import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { logActivity } from '@/lib/permissions';

// GET - Get single post with platform details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requirePermission(request, 'social_media_posts', 'read');
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const posts = await query<any[]>(
      `SELECT p.*, u.name as creator_name
       FROM social_media_posts p
       LEFT JOIN users u ON p.created_by = u.id
       WHERE p.id = ?`,
      [params.id]
    );

    if (posts.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Get platforms this post is linked to
    const platforms = await query<any[]>(
      `SELECT 
        pp.*,
        sa.platform,
        sa.account_name,
        sa.account_username
       FROM social_media_post_platforms pp
       JOIN social_media_accounts sa ON pp.account_id = sa.id
       WHERE pp.post_id = ?`,
      [params.id]
    );

    // Get analytics
    const analytics = await query<any[]>(
      `SELECT * FROM social_media_analytics WHERE post_id = ?`,
      [params.id]
    );

    return NextResponse.json({ 
      post: posts[0],
      platforms,
      analytics
    });
  } catch (error: any) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requirePermission(request, 'social_media_posts', 'update');
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    const data = await request.json();
    const {
      title,
      content,
      media_type,
      media_urls,
      hashtags,
      status,
      scheduled_at,
      publish_to_website,
      website_category,
      platforms
    } = data;

    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (content !== undefined) {
      updates.push('content = ?');
      values.push(content);
    }
    if (media_type !== undefined) {
      updates.push('media_type = ?');
      values.push(media_type);
    }
    if (media_urls !== undefined) {
      updates.push('media_urls = ?');
      values.push(JSON.stringify(media_urls));
    }
    if (hashtags !== undefined) {
      updates.push('hashtags = ?');
      values.push(hashtags);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (scheduled_at !== undefined) {
      updates.push('scheduled_at = ?');
      values.push(scheduled_at);
    }
    if (publish_to_website !== undefined) {
      updates.push('publish_to_website = ?');
      values.push(publish_to_website);
    }
    if (website_category !== undefined) {
      updates.push('website_category = ?');
      values.push(website_category);
    }

    if (updates.length === 0 && !platforms) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    if (updates.length > 0) {
      values.push(params.id);
      await query(
        `UPDATE social_media_posts SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Update platforms if provided
    if (platforms && Array.isArray(platforms)) {
      // Remove existing platforms
      await query(
        'DELETE FROM social_media_post_platforms WHERE post_id = ? AND status = "pending"',
        [params.id]
      );

      // Add new platforms
      if (platforms.length > 0) {
        const platformValues = platforms.map((accountId: number) => 
          `(${params.id}, ${accountId}, 'pending')`
        ).join(', ');

        await query(
          `INSERT INTO social_media_post_platforms (post_id, account_id, status)
           VALUES ${platformValues}`
        );
      }
    }

    // Log activity
    await logActivity(
      user.id,
      'social_media_post_updated',
      'social_media_posts',
      parseInt(params.id),
      { updated_fields: Object.keys(data) }
    );

    const updated = await query<any[]>(
      `SELECT p.*, u.name as creator_name
       FROM social_media_posts p
       LEFT JOIN users u ON p.created_by = u.id
       WHERE p.id = ?`,
      [params.id]
    );

    return NextResponse.json({
      message: 'Post updated successfully',
      post: updated[0],
    });
  } catch (error: any) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requirePermission(request, 'social_media_posts', 'delete');
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    const posts = await query<any[]>(
      'SELECT * FROM social_media_posts WHERE id = ?',
      [params.id]
    );

    if (posts.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if post is already published
    const publishedPlatforms = await query<any[]>(
      'SELECT COUNT(*) as count FROM social_media_post_platforms WHERE post_id = ? AND status = "published"',
      [params.id]
    );

    if (publishedPlatforms[0].count > 0) {
      // Instead of deleting, archive it
      await query(
        'UPDATE social_media_posts SET status = "archived" WHERE id = ?',
        [params.id]
      );

      return NextResponse.json({
        message: 'Post archived successfully (already published to some platforms)',
      });
    }

    await query('DELETE FROM social_media_posts WHERE id = ?', [params.id]);

    // Log activity
    await logActivity(
      user.id,
      'social_media_post_deleted',
      'social_media_posts',
      parseInt(params.id),
      { title: posts[0].title }
    );

    return NextResponse.json({
      message: 'Post deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
