import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole, getUserFromRequest } from '@/lib/auth';

// GET all prophecies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const user = await getUserFromRequest(request);

    let sql = `
      SELECT p.*, u.name as creator_name
      FROM prophecies p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    // Only admins and pastors can see all prophecies
    if (!user || !['master_admin', 'pastor'].includes(user.role)) {
      sql += ' AND p.status = "verified"';
    } else if (status) {
      sql += ' AND p.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY p.date DESC, p.created_at DESC';

    const prophecies = await query<any[]>(sql, params);

    return NextResponse.json({ data: prophecies });
  } catch (error: any) {
    console.error('Get prophecies error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create prophecy
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    const { title, content, date, reference, status = 'pending' } = await request.json();

    if (!title || !content || !date) {
      return NextResponse.json(
        { error: 'Title, content, and date are required' },
        { status: 400 }
      );
    }

    const result = await query<any>(
      'INSERT INTO prophecies (title, content, date, reference, status, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content, date, reference || null, status, user.id]
    );

    const prophecyId = (result as any).insertId;
    const prophecies = await query<any[]>(
      'SELECT p.*, u.name as creator_name FROM prophecies p LEFT JOIN users u ON p.created_by = u.id WHERE p.id = ?',
      [prophecyId]
    );

    return NextResponse.json({ data: prophecies[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Create prophecy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
