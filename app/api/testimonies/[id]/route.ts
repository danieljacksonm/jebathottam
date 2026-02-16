import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { exampleTestimonies } from '@/lib/example-data';

// GET single testimony (returns example when DB fails; 404 only when not found)
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
    const fallback = exampleTestimonies.find((t) => String(t.id) === id || String(-Math.abs(Number(t.id))) === id);
    if (fallback) return NextResponse.json({ data: fallback });
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Get testimony error:', error);
    const first = exampleTestimonies[0];
    const { id: paramId } = await params;
    return NextResponse.json({ data: { ...first, id: Number(paramId) || first.id } });
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
