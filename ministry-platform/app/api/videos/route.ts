import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET published YouTube videos (from DB cache — no live YouTube sync here)
export async function GET() {
  try {
    const videos = await prisma.youtubeVideo.findMany({
      where: { published: true },
      orderBy: { published_at: 'desc' },
      take: 30,
    });

    return NextResponse.json({ data: videos });
  } catch (error) {
    console.error('Get videos error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
