/**
 * Prayer Collector Android API — shared auth & helpers
 *
 * Auth header (all endpoints):
 *   Authorization: Bearer <PRAYER_API_TOKEN>
 *   (PHP default token: JebathottamPrayerCollector2026)
 *
 * Endpoints & bodies (JSON field names must match Android app):
 *
 * POST /api/prayer/session/start
 *   Body: { session_id, prayer_name, device_id, started_at?, date?, call_type? }
 *   Response: { success, message, session_id }
 *
 * POST /api/prayer/session/update
 *   Body: { session_id, prayer_name?, device_id?, active_participants?, participant_count?,
 *           updated_at?, detection_method? }
 *   Response: { success, message, session_id, participant_count }
 *
 * POST /api/prayer/session/end
 *   Body: { session_id, prayer_name?, device_id?, ended_at?, total_participants?, duration_seconds? }
 *   Response: { success, message, session_id }
 *
 * POST /api/prayer/attendance
 *   Body: { session_id, records: [{ name, join_time, leave_time?, duration_seconds?,
 *           attendance_status?, detection_method?, date?, prayer_session_name?, device_id?,
 *           event_type?, is_duplicate? }] }
 *   Response: { success, message, session_id, inserted, skipped, errors }
 *
 * GET /api/prayer/settings
 *   Response: { success, prayer_name, scan_interval_seconds, ocr_enabled,
 *               accessibility_enabled, auto_sync, retry_count, message }
 *
 * Datetimes are Asia/Kolkata strings: "YYYY-MM-DD HH:mm:ss". Dates: "YYYY-MM-DD".
 */

import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import {
  getDeviceType,
  getIPHash,
  getISTDate,
  getISTTime,
  getISTYesterday,
  normalizeAttendanceName,
} from '@/lib/attendance-utils';

const DEFAULT_TOKEN = 'JebathottamPrayerCollector2026';

export function getPrayerApiToken(): string {
  return process.env.PRAYER_API_TOKEN || DEFAULT_TOKEN;
}

export function prayerCorsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    'X-Content-Type-Options': 'nosniff',
  };
}

export function prayerOptionsResponse(): NextResponse {
  return new NextResponse(null, { status: 204, headers: prayerCorsHeaders() });
}

export function prayerJson(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status, headers: prayerCorsHeaders() });
}

function tokensEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Validate Bearer token. Returns a 401 response if invalid, otherwise null. */
export function authenticatePrayerRequest(request: NextRequest): NextResponse | null {
  const header = request.headers.get('authorization') || '';
  const match = header.match(/Bearer\s+(.+)$/i);
  const token = match?.[1]?.trim() ?? '';
  const expected = getPrayerApiToken();

  if (!token || !tokensEqual(token, expected)) {
    return prayerJson(
      { success: false, message: 'Unauthorized. Invalid or missing API token.' },
      401
    );
  }
  return null;
}

export async function readPrayerBody(request: NextRequest): Promise<Record<string, unknown>> {
  try {
    const data = await request.json();
    return data && typeof data === 'object' && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export function prayerNormalizeName(name: string): string {
  return normalizeAttendanceName(name);
}

/** Parse "YYYY-MM-DD HH:mm:ss" (IST). Returns null if invalid. */
export function prayerParseDateTime(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(raw)) return null;
  return raw;
}

export function prayerNowDateTime(): string {
  return `${getISTDate()} ${getISTTime()}`;
}

export async function ensurePrayerSessionExists(
  sessionId: string,
  prayerName: string,
  deviceId: string
): Promise<void> {
  const existing = await query<{ id: number }[]>(
    'SELECT id FROM prayer_sessions WHERE session_id = ? LIMIT 1',
    [sessionId]
  );
  if (existing.length > 0) return;

  const startedAt = prayerNowDateTime();
  await query(
    `INSERT INTO prayer_sessions
     (session_id, prayer_name, device_id, call_type, started_at, date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      sessionId,
      prayerName !== '' ? prayerName : 'Prayer Session',
      deviceId !== '' ? deviceId : 'unknown',
      'AUTO',
      startedAt,
      getISTDate(),
      'active',
    ]
  );
}

/** Mirror PHP prayerApiSyncYouthAttendance — non-fatal if youth tables missing. */
export async function syncYouthAttendanceFromPrayer(
  request: NextRequest,
  name: string,
  date: string
): Promise<void> {
  try {
    const dup = await query<{ c: number }[]>(
      'SELECT COUNT(*) AS c FROM youth_attendance WHERE name = ? AND date = ?',
      [name, date]
    );
    if (Number(dup[0]?.c ?? 0) > 0) return;

    const ipHash = getIPHash(request);
    const device = getDeviceType(request);
    const yesterday = getISTYesterday(
      // Use noon UTC for the attendance date so IST yesterday is correct enough
      new Date(`${date}T12:00:00+05:30`)
    );

    const streakRows = await query<{ streak: number }[]>(
      'SELECT streak FROM youth_attendance WHERE name = ? AND date = ? LIMIT 1',
      [name, yesterday]
    );
    const streak = streakRows[0]?.streak ? Number(streakRows[0].streak) + 1 : 1;

    await query(
      `INSERT INTO youth_attendance (name, date, ip_hash, device, streak, added_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, date, ipHash, device, streak, 'auto_app']
    );

    await query(
      `INSERT IGNORE INTO youth_members (name, joined_date, is_active) VALUES (?, ?, 1)`,
      [name, date]
    );
  } catch {
    // Non-fatal: youth table may not exist on all environments
  }
}

export async function ensurePrayerSettingsSeeded(): Promise<void> {
  const defaults: Record<string, string> = {
    prayer_name: 'Youth Morning Prayer',
    scan_interval_seconds: '5',
    ocr_enabled: '1',
    accessibility_enabled: '1',
    auto_sync: '1',
    retry_count: '3',
  };
  for (const [key, value] of Object.entries(defaults)) {
    await query(
      'INSERT IGNORE INTO prayer_app_settings (setting_key, setting_value) VALUES (?, ?)',
      [key, value]
    );
  }
}
