import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

const PUBLIC_KEYS = [
  'ministry_name', 'ministry_subtitle', 'ministry_tagline', 'ministry_scripture',
  'ministry_email', 'ministry_phone', 'ministry_address',
  'about_heading', 'about_text', 'about_text_secondary',
  'mission_title', 'mission_description', 'vision_title', 'vision_description',
  'logo_url', 'primary_color',
  'dial_in_india', 'dial_in_us', 'dial_in_uk', 'dial_in_pin',
  'conference_web_url', 'jitsi_room_name',
];

// GET settings - public keys are available without auth, all keys require admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');

    if (scope === 'public') {
      const settings = await prisma.setting.findMany({
        where: { key_name: { in: PUBLIC_KEYS } },
        select: { key_name: true, value: true },
      });
      const obj: Record<string, string> = {};
      for (const s of settings) obj[s.key_name] = s.value ?? '';
      return NextResponse.json({ data: obj });
    }

    const authResult = await requireRole(request, ['super_admin', 'media_team']);
    if (authResult instanceof NextResponse) return authResult;

    const settings = await prisma.setting.findMany({ orderBy: { key_name: 'asc' } });
    const settingsObj: Record<string, string> = {};
    for (const s of settings) settingsObj[s.key_name] = s.value ?? '';

    return NextResponse.json({ data: settingsObj });
  } catch (error: unknown) {
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
    const authResult = await requireRole(request, ['super_admin', 'media_team']);
    if (authResult instanceof NextResponse) return authResult;

    const settings = await request.json();

    for (const [key, value] of Object.entries(settings)) {
      await prisma.setting.upsert({
        where: { key_name: key },
        create: { key_name: key, value: String(value) },
        update: { value: String(value) },
      });
    }

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error: unknown) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
