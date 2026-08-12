import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import {
  authenticatePrayerRequest,
  ensurePrayerSessionExists,
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
    const endedAt = prayerParseDateTime(data.ended_at) ?? prayerNowDateTime();
    const totalParticipants = Number(data.total_participants ?? 0) || 0;
    const durationSeconds = Number(data.duration_seconds ?? 0) || 0;

    if (!sessionId) {
      return prayerJson(
        { success: false, message: 'session_id is required.' },
        400
      );
    }

    await ensurePrayerSessionExists(sessionId, prayerName, deviceId);

    await query(
      `UPDATE prayer_sessions
       SET prayer_name = ?, device_id = ?, ended_at = ?, duration_seconds = ?,
           total_participants = ?, status = ?
       WHERE session_id = ?`,
      [
        prayerName,
        deviceId,
        endedAt,
        durationSeconds,
        totalParticipants,
        'ended',
        sessionId,
      ]
    );

    return prayerJson({
      success: true,
      message: 'Prayer session ended.',
      session_id: sessionId,
    });
  } catch (error) {
    console.error('Prayer session/end error:', error);
    return prayerJson(
      { success: false, message: 'Server error. Please try again.' },
      500
    );
  }
}
