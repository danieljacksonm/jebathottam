import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// PUT update slider
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
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
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
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
