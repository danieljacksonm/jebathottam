import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole, getUserFromRequest } from '@/lib/auth';

// GET all media
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let sql = 'SELECT * FROM media WHERE 1=1';
    const params: any[] = [];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    sql += ' ORDER BY created_at DESC';

    const media = await query<any[]>(sql, params);

    return NextResponse.json({ data: media });
  } catch (error: any) {
    console.error('Get media error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create media
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    const { title, description, type, image_url, video_id, thumbnail_url, message } = await request.json();

    if (!title || !type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      );
    }

    const result = await query<any>(
      'INSERT INTO media (title, description, type, image_url, video_id, thumbnail_url, message, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description || null, type, image_url || null, video_id || null, thumbnail_url || null, message || null, user.id]
    );

    const mediaId = (result as any).insertId;
    const media = await query<any[]>(
      'SELECT * FROM media WHERE id = ?',
      [mediaId]
    );

    return NextResponse.json({ data: media[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Create media error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
