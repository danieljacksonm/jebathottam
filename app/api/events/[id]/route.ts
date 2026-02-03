import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const events = await query<any[]>(
      'SELECT e.*, u.name as creator_name FROM events e LEFT JOIN users u ON e.created_by = u.id WHERE e.id = ?',
      [id]
    );

    if (events.length === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: events[0] });
  } catch (error: any) {
    console.error('Get event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    const { title, description, type, date, time, location } = await request.json();

    await query(
      `UPDATE events 
       SET title = ?, description = ?, type = ?, date = ?, time = ?, location = ?
       WHERE id = ?`,
      [title, description || null, type || null, date, time || null, location || null, id]
    );

    const events = await query<any[]>(
      'SELECT e.*, u.name as creator_name FROM events e LEFT JOIN users u ON e.created_by = u.id WHERE e.id = ?',
      [id]
    );

    return NextResponse.json({ data: events[0] });
  } catch (error: any) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    await query('DELETE FROM events WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error: any) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
