import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET single gallery image
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const gallery = await query<any[]>(
      'SELECT * FROM gallery WHERE id = ?',
      [id]
    );

    if (gallery.length === 0) {
      return NextResponse.json(
        { error: 'Gallery image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: gallery[0] });
  } catch (error: any) {
    console.error('Get gallery error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update gallery image
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    const { title, description, image_url } = await request.json();

    await query(
      'UPDATE gallery SET title = ?, description = ?, image_url = ? WHERE id = ?',
      [title, description || null, image_url, id]
    );

    const gallery = await query<any[]>(
      'SELECT * FROM gallery WHERE id = ?',
      [id]
    );

    return NextResponse.json({ data: gallery[0] });
  } catch (error: any) {
    console.error('Update gallery error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE gallery image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    await query('DELETE FROM gallery WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Gallery image deleted successfully' });
  } catch (error: any) {
    console.error('Delete gallery error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
