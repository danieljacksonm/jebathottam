import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import {
  computeCarmelSlotState,
  createCaptcha,
  getDeviceType,
  getIPHash,
  getISTDate,
  getISTNowMins,
  getISTWeekday,
  isBotUserAgent,
  isTooFastSubmission,
  mapHourSlotToFirst30,
  normalizeAttendanceName,
  randomCarmelVerse,
  verifyCaptcha,
} from '@/lib/attendance-utils';

export const dynamic = 'force-dynamic';

const CAPTCHA_COOKIE = 'carmel_captcha';

type SlotRow = {
  id: number;
  slot_time: string;
  session_name: string;
  assigned_member: string | null;
  is_empty: number | boolean;
  sort_order: number;
  is_done: number;
  marked_names: string | null;
};

async function countHourlyMarks(ipHash: string): Promise<number> {
  let youthCount = 0;
  let carmelCount = 0;
  try {
    const youth = await query<{ c: number }[]>(
      `SELECT COUNT(*) AS c FROM youth_attendance
       WHERE ip_hash = ? AND marked_at > NOW() - INTERVAL 1 HOUR`,
      [ipHash]
    );
    youthCount = Number(youth[0]?.c ?? 0);
  } catch {
    youthCount = 0;
  }
  try {
    const carmel = await query<{ c: number }[]>(
      `SELECT COUNT(*) AS c FROM carmel_attendance
       WHERE ip_hash = ? AND marked_at > NOW() - INTERVAL 1 HOUR`,
      [ipHash]
    );
    carmelCount = Number(carmel[0]?.c ?? 0);
  } catch {
    carmelCount = 0;
  }
  return youthCount + carmelCount;
}

async function getCarmelStreak(name: string, date: string): Promise<number> {
  try {
    const rows = await query<{ date: string | Date }[]>(
      `SELECT DISTINCT date FROM carmel_attendance WHERE name = ? ORDER BY date DESC`,
      [name]
    );
    if (!rows?.length) return 0;

    const dates = rows.map((r) => {
      if (r.date instanceof Date) return r.date.toISOString().slice(0, 10);
      return String(r.date).slice(0, 10);
    });

    let streak = 0;
    let current = date;

    if (dates[0] !== date) {
      const [y, m, d] = date.split('-').map(Number);
      const prev = new Date(Date.UTC(y, m - 1, d, 12));
      prev.setUTCDate(prev.getUTCDate() - 1);
      const yesterday = prev.toISOString().slice(0, 10);
      if (dates[0] === yesterday) {
        current = dates[0];
      } else {
        return 0;
      }
    }

    for (const dStr of dates) {
      if (dStr === current) {
        streak++;
        const [y, m, d] = current.split('-').map(Number);
        const prev = new Date(Date.UTC(y, m - 1, d, 12));
        prev.setUTCDate(prev.getUTCDate() - 1);
        current = prev.toISOString().slice(0, 10);
      } else {
        break;
      }
    }
    return streak;
  } catch {
    return 0;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || '';
    const today = getISTDate();

    if (action === 'today_count') {
      try {
        const countRows = await query<{ c: number }[]>(
          'SELECT COUNT(*) AS c FROM carmel_attendance WHERE date = ?',
          [today]
        );
        const slotRows = await query<{ c: number }[]>(
          'SELECT COUNT(DISTINCT slot_time) AS c FROM carmel_attendance WHERE date = ?',
          [today]
        );
        return NextResponse.json({
          success: true,
          today_count: Number(countRows[0]?.c ?? 0),
          slot_count: Number(slotRows[0]?.c ?? 0),
        });
      } catch {
        return NextResponse.json({
          success: false,
          message: 'Database error query count.',
          today_count: 0,
          slot_count: 0,
        });
      }
    }

    if (action === 'slots') {
      const targetDate = searchParams.get('date') || today;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
        return NextResponse.json({ success: false, message: 'Invalid date format.' });
      }

      try {
        await query('SELECT 1 FROM carmel_slots LIMIT 1');
      } catch {
        return NextResponse.json({
          success: false,
          message: 'Slots table missing. Run prisma/migrations/add_carmel.sql first.',
          slots: [],
          coverage_percent: 0,
        });
      }

      try {
        const slotsRaw = await query<SlotRow[]>(
          `SELECT s.*,
             (SELECT COUNT(*) FROM carmel_attendance a
              WHERE a.date = ? AND a.slot_time = s.slot_time AND a.session_name = s.session_name) AS is_done,
             (SELECT GROUP_CONCAT(name SEPARATOR ', ') FROM carmel_attendance a
              WHERE a.date = ? AND a.slot_time = s.slot_time AND a.session_name = s.session_name) AS marked_names
           FROM carmel_slots s
           ORDER BY s.sort_order ASC`,
          [targetDate, targetDate]
        );

        const istNowMins = getISTNowMins();
        const istWeekday = getISTWeekday();
        let coveredCount = 0;

        const slots = (slotsRaw || []).map((row) => {
          const isDone = Number(row.is_done) > 0;
          const state = computeCarmelSlotState({
            targetDate,
            today,
            slotTime: row.slot_time,
            sessionName: row.session_name,
            assignedMember: row.assigned_member,
            isDone,
            istNowMins,
            istWeekday,
          });
          // PHP only counts coverage when state resolves to done (not weekend-midnight empty)
          if (state === 'done') coveredCount++;

          return {
            id: Number(row.id),
            slot_time: row.slot_time,
            session_name: row.session_name,
            assigned_member: row.assigned_member,
            is_empty: Number(row.is_empty) ? 1 : 0,
            sort_order: Number(row.sort_order),
            is_done: isDone,
            marked_names: row.marked_names || '',
            state,
          };
        });

        const totalSlotsCount = slots.length;
        const coveragePercent =
          totalSlotsCount > 0 ? Math.round((coveredCount / totalSlotsCount) * 1000) / 10 : 0;

        return NextResponse.json({
          success: true,
          slots,
          coverage_percent: coveragePercent,
          covered_count: coveredCount,
          total_count: totalSlotsCount,
        });
      } catch (error) {
        console.error('Carmel slots error:', error);
        return NextResponse.json({
          success: false,
          message: 'Database error query slots. Please try again.',
          slots: [],
          coverage_percent: 0,
        });
      }
    }

    if (action === 'leaderboard') {
      const period = searchParams.get('period') || 'month';
      let dateFilter = '';
      const params: string[] = [];

      if (period === 'week') {
        dateFilter = 'AND date >= DATE_SUB(?, INTERVAL 7 DAY)';
        params.push(today);
      } else if (period === 'month') {
        dateFilter = 'AND date >= DATE_SUB(?, INTERVAL 30 DAY)';
        params.push(today);
      }

      try {
        const records = await query<{ name: string; count: number }[]>(
          `SELECT name, COUNT(*) AS count
           FROM carmel_attendance
           WHERE 1=1 ${dateFilter}
           GROUP BY name
           ORDER BY count DESC
           LIMIT 15`,
          params
        );

        const leaderboard = [];
        let rank = 1;
        for (const r of records || []) {
          const streak = await getCarmelStreak(r.name, today);
          leaderboard.push({
            rank: rank++,
            name: r.name,
            count: Number(r.count),
            streak,
          });
        }

        return NextResponse.json({ leaderboard });
      } catch {
        return NextResponse.json({
          success: false,
          message: 'Querying leaderboard failed.',
          leaderboard: [],
        });
      }
    }

    if (action === 'captcha') {
      const { question, token } = createCaptcha();
      const res = NextResponse.json({ question });
      res.cookies.set(CAPTCHA_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 600,
        secure: process.env.NODE_ENV === 'production',
      });
      return res;
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Carmel GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const today = getISTDate();
    const ipHash = getIPHash(request);
    const device = getDeviceType(request);

    let data: Record<string, unknown> = {};
    try {
      data = await request.json();
    } catch {
      data = {};
    }

    const website = String(data.website ?? '').trim();
    if (website) {
      return NextResponse.json({ success: false, message: 'Bot activity flagged (honeypot)' });
    }

    if (isTooFastSubmission(data.form_time as string | number | undefined)) {
      return NextResponse.json({
        success: false,
        message: 'பாட் செயல்பாடு கண்டறியப்பட்டது.',
      });
    }

    if (isBotUserAgent(request)) {
      return NextResponse.json({
        success: false,
        message: 'பாட் செயல்பாடு கண்டறியப்பட்டது.',
      });
    }

    const hourly = await countHourlyMarks(ipHash);
    if (hourly >= 3) {
      return NextResponse.json({
        success: false,
        message: 'வேக வரம்பு மீறப்பட்டது! ஒரு மணி நேரத்திற்கு அதிகபட்சம் 3 பதிவுகள்.',
      });
    }

    let recentSubmissions = 0;
    try {
      const rows = await query<{ c: number }[]>(
        `SELECT COUNT(*) AS c FROM carmel_attendance
         WHERE ip_hash = ? AND marked_at > NOW() - INTERVAL 1 HOUR`,
        [ipHash]
      );
      recentSubmissions = Number(rows[0]?.c ?? 0);
    } catch {
      recentSubmissions = 0;
    }

    if (recentSubmissions >= 1) {
      const captchaToken = request.cookies.get(CAPTCHA_COOKIE)?.value;
      const captchaOk = verifyCaptcha(captchaToken, data.captcha_ans as string | number);
      if (!captchaOk) {
        return NextResponse.json({
          success: false,
          captcha_required: true,
          message: 'பாதுகாப்பு சரிபார்ப்பு தேவை. கணக்கு கேள்விக்கு பதிலளிக்கவும்.',
        });
      }
    }

    const name = normalizeAttendanceName(String(data.name ?? ''));
    let slotTime = String(data.slot_time ?? '').trim();
    const session = String(data.session ?? '').trim();
    let duration = parseInt(String(data.duration_mins ?? 30), 10);
    if (Number.isNaN(duration) || (duration !== 30 && duration !== 60)) duration = 30;

    if (duration === 60) {
      slotTime = mapHourSlotToFirst30(slotTime);
    }

    if (!name) {
      return NextResponse.json({
        success: false,
        message: 'தயவுசெய்து உங்கள் பெயரை உள்ளிடுங்கள்.',
      });
    }
    if (!slotTime || !session) {
      return NextResponse.json({
        success: false,
        message: 'நேரத்தைத் தேர்ந்தெடுக்கவும்.',
      });
    }

    try {
      const nameDup = await query<{ id: number }[]>(
        `SELECT id FROM carmel_attendance
         WHERE name = ? AND date = ? AND slot_time = ? LIMIT 1`,
        [name, today, slotTime]
      );
      if (nameDup.length > 0) {
        return NextResponse.json({
          success: false,
          duplicate: true,
          message:
            'நீங்கள் இந்த நேரத்திற்கு ஏற்கனவே ஆஜர் பதிவு செய்துவிட்டீர்கள்! கர்த்தர் உங்களை ஆசீர்வதிப்பார்.',
        });
      }

      const ipDup = await query<{ id: number }[]>(
        `SELECT id FROM carmel_attendance
         WHERE ip_hash = ? AND date = ? AND slot_time = ? LIMIT 1`,
        [ipHash, today, slotTime]
      );
      if (ipDup.length > 0) {
        const adminUser = await getUserFromRequest(request);
        if (!adminUser) {
          return NextResponse.json({
            success: false,
            duplicate: true,
            message:
              'இந்த சாதனத்திலிருந்து இந்த நேரத்திற்கு ஆஜர் ஏற்கனவே பதிவாகிவிட்டது. தவறு என்றால் உங்கள் தலைவரிடம் தெரிவிக்கவும்.',
          });
        }
      }

      await query(
        `INSERT INTO carmel_attendance
         (name, date, slot_time, session_name, ip_hash, device_type, duration_mins, added_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'self')`,
        [name, today, slotTime, session, ipHash, device, duration]
      );

      const countRows = await query<{ c: number }[]>(
        'SELECT COUNT(*) AS c FROM carmel_attendance WHERE date = ?',
        [today]
      );
      const slotCountRows = await query<{ c: number }[]>(
        'SELECT COUNT(DISTINCT slot_time) AS c FROM carmel_attendance WHERE date = ?',
        [today]
      );
      const streak = await getCarmelStreak(name, today);

      const res = NextResponse.json({
        success: true,
        message: `நன்றி! ${name} அவர்களே, உங்கள் ஜெபம் பதிவாகிவிட்டது!`,
        today_count: Number(countRows[0]?.c ?? 0),
        slot_count: Number(slotCountRows[0]?.c ?? 0),
        streak,
        verse: randomCarmelVerse(),
      });
      res.cookies.delete(CAPTCHA_COOKIE);
      return res;
    } catch (error) {
      console.error('Carmel POST insert error:', error);
      return NextResponse.json({
        success: false,
        message: 'தரவுத்தள பிழை. மீண்டும் முயற்சிக்கவும்.',
      });
    }
  } catch (error) {
    console.error('Carmel POST error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
}
