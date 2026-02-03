import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET all team members
export async function GET(request: NextRequest) {
  try {
    const team = await query<any[]>(
      'SELECT * FROM team_members ORDER BY order_index ASC, created_at ASC'
    );

    return NextResponse.json({ data: team });
  } catch (error: any) {
    console.error('Get team error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create team member
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    const { name, role, bio, image_url, email, phone, order_index } = await request.json();

    if (!name || !role) {
      return NextResponse.json(
        { error: 'Name and role are required' },
        { status: 400 }
      );
    }

    const result = await query<any>(
      'INSERT INTO team_members (name, role, bio, image_url, email, phone, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, role, bio || null, image_url || null, email || null, phone || null, order_index || 0]
    );

    const teamId = (result as any).insertId;
    const team = await query<any[]>(
      'SELECT * FROM team_members WHERE id = ?',
      [teamId]
    );

    return NextResponse.json({ data: team[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Create team member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
