import { NextResponse } from "next/server";

/**
 * In-memory viewer count. Resets on server cold start (e.g. Vercel serverless).
 * For persistent count, use Redis (e.g. Upstash) or a database and replace this.
 */
let viewerCount = 0;

export async function GET() {
  return NextResponse.json({ count: viewerCount });
}

export async function POST() {
  viewerCount += 1;
  return NextResponse.json({ count: viewerCount });
}
