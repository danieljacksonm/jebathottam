import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole, getUserFromRequest } from '@/lib/auth';

// GET single slide (admin or public for active)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await query<any[]>(
      'SELECT * FROM slider_images WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const slide = rows[0];
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'super_admin') {
      if (slide.status !== 'active') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
    }
    return NextResponse.json({ data: slide });
  } catch (error: any) {
    console.error('Get slider error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update slider
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) return authResult;

    const { image_url, text, title, description, order_index, status } = await request.json();

    await query(
      'UPDATE slider_images SET image_url = ?, text = ?, title = ?, description = ?, order_index = ?, status = ? WHERE id = ?',
      [image_url, text || null, title || null, description || null, order_index || 0, status, id]
    );

    const slides = await query<any[]>(
      'SELECT * FROM slider_images WHERE id = ?',
      [id]
    );

    return NextResponse.json({ data: slides[0] });
  } catch (error: any) {
    console.error('Update slider error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE slider
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) return authResult;

    await query('DELETE FROM slider_images WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Slider image deleted successfully' });
  } catch (error: any) {
    console.error('Delete slider error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
