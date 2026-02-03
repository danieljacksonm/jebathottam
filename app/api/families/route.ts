import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET all families with members
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor', 'member']);
    if (authResult instanceof NextResponse) return authResult;

    const families = await query<any[]>(
      'SELECT * FROM families ORDER BY name ASC'
    );

    // Get members for each family
    const familiesWithMembers = await Promise.all(
      families.map(async (family) => {
        const members = await query<any[]>(
          `SELECT f.*, 
           (SELECT COUNT(*) FROM prayer_points WHERE follower_id = f.id) as prayer_count
           FROM followers f 
           WHERE f.family_id = ?`,
          [family.id]
        );

        // Get prayer points for each member
        const membersWithPrayers = await Promise.all(
          members.map(async (member) => {
            const prayerPoints = await query<any[]>(
              'SELECT * FROM prayer_points WHERE follower_id = ? ORDER BY date DESC',
              [member.id]
            );
            return { ...member, prayerPoints };
          })
        );

        return {
          ...family,
          members: membersWithPrayers,
        };
      })
    );

    return NextResponse.json({ data: familiesWithMembers });
  } catch (error: any) {
    console.error('Get families error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create family
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Family name is required' },
        { status: 400 }
      );
    }

    const result = await query<any>(
      'INSERT INTO families (name) VALUES (?)',
      [name]
    );

    const familyId = (result as any).insertId;

    const families = await query<any[]>(
      'SELECT * FROM families WHERE id = ?',
      [familyId]
    );

    return NextResponse.json({ data: families[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Create family error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
