import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole, getUserFromRequest } from '@/lib/auth';

// GET single blog
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
    if (!user || !['master_admin', 'pastor'].includes(user.role)) {
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

// PUT update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    const { title, content, excerpt, author, category, featured, published } = await request.json();

    await query(
      `UPDATE blogs 
       SET title = ?, content = ?, excerpt = ?, author = ?, category = ?, 
           featured = ?, published = ?, published_at = CASE WHEN ? = 1 AND published_at IS NULL THEN NOW() ELSE published_at END
       WHERE id = ?`,
      [title, content, excerpt || null, author || null, category || null, featured ? 1 : 0, published ? 1 : 0, published ? 1 : 0, id]
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
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
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
