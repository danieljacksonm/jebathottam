import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

// GET all audio tracks (public – for homepage player)
export async function GET() {
  try {
    const rows = await prisma.audioTrack.findMany({
      orderBy: [{ order_index: 'asc' }, { id: 'asc' }],
      select: { id: true, title: true, artist: true, duration: true, image_url: true, url: true, scripture: true, order_index: true },
    });
    return NextResponse.json({ data: rows });
  } catch (error: unknown) {
    console.error('Get audio tracks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create audio track (admin)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) return authResult;

    const body = await request.json();
    const { title, artist, duration, image_url, url, scripture, order_index } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and audio URL are required' },
        { status: 400 }
      );
    }

    const track = await prisma.audioTrack.create({
      data: {
        title: title.trim(),
        artist: artist?.trim() || null,
        duration: duration?.trim() || null,
        image_url: image_url?.trim() || null,
        url: url.trim(),
        scripture: scripture?.trim() || null,
        order_index: order_index ?? 0,
      },
    });
    return NextResponse.json({ data: track }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create audio track error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
