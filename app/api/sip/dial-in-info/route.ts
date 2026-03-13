import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const KEYS = [
  'dial_in_india', 'dial_in_us', 'dial_in_uk', 'dial_in_pin',
  'conference_web_url', 'jitsi_room_name',
];

/**
 * Public API for the SIP bridge (Asterisk/Jigasi on VPS).
 * Returns dial-in numbers, PIN, and Jitsi room name so the bridge can join the same room.
 * No auth required – only exposes what is already shown on the public conference page.
 */
export async function GET() {
  try {
    const rows = await prisma.setting.findMany({
      where: { key_name: { in: KEYS } },
      select: { key_name: true, value: true },
    });
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key_name] = r.value ?? '';

    const conference_web_url = (map.conference_web_url || '').trim();
    let jitsi_room_name = (map.jitsi_room_name || '').trim();
    if (!jitsi_room_name && conference_web_url) {
      try {
        const u = new URL(conference_web_url);
        jitsi_room_name = u.pathname.replace(/^\//, '').split('/')[0] || 'MinistryLine';
      } catch {
        jitsi_room_name = 'MinistryLine';
      }
    }
    if (!jitsi_room_name) jitsi_room_name = 'MinistryLine';

    const data = {
      numbers: {
        india: (map.dial_in_india || '').trim(),
        us: (map.dial_in_us || '').trim(),
        uk: (map.dial_in_uk || '').trim(),
      },
      pin: (map.dial_in_pin || '').trim(),
      jitsi_room_name,
      conference_web_url: conference_web_url || undefined,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error('SIP dial-in-info error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load dial-in info' },
      { status: 500 }
    );
  }
}
