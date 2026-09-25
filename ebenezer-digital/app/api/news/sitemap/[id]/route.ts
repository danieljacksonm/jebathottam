import { NextRequest, NextResponse } from "next/server";
import {
  buildNewsSitemapXml,
  listPublicNewsForSitemap,
  newsSitemapChunkCount,
  resolveSiteOrigin,
} from "@/lib/news-service";
import { NEWS_GOOGLE_NEWS_MAX_URLS } from "@/lib/news-sitemap-archive";
import { EMPTY_URLSET_XML, xmlSitemapHeaders } from "@/lib/sitemap-xml";
import { requestHostFromHeaders } from "@/lib/site-url";

export const dynamic = "force-dynamic";

const CACHE = "public, s-maxage=300, stale-while-revalidate=600";
const RETRY = { ...xmlSitemapHeaders("no-store"), "Retry-After": "60" };

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

    const origin = resolveSiteOrigin(request.url, requestHostFromHeaders(request.headers));
    const offset = id * NEWS_GOOGLE_NEWS_MAX_URLS;
    const xml = buildNewsSitemapXml(items, origin, {
      offset,
      limit: NEWS_GOOGLE_NEWS_MAX_URLS,
    });

    return new NextResponse(xml, {
      status: 200,
      headers: xmlSitemapHeaders(CACHE),
    });
  } catch (error) {
    console.error("News sitemap chunk error:", error);
    return new NextResponse(EMPTY_URLSET_XML, {
      status: 503,
      headers: RETRY,
    });
  }
}
