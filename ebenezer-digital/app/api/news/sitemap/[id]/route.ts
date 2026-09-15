import { NextRequest, NextResponse } from "next/server";
import {
  buildNewsSitemapXml,
  listPublicNewsForSitemap,
  newsSitemapChunkCount,
  resolveSiteOrigin,
} from "@/lib/news-service";
import { NEWS_GOOGLE_NEWS_MAX_URLS } from "@/lib/news-sitemap-archive";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

/** One Google News urlset chunk (≤1000 URLs). Linked from /api/news/sitemap index. */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const id = Number.parseInt(params.id, 10);
    if (!Number.isFinite(id) || id < 0) {
      return new NextResponse("Not found", { status: 404 });
    }

    const items = await listPublicNewsForSitemap();
    const chunks = newsSitemapChunkCount(items.length);
    if (id >= chunks) {
      return new NextResponse("Not found", { status: 404 });
    }

    const origin = resolveSiteOrigin(request.url, request.headers.get("host"));
    const offset = id * NEWS_GOOGLE_NEWS_MAX_URLS;
    const xml = buildNewsSitemapXml(items, origin, {
      offset,
      limit: NEWS_GOOGLE_NEWS_MAX_URLS,
    });

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("News sitemap chunk error:", error);
    return new NextResponse("News sitemap chunk failed", { status: 500 });
  }
}
