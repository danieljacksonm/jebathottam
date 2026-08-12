'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type LeaderboardItem = {
  rank: number;
  name: string;
  count: number;
  streak?: number;
};

type Verse = { verse: string; ref: string };

function istDisplayDate(): string {
  return new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function AttendancePage() {
  const [todayCount, setTodayCount] = useState(0);
  const [period, setPeriod] = useState<'week' | 'month'>('month');
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [formTime, setFormTime] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAns, setCaptchaAns] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'error' | 'warning'; message: string } | null>(null);
  const [success, setSuccess] = useState<{
    name: string;
    today_count: number;
    streak: number;
    verse?: Verse;
  } | null>(null);

  const fetchCaptcha = useCallback(async () => {
    try {
      const res = await fetch('/api/attendance?action=captcha', { credentials: 'include' });
      const data = await res.json();
      if (data.question) {
        setCaptchaQuestion(data.question);
        setShowCaptcha(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchTodayCount = useCallback(async () => {
    try {
      const res = await fetch('/api/attendance?action=today_count');
      const data = await res.json();
      setTodayCount(Number(data.count) || 0);
    } catch {
      setTodayCount(0);
    }
  }, []);

  const fetchLeaderboard = useCallback(async (p: 'week' | 'month') => {
    setLoadingBoard(true);
    try {
      const res = await fetch(`/api/attendance?action=leaderboard&period=${p}`);
      const data = await res.json();
      setLeaderboard(Array.isArray(data.leaderboard) ? data.leaderboard : []);
    } catch {
      setLeaderboard([]);
    } finally {
      setLoadingBoard(false);
    }
  }, []);

  useEffect(() => {
    setFormTime(String(Math.floor(Date.now() / 1000)));
    fetchCaptcha();
    fetchTodayCount();
    fetchLeaderboard('month');
  }, [fetchCaptcha, fetchTodayCount, fetchLeaderboard]);

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period, fetchLeaderboard]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          website,
          form_time: formTime,
          captcha_ans: captchaAns,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess({
          name,
          today_count: data.today_count,
          streak: data.streak,
          verse: data.verse,
        });
        setName('');
        setCaptchaAns('');
        setFormTime(String(Math.floor(Date.now() / 1000)));
        await fetchCaptcha();
        await fetchTodayCount();
        await fetchLeaderboard(period);
      } else if (data.captcha_required) {
        await fetchCaptcha();
        setShowCaptcha(true);
        setAlert({
          type: 'warning',
          message: 'Please solve the math question to mark your attendance.',
        });
      } else {
        setAlert({
          type: 'error',
          message: data.message || 'Verification failed. Try again.',
        });
      }
    } catch {
      setAlert({ type: 'error', message: 'Network error. Please check your connection.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 max-w-2xl">
        <nav className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-gray-100">Youth Attendance</span>
        </nav>

        <header className="text-center mb-8">
          <p className="text-sm font-medium tracking-wide text-amber-700 dark:text-amber-400 mb-2">
            Youth Morning Prayer · 5:30 – 6:00 AM
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Rise Early, Seek God First
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Mark your daily attendance · வழிபாட்டு வருகை
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-100/80 dark:bg-amber-900/30 px-4 py-2 text-amber-900 dark:text-amber-200 text-sm font-semibold">
            <span aria-hidden>🔥</span>
            <span>{todayCount} youth prayed today!</span>
          </div>
        </header>

        <div className="rounded-2xl border border-amber-200/60 dark:border-gray-700 bg-white/90 dark:bg-gray-900/80 shadow-sm p-5 sm:p-6 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Please enter your name the <strong>same way</strong> every time (எ.கா. Sis. Mary) so your streak stays correct.
          </p>

          {alert && (
            <div
              className={`mb-4 rounded-lg px-4 py-3 text-sm ${
                alert.type === 'warning'
                  ? 'bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800'
                  : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800'
              }`}
              role="alert"
            >
              {alert.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <input type="hidden" name="form_time" value={formTime} readOnly />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Date (தேதி)
              </label>
              <Input value={istDisplayDate()} readOnly className="bg-gray-50 dark:bg-gray-800/50" />
            </div>

            <div>
              <label htmlFor="user-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Your Name (உங்களுடைய பெயர்)
              </label>
              <Input
                id="user-name"
                name="name"
                required
                autoComplete="off"
                placeholder="Enter your full name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {showCaptcha && (
              <div className="rounded-lg border border-dashed border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20 p-4">
                <label htmlFor="captcha-ans" className="block text-sm font-medium text-amber-800 dark:text-amber-300 mb-1.5">
                  Security Check: {captchaQuestion || 'Loading…'}
                </label>
                <Input
                  id="captcha-ans"
                  name="captcha_ans"
                  type="number"
                  inputMode="numeric"
                  placeholder="Type your answer here..."
                  value={captchaAns}
                  onChange={(e) => setCaptchaAns(e.target.value)}
                />
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Saving…' : 'I Attended Today'}
            </Button>
          </form>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/80 shadow-sm p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Prayer Warriors</h2>
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm">
              <button
                type="button"
                onClick={() => setPeriod('month')}
                className={`px-3 py-1.5 min-h-[40px] ${
                  period === 'month'
                    ? 'bg-primary-600 text-white'
                    : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                Month
              </button>
              <button
                type="button"
                onClick={() => setPeriod('week')}
                className={`px-3 py-1.5 min-h-[40px] ${
                  period === 'week'
                    ? 'bg-primary-600 text-white'
                    : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                Week
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Top faithful attendees seeking God early.
          </p>

          {loadingBoard ? (
            <p className="text-center text-gray-500 py-8">Loading leaderboard…</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No records found for this period.</p>
          ) : (
            <ul className="space-y-2">
              {leaderboard.map((item) => (
                <li
                  key={`${item.rank}-${item.name}`}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50"
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
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-sm">
                    {item.streak && item.streak > 1 ? (
                      <span className="rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 px-2 py-0.5">
                        {item.streak}🔥
                      </span>
                    ) : null}
                    <span className="text-gray-600 dark:text-gray-400">{item.count} days</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          <a
            href="https://join.freeconferencecall.com/jesusisthewayjebathottam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline font-medium"
          >
            Join Youth Prayer Now
          </a>
        </p>
      </main>

      <Footer />

      {success && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-2xl text-green-700 dark:text-green-300">
              ✓
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              Praise God, {success.name}!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Your prayer is recorded!</p>
            {success.verse && (
              <blockquote className="mb-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-sm text-gray-800 dark:text-gray-200 italic">
                “{success.verse.verse}”
                <footer className="mt-1 not-italic text-amber-700 dark:text-amber-400 text-xs">
                  — {success.verse.ref}
                </footer>
              </blockquote>
            )}
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
              {success.today_count} warriors prayed today!
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mb-6">
              Your streak: {success.streak} days!
            </p>
            <Button type="button" className="w-full" onClick={() => setSuccess(null)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
