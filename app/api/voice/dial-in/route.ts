import { NextResponse } from 'next/server';

/**
 * Returns the Twilio dial-in number for phone users (no auth required).
 */
export async function GET() {
  const dialInNumber =
    process.env.TWILIO_PHONE_NUMBER || process.env.NEXT_PUBLIC_TWILIO_DIAL_NUMBER || null;
  return NextResponse.json({ dialInNumber: dialInNumber || undefined });
}
