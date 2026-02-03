import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole, getUserFromRequest } from '@/lib/auth';

// GET all notes/sermons
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'note' or 'sermon'
    const user = await getUserFromRequest(request);

    let sql = `
      SELECT n.*, u.name as author_name
      FROM notes n
      LEFT JOIN users u ON n.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (type) {
      sql += ' AND n.type = ?';
      params.push(type);
    }

    // Users can only see their own notes, admins can see all
    if (user && !['master_admin', 'pastor'].includes(user.role)) {
      sql += ' AND n.user_id = ?';
      params.push(user.id);
    }

    sql += ' ORDER BY n.created_at DESC';

    const notes = await query<any[]>(sql, params);

    return NextResponse.json({ data: notes });
  } catch (error: any) {
    console.error('Get notes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create note/sermon
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor', 'member']);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    const { title, content, type = 'note' } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const result = await query<any>(
      'INSERT INTO notes (title, content, type, user_id) VALUES (?, ?, ?, ?)',
      [title || null, content, type, user.id]
    );

    const noteId = (result as any).insertId;
    const notes = await query<any[]>(
      'SELECT n.*, u.name as author_name FROM notes n LEFT JOIN users u ON n.user_id = u.id WHERE n.id = ?',
      [noteId]
    );

    return NextResponse.json({ data: notes[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Create note error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
