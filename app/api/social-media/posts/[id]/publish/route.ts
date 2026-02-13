import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { logActivity } from '@/lib/permissions';

/**
 * POST - Publish post to selected social media platforms
 * This is the core feature that publishes to multiple platforms simultaneously
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requirePermission(request, 'social_media_posts', 'update');
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;
  let id: string;
  try {
    const resolved = await params;
    id = resolved.id;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    // Get post details
    const posts = await query<any[]>(
      'SELECT * FROM social_media_posts WHERE id = ?',
      [id]
    );

    if (posts.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const post = posts[0];

    // Get all platforms linked to this post
    const platforms = await query<any[]>(
      `SELECT 
        pp.id as link_id,
        pp.status as link_status,
        sa.*
       FROM social_media_post_platforms pp
       JOIN social_media_accounts sa ON pp.account_id = sa.id
       WHERE pp.post_id = ? AND pp.status IN ('pending', 'failed')`,
      [id]
    );

    if (platforms.length === 0) {
      return NextResponse.json(
        { error: 'No platforms selected for publishing' },
        { status: 400 }
      );
    }

    // Update post status to publishing
    await query(
      'UPDATE social_media_posts SET status = "publishing" WHERE id = ?',
      [id]
    );

    const results = [];
    let successCount = 0;
    let failCount = 0;

    // Publish to each platform
    for (const platform of platforms) {
      try {
        // Update platform status to publishing
        await query(
          'UPDATE social_media_post_platforms SET status = "publishing" WHERE id = ?',
          [platform.link_id]
        );

        // Call the appropriate platform publishing function
        const publishResult = await publishToPlatform(
          platform.platform,
          platform,
          post
        );

        if (publishResult.success) {
          // Update platform status to published
          await query(
            `UPDATE social_media_post_platforms 
             SET status = "published", 
                 platform_post_id = ?,
                 platform_post_url = ?,
                 published_at = NOW()
             WHERE id = ?`,
            [
              publishResult.post_id || null,
              publishResult.post_url || null,
              platform.link_id
            ]
          );

          // Update last posted time for account
          await query(
            'UPDATE social_media_accounts SET last_posted_at = NOW() WHERE id = ?',
            [platform.id]
          );

          // Initialize analytics
          await query(
            `INSERT INTO social_media_analytics 
             (post_id, account_id, platform)
             VALUES (?, ?, ?)`,
            [id, platform.id, platform.platform]
          );

          successCount++;
          results.push({
            platform: platform.platform,
            account: platform.account_name,
            status: 'success',
            url: publishResult.post_url,
          });
        } else {
          throw new Error(publishResult.error || 'Unknown error');
        }
      } catch (error: any) {
        console.error(`Error publishing to ${platform.platform}:`, error);
        
        // Update platform status to failed
        await query(
          `UPDATE social_media_post_platforms 
           SET status = "failed",
               error_message = ?
           WHERE id = ?`,
          [error.message, platform.link_id]
        );

        failCount++;
        results.push({
          platform: platform.platform,
          account: platform.account_name,
          status: 'failed',
          error: error.message,
        });
      }
    }

    // Update overall post status
    let finalStatus = 'published';
    if (failCount > 0 && successCount === 0) {
      finalStatus = 'failed';
    } else if (failCount > 0 && successCount > 0) {
      finalStatus = 'published'; // Partial success still counts as published
    }

    await query(
      'UPDATE social_media_posts SET status = ?, published_at = NOW() WHERE id = ?',
      [finalStatus, id]
    );

    // Log activity
    await logActivity(
      user.id,
      'social_media_post_published',
      'social_media_posts',
      parseInt(id),
      { 
        successCount, 
        failCount, 
        total: platforms.length,
        results 
      }
    );

    return NextResponse.json({
      message: `Post published to ${successCount} out of ${platforms.length} platforms`,
      results,
      summary: {
        total: platforms.length,
        success: successCount,
        failed: failCount,
      },
    });
  } catch (error: any) {
    console.error('Error publishing post:', error);
    
    // Update post status back to draft on critical error
    await query(
      'UPDATE social_media_posts SET status = "draft" WHERE id = ?',
      [id]
    ).catch(() => {});

    return NextResponse.json(
      { error: 'Failed to publish post' },
      { status: 500 }
    );
  }
}

/**
 * Platform-specific publishing functions
 * These would integrate with actual social media APIs
 * For now, they return mock success responses
 */
async function publishToPlatform(
  platform: string,
  account: any,
  post: any
): Promise<{ success: boolean; post_id?: string; post_url?: string; error?: string }> {
  // Parse media URLs
  let mediaUrls = [];
  try {
    mediaUrls = JSON.parse(post.media_urls);
  } catch (e) {
    mediaUrls = [];
  }

  switch (platform) {
    case 'facebook':
      return await publishToFacebook(account, post, mediaUrls);
    
    case 'instagram':
      return await publishToInstagram(account, post, mediaUrls);
    
    case 'twitter':
      return await publishToTwitter(account, post, mediaUrls);
    
    case 'linkedin':
      return await publishToLinkedIn(account, post, mediaUrls);
    
    case 'youtube':
      return await publishToYouTube(account, post, mediaUrls);
    
    case 'tiktok':
      return await publishToTikTok(account, post, mediaUrls);
    
    case 'telegram':
      return await publishToTelegram(account, post, mediaUrls);
    
    case 'whatsapp':
      return await publishToWhatsApp(account, post, mediaUrls);
    
    default:
      return { success: false, error: 'Unsupported platform' };
  }
}

// Facebook Publishing
async function publishToFacebook(account: any, post: any, mediaUrls: string[]) {
  // TODO: Integrate with Facebook Graph API
  // This is a placeholder implementation
  
  // Simulated API call
  console.log(`Publishing to Facebook: ${account.account_name}`);
  
  // In production, you would use:
  // const response = await fetch(`https://graph.facebook.com/${account.page_id}/feed`, {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     message: post.content,
  //     access_token: account.access_token,
  //   }),
  // });
  
  return {
    success: true,
    post_id: `fb_${Date.now()}`,
    post_url: `https://facebook.com/${account.page_id}/posts/mock_${post.id}`,
  };
}

// Instagram Publishing
async function publishToInstagram(account: any, post: any, mediaUrls: string[]) {
  // TODO: Integrate with Instagram Graph API
  console.log(`Publishing to Instagram: ${account.account_name}`);
  
  return {
    success: true,
    post_id: `ig_${Date.now()}`,
    post_url: `https://instagram.com/p/mock_${post.id}`,
  };
}

// Twitter/X Publishing
async function publishToTwitter(account: any, post: any, mediaUrls: string[]) {
  // TODO: Integrate with Twitter API v2
  console.log(`Publishing to Twitter: ${account.account_name}`);
  
  return {
    success: true,
    post_id: `tw_${Date.now()}`,
    post_url: `https://twitter.com/${account.account_username}/status/mock_${post.id}`,
  };
}

// LinkedIn Publishing
async function publishToLinkedIn(account: any, post: any, mediaUrls: string[]) {
  // TODO: Integrate with LinkedIn API
  console.log(`Publishing to LinkedIn: ${account.account_name}`);
  
  return {
    success: true,
    post_id: `li_${Date.now()}`,
    post_url: `https://linkedin.com/feed/update/mock_${post.id}`,
  };
}

// YouTube Publishing
async function publishToYouTube(account: any, post: any, mediaUrls: string[]) {
  // TODO: Integrate with YouTube Data API
  console.log(`Publishing to YouTube: ${account.account_name}`);
  
  return {
    success: true,
    post_id: `yt_${Date.now()}`,
    post_url: `https://youtube.com/watch?v=mock_${post.id}`,
  };
}

// TikTok Publishing
async function publishToTikTok(account: any, post: any, mediaUrls: string[]) {
  // TODO: Integrate with TikTok API
  console.log(`Publishing to TikTok: ${account.account_name}`);
  
  return {
    success: true,
    post_id: `tt_${Date.now()}`,
    post_url: `https://tiktok.com/@${account.account_username}/video/mock_${post.id}`,
  };
}

// Telegram Publishing
async function publishToTelegram(account: any, post: any, mediaUrls: string[]) {
  // TODO: Integrate with Telegram Bot API
  console.log(`Publishing to Telegram: ${account.account_name}`);
  
  return {
    success: true,
    post_id: `tg_${Date.now()}`,
    post_url: `https://t.me/${account.account_username}/mock_${post.id}`,
  };
}

// WhatsApp Publishing
async function publishToWhatsApp(account: any, post: any, mediaUrls: string[]) {
  // TODO: Integrate with WhatsApp Business API
  console.log(`Publishing to WhatsApp: ${account.account_name}`);
  
  return {
    success: true,
    post_id: `wa_${Date.now()}`,
    post_url: `https://wa.me/${account.account_id}?text=Published`,
  };
}
