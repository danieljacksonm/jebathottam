import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import crypto from 'crypto';

// Helper to generate Jitsi room ID
function generateJitsiRoomId(conferenceTitle: string): string {
  const sanitized = conferenceTitle
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const uniqueSuffix = crypto.randomBytes(4).toString('hex');
  return `${sanitized || 'meeting'}-${uniqueSuffix}`;
}

// Helper to generate dial-in PIN
function generateDialInPin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// GET - List conferences (public or authenticated)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const searchParams = request.nextUrl.searchParams;
    const scope = searchParams.get('scope');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Public listing for website pages
    if (scope === 'public') {
      let sql = 'SELECT id, title, description, status, scheduled_start, scheduled_end, meeting_link, is_public FROM conferences WHERE is_public = 1 AND status != ?';
      const params: (string | number)[] = ['cancelled'];

      if (status) {
        sql += ' AND status = ?';
        params.push(status);
      }

      sql += ' ORDER BY scheduled_start DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const conferences = await query(sql, params);
      return NextResponse.json({ success: true, data: conferences, pagination: { limit, offset } });
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let sql = 'SELECT * FROM conferences WHERE 1=1';
    const params: (string | number)[] = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (user.role !== 'super_admin') {
      sql += ' AND creator_id = ?';
      params.push(user.id);
    }

    sql += ' ORDER BY scheduled_start DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const conferences = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: conferences,
      pagination: { limit, offset },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching conferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conferences', details: message },
      { status: 500 }
    );
  }
}

// POST - Create new conference
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !['super_admin', 'media_team', 'ministry_member'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      scheduled_start,
      scheduled_end,
      is_public = false,
      allow_recordings = true,
      max_participants = 100,
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const jitsiRoomId = generateJitsiRoomId(title);
    const dialInPin = generateDialInPin();
    const meetingLink = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000'}/conferences/${jitsiRoomId}`;

    const sql = `
      INSERT INTO conferences 
      (title, description, jitsi_room_id, dial_in_pin, creator_id, is_public, allow_recordings, max_participants, scheduled_start, scheduled_end, meeting_link, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')
    `;

    const result = await query(sql, [
      title,
      description || null,
      jitsiRoomId,
      dialInPin,
      user.id,
      is_public ? 1 : 0,
      allow_recordings ? 1 : 0,
      max_participants,
      scheduled_start || null,
      scheduled_end || null,
      meetingLink,
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: result.insertId,
          jitsi_room_id: jitsiRoomId,
          dial_in_pin: dialInPin,
          meeting_link: meetingLink,
          title,
          description,
          scheduled_start,
          scheduled_end,
          is_public,
          allow_recordings,
          max_participants,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating conference:', error);
    return NextResponse.json(
      { error: 'Failed to create conference', details: error.message },
      { status: 500 }
    );
  }
}
