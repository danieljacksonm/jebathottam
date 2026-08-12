import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type YtSearchItem = {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
};

async function authorizeSync(request: NextRequest): Promise<NextResponse | null> {
  const cronSecret = request.headers.get('x-cron-secret') || request.headers.get('X-Cron-Secret');
  const expected = process.env.CRON_SECRET;
  if (cronSecret && expected && cronSecret === expected) {
    return null;
  }

  const authResult = await requireRole(request, ['super_admin']);
  if (authResult instanceof NextResponse) return authResult;
  return null;
}

// POST — fetch channel uploads and upsert into youtube_videos
export async function POST(request: NextRequest) {
  try {
    const denied = await authorizeSync(request);
    if (denied) return denied;

    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UCaRcFCKCmj1BgG1DTC3mlDw';

    if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
      return NextResponse.json(
        { error: 'YOUTUBE_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('channelId', channelId);
    url.searchParams.set('part', 'snippet,id');
    url.searchParams.set('order', 'date');
    url.searchParams.set('maxResults', '10');
    url.searchParams.set('type', 'video');

    const ytRes = await fetch(url.toString(), { next: { revalidate: 0 } });
    if (!ytRes.ok) {
      const body = await ytRes.text().catch(() => '');
      console.error('YouTube API error:', ytRes.status, body);
      return NextResponse.json(
        { error: `Failed to fetch from YouTube API (HTTP ${ytRes.status})` },
        { status: 502 }
      );
    }

    const data = (await ytRes.json()) as { items?: YtSearchItem[] };
    const items = data.items || [];
    let upserted = 0;

    for (const item of items) {
      const videoId = item.id?.videoId;
      if (!videoId) continue;

      const snippet = item.snippet || {};
      const title = (snippet.title || 'Untitled').slice(0, 255);
      const description = snippet.description || null;
      const publishedAt = snippet.publishedAt
        ? new Date(snippet.publishedAt)
        : new Date();
      const thumbnailUrl =
        snippet.thumbnails?.high?.url ||
        snippet.thumbnails?.medium?.url ||
        snippet.thumbnails?.default?.url ||
        null;

      await prisma.youtubeVideo.upsert({
        where: { video_id: videoId },
        create: {
          video_id: videoId,
          title,
          description,
          published_at: publishedAt,
          thumbnail_url: thumbnailUrl,
          published: true,
          blog_post_created: false,
        },
        update: {
          title,
          description,
          published_at: publishedAt,
          thumbnail_url: thumbnailUrl,
          published: true,
        },
      });
      upserted += 1;
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${upserted} videos from YouTube channel.`,
      count: upserted,
      source: 'api',
    });
  } catch (error) {
    console.error('YouTube sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
