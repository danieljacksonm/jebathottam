import { NextRequest, NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;
const TWILIO_DIAL = process.env.TWILIO_PHONE_NUMBER || process.env.NEXT_PUBLIC_TWILIO_DIAL_NUMBER || null;

function isAgoraConfigured(): boolean {
  return !!(APP_ID && APP_CERTIFICATE);
}

export async function POST(request: NextRequest) {
  try {
    if (!isAgoraConfigured()) {
      return NextResponse.json(
        { error: 'Voice (internet) is not configured. Set AGORA_APP_ID and AGORA_APP_CERTIFICATE.' },
        { status: 503 }
      );
    }
    const body = await request.json().catch(() => ({}));
    const meetingId = typeof body.meetingId === 'string' && /^\d{6}$/.test(body.meetingId)
      ? body.meetingId
      : null;
    if (!meetingId) {
      return NextResponse.json({ error: 'Valid 6-digit meeting ID required' }, { status: 400 });
    }
    const channelName = `meeting-${meetingId}`;
    const uid = Math.floor(Math.random() * 1e9);
    const expiration = 3600; // 1 hour
    const currentTs = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTs + expiration;
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID!,
      APP_CERTIFICATE!,
      channelName,
      uid,
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    );
    return NextResponse.json({
      token,
      appId: APP_ID,
      channel: channelName,
      uid,
      dialInNumber: TWILIO_DIAL || undefined,
    });
  } catch (e) {
    console.error('Agora token error:', e);
    return NextResponse.json({ error: 'Failed to create token' }, { status: 500 });
  }
}
