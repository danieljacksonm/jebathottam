import { NextRequest, NextResponse } from 'next/server';

/**
 * TwiML webhook for the Twilio TwiML App.
 * When a browser client (Twilio Device) connects, Twilio calls this URL.
 * We parse the caller identity (m-{meetingId}) and return TwiML to dial them into that conference.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const from = url.searchParams.get('From') || request.headers.get('x-twilio-from') || '';
  const match = from.match(/^client:(mod|m)-(\d{6})$/);
  const meetingId = match ? match[2] : null;
  const isModerator = match ? match[1] === 'mod' : false;
  if (!meetingId) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say>Invalid conference. Goodbye.</Say><Hangup/></Response>`;
    return new NextResponse(twiml, {
      headers: { 'Content-Type': 'application/xml' },
    });
  }
  const conferenceName = `meeting-${meetingId}`;
  const endOnExit = isModerator ? 'true' : 'false';
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial>
    <Conference startOnEnter="true" endOnExit="${endOnExit}" waitUrl="" beep="false">${escapeXml(conferenceName)}</Conference>
  </Dial>
</Response>`;
  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}

export async function POST(request: NextRequest) {
  return GET(request);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
