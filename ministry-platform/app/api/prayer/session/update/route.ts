import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import {
  authenticatePrayerRequest,
  ensurePrayerSessionExists,
  prayerJson,
  prayerNormalizeName,
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
    const participants = Array.isArray(data.active_participants)
      ? data.active_participants
      : [];
    let participantCount = Number(data.participant_count ?? participants.length);
    if (Number.isNaN(participantCount)) participantCount = participants.length;

    const updatedAt = prayerParseDateTime(data.updated_at) ?? prayerNowDateTime();
    const detectionMethod = String(data.detection_method ?? 'ACCESSIBILITY').trim();

    if (!sessionId) {
      return prayerJson(
        { success: false, message: 'session_id is required.' },
        400
      );
    }

    const cleanNames: string[] = [];
    for (const name of participants) {
      const clean = prayerNormalizeName(String(name ?? ''));
      if (clean) cleanNames.push(clean);
    }
    const uniqueNames = [...new Set(cleanNames)];
    participantCount = Math.max(participantCount, uniqueNames.length);

    await ensurePrayerSessionExists(sessionId, prayerName, deviceId);

    await query(
      `INSERT INTO prayer_session_updates
       (session_id, prayer_name, device_id, participant_count, active_participants, detection_method, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        sessionId,
        prayerName,
        deviceId,
        participantCount,
        uniqueNames.join('|'),
        detectionMethod,
        updatedAt,
      ]
    );

    await query(
      `UPDATE prayer_sessions
       SET prayer_name = ?, device_id = ?, total_participants = ?, status = ?
       WHERE session_id = ?`,
      [prayerName, deviceId, participantCount, 'active', sessionId]
    );

    return prayerJson({
      success: true,
      message: 'Session updated.',
      session_id: sessionId,
      participant_count: participantCount,
    });
  } catch (error) {
    console.error('Prayer session/update error:', error);
    return prayerJson(
      { success: false, message: 'Server error. Please try again.' },
      500
    );
  }
}
