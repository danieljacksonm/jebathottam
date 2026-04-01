import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET - Get conference by ID with participants
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conferenceId = parseInt(id);

    // Get conference details
    const conferenceResult = await query(
      `SELECT * FROM conferences WHERE id = ?`,
      [conferenceId]
    );

    if (conferenceResult.length === 0) {
      return NextResponse.json({ error: 'Conference not found' }, { status: 404 });
    }

    const conference = conferenceResult[0];

    // Check permissions
    if (
      conference.is_public === 0 &&
      user.role !== 'super_admin' &&
      conference.creator_id !== user.id
    ) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get participants
    const participantsResult = await query(
      `SELECT * FROM conference_participants WHERE conference_id = ? ORDER BY join_time DESC`,
      [conferenceId]
    );

    // Get call records
    const recordsResult = await query(
      `SELECT * FROM call_records WHERE conference_id = ? ORDER BY created_at DESC LIMIT 100`,
      [conferenceId]
    );

    return NextResponse.json({
      success: true,
      data: {
        conference,
        participants: participantsResult,
        call_records: recordsResult,
      },
    });
  } catch (error: any) {
    console.error('Error fetching conference:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conference', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update conference
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conferenceId = parseInt(id);
    const body = await request.json();

    // Check ownership
    const conferenceResult = await query(
      `SELECT creator_id FROM conferences WHERE id = ?`,
      [conferenceId]
    );

    if (conferenceResult.length === 0) {
      return NextResponse.json({ error: 'Conference not found' }, { status: 404 });
    }

    if (conferenceResult[0].creator_id !== user.id && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { title, description, is_public, allow_recordings, max_participants, scheduled_start, scheduled_end } = body;

    let updateSql = 'UPDATE conferences SET ';
    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (is_public !== undefined) {
      updates.push('is_public = ?');
      values.push(is_public ? 1 : 0);
    }
    if (allow_recordings !== undefined) {
      updates.push('allow_recordings = ?');
      values.push(allow_recordings ? 1 : 0);
    }
    if (max_participants !== undefined) {
      updates.push('max_participants = ?');
      values.push(max_participants);
    }
    if (scheduled_start !== undefined) {
      updates.push('scheduled_start = ?');
      values.push(scheduled_start);
    }
    if (scheduled_end !== undefined) {
      updates.push('scheduled_end = ?');
      values.push(scheduled_end);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updates.push('updated_at = NOW()');
    updateSql += updates.join(', ') + ' WHERE id = ?';
    values.push(conferenceId);

    await query(updateSql, values);

    return NextResponse.json({ success: true, data: { id: conferenceId } });
  } catch (error: any) {
    console.error('Error updating conference:', error);
    return NextResponse.json(
      { error: 'Failed to update conference', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete conference
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conferenceId = parseInt(id);

    // Check ownership
    const conferenceResult = await query(
      `SELECT creator_id FROM conferences WHERE id = ?`,
      [conferenceId]
    );

    if (conferenceResult.length === 0) {
      return NextResponse.json({ error: 'Conference not found' }, { status: 404 });
    }

    if (conferenceResult[0].creator_id !== user.id && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await query(`DELETE FROM conferences WHERE id = ?`, [conferenceId]);

    return NextResponse.json({ success: true, data: { id: conferenceId } });
  } catch (error: any) {
    console.error('Error deleting conference:', error);
    return NextResponse.json(
      { error: 'Failed to delete conference', details: error.message },
      { status: 500 }
    );
  }
}
