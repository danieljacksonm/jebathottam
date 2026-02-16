import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET single testimony (from database only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await query<any[]>(
      'SELECT id, name, content, image_url, created_at, updated_at FROM testimonies WHERE id = ?',
      [id]
    );
    if (rows.length > 0) {
      return NextResponse.json({ data: rows[0] });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Get testimony error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update testimony (super_admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) return authResult;

    const body = await request.json();
    const name = body.name?.trim();
    const content = body.content?.trim();
    const image_url = body.image_url?.trim() || null;

    if (!name || !content) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      );
    }

    await query(
      'UPDATE testimonies SET name = ?, content = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, content, image_url, id]
    );
    const rows = await query<any[]>(
      'SELECT id, name, content, image_url, created_at, updated_at FROM testimonies WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ data: rows[0] });
  } catch (error: any) {
    console.error('Update testimony error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE testimony (super_admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) return authResult;

    await query('DELETE FROM testimonies WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Testimony deleted successfully' });
  } catch (error: any) {
    console.error('Delete testimony error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
