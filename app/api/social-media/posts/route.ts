import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { logActivity } from '@/lib/permissions';

// GET - List all social media posts
export async function GET(request: NextRequest) {
  const authResult = await requirePermission(request, 'social_media_posts', 'read');
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const media_type = searchParams.get('media_type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = `
      SELECT 
        p.*,
        u.name as creator_name,
        (SELECT COUNT(*) FROM social_media_post_platforms WHERE post_id = p.id AND status = 'published') as published_count,
        (SELECT COUNT(*) FROM social_media_post_platforms WHERE post_id = p.id) as total_platforms
      FROM social_media_posts p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      sql += ' AND p.status = ?';
      params.push(status);
    }

    if (media_type) {
      sql += ' AND p.media_type = ?';
      params.push(media_type);
    }

    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const posts = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM social_media_posts p WHERE 1=1';
    const countParams: any[] = [];

    if (status) {
      countSql += ' AND p.status = ?';
      countParams.push(status);
    }

    if (media_type) {
      countSql += ' AND p.media_type = ?';
      countParams.push(media_type);
    }

    const countResult = await query<any[]>(countSql, countParams);
    const total = countResult[0]?.total || 0;

    return NextResponse.json({ 
      posts, 
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error: any) {
    console.error('Error fetching social media posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST - Create new social media post
export async function POST(request: NextRequest) {
  const authResult = await requirePermission(request, 'social_media_posts', 'create');
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    const data = await request.json();
    const {
      title,
      content,
      media_type = 'text',
      media_urls = [],
      hashtags,
      status = 'draft',
      scheduled_at,
      publish_to_website = true,
      website_category,
      platforms = [], // Array of account IDs to publish to
    } = data;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Create post
    const result = await query<any>(
      `INSERT INTO social_media_posts 
       (title, content, media_type, media_urls, hashtags, status, scheduled_at, 
        publish_to_website, website_category, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title || null,
        content,
        media_type,
        JSON.stringify(media_urls),
        hashtags || null,
        status,
        scheduled_at || null,
        publish_to_website,
        website_category || null,
        user.id,
      ]
    );

    const postId = (result as any).insertId;

    // Link post to selected platforms
    if (platforms.length > 0) {
      const platformValues = platforms.map((accountId: number) => 
        `(${postId}, ${accountId}, 'pending')`
      ).join(', ');

      await query(
        `INSERT INTO social_media_post_platforms (post_id, account_id, status)
         VALUES ${platformValues}`
      );
    }

    // Log activity
    await logActivity(
      user.id,
      'social_media_post_created',
      'social_media_posts',
      postId,
      { title, media_type, platforms: platforms.length }
    );

    const newPost = await query<any[]>(
      `SELECT p.*, u.name as creator_name
       FROM social_media_posts p
       LEFT JOIN users u ON p.created_by = u.id
       WHERE p.id = ?`,
      [postId]
    );

    return NextResponse.json(
      { message: 'Post created successfully', post: newPost[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating social media post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
