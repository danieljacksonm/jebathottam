import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET all followers
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor', 'member']);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const familyId = searchParams.get('family_id');

    let sql = `
      SELECT 
        f.*,
        fa.name as family_name,
        (SELECT COUNT(*) FROM prayer_points WHERE follower_id = f.id) as prayer_count,
        (SELECT COUNT(*) FROM prayer_points WHERE follower_id = f.id AND status = 'pending') as pending_prayers
      FROM followers f
      LEFT JOIN families fa ON f.family_id = fa.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      sql += ' AND f.status = ?';
      params.push(status);
    }

    if (familyId) {
      sql += ' AND f.family_id = ?';
      params.push(familyId);
    }

    sql += ' ORDER BY f.created_at DESC';

    const followers = await query<any[]>(sql, params);

    return NextResponse.json({ data: followers });
  } catch (error: any) {
    console.error('Get followers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create follower
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    const { name, email, phone, family_id, family_name, status = 'active', notes, join_date } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    let familyId = family_id;

    // Create new family if family_name provided
    if (family_name && !family_id) {
      const familyResult = await query<any>(
        'INSERT INTO families (name) VALUES (?)',
        [family_name]
      );
      familyId = (familyResult as any).insertId;
    }

    const result = await query<any>(
      `INSERT INTO followers (name, email, phone, family_id, status, notes, join_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone || null, familyId || null, status, notes || null, join_date || new Date().toISOString().split('T')[0]]
    );

    const followerId = (result as any).insertId;

    // Get created follower with family name
    const followers = await query<any[]>(
      `SELECT f.*, fa.name as family_name 
       FROM followers f 
       LEFT JOIN families fa ON f.family_id = fa.id 
       WHERE f.id = ?`,
      [followerId]
    );

    return NextResponse.json({ data: followers[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Create follower error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
