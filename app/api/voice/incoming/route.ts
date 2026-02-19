import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook for when someone calls the Twilio dial-in number (PSTN).
 * 1. If no Digits: play greeting and Gather 6-digit meeting ID.
 * 2. If Digits: dial the caller into the conference.
 * Configure your Twilio number's "A call comes in" to: https://yourdomain.com/api/voice/incoming
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  const digits = formData?.get('Digits') as string | null;
  const callSid = formData?.get('CallSid');

  if (digits && /^\d{6}$/.test(digits)) {
    const conferenceName = `meeting-${digits}`;
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Joining conference now.</Say>
  <Dial>
    <Conference startOnEnter="true" endOnExit="false" beep="false">${escapeXml(conferenceName)}</Conference>
  </Dial>
</Response>`;
    return new NextResponse(twiml, {
      headers: { 'Content-Type': 'application/xml' },
    });
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="6" action="${getBaseUrl(request)}/api/voice/incoming" method="POST" timeout="10">
    <Say>Welcome. Enter your 6 digit meeting I D to join the conference.</Say>
  </Gather>
  <Say>We didn't receive your meeting I D. Goodbye.</Say>
  <Hangup/>
</Response>`;
  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}

export async function GET(request: NextRequest) {
  return POST(request);
}

function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  if (host) return `${proto === 'https' ? 'https' : 'http'}://${host}`;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://yourdomain.com';
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
