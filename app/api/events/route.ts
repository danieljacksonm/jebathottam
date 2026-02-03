import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole, getUserFromRequest } from '@/lib/auth';

// GET all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get('upcoming');

    let sql = `
      SELECT e.*, u.name as creator_name
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (upcoming === 'true') {
      sql += ' AND e.date >= CURDATE()';
    }

    sql += ' ORDER BY e.date ASC, e.time ASC';

    const events = await query<any[]>(sql, params);

    return NextResponse.json({ data: events });
  } catch (error: any) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create event
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    const { title, description, type, date, time, location } = await request.json();

    if (!title || !date) {
      return NextResponse.json(
        { error: 'Title and date are required' },
        { status: 400 }
      );
    }

    const result = await query<any>(
      `INSERT INTO events (title, description, type, date, time, location, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description || null, type || null, date, time || null, location || null, user.id]
    );

    const eventId = (result as any).insertId;
    const events = await query<any[]>(
      'SELECT e.*, u.name as creator_name FROM events e LEFT JOIN users u ON e.created_by = u.id WHERE e.id = ?',
      [eventId]
    );

    return NextResponse.json({ data: events[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
