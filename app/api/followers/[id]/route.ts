import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET single follower
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor', 'member']);
    if (authResult instanceof NextResponse) return authResult;

    const followers = await query<any[]>(
      `SELECT f.*, fa.name as family_name 
       FROM followers f 
       LEFT JOIN families fa ON f.family_id = fa.id 
       WHERE f.id = ?`,
      [id]
    );

    if (followers.length === 0) {
      return NextResponse.json(
        { error: 'Follower not found' },
        { status: 404 }
      );
    }

    // Get prayer points
    const prayerPoints = await query<any[]>(
      'SELECT * FROM prayer_points WHERE follower_id = ? ORDER BY date DESC',
      [id]
    );

    return NextResponse.json({
      data: {
        ...followers[0],
        prayerPoints,
      },
    });
  } catch (error: any) {
    console.error('Get follower error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update follower
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    const { name, email, phone, family_id, status, notes } = await request.json();

    await query(
      `UPDATE followers 
       SET name = ?, email = ?, phone = ?, family_id = ?, status = ?, notes = ?
       WHERE id = ?`,
      [name, email, phone || null, family_id || null, status, notes || null, id]
    );

    const followers = await query<any[]>(
      `SELECT f.*, fa.name as family_name 
       FROM followers f 
       LEFT JOIN families fa ON f.family_id = fa.id 
       WHERE f.id = ?`,
      [id]
    );

    return NextResponse.json({ data: followers[0] });
  } catch (error: any) {
    console.error('Update follower error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE follower
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    await query('DELETE FROM followers WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Follower deleted successfully' });
  } catch (error: any) {
    console.error('Delete follower error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
