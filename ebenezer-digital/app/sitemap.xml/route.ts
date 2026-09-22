import { NextRequest, NextResponse } from "next/server";
import { sitemapForKind } from "@/lib/site-sitemaps";
import { SITEMAP_CHUNK_SIZE, buildSitemapIndexXml } from "@/lib/sitemap-xml";
import { getPublishedLocales } from "@/lib/i18n/published-locales";
import { originForKind, siteKindFromHost } from "@/lib/site-url";
import { factorySitemapLocsForKind } from "@/lib/content-factory/sitemap";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const CACHE_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

/**
 * Host-aware sitemap index.
 * Always lists the real page chunks (/sitemaps/0…).
 * News is English-only: also list the Google News sitemap, never locale clones
 * (those URLs 301 and made Search Console report "Couldn't fetch").
 */
export async function GET(request: NextRequest) {
  try {
    const kind = siteKindFromHost(request.headers.get("host"));
    const origin = originForKind(kind);
    const entries = await sitemapForKind(kind);
    const chunks = Math.max(1, Math.ceil(entries.length / SITEMAP_CHUNK_SIZE));
    const chunkLocs = Array.from({ length: chunks }, (_, i) => `${origin}/sitemaps/${i}`);
    const factoryLocs = factorySitemapLocsForKind(kind);

    const locs = [...chunkLocs, ...factoryLocs];

    if (kind === "news") {
      locs.push(`${origin}/api/news/sitemap`);
    } else {
      for (const loc of getPublishedLocales()) {
        if (loc === "en") continue;
        locs.push(`${origin}/sitemaps/locale/${loc}`);
      }
    }

    return new NextResponse(buildSitemapIndexXml(locs), {
      status: 200,
      headers: CACHE_HEADERS,
    });
  } catch (error) {
    console.error("Sitemap.xml failed", error);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { status: 500, headers: { "Content-Type": "application/xml; charset=utf-8" } }
    );
  }
}
