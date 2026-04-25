import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// POST - Join conference
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    const conferenceId = parseInt(id);
    const body = await request.json();

    // Check conference exists and is active
    const conferenceResult = await query(
      `SELECT * FROM conferences WHERE id = ?`,
      [conferenceId]
    );

    if (conferenceResult.length === 0) {
      return NextResponse.json({ error: 'Conference not found' }, { status: 404 });
    }

    const conference = conferenceResult[0];

    // Check if conference is public or user is authorized
    if (
      conference.is_public === 0 &&
      (!user || (user.role !== 'super_admin' && conference.creator_id !== user.id))
    ) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const {
      participant_name,
      participant_phone,
      join_method = 'browser', // 'browser', 'phone', 'app'
      follower_id = null,
    } = body;

    if (!participant_name) {
      return NextResponse.json({ error: 'Participant name is required' }, { status: 400 });
    }

    // Add participant
    const sql = `
      INSERT INTO conference_participants 
      (conference_id, user_id, follower_id, participant_name, participant_phone, join_method, join_time)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    const result = await query(sql, [
      conferenceId,
      user?.id || null,
      follower_id,
      participant_name,
      participant_phone || null,
      join_method,
    ]);

    // Update conference status if not already live
    if (conference.status === 'scheduled') {
      await query(
        `UPDATE conferences SET status = 'live', actual_start = NOW() WHERE id = ?`,
        [conferenceId]
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          participant_id: result.insertId,
          conference_id: conferenceId,
          jitsi_room_id: conference.jitsi_room_id,
          meeting_link: conference.meeting_link,
          dial_in_pin: conference.dial_in_pin,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error joining conference:', error);
    return NextResponse.json(
      { error: 'Failed to join conference', details: error.message },
      { status: 500 }
    );
  }
}
