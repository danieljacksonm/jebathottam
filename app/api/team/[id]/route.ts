import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET single team member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const team = await query<any[]>(
      'SELECT * FROM team_members WHERE id = ?',
      [id]
    );

    if (team.length === 0) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: team[0] });
  } catch (error: any) {
    console.error('Get team member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update team member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    const { name, role, bio, image_url, email, phone, order_index } = await request.json();

    await query(
      'UPDATE team_members SET name = ?, role = ?, bio = ?, image_url = ?, email = ?, phone = ?, order_index = ? WHERE id = ?',
      [name, role, bio || null, image_url || null, email || null, phone || null, order_index || 0, id]
    );

    const team = await query<any[]>(
      'SELECT * FROM team_members WHERE id = ?',
      [id]
    );

    return NextResponse.json({ data: team[0] });
  } catch (error: any) {
    console.error('Update team member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    await query('DELETE FROM team_members WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Team member deleted successfully' });
  } catch (error: any) {
    console.error('Delete team member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
