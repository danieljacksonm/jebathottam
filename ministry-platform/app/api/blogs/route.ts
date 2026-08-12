import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole, getUserFromRequest } from '@/lib/auth';
import { ensureUniqueSlug, slugify } from '@/lib/slug';

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
    if (!user || user.role !== 'super_admin') {
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

async function slugTaken(slug: string): Promise<boolean> {
  const rows = await query<any[]>('SELECT id FROM blogs WHERE slug = ? LIMIT 1', [slug]);
  return rows.length > 0;
}

// POST create blog
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      author,
      category,
      featured,
      published,
      slug: slugInput,
      title_ta,
      excerpt_ta,
      content_ta,
      meta_title,
      meta_desc,
      og_image,
      featured_image,
      tags,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const slug = await ensureUniqueSlug(slugTaken, title, slugInput || slugify(title));

    const result = await query<any>(
      `INSERT INTO blogs (
         slug, title, title_ta, content, content_ta, excerpt, excerpt_ta,
         meta_title, meta_desc, og_image, featured_image, tags,
         author, category, featured, published, created_by, published_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        title,
        title_ta || null,
        content,
        content_ta || null,
        excerpt || null,
        excerpt_ta || null,
        meta_title || null,
        meta_desc || null,
        og_image || null,
        featured_image || null,
        tags || null,
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
