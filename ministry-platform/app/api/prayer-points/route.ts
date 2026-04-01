import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET all prayer points (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor', 'member']);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(request.url);
    const followerId = searchParams.get('follower_id');
    const status = searchParams.get('status');

    let sql = `
      SELECT pp.*, f.name as follower_name, f.email as follower_email
      FROM prayer_points pp
      JOIN followers f ON pp.follower_id = f.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (followerId) {
      sql += ' AND pp.follower_id = ?';
      params.push(followerId);
    }

    if (status) {
      sql += ' AND pp.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY pp.date DESC, pp.created_at DESC';

    const prayerPoints = await query<any[]>(sql, params);

    return NextResponse.json({ data: prayerPoints });
  } catch (error: any) {
    console.error('Get prayer points error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create prayer point
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor', 'member']);
    if (authResult instanceof NextResponse) return authResult;

    const { follower_id, text, date, notes } = await request.json();

    if (!follower_id || !text || !date) {
      return NextResponse.json(
        { error: 'Follower ID, text, and date are required' },
        { status: 400 }
      );
    }

    const result = await query<any>(
      'INSERT INTO prayer_points (follower_id, text, date, notes, status) VALUES (?, ?, ?, ?, ?)',
      [follower_id, text, date, notes || null, 'pending']
    );

    const prayerPointId = (result as any).insertId;

    const prayerPoints = await query<any[]>(
      'SELECT * FROM prayer_points WHERE id = ?',
      [prayerPointId]
    );

    return NextResponse.json({ data: prayerPoints[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Create prayer point error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
