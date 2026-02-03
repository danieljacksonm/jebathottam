import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole, getUserFromRequest } from '@/lib/auth';

// GET single note
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserFromRequest(request);

    let sql = `
      SELECT n.*, u.name as author_name
      FROM notes n
      LEFT JOIN users u ON n.user_id = u.id
      WHERE n.id = ?
    `;
    const params_arr: any[] = [id];

    // Users can only see their own notes, admins can see all
    if (user && !['master_admin', 'pastor'].includes(user.role)) {
      sql += ' AND n.user_id = ?';
      params_arr.push(user.id);
    }

    const notes = await query<any[]>(sql, params_arr);

    if (notes.length === 0) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: notes[0] });
  } catch (error: any) {
    console.error('Get note error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update note
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor', 'member']);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    // Check if user owns this note (unless admin)
    if (!['master_admin', 'pastor'].includes(user.role)) {
      const notes = await query<any[]>(
        'SELECT user_id FROM notes WHERE id = ?',
        [id]
      );
      if (notes.length === 0 || notes[0].user_id !== user.id) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }
    }

    const { title, content, type } = await request.json();

    await query(
      'UPDATE notes SET title = ?, content = ?, type = ? WHERE id = ?',
      [title || null, content, type || 'note', id]
    );

    const updatedNotes = await query<any[]>(
      'SELECT n.*, u.name as author_name FROM notes n LEFT JOIN users u ON n.user_id = u.id WHERE n.id = ?',
      [id]
    );

    return NextResponse.json({ data: updatedNotes[0] });
  } catch (error: any) {
    console.error('Update note error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor', 'member']);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    // Check if user owns this note (unless admin)
    if (!['master_admin', 'pastor'].includes(user.role)) {
      const notes = await query<any[]>(
        'SELECT user_id FROM notes WHERE id = ?',
        [id]
      );
      if (notes.length === 0 || notes[0].user_id !== user.id) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }
    }

    await query('DELETE FROM notes WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error: any) {
    console.error('Delete note error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
