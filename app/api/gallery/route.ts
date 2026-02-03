import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole, getUserFromRequest } from '@/lib/auth';

// GET all gallery images
export async function GET(request: NextRequest) {
  try {
    const gallery = await query<any[]>(
      'SELECT * FROM gallery ORDER BY created_at DESC'
    );

    return NextResponse.json({ data: gallery });
  } catch (error: any) {
    console.error('Get gallery error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create gallery image
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    const { title, description, image_url } = await request.json();

    if (!title || !image_url) {
      return NextResponse.json(
        { error: 'Title and image URL are required' },
        { status: 400 }
      );
    }

    const result = await query<any>(
      'INSERT INTO gallery (title, description, image_url, created_by) VALUES (?, ?, ?, ?)',
      [title, description || null, image_url, user.id]
    );

    const galleryId = (result as any).insertId;
    const gallery = await query<any[]>(
      'SELECT * FROM gallery WHERE id = ?',
      [galleryId]
    );

    return NextResponse.json({ data: gallery[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Create gallery error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
