import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import {
  createCaptcha,
  getDeviceType,
  getIPHash,
  getISTDate,
  getISTTime,
  getISTYesterday,
  isBotUserAgent,
  isTooFastSubmission,
  normalizeAttendanceName,
  randomYouthVerse,
  verifyCaptcha,
} from '@/lib/attendance-utils';

export const dynamic = 'force-dynamic';

const CAPTCHA_COOKIE = 'youth_captcha';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || '';
    const today = getISTDate();

    if (action === 'today_count') {
      try {
        const rows = await query<{ c: number }[]>(
          'SELECT COUNT(*) AS c FROM youth_attendance WHERE date = ?',
          [today]
        );
        return NextResponse.json({ count: Number(rows[0]?.c ?? 0) });
      } catch {
        return NextResponse.json({ success: false, count: 0 });
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
        const records = await query<
          { name: string; count: number; streak: number }[]
        >(
          `SELECT name, COUNT(*) AS count, MAX(streak) AS streak
           FROM youth_attendance
           WHERE 1=1 ${dateFilter}
           GROUP BY name
           ORDER BY count DESC, streak DESC
           LIMIT 15`,
          params
        );

        const leaderboard = (records || []).map((r, i) => ({
          rank: i + 1,
          name: r.name,
          count: Number(r.count),
          streak: Number(r.streak),
        }));

        return NextResponse.json({ leaderboard });
      } catch {
        return NextResponse.json({
          success: false,
          message: 'Leaderboard query failed.',
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
    console.error('Attendance GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const today = getISTDate();
    const time = getISTTime();
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
      return NextResponse.json({ success: false, message: 'Bot detected (honeypot)' });
    }

    if (isTooFastSubmission(data.form_time as string | number | undefined)) {
      return NextResponse.json({ success: false, message: 'Bot activity detected.' });
    }

    if (isBotUserAgent(request)) {
      return NextResponse.json({ success: false, message: 'Bot activity detected.' });
    }

    const hourly = await countHourlyMarks(ipHash);
    if (hourly >= 3) {
      return NextResponse.json({
        success: false,
        message: 'Rate limit exceeded! Max 3 submissions per hour. Please wait.',
      });
    }

    let recentSubmissions = 0;
    try {
      const rows = await query<{ c: number }[]>(
        `SELECT COUNT(*) AS c FROM youth_attendance
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
          message: 'Security verification required. Please answer the math question.',
        });
      }
    }

    const name = normalizeAttendanceName(String(data.name ?? ''));
    if (!name) {
      return NextResponse.json({ success: false, message: 'Please enter your name.' });
    }

    const nameDup = await query<{ c: number }[]>(
      'SELECT COUNT(*) AS c FROM youth_attendance WHERE name = ? AND date = ?',
      [name, today]
    );
    if (Number(nameDup[0]?.c ?? 0) > 0) {
      return NextResponse.json({
        success: false,
        message: 'Attendance already marked for this name today.',
      });
    }

    const ipRows = await query<{ name: string }[]>(
      'SELECT name FROM youth_attendance WHERE ip_hash = ? AND date = ? LIMIT 1',
      [ipHash, today]
    );
    if (ipRows.length > 0) {
      const adminUser = await getUserFromRequest(request);
      if (!adminUser) {
        return NextResponse.json({
          success: false,
          message:
            'Attendance already marked from this device today. If this is wrong, please contact your leader.',
        });
      }
    }

    const yesterday = getISTYesterday();
    const streakRows = await query<{ streak: number }[]>(
      'SELECT streak FROM youth_attendance WHERE name = ? AND date = ? LIMIT 1',
      [name, yesterday]
    );
    const streak = streakRows[0]?.streak ? Number(streakRows[0].streak) + 1 : 1;

    await query(
      `INSERT INTO youth_attendance (name, date, time, ip_hash, device, streak, added_by)
       VALUES (?, ?, ?, ?, ?, ?, 'self')`,
      [name, today, time, ipHash, device, streak]
    );

    try {
      await query(
        `INSERT IGNORE INTO youth_members (name, joined_date, is_active) VALUES (?, ?, 1)`,
        [name, today]
      );
    } catch {
      // optional table / ignore failures
    }

    const countRows = await query<{ c: number }[]>(
      'SELECT COUNT(*) AS c FROM youth_attendance WHERE date = ?',
      [today]
    );
    const todayCount = Number(countRows[0]?.c ?? 0);

    const leaderQuery = await query<{ name: string; count: number }[]>(
      `SELECT name, COUNT(*) AS count
       FROM youth_attendance
       WHERE date >= DATE_SUB(?, INTERVAL 30 DAY)
       GROUP BY name
       ORDER BY count DESC
       LIMIT 5`,
      [today]
    );
    const leaderboard = (leaderQuery || []).map((l, i) => ({
      rank: i + 1,
      name: l.name,
      count: Number(l.count),
    }));

    const res = NextResponse.json({
      success: true,
      message: `Praise God, ${name}! Your prayer is recorded.`,
      today_count: todayCount,
      streak,
      verse: randomYouthVerse(),
      leaderboard,
    });
    res.cookies.delete(CAPTCHA_COOKIE);
    return res;
  } catch (error) {
    console.error('Attendance POST error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database error. Please try again.',
    });
  }
}
