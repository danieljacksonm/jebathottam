import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET - List participants in conference
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conferenceId = parseInt(params.id);

    // Check conference exists
    const conferenceResult = await query(
      `SELECT * FROM conferences WHERE id = ?`,
      [conferenceId]
    );

    if (conferenceResult.length === 0) {
      return NextResponse.json({ error: 'Conference not found' }, { status: 404 });
    }

    const conference = conferenceResult[0];

    // Get participants
    const participants = await query(
      `SELECT 
        cp.*,
        u.name as user_name,
        u.email as user_email,
        f.name as follower_name
       FROM conference_participants cp
       LEFT JOIN users u ON cp.user_id = u.id
       LEFT JOIN followers f ON cp.follower_id = f.id
       WHERE cp.conference_id = ?
       ORDER BY cp.join_time DESC`,
      [conferenceId]
    );

    // Get statistics
    const stats = await query(
      `SELECT 
        COUNT(*) as total_participants,
        COUNT(CASE WHEN join_method = 'browser' THEN 1 END) as browser_count,
        COUNT(CASE WHEN join_method = 'phone' THEN 1 END) as phone_count,
        SUM(duration_seconds) as total_duration_seconds,
        AVG(duration_seconds) as avg_duration_seconds
       FROM conference_participants 
       WHERE conference_id = ?`,
      [conferenceId]
    );

    return NextResponse.json({
      success: true,
      data: {
        participants,
        statistics: stats[0],
      },
    });
  } catch (error: any) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Manually add participant (for admin dial-in setup)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !['super_admin', 'media_team'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const conferenceId = parseInt(params.id);
    const body = await request.json();

    const {
      participant_name,
      participant_phone,
      join_method = 'phone',
      follower_id = null,
    } = body;

    if (!participant_name || !participant_phone) {
      return NextResponse.json(
        { error: 'Participant name and phone are required' },
        { status: 400 }
      );
    }

    // Check conference exists
    const conferenceResult = await query(
      `SELECT * FROM conferences WHERE id = ?`,
      [conferenceId]
    );

    if (conferenceResult.length === 0) {
      return NextResponse.json({ error: 'Conference not found' }, { status: 404 });
    }

    // Add participant
    const sql = `
      INSERT INTO conference_participants 
      (conference_id, participant_name, participant_phone, join_method, follower_id, join_time)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const result = await query(sql, [
      conferenceId,
      participant_name,
      participant_phone,
      join_method,
      follower_id,
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: result.insertId,
          conference_id: conferenceId,
          participant_name,
          participant_phone,
          join_method,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error adding participant:', error);
    return NextResponse.json(
      { error: 'Failed to add participant', details: error.message },
      { status: 500 }
    );
  }
}
