import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole, getUserFromRequest } from '@/lib/auth';
import { ensureUniqueSlug } from '@/lib/slug';

// GET single blog (by numeric id — admin / legacy)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserFromRequest(request);
    
    let sql = `
      SELECT b.*, u.name as author_name
      FROM blogs b
      LEFT JOIN users u ON b.created_by = u.id
      WHERE b.id = ?
    `;
    const params_arr: any[] = [id];

    // Public can only see published blogs
    if (!user || user.role !== 'super_admin') {
      sql += ' AND b.published = 1';
    }

    const blogs = await query<any[]>(sql, params_arr);

    if (blogs.length === 0) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: blogs[0] });
  } catch (error: any) {
    console.error('Get blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function slugTakenByOther(slug: string, excludeId: string): Promise<boolean> {
  const rows = await query<any[]>(
    'SELECT id FROM blogs WHERE slug = ? AND id != ? LIMIT 1',
    [slug, excludeId]
  );
  return rows.length > 0;
}

// PUT update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) return authResult;

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

    const existing = await query<any[]>('SELECT id, slug FROM blogs WHERE id = ? LIMIT 1', [id]);
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    let slug = existing[0].slug as string;
    if (slugInput && String(slugInput).trim()) {
      slug = await ensureUniqueSlug(
        (s) => slugTakenByOther(s, id),
        title,
        slugInput
      );
    } else if (!slug) {
      slug = await ensureUniqueSlug((s) => slugTakenByOther(s, id), title);
    }

    await query(
      `UPDATE blogs 
       SET slug = ?, title = ?, title_ta = ?, content = ?, content_ta = ?,
           excerpt = ?, excerpt_ta = ?, meta_title = ?, meta_desc = ?,
           og_image = ?, featured_image = ?, tags = ?,
           author = ?, category = ?, featured = ?, published = ?,
           published_at = CASE WHEN ? = 1 AND published_at IS NULL THEN NOW() ELSE published_at END
       WHERE id = ?`,
      [
        slug,
        title,
        title_ta ?? null,
        content,
        content_ta ?? null,
        excerpt || null,
        excerpt_ta ?? null,
        meta_title ?? null,
        meta_desc ?? null,
        og_image ?? null,
        featured_image ?? null,
        tags ?? null,
        author || null,
        category || null,
        featured ? 1 : 0,
        published ? 1 : 0,
        published ? 1 : 0,
        id,
      ]
    );

    const blogs = await query<any[]>(
      'SELECT b.*, u.name as author_name FROM blogs b LEFT JOIN users u ON b.created_by = u.id WHERE b.id = ?',
      [id]
    );

    return NextResponse.json({ data: blogs[0] });
  } catch (error: any) {
    console.error('Update blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) return authResult;

    await query('DELETE FROM blogs WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error: any) {
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
