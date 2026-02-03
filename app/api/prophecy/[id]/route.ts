import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET single prophecy
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prophecies = await query<any[]>(
      'SELECT p.*, u.name as creator_name FROM prophecies p LEFT JOIN users u ON p.created_by = u.id WHERE p.id = ?',
      [id]
    );

    if (prophecies.length === 0) {
      return NextResponse.json(
        { error: 'Prophecy not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: prophecies[0] });
  } catch (error: any) {
    console.error('Get prophecy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update prophecy
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    const { title, content, date, reference, status } = await request.json();

    await query(
      'UPDATE prophecies SET title = ?, content = ?, date = ?, reference = ?, status = ? WHERE id = ?',
      [title, content, date, reference || null, status, id]
    );

    const prophecies = await query<any[]>(
      'SELECT p.*, u.name as creator_name FROM prophecies p LEFT JOIN users u ON p.created_by = u.id WHERE p.id = ?',
      [id]
    );

    return NextResponse.json({ data: prophecies[0] });
  } catch (error: any) {
    console.error('Update prophecy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE prophecy
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    await query('DELETE FROM prophecies WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Prophecy deleted successfully' });
  } catch (error: any) {
    console.error('Delete prophecy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
