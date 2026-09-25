import { NextRequest, NextResponse } from "next/server";
import {
  buildNewsSitemapIndexXml,
  buildNewsSitemapXml,
  listPublicNewsForSitemap,
  resolveSiteOrigin,
} from "@/lib/news-service";
import { NEWS_GOOGLE_NEWS_MAX_URLS } from "@/lib/news-sitemap-archive";
import { EMPTY_URLSET_XML, xmlSitemapHeaders } from "@/lib/sitemap-xml";
import { requestHostFromHeaders } from "@/lib/site-url";

export const dynamic = "force-dynamic";

const CACHE = "public, s-maxage=300, stale-while-revalidate=600";
const RETRY = { ...xmlSitemapHeaders("no-store"), "Retry-After": "60" };

/**
 * Google News sitemap entrypoint.
 * ≤1000 stories → single urlset; more → sitemap index of /api/news/sitemap/0…
 * Always returns XML (never JSON). Transient failure → 503 (not empty 200).
 */
export async function GET(request: NextRequest) {
  try {
    const items = await listPublicNewsForSitemap();
    const origin = resolveSiteOrigin(request.url, requestHostFromHeaders(request.headers));

    if (items.length <= NEWS_GOOGLE_NEWS_MAX_URLS) {
      return new NextResponse(buildNewsSitemapXml(items, origin), {
        status: 200,
        headers: xmlSitemapHeaders(CACHE),
      });
    }

    return new NextResponse(buildNewsSitemapIndexXml(items.length, origin), {
      status: 200,
      headers: xmlSitemapHeaders(CACHE),
    });
  } catch (error) {
    console.error("News sitemap error:", error);
    return new NextResponse(EMPTY_URLSET_XML, {
      status: 503,
      headers: RETRY,
    });
  }
}
