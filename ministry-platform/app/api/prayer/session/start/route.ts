import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getISTDate } from '@/lib/attendance-utils';
import {
  authenticatePrayerRequest,
  prayerJson,
  prayerOptionsResponse,
  prayerParseDateTime,
  prayerNowDateTime,
  readPrayerBody,
} from '@/lib/prayer-auth';

export const dynamic = 'force-dynamic';

export function OPTIONS() {
  return prayerOptionsResponse();
}

export async function POST(request: NextRequest) {
  const authError = authenticatePrayerRequest(request);
  if (authError) return authError;

  try {
    const data = await readPrayerBody(request);

    const sessionId = String(data.session_id ?? '').trim();
    const prayerName = String(data.prayer_name ?? '').trim();
    const deviceId = String(data.device_id ?? '').trim();
    const startedAt =
      prayerParseDateTime(data.started_at) ?? prayerNowDateTime();
    const date = String(data.date ?? getISTDate()).trim();
    const callType = String(data.call_type ?? 'UNKNOWN').trim();

    if (!sessionId || !prayerName || !deviceId) {
      return prayerJson(
        {
          success: false,
          message: 'session_id, prayer_name, and device_id are required.',
        },
        400
      );
    }

    const existing = await query<{ id: number; status: string }[]>(
      'SELECT id, status FROM prayer_sessions WHERE session_id = ? LIMIT 1',
      [sessionId]
    );

    if (existing.length > 0) {
      if (existing[0].status === 'ended') {
        await query(
          `UPDATE prayer_sessions
           SET prayer_name = ?, device_id = ?, call_type = ?, started_at = ?, ended_at = NULL,
               date = ?, duration_seconds = 0, total_participants = 0, status = 'active'
           WHERE session_id = ?`,
          [prayerName, deviceId, callType, startedAt, date, sessionId]
        );
      }

      return prayerJson({
        success: true,
        message: 'Session already exists, resumed.',
        session_id: sessionId,
      });
    }

    await query(
      `INSERT INTO prayer_sessions
       (session_id, prayer_name, device_id, call_type, started_at, date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [sessionId, prayerName, deviceId, callType, startedAt, date, 'active']
    );

    return prayerJson({
      success: true,
      message: 'Prayer session started.',
      session_id: sessionId,
    });
  } catch (error) {
    console.error('Prayer session/start error:', error);
    return prayerJson(
      { success: false, message: 'Server error. Please try again.' },
      500
    );
  }
}
