import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET all testimonies (public)
export async function GET() {
  try {
    const rows = await query<any[]>(
      'SELECT id, name, content, image_url, created_at, updated_at FROM testimonies ORDER BY created_at DESC'
    );
    return NextResponse.json({ data: rows });
  } catch (error: any) {
    console.error('Get testimonies error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create testimony (super_admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) return authResult;

    const body = await request.json();
    const name = body.name?.trim();
    const content = body.content?.trim();
    const image_url = body.image_url?.trim() || null;

    if (!name || !content) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      );
    }

    const result = await query<any>(
      'INSERT INTO testimonies (name, content, image_url) VALUES (?, ?, ?)',
      [name, content, image_url]
    );
    const id = (result as any).insertId;
    const rows = await query<any[]>(
      'SELECT id, name, content, image_url, created_at, updated_at FROM testimonies WHERE id = ?',
      [id]
    );
    return NextResponse.json({ data: rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Create testimony error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
