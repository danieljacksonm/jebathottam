import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';

// GET - Get analytics for posts
export async function GET(request: NextRequest) {
  const authResult = await requirePermission(request, 'social_media_analytics', 'read');
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');
    const platform = searchParams.get('platform');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');

    let sql = `
      SELECT 
        a.*,
        p.title as post_title,
        p.content as post_content,
        sa.platform,
        sa.account_name
      FROM social_media_analytics a
      LEFT JOIN social_media_posts p ON a.post_id = p.id
      LEFT JOIN social_media_accounts sa ON a.account_id = sa.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (postId) {
      sql += ' AND a.post_id = ?';
      params.push(postId);
    }

    if (platform) {
      sql += ' AND a.platform = ?';
      params.push(platform);
    }

    if (dateFrom) {
      sql += ' AND a.synced_at >= ?';
      params.push(dateFrom);
    }

    if (dateTo) {
      sql += ' AND a.synced_at <= ?';
      params.push(dateTo);
    }

    sql += ' ORDER BY a.synced_at DESC';

    const analytics = await query(sql, params);

    // Get summary statistics
    const summary = await query<any[]>(`
      SELECT 
        COUNT(DISTINCT a.post_id) as total_posts,
        COUNT(DISTINCT a.account_id) as total_accounts,
        SUM(a.likes) as total_likes,
        SUM(a.comments) as total_comments,
        SUM(a.shares) as total_shares,
        SUM(a.views) as total_views,
        SUM(a.reach) as total_reach,
        SUM(a.impressions) as total_impressions,
        AVG(a.engagement_rate) as avg_engagement_rate
      FROM social_media_analytics a
      WHERE 1=1
      ${postId ? 'AND a.post_id = ?' : ''}
      ${platform ? 'AND a.platform = ?' : ''}
      ${dateFrom ? 'AND a.synced_at >= ?' : ''}
      ${dateTo ? 'AND a.synced_at <= ?' : ''}
    `, params);

    // Get platform breakdown
    const platformBreakdown = await query<any[]>(`
      SELECT 
        a.platform,
        COUNT(*) as post_count,
        SUM(a.likes) as total_likes,
        SUM(a.comments) as total_comments,
        SUM(a.shares) as total_shares,
        SUM(a.views) as total_views,
        AVG(a.engagement_rate) as avg_engagement_rate
      FROM social_media_analytics a
      WHERE 1=1
      ${postId ? 'AND a.post_id = ?' : ''}
      ${dateFrom ? 'AND a.synced_at >= ?' : ''}
      ${dateTo ? 'AND a.synced_at <= ?' : ''}
      GROUP BY a.platform
      ORDER BY total_likes DESC
    `, params);

    return NextResponse.json({
      analytics,
      summary: summary[0] || {},
      platformBreakdown,
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// POST - Update analytics (sync from platforms)
export async function POST(request: NextRequest) {
  const authResult = await requirePermission(request, 'social_media_posts', 'update');
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const data = await request.json();
    const {
      post_id,
      account_id,
      platform,
      likes = 0,
      comments = 0,
      shares = 0,
      views = 0,
      clicks = 0,
      reach = 0,
      impressions = 0,
    } = data;

    if (!post_id || !account_id || !platform) {
      return NextResponse.json(
        { error: 'post_id, account_id, and platform are required' },
        { status: 400 }
      );
    }

    // Calculate engagement rate
    const totalEngagement = likes + comments + shares + clicks;
    const engagementRate = impressions > 0 
      ? ((totalEngagement / impressions) * 100).toFixed(2)
      : 0;

    // Update or insert analytics
    await query(
      `INSERT INTO social_media_analytics 
       (post_id, account_id, platform, likes, comments, shares, views, clicks, reach, impressions, engagement_rate, synced_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         likes = VALUES(likes),
         comments = VALUES(comments),
         shares = VALUES(shares),
         views = VALUES(views),
         clicks = VALUES(clicks),
         reach = VALUES(reach),
         impressions = VALUES(impressions),
         engagement_rate = VALUES(engagement_rate),
         synced_at = NOW()`,
      [post_id, account_id, platform, likes, comments, shares, views, clicks, reach, impressions, engagementRate]
    );

    return NextResponse.json({
      message: 'Analytics updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating analytics:', error);
    return NextResponse.json(
      { error: 'Failed to update analytics' },
      { status: 500 }
    );
  }
}
