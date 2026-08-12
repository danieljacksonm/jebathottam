import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import {
  authenticatePrayerRequest,
  ensurePrayerSettingsSeeded,
  prayerJson,
  prayerOptionsResponse,
} from '@/lib/prayer-auth';

export const dynamic = 'force-dynamic';

export function OPTIONS() {
  return prayerOptionsResponse();
}

export async function GET(request: NextRequest) {
  const authError = authenticatePrayerRequest(request);
  if (authError) return authError;

  try {
    try {
      await ensurePrayerSettingsSeeded();
    } catch {
      // Table may not exist yet; query below will surface a clear error
    }

    const rows = await query<{ setting_key: string; setting_value: string | null }[]>(
      'SELECT setting_key, setting_value FROM prayer_app_settings'
    );

    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.setting_key] = row.setting_value ?? '';
    }

    return prayerJson({
      success: true,
      prayer_name: settings.prayer_name ?? 'Youth Morning Prayer',
      scan_interval_seconds: Number(settings.scan_interval_seconds ?? 5),
      ocr_enabled: (settings.ocr_enabled ?? '1') === '1',
      accessibility_enabled: (settings.accessibility_enabled ?? '1') === '1',
      auto_sync: (settings.auto_sync ?? '1') === '1',
      retry_count: Number(settings.retry_count ?? 3),
      message: 'Settings loaded.',
    });
  } catch (error) {
    console.error('Prayer settings error:', error);
    return prayerJson(
      { success: false, message: 'Server error. Please try again.' },
      500
    );
  }
}
