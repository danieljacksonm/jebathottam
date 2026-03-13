import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;
    const trackId = parseInt(id, 10);
    if (isNaN(trackId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const body = await request.json();
    const { title, artist, duration, image_url, url, scripture, order_index } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and audio URL are required' },
        { status: 400 }
      );
    }

    const track = await prisma.audioTrack.update({
      where: { id: trackId },
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
    return NextResponse.json({ data: track });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('Update audio track error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;
    const trackId = parseInt(id, 10);
    if (isNaN(trackId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    await prisma.audioTrack.delete({ where: { id: trackId } });
    return NextResponse.json({ success: true, data: { id: trackId } });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('Delete audio track error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
