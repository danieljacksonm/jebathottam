import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import {
  authenticatePrayerRequest,
  ensurePrayerSessionExists,
  prayerJson,
  prayerNormalizeName,
  prayerOptionsResponse,
  prayerParseDateTime,
  readPrayerBody,
  syncYouthAttendanceFromPrayer,
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
    const records = data.records;

    if (!sessionId || !Array.isArray(records) || records.length === 0) {
      return prayerJson(
        { success: false, message: 'session_id and records are required.' },
        400
      );
    }

    let inserted = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      if (!record || typeof record !== 'object' || Array.isArray(record)) {
        errors.push(`Record ${index} is invalid.`);
        continue;
      }

      const row = record as Record<string, unknown>;
      const name = prayerNormalizeName(String(row.name ?? ''));
      if (!name) {
        errors.push(`Record ${index} missing name.`);
        continue;
      }

      const joinTime = prayerParseDateTime(row.join_time);
      if (joinTime === null) {
        errors.push(`Record ${index} has invalid join_time.`);
        continue;
      }

      const leaveTime = prayerParseDateTime(row.leave_time);
      const durationSeconds = Number(row.duration_seconds ?? 0) || 0;
      const attendanceStatus = String(row.attendance_status ?? 'JOINED')
        .trim()
        .toUpperCase();
      const detectionMethod = String(row.detection_method ?? 'ACCESSIBILITY')
        .trim()
        .toUpperCase();
      const date = String(row.date ?? joinTime.slice(0, 10)).trim();
      const prayerSessionName = String(
        row.prayer_session_name ?? 'Prayer Session'
      ).trim();
      const deviceId = String(row.device_id ?? '').trim();
      const eventType = String(row.event_type ?? attendanceStatus)
        .trim()
        .toUpperCase();
      // Match PHP empty(): false for null, false, 0, "0", ""
      const dupRaw = row.is_duplicate;
      const isDuplicate =
        dupRaw !== null &&
        dupRaw !== undefined &&
        dupRaw !== false &&
        dupRaw !== 0 &&
        dupRaw !== '0' &&
        dupRaw !== ''
          ? 1
          : 0;

      if (isDuplicate || eventType === 'DUPLICATE') {
        skipped++;
        continue;
      }

      await ensurePrayerSessionExists(sessionId, prayerSessionName, deviceId);

      try {
        await query(
          `INSERT INTO prayer_auto_attendance
           (session_id, name, join_time, leave_time, duration_seconds, attendance_status,
            detection_method, date, prayer_session_name, device_id, event_type, is_duplicate)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            sessionId,
            name,
            joinTime,
            leaveTime,
            durationSeconds,
            attendanceStatus,
            detectionMethod,
            date,
            prayerSessionName,
            deviceId,
            eventType,
            isDuplicate,
          ]
        );
        inserted++;

        if (eventType === 'JOINED' || eventType === 'RETURNED') {
          if (prayerSessionName.toLowerCase().includes('youth')) {
            await syncYouthAttendanceFromPrayer(request, name, date);
          }
        }
      } catch (err: unknown) {
        const code =
          err && typeof err === 'object' && 'code' in err
            ? String((err as { code?: string }).code)
            : '';
        const errno =
          err && typeof err === 'object' && 'errno' in err
            ? Number((err as { errno?: number }).errno)
            : 0;
        // MySQL duplicate key (ER_DUP_ENTRY)
        if (code === 'ER_DUP_ENTRY' || errno === 1062) {
          skipped++;
        } else {
          const message =
            err instanceof Error ? err.message : 'unknown error';
          errors.push(`Record ${index} failed: ${message}`);
        }
      }
    }

    return prayerJson({
      success: true,
      message: `Attendance processed. Inserted: ${inserted}, Skipped: ${skipped}.`,
      session_id: sessionId,
      inserted,
      skipped,
      errors,
    });
  } catch (error) {
    console.error('Prayer attendance error:', error);
    return prayerJson(
      { success: false, message: 'Server error. Please try again.' },
      500
    );
  }
}
