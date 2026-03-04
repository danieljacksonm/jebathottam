import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

const PUBLIC_KEYS = [
  'ministry_name', 'ministry_subtitle', 'ministry_tagline', 'ministry_scripture',
  'ministry_email', 'ministry_phone', 'ministry_address',
  'about_heading', 'about_text', 'about_text_secondary',
  'mission_title', 'mission_description', 'vision_title', 'vision_description',
  'logo_url', 'primary_color',
  'dial_in_india', 'dial_in_us', 'dial_in_uk', 'dial_in_pin',
  'conference_web_url',
];

// GET settings - public keys are available without auth, all keys require admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');

    if (scope === 'public') {
      const settings = await query<any[]>(
        `SELECT key_name, value FROM settings WHERE key_name IN (${PUBLIC_KEYS.map(() => '?').join(',')})`,
        PUBLIC_KEYS
      );
      const obj: Record<string, string> = {};
      settings.forEach((s: any) => { obj[s.key_name] = s.value; });
      return NextResponse.json({ data: obj });
    }

    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    const settings = await query<any[]>(
      'SELECT * FROM settings ORDER BY key_name ASC'
    );

    const settingsObj: Record<string, string> = {};
    settings.forEach((setting: any) => {
      settingsObj[setting.key_name] = setting.value;
    });

    return NextResponse.json({ data: settingsObj });
  } catch (error: any) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST update settings
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    const settings = await request.json();

    // Update or insert each setting
    for (const [key, value] of Object.entries(settings)) {
      await query(
        'INSERT INTO settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
        [key, String(value), String(value)]
      );
    }

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error: any) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
