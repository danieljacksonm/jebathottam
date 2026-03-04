import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// POST - End conference (mark as ended)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conferenceId = parseInt(params.id);

    // Check conference exists and user has permission
    const conferenceResult = await query(
      `SELECT * FROM conferences WHERE id = ?`,
      [conferenceId]
    );

    if (conferenceResult.length === 0) {
      return NextResponse.json({ error: 'Conference not found' }, { status: 404 });
    }

    const conference = conferenceResult[0];

    if (conference.creator_id !== user.id && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { recording_url = null, reason = 'ended' } = body;

    // Update conference status to ended
    let updateSql = `
      UPDATE conferences 
      SET status = 'ended', actual_end = NOW()
    `;
    const params: any[] = [];

    if (recording_url) {
      updateSql += `, recording_url = ?`;
      params.push(recording_url);
    }

    updateSql += ` WHERE id = ?`;
    params.push(conferenceId);

    await query(updateSql, params);

    // Update all participants with leave_time if not already set
    await query(
      `UPDATE conference_participants 
       SET leave_time = NOW(), duration_seconds = TIMESTAMPDIFF(SECOND, join_time, NOW())
       WHERE conference_id = ? AND leave_time IS NULL`,
      [conferenceId]
    );

    return NextResponse.json({
      success: true,
      data: {
        id: conferenceId,
        status: 'ended',
        actual_end: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error ending conference:', error);
    return NextResponse.json(
      { error: 'Failed to end conference', details: error.message },
      { status: 500 }
    );
  }
}
