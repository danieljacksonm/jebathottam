import { NextRequest, NextResponse } from 'next/server';
import { createVoiceToken, generateMeetingId, getDialInNumber, isTwilioConfigured } from '@/lib/twilio';
import { requireRole } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    if (!isTwilioConfigured()) {
      return NextResponse.json(
        { error: 'Voice conference is not configured. Set TWILIO_* env variables.' },
        { status: 503 }
      );
    }
    const body = await request.json().catch(() => ({}));
    const meetingId = typeof body.meetingId === 'string' && /^\d{6}$/.test(body.meetingId)
      ? body.meetingId
      : generateMeetingId();
    const isModerator = body.isModerator === true;
    if (isModerator) {
      const auth = await requireRole(request, ['super_admin', 'admin']);
      if (auth instanceof NextResponse) return auth;
    }
    const result = createVoiceToken(meetingId, isModerator);
    if (!result) {
      return NextResponse.json({ error: 'Failed to create token' }, { status: 500 });
    }
    const dialInNumber = getDialInNumber();
    return NextResponse.json({
      token: result.token,
      identity: result.identity,
      meetingId,
      isModerator,
      dialInNumber: dialInNumber || undefined,
    });
  } catch (e) {
    console.error('Voice token error:', e);
    return NextResponse.json({ error: 'Failed to create token' }, { status: 500 });
  }
}
