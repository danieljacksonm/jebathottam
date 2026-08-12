'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

type SlotState = 'done' | 'current' | 'missed' | 'empty' | 'upcoming';

type CarmelSlot = {
  id: number;
  slot_time: string;
  session_name: string;
  assigned_member: string | null;
  is_empty: number;
  sort_order: number;
  is_done: boolean;
  marked_names: string;
  state: SlotState;
};

type LeaderboardItem = {
  rank: number;
  name: string;
  count: number;
  streak: number;
};

type Verse = { verse: string; ref: string };

type SlotOption = { v: string; l: string; s: string };

const SLOTS_30MIN: SlotOption[] = [
  { v: '04:00-04:30', l: '04:00 - 04:30 காலை', s: 'காலை' },
  { v: '04:30-05:00', l: '04:30 - 05:00 காலை', s: 'காலை' },
  { v: '05:00-05:30', l: '05:00 - 05:30 காலை', s: 'காலை' },
  { v: '05:30-06:00', l: '05:30 - 06:00 காலை', s: 'காலை' },
  { v: '06:00-06:30', l: '06:00 - 06:30 காலை', s: 'காலை' },
  { v: '06:30-07:00', l: '06:30 - 07:00 காலை', s: 'காலை' },
  { v: '07:00-07:30', l: '07:00 - 07:30 காலை', s: 'காலை' },
  { v: '07:30-08:00', l: '07:30 - 08:00 காலை', s: 'காலை' },
  { v: '08:00-08:30', l: '08:00 - 08:30 காலை', s: 'காலை' },
  { v: '08:30-09:00', l: '08:30 - 09:00 காலை', s: 'காலை' },
  { v: '09:00-09:30', l: '09:00 - 09:30 காலை', s: 'காலை' },
  { v: '09:30-10:00', l: '09:30 - 10:00 காலை', s: 'காலை' },
  { v: '10:00-10:30', l: '10:00 - 10:30 காலை', s: 'காலை' },
  { v: '10:30-11:00', l: '10:30 - 11:00 காலை', s: 'காலை' },
  { v: '11:00-11:30', l: '11:00 - 11:30 காலை', s: 'காலை' },
  { v: '11:30-12:00', l: '11:30 - 12:00 காலை', s: 'காலை' },
  { v: '12:00-12:30', l: '12:00 - 12:30 மதியம்', s: 'மதியம்' },
  { v: '12:30-13:00', l: '12:30 - 01:00 மதியம்', s: 'மதியம்' },
  { v: '13:00-13:30', l: '01:00 - 01:30 மதியம்', s: 'மதியம்' },
  { v: '13:30-14:00', l: '01:30 - 02:00 மதியம்', s: 'மதியம்' },
  { v: '14:00-14:30', l: '02:00 - 02:30 மதியம்', s: 'மதியம்' },
  { v: '14:30-15:00', l: '02:30 - 03:00 மதியம்', s: 'மதியம்' },
  { v: '15:00-15:30', l: '03:00 - 03:30 மதியம்', s: 'மதியம்' },
  { v: '15:30-16:00', l: '03:30 - 04:00 மதியம்', s: 'மதியம்' },
  { v: '16:00-16:30', l: '04:00 - 04:30 மாலை', s: 'மாலை' },
  { v: '16:30-17:00', l: '04:30 - 05:00 மாலை', s: 'மாலை' },
  { v: '17:00-17:30', l: '05:00 - 05:30 மாலை', s: 'மாலை' },
  { v: '17:30-18:00', l: '05:30 - 06:00 மாலை', s: 'மாலை' },
  { v: '18:00-18:30', l: '06:00 - 06:30 மாலை', s: 'மாலை' },
  { v: '18:30-19:00', l: '06:30 - 07:00 மாலை', s: 'மாலை' },
  { v: '19:00-19:30', l: '07:00 - 07:30 இரவு', s: 'இரவு' },
  { v: '19:30-20:00', l: '07:30 - 08:00 இரவு', s: 'இரவு' },
  { v: '20:00-20:30', l: '08:00 - 08:30 இரவு', s: 'இரவு' },
  { v: '20:30-21:00', l: '08:30 - 09:00 இரவு', s: 'இரவு' },
  { v: '21:00-21:30', l: '09:00 - 09:30 இரவு', s: 'இரவு' },
  { v: '21:30-22:00', l: '09:30 - 10:00 இரவு', s: 'இரவு' },
  { v: '22:00-22:30', l: '10:00 - 10:30 இரவு', s: 'இரவு' },
  { v: '22:30-23:00', l: '10:30 - 11:00 இரவு', s: 'இரவு' },
  { v: '23:00-23:30', l: '11:00 - 11:30 இரவு', s: 'இரவு' },
  { v: '23:30-00:00', l: '11:30 - 12:00 இரவு', s: 'இரவு' },
  { v: '00:00-00:30', l: '12:00 - 12:30 நள்ளிரவு', s: 'நள்ளிரவு' },
  { v: '00:30-01:00', l: '12:30 - 01:00 நள்ளிரவு', s: 'நள்ளிரவு' },
  { v: '01:00-01:30', l: '01:00 - 01:30 நள்ளிரவு', s: 'நள்ளிரவு' },
  { v: '01:30-02:00', l: '01:30 - 02:00 நள்ளிரவு', s: 'நள்ளிரவு' },
  { v: '02:00-02:30', l: '02:00 - 02:30 நள்ளிரவு', s: 'நள்ளிரவு' },
  { v: '02:30-03:00', l: '02:30 - 03:00 நள்ளிரவு', s: 'நள்ளிரவு' },
  { v: '03:00-03:30', l: '03:00 - 03:30 நள்ளிரவு', s: 'நள்ளிரவு' },
  { v: '03:30-04:00', l: '03:30 - 04:00 நள்ளிரவு', s: 'நள்ளிரவு' },
];

const SLOTS_1HOUR: SlotOption[] = [
  { v: '04:00-05:00', l: '04:00 - 05:00 காலை', s: 'காலை' },
  { v: '05:00-06:00', l: '05:00 - 06:00 காலை', s: 'காலை' },
  { v: '06:00-07:00', l: '06:00 - 07:00 காலை', s: 'காலை' },
  { v: '07:00-08:00', l: '07:00 - 08:00 காலை', s: 'காலை' },
  { v: '08:00-09:00', l: '08:00 - 09:00 காலை', s: 'காலை' },
  { v: '09:00-10:00', l: '09:00 - 10:00 காலை', s: 'காலை' },
  { v: '10:00-11:00', l: '10:00 - 11:00 காலை', s: 'காலை' },
  { v: '11:00-12:00', l: '11:00 - 12:00 காலை', s: 'காலை' },
  { v: '12:00-13:00', l: '12:00 - 01:00 மதியம்', s: 'மதியம்' },
  { v: '13:00-14:00', l: '01:00 - 02:00 மதியம்', s: 'மதியம்' },
  { v: '14:00-15:00', l: '02:00 - 03:00 மதியம்', s: 'மதியம்' },
  { v: '15:00-16:00', l: '03:00 - 04:00 மதியம்', s: 'மதியம்' },
  { v: '16:00-17:00', l: '04:00 - 05:00 மாலை', s: 'மாலை' },
  { v: '17:00-18:00', l: '05:00 - 06:00 மாலை', s: 'மாலை' },
  { v: '18:00-19:00', l: '06:00 - 07:00 மாலை', s: 'மாலை' },
  { v: '19:00-20:00', l: '07:00 - 08:00 இரவு', s: 'இரவு' },
  { v: '20:00-21:00', l: '08:00 - 09:00 இரவு', s: 'இரவு' },
  { v: '21:00-22:00', l: '09:00 - 10:00 இரவு', s: 'இரவு' },
  { v: '22:00-23:00', l: '10:00 - 11:00 இரவு', s: 'இரவு' },
  { v: '23:00-00:00', l: '11:00 - 12:00 இரவு', s: 'இரவு' },
  { v: '00:00-01:00', l: '12:00 - 01:00 நள்ளிரவு', s: 'நள்ளிரவு' },
  { v: '01:00-02:00', l: '01:00 - 02:00 நள்ளிரவு', s: 'நள்ளிரவு' },
  { v: '02:00-03:00', l: '02:00 - 03:00 நள்ளிரவு', s: 'நள்ளிரவு' },
  { v: '03:00-04:00', l: '03:00 - 04:00 நள்ளிரவு', s: 'நள்ளிரவு' },
];

const SESSIONS_FULL = [
  'காலை நேரம்',
  'மதியம் நேரம்',
  'மாலை நேரம்',
  'இரவு நேரம்',
  'நள்ளிரவு நேரம்',
];

const STATE_COLORS: Record<SlotState, string> = {
  done: 'bg-green-500 text-white',
  missed: 'bg-red-500 text-white',
  current: 'bg-amber-500 text-amber-950 ring-2 ring-amber-300',
  empty: 'bg-gray-300/80 dark:bg-gray-700 text-gray-700 dark:text-gray-200',
  upcoming: 'bg-gray-100 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400',
};

function autoSelectCurrentSlot(slots: SlotOption[]): string {
  const ist = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const totalMins = ist.getHours() * 60 + ist.getMinutes();
  const curMins = totalMins < 240 ? totalMins + 1440 : totalMins;

  for (const slot of slots) {
    const [a, b] = slot.v.split('-');
    const [ah, am] = a.split(':').map(Number);
    const [bh, bm] = b.split(':').map(Number);
    let startMins = ah * 60 + am;
    let endMins = bh * 60 + bm;
    if (endMins <= startMins) endMins += 1440;
    if (startMins < 240) {
      startMins += 1440;
      endMins += 1440;
    }
    if (curMins >= startMins && curMins < endMins) return slot.v;
  }
  return slots[0]?.v || '';
}

function coverageQuote(pct: number): string {
  if (pct < 35) return 'காவலர்கள் தேவை! ஜெபத்தில் சேருங்கள்!';
  if (pct < 75) return 'காவலர்களின் எண்ணிக்கை உயர்கிறது! தொடர்ந்து ஜெபிப்போம்!';
  return 'அகார்ப்பரியான ஜெபக்கோட்டை! கர்த்தர் உங்களை ஆசீர்வதிப்பார்!';
}

function istTamilDate(): string {
  return new Date().toLocaleDateString('ta-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function CarmelAttendancePage() {
  const [allSlots, setAllSlots] = useState<CarmelSlot[]>([]);
  const [coverage, setCoverage] = useState({ pct: 0, covered: 0, total: 0 });
  const [duration, setDuration] = useState<30 | 60>(30);
  const [slotTime, setSlotTime] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [website, setWebsite] = useState('');
  const [formTime, setFormTime] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAns, setCaptchaAns] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('month');
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [success, setSuccess] = useState<{
    name: string;
    today_count: number;
    streak: number;
    verse?: Verse;
  } | null>(null);

  const slotOptions = duration === 60 ? SLOTS_1HOUR : SLOTS_30MIN;

  const sessionName = useMemo(() => {
    const opt = slotOptions.find((s) => s.v === slotTime);
    return opt ? `${opt.s} நேரம்` : '';
  }, [slotOptions, slotTime]);

  const matchedSlot = useMemo(() => {
    if (!slotTime || !sessionName) return null;
    const start = slotTime.split('-')[0];
    return (
      allSlots.find(
        (s) => s.slot_time.startsWith(start) && s.session_name === sessionName
      ) || null
    );
  }, [allSlots, slotTime, sessionName]);

  const namesBySession = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const sess of SESSIONS_FULL) {
      const members: string[] = [];
      for (const s of allSlots) {
        if (s.session_name !== sess || !s.assigned_member) continue;
        for (const part of s.assigned_member.split('/')) {
          const n = part.trim();
          if (n && n !== 'காலியாக உள்ளது' && !members.includes(n)) members.push(n);
        }
      }
      if (members.length) map[sess] = members;
    }
    return map;
  }, [allSlots]);

  const fetchSlots = useCallback(async () => {
    try {
      const res = await fetch('/api/carmel?action=slots');
      const data = await res.json();
      if (data.success) {
        setAllSlots(Array.isArray(data.slots) ? data.slots : []);
        setCoverage({
          pct: Number(data.coverage_percent) || 0,
          covered: Number(data.covered_count) || 0,
          total: Number(data.total_count) || 0,
        });
      }
    } catch {
      setAllSlots([]);
    }
  }, []);

  const fetchLeaderboard = useCallback(async (p: 'week' | 'month' | 'all') => {
    setLoadingBoard(true);
    try {
      const res = await fetch(`/api/carmel?action=leaderboard&period=${p}`);
      const data = await res.json();
      setLeaderboard(Array.isArray(data.leaderboard) ? data.leaderboard : []);
    } catch {
      setLeaderboard([]);
    } finally {
      setLoadingBoard(false);
    }
  }, []);

  const fetchCaptcha = useCallback(async () => {
    try {
      const res = await fetch('/api/carmel?action=captcha', { credentials: 'include' });
      const data = await res.json();
      if (data.question) {
        setCaptchaQuestion(data.question);
        setShowCaptcha(true);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setFormTime(String(Math.floor(Date.now() / 1000)));
    fetchSlots();
    fetchLeaderboard('month');
  }, [fetchSlots, fetchLeaderboard]);

  useEffect(() => {
    const current = autoSelectCurrentSlot(slotOptions);
    setSlotTime(current);
  }, [duration]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period, fetchLeaderboard]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    if (!selectedName || !slotTime || !sessionName) {
      setAlert('தயவுசெய்து நேரமும் பெயரும் தேர்ந்தெடுக்கவும்.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/carmel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: selectedName,
          slot_time: slotTime,
          session: sessionName,
          duration_mins: duration,
          website,
          form_time: formTime,
          captcha_ans: captchaAns,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess({
          name: selectedName,
          today_count: data.today_count,
          streak: data.streak,
          verse: data.verse,
        });
        setSelectedName('');
        setCaptchaAns('');
        setShowCaptcha(false);
        setFormTime(String(Math.floor(Date.now() / 1000)));
        await fetchSlots();
        await fetchLeaderboard(period);
      } else if (data.captcha_required) {
        await fetchCaptcha();
        setAlert('தயவுசெய்து மேலே உள்ள கணக்கு கேள்விக்கு பதிலளிக்கவும்.');
      } else {
        setAlert(data.message || 'சரிபார்ப்பு தோல்வியடைந்தது.');
      }
    } catch {
      setAlert('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 max-w-3xl">
        <nav className="mb-6 text-sm text-white/60">
          <Link href="/" className="hover:text-amber-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/90">Carmel Attendance</span>
        </nav>

        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-1">கர்மேல் நடுவிலே</h1>
          <p className="text-lg font-semibold mb-4">ஜெபக் காவலர்கள்</p>
          <blockquote className="text-sm text-white/70 italic max-w-xl mx-auto mb-2">
            &ldquo;எருசலேமே, உன் மதில்களின்மேல் பகல்முழுதும் இராமுழுதும் ஒருக்காலும் மவுனமாயிராத
            ஜாமக்காரரைக் கட்டளையிடுகிறேன்&rdquo;
          </blockquote>
          <cite className="text-amber-300/90 text-sm not-italic">— ஏசாயா 62:6</cite>
        </header>

        <div className="rounded-2xl border border-amber-500/30 bg-white/5 p-4 sm:p-5 mb-5 text-sm text-white/75">
          <p className="font-semibold text-amber-300 mb-2">முக்கிய அறிவுறுத்தல்</p>
          <p>
            உங்கள் பெயரை எப்போதும் <strong className="text-white">ஒரே மாதிரியாக</strong> தட்டச்சு
            செய்யுங்கள் (எ.கா. Sis. Mary).
          </p>
        </div>

        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 mb-5 text-center">
          <p className="font-semibold mb-1">{istTamilDate()}</p>
          <p className="text-amber-300 font-bold mb-3">
            {matchedSlot
              ? `${matchedSlot.session_name.replace(' நேரம்', '')} ${matchedSlot.slot_time}`
              : sessionName
                ? `${sessionName.replace(' நேரம்', '')} ${slotTime}`
                : 'நேரத்தைத் தேர்ந்தெடுக்கவும்'}
          </p>
          <p className="inline-block rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm">
            {matchedSlot?.assigned_member
              ? `இந்த நேர ஜெபக்காரர்: ${matchedSlot.assigned_member}`
              : 'ஜெபிக்க தயாரா? இந்த நேரத்தை எடுக்கவும்!'}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 mb-6">
          {alert && (
            <div className="mb-4 rounded-lg border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              {alert}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="hidden" aria-hidden="true">
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <input type="hidden" name="form_time" value={formTime} readOnly />

            <div>
              <p className="text-sm text-white/70 mb-2">ஜெப கால அளவு தேர்வு செய்யவும்:</p>
              <div className="grid grid-cols-2 gap-3 mb-2">
                {([30, 60] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`min-h-[52px] rounded-xl border-2 px-3 py-3 text-sm font-medium transition ${
                      duration === d
                        ? 'border-amber-400 bg-gradient-to-br from-amber-400 to-amber-200 text-slate-900'
                        : 'border-amber-500/30 bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {d === 30 ? '30 நிமிடம்' : '1 மணி நேரம்'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/50 text-center mb-4">
                {duration === 60
                  ? '1 மணி நேர slot தேர்வு செய்துள்ளீர்கள்'
                  : '30 நிமிட slot தேர்வு செய்துள்ளீர்கள்'}
              </p>

              <label className="block text-sm text-white/85 mb-2">ஜெபித்த நேரம்:</label>
              <select
                className="w-full rounded-xl border-2 border-amber-500/30 bg-white/10 px-4 py-3 text-white text-base"
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
              >
                <option value="">-- நேரத்தை தேர்வு செய்யுங்கள் --</option>
                {(['காலை', 'மதியம்', 'மாலை', 'இரவு', 'நள்ளிரவு'] as const).map((sess) => (
                  <optgroup key={sess} label={sess} className="text-gray-900">
                    {slotOptions
                      .filter((s) => s.s === sess)
                      .map((s) => (
                        <option key={s.v} value={s.v} className="text-gray-900">
                          {s.l}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/85 mb-3">
                உங்கள் பெயரைத் தேர்ந்தெடுக்கவும்:
              </label>
              <div className="space-y-4">
                {Object.keys(namesBySession).length === 0 ? (
                  <p className="text-center text-white/50 py-4">பட்டியல் ஏற்றப்படுகிறது...</p>
                ) : (
                  Object.entries(namesBySession).map(([sess, members]) => (
                    <div key={sess}>
                      <p className="text-xs font-bold text-amber-300/90 mb-2">{sess}</p>
                      <div className="flex flex-wrap gap-2">
                        {members.map((m) => {
                          const highlight =
                            matchedSlot?.assigned_member
                              ?.split('/')
                              .map((p) => p.trim())
                              .includes(m) ?? false;
                          return (
                            <button
                              key={`${sess}-${m}`}
                              type="button"
                              onClick={() => setSelectedName(m)}
                              className={`rounded-lg px-3 py-2 text-sm min-h-[40px] border transition ${
                                selectedName === m
                                  ? 'bg-amber-400 text-slate-900 border-amber-300 font-semibold'
                                  : highlight
                                    ? 'bg-amber-500/20 border-amber-400/60 text-amber-100'
                                    : 'bg-white/5 border-white/15 text-white/90 hover:bg-white/10'
                              }`}
                            >
                              {m}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {showCaptcha && (
              <div className="rounded-lg border border-dashed border-amber-400/60 bg-white/5 p-4">
                <label className="block text-sm text-amber-300 mb-1.5">
                  பாதுகாப்பு சரிபார்ப்பு: {captchaQuestion || 'Loading…'}
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-white"
                  placeholder="விடையை உள்ளிடவும்..."
                  value={captchaAns}
                  onChange={(e) => setCaptchaAns(e.target.value)}
                />
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold"
              disabled={submitting || !selectedName || !slotTime}
            >
              {submitting ? 'பதிவாகிறது...' : 'நான் ஜெபித்தேன்!'}
            </Button>
          </form>
        </div>

        {/* Coverage */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 mb-6">
          <h2 className="font-semibold text-amber-300 mb-3">இன்றைய கர்மேல் நிலை:</h2>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-green-400 transition-all"
              style={{ width: `${Math.min(100, coverage.pct)}%` }}
            />
          </div>
          <div className="flex flex-wrap justify-between gap-2 text-sm text-amber-200/90 mb-4">
            <span>
              {coverage.pct}% ({coverage.covered}/{coverage.total} பகுதிகள் நிறைவு)
            </span>
            <span className="text-white/60">{coverageQuote(coverage.pct)}</span>
          </div>

          <p className="text-sm font-bold border-b border-white/10 pb-2 mb-3">
            ஜெப நேரக் கட்டம் (Slot Coverage Grid)
          </p>
          <div className="space-y-3">
            {SESSIONS_FULL.map((sess) => {
              const sessSlots = allSlots.filter((s) => s.session_name === sess);
              if (!sessSlots.length) return null;
              return (
                <div key={sess}>
                  <p className="text-xs font-bold text-amber-300/80 mb-1.5">{sess}</p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
                    {sessSlots.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        title={`[${s.session_name}] ${s.slot_time} - ${s.assigned_member || 'காலியாக உள்ளது'}${
                          s.marked_names ? ` (${s.marked_names})` : ''
                        }`}
                        onClick={() => {
                          setSlotTime(s.slot_time);
                          setDuration(30);
                        }}
                        className={`rounded px-1 py-2 text-[10px] sm:text-xs font-medium min-h-[36px] ${STATE_COLORS[s.state]}`}
                      >
                        {s.slot_time.split('-')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-4 text-xs text-white/70 justify-center">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-green-500" /> ஜெபித்தவை
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> விடுபட்டவை
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> தற்போதைய நேரம்
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-gray-400" /> காலியாக உள்ளவை
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-gray-700" /> வரவிருப்பவை
            </span>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
            <h2 className="text-lg font-semibold text-amber-300">உண்மையான ஜெபக்காவலர்கள்</h2>
            <div className="flex rounded-lg border border-white/15 overflow-hidden text-sm">
              {(
                [
                  ['month', 'இந்த மாதம்'],
                  ['week', 'இந்த வாரம்'],
                  ['all', 'எல்லா நேரமும்'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPeriod(key)}
                  className={`px-3 py-1.5 min-h-[40px] ${
                    period === key ? 'bg-amber-500 text-slate-900 font-semibold' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-sm text-white/55 mb-4">
            ஜெபப் பீடத்தை உண்மையுடன் காக்கும் ஜெப வீரர்கள் பட்டியல்.
          </p>
          {loadingBoard ? (
            <p className="text-center text-white/50 py-8">ஏற்றப்படுகிறது...</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-center text-white/50 py-8">பதிவுகள் எதுவும் இல்லை.</p>
          ) : (
            <ul className="space-y-2">
              {leaderboard.map((item) => (
                <li
                  key={`${item.rank}-${item.name}`}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 bg-white/5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shrink-0 ${
                        item.rank === 1
                          ? 'bg-amber-400 text-amber-950'
                          : item.rank === 2
                            ? 'bg-gray-300 text-gray-800'
                            : item.rank === 3
                              ? 'bg-orange-300 text-orange-950'
                              : 'bg-white/10 text-white/80'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <span className="font-medium truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-sm">
                    {item.streak > 1 ? (
                      <span className="rounded-full bg-orange-500/20 text-orange-200 px-2 py-0.5">
                        {item.streak} நாட்கள்
                      </span>
                    ) : null}
                    <span className="text-white/60">{item.count} பகுதிகள்</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer />

      {success && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl shadow-xl max-w-md w-full p-6 text-center text-white">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center text-2xl text-green-300">
              ✓
            </div>
            <h3 className="text-xl font-semibold text-amber-300 mb-1">அதிசயம்!</h3>
            <p className="mb-4">நன்றி! {success.name} அவர்களே,</p>
            {success.verse && (
              <blockquote className="mb-4 rounded-lg bg-amber-500/10 px-4 py-3 text-sm italic">
                &ldquo;{success.verse.verse}&rdquo;
                <footer className="mt-1 not-italic text-amber-300 text-xs">
                  — {success.verse.ref}
                </footer>
              </blockquote>
            )}
            <p className="text-sm mb-1">இன்று {success.today_count} பேர் ஜெபித்தனர்!</p>
            <p className="text-sm text-amber-300 mb-6">உங்கள் தொடர்: {success.streak} நாட்கள்!</p>
            <Button
              type="button"
              className="w-full bg-white/10 hover:bg-white/15 text-white"
              onClick={() => setSuccess(null)}
            >
              சரி (Close)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
