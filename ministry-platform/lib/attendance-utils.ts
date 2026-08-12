import { createHash, createHmac, randomInt, timingSafeEqual } from 'crypto';
import { NextRequest } from 'next/server';

const IST = 'Asia/Kolkata';

export const YOUTH_VERSES = [
  { verse: 'Those who seek me diligently find me.', ref: 'Proverbs 8:17' },
  { verse: 'Early will I seek thee: my soul thirsteth for thee.', ref: 'Psalm 63:1' },
  { verse: 'The effectual fervent prayer of a righteous man availeth much.', ref: 'James 5:16' },
  { verse: 'Draw near to God and He will draw near to you.', ref: 'James 4:8' },
  { verse: 'In the morning, LORD, you hear my voice.', ref: 'Psalm 5:3' },
  { verse: 'Pray without ceasing.', ref: '1 Thessalonians 5:17' },
  { verse: 'Call to me and I will answer you.', ref: 'Jeremiah 33:3' },
  { verse: 'The Lord is near to all who call on Him.', ref: 'Psalm 145:18' },
] as const;

export const CARMEL_VERSES = [
  { verse: 'காலையிலே என் சத்தத்தைக் கேளும், காலையிலே உமக்காக அணிவகுப்பேன்.', ref: 'சங்கீதம் 5:3' },
  { verse: 'இடைவிடாமல் ஜெபியுங்கள்.', ref: '1 தெசலோனிக்கேயர் 5:17' },
  { verse: 'கர்த்தரை நோக்கிக் கூப்பிடு, அவர் உனக்கு உத்தரவு அருளுவார்.', ref: 'எரேமியா 33:3' },
  { verse: 'நீதிமானுடைய வேண்டுதல் செயல்படும்போது மிகவும் பலனுள்ளதாயிருக்கிறது.', ref: 'யாக்கோபு 5:16' },
  { verse: 'தேவனிடத்தில் சேருங்கள், அவர் உங்களிடத்தில் சேருவார்.', ref: 'யாக்கோபு 4:8' },
  { verse: 'அதிகாலமே எழுந்து உம்மைத் தேடுகிறேன்.', ref: 'சங்கீதம் 63:1' },
  {
    verse:
      'எருசலேமே, உன் மதில்களின்மேல் பகல்முழுதும் இராமுழுதும் ஒருக்காலும் மவுனமாயிராத ஜாமக்காரரைக் கட்டளையிடுகிறேன்.',
    ref: 'ஏசாயா 62:6',
  },
  { verse: 'விடியற்காலமே கர்த்தரைத் தேடுகிறவர்கள் அவரைக் கண்டடைவார்கள்.', ref: 'நீதிமொழிகள் 8:17' },
] as const;

export type CarmelSlotState = 'done' | 'current' | 'missed' | 'empty' | 'upcoming';

const BOT_UA = /bot|crawl|spider|wget|curl|python|java|go-http-client/i;
const MOBILE_UA = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

function formatInTimeZone(
  date: Date,
  timeZone: string,
  options: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone, ...options }).format(date);
}

/** Today's date in IST as YYYY-MM-DD */
export function getISTDate(now = new Date()): string {
  return formatInTimeZone(now, IST, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/** Current time in IST as HH:mm:ss */
export function getISTTime(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: IST,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
  return `${get('hour')}:${get('minute')}:${get('second')}`;
}

/** Yesterday's date in IST as YYYY-MM-DD */
export function getISTYesterday(now = new Date()): string {
  const today = getISTDate(now);
  const [y, m, d] = today.split('-').map(Number);
  const utcNoon = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  utcNoon.setUTCDate(utcNoon.getUTCDate() - 1);
  return getISTDate(utcNoon);
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}

function getIpSalt(): string {
  return process.env.ATTENDANCE_IP_SALT || process.env.JWT_SECRET || 'jebathottam_salt_2026';
}

export function getIPHash(request: NextRequest): string {
  const ip = getClientIp(request);
  return createHash('sha256').update(ip + getIpSalt()).digest('hex');
}

export function getDeviceType(request: NextRequest): 'mobile' | 'desktop' {
  const ua = request.headers.get('user-agent') || '';
  return MOBILE_UA.test(ua) ? 'mobile' : 'desktop';
}

export function isBotUserAgent(request: NextRequest): boolean {
  const ua = request.headers.get('user-agent');
  if (!ua) return true;
  return BOT_UA.test(ua);
}

/** form_time is unix seconds when the form was loaded; submissions under 3s are bots */
export function isTooFastSubmission(formTime: number | string | undefined | null): boolean {
  const t = typeof formTime === 'string' ? parseInt(formTime, 10) : Number(formTime);
  if (!t || Number.isNaN(t) || t <= 0) return false;
  return Date.now() / 1000 - t < 3;
}

export function normalizeAttendanceName(raw: string): string {
  let name = raw.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  if (!name) return '';
  return name
    .toLowerCase()
    .split(' ')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
    .join(' ');
}

export function randomYouthVerse(): { verse: string; ref: string } {
  return YOUTH_VERSES[randomInt(0, YOUTH_VERSES.length)];
}

export function randomCarmelVerse(): { verse: string; ref: string } {
  return CARMEL_VERSES[randomInt(0, CARMEL_VERSES.length)];
}

/** Current IST minutes since midnight (0–1439) */
export function getISTNowMins(now = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: IST,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return get('hour') * 60 + get('minute');
}

/** IST weekday long name, e.g. Saturday */
export function getISTWeekday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: IST, weekday: 'long' }).format(now);
}

/** Parse "HH:MM-HH:MM" into start/end minutes; overnight end wraps +1440 */
export function parseSlotTimeMins(slotTime: string): { startMins: number; endMins: number } {
  const parts = slotTime.split('-');
  const startStr = (parts[0] || '').trim();
  const endStr = (parts[1] || '').trim();
  const [sh, sm] = startStr.split(':').map((n) => parseInt(n, 10) || 0);
  const [eh, em] = endStr.split(':').map((n) => parseInt(n, 10) || 0);
  let startMins = sh * 60 + sm;
  let endMins = eh * 60 + em;
  if (endMins < startMins) endMins += 1440;
  return { startMins, endMins };
}

/**
 * Map a 1-hour slot range to its first 30-minute counterpart
 * (PHP carmel-api duration === 60 behaviour).
 */
export function mapHourSlotToFirst30(slotTime: string): string {
  const parts = slotTime.split('-');
  if (parts.length !== 2) return slotTime;
  const start = parts[0].trim();
  const [shStr, smStr] = start.split(':');
  if (shStr === undefined || smStr === undefined) return slotTime;
  let sh = parseInt(shStr, 10);
  let sm = parseInt(smStr, 10);
  if (Number.isNaN(sh) || Number.isNaN(sm)) return slotTime;
  let em = sm + 30;
  let eh = sh;
  if (em >= 60) {
    em -= 60;
    eh += 1;
    if (eh >= 24) eh = 0;
  }
  return `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}-${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
}

/**
 * PHP carmel slot status: done / current / missed / empty / upcoming.
 * Midnight session is forced empty on Saturday/Sunday (IST).
 */
export function computeCarmelSlotState(opts: {
  targetDate: string;
  today: string;
  slotTime: string;
  sessionName: string;
  assignedMember: string | null | undefined;
  isDone: boolean;
  istNowMins: number;
  istWeekday: string;
}): CarmelSlotState {
  const {
    targetDate,
    today,
    slotTime,
    sessionName,
    assignedMember,
    isDone,
    istNowMins,
    istWeekday,
  } = opts;

  const hasAssignee = Boolean(assignedMember && assignedMember.trim());
  const isWeekend = istWeekday === 'Saturday' || istWeekday === 'Sunday';
  const isMidnight = sessionName === 'நள்ளிரவு நேரம்';

  if (targetDate === today) {
    if (isMidnight && isWeekend) return 'empty';

    const { startMins, endMins } = parseSlotTimeMins(slotTime);
    const isActiveRightNow = istNowMins >= startMins && istNowMins < endMins;
    const isPast = istNowMins >= endMins;

    if (isDone) return 'done';
    if (isActiveRightNow) return 'current';
    if (isPast) return hasAssignee ? 'missed' : 'empty';
    return hasAssignee ? 'upcoming' : 'empty';
  }

  if (isDone) return 'done';
  if (targetDate < today) return hasAssignee ? 'missed' : 'empty';
  return 'upcoming';
}

function captchaSecret(): string {
  return process.env.ATTENDANCE_IP_SALT || process.env.JWT_SECRET || 'dev-captcha-secret';
}

/** Signed captcha token: answer.expiry.hmac */
export function createCaptcha(): { question: string; token: string } {
  const num1 = randomInt(1, 10);
  const num2 = randomInt(1, 10);
  const answer = num1 + num2;
  const expiry = Date.now() + 10 * 60 * 1000;
  const payload = `${answer}.${expiry}`;
  const sig = createHmac('sha256', captchaSecret()).update(payload).digest('hex');
  return {
    question: `What is ${num1} + ${num2}?`,
    token: `${payload}.${sig}`,
  };
}

export function verifyCaptcha(
  token: string | undefined | null,
  answer: number | string | undefined | null
): boolean {
  if (!token || answer === undefined || answer === null || answer === '') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [ansStr, expiryStr, sig] = parts;
  const expectedSig = createHmac('sha256', captchaSecret())
    .update(`${ansStr}.${expiryStr}`)
    .digest('hex');
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  if (Date.now() > Number(expiryStr)) return false;
  return Number(ansStr) === Number(answer);
}
