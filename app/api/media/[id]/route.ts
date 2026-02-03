import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET single media
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const media = await query<any[]>(
      'SELECT * FROM media WHERE id = ?',
      [id]
    );

    if (media.length === 0) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: media[0] });
  } catch (error: any) {
    console.error('Get media error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update media
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    const { title, description, type, image_url, video_id, thumbnail_url, message } = await request.json();

    await query(
      'UPDATE media SET title = ?, description = ?, type = ?, image_url = ?, video_id = ?, thumbnail_url = ?, message = ? WHERE id = ?',
      [title, description || null, type, image_url || null, video_id || null, thumbnail_url || null, message || null, id]
    );

    const media = await query<any[]>(
      'SELECT * FROM media WHERE id = ?',
      [id]
    );

    return NextResponse.json({ data: media[0] });
  } catch (error: any) {
    console.error('Update media error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE media
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    await query('DELETE FROM media WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch (error: any) {
    console.error('Delete media error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
