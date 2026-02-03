import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole, getUserFromRequest } from '@/lib/auth';

// GET all slider images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');

    let sql = 'SELECT * FROM slider_images WHERE 1=1';
    const params: any[] = [];

    // Public can only see active slides
    const user = await getUserFromRequest(request);
    if (!user || !['master_admin', 'pastor'].includes(user.role)) {
      sql += ' AND status = "active"';
    } else if (active !== null) {
      sql += ' AND status = ?';
      params.push(active === 'true' ? 'active' : 'inactive');
    }

    sql += ' ORDER BY order_index ASC, created_at ASC';

    const slides = await query<any[]>(sql, params);

    return NextResponse.json({ data: slides });
  } catch (error: any) {
    console.error('Get slider error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create slider image
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    const { image_url, text, title, description, order_index, status = 'active' } = await request.json();

    if (!image_url) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const result = await query<any>(
      'INSERT INTO slider_images (image_url, text, title, description, order_index, status) VALUES (?, ?, ?, ?, ?, ?)',
      [image_url, text || null, title || null, description || null, order_index || 0, status]
    );

    const slideId = (result as any).insertId;
    const slides = await query<any[]>(
      'SELECT * FROM slider_images WHERE id = ?',
      [slideId]
    );

    return NextResponse.json({ data: slides[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Create slider error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
