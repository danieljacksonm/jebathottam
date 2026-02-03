import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole, getUserFromRequest } from '@/lib/auth';

// GET all blogs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const category = searchParams.get('category');

    let sql = `
      SELECT b.*, u.name as author_name
      FROM blogs b
      LEFT JOIN users u ON b.created_by = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    // Public can only see published blogs
    const user = await getUserFromRequest(request);
    if (!user || !['master_admin', 'pastor'].includes(user.role)) {
      sql += ' AND b.published = 1';
    } else if (published !== null) {
      sql += ' AND b.published = ?';
      params.push(published === 'true' ? 1 : 0);
    }

    if (category) {
      sql += ' AND b.category = ?';
      params.push(category);
    }

    sql += ' ORDER BY b.created_at DESC';

    const blogs = await query<any[]>(sql, params);

    return NextResponse.json({ data: blogs });
  } catch (error: any) {
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create blog
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    const { title, content, excerpt, author, category, featured, published } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const result = await query<any>(
      `INSERT INTO blogs (title, content, excerpt, author, category, featured, published, created_by, published_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        content,
        excerpt || null,
        author || user.name,
        category || null,
        featured ? 1 : 0,
        published ? 1 : 0,
        user.id,
        published ? new Date() : null,
      ]
    );

    const blogId = (result as any).insertId;
    const blogs = await query<any[]>(
      'SELECT b.*, u.name as author_name FROM blogs b LEFT JOIN users u ON b.created_by = u.id WHERE b.id = ?',
      [blogId]
    );

    return NextResponse.json({ data: blogs[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Create blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
