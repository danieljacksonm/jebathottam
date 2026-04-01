import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// PUT update prayer point status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor', 'member']);
    if (authResult instanceof NextResponse) return authResult;

    const { status, notes } = await request.json();

    if (!status || !['pending', 'happened', 'not-happened'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      );
    }

    await query(
      'UPDATE prayer_points SET status = ?, notes = COALESCE(?, notes) WHERE id = ?',
      [status, notes || null, id]
    );

    const prayerPoints = await query<any[]>(
      'SELECT * FROM prayer_points WHERE id = ?',
      [id]
    );

    return NextResponse.json({ data: prayerPoints[0] });
  } catch (error: any) {
    console.error('Update prayer point error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE prayer point
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    await query('DELETE FROM prayer_points WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Prayer point deleted successfully' });
  } catch (error: any) {
    console.error('Delete prayer point error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
