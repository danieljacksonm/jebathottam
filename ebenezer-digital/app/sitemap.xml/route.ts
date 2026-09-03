import { NextRequest, NextResponse } from "next/server";
import { sitemapForKind } from "@/lib/site-sitemaps";
import {
  SITEMAP_CHUNK_SIZE,
  buildSitemapIndexXml,
  buildUrlsetXml,
} from "@/lib/sitemap-xml";
import { originForKind, siteKindFromHost } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const CACHE_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

/** Host-aware sitemap — index when large, otherwise a single urlset. */
export async function GET(request: NextRequest) {
  try {
    const kind = siteKindFromHost(request.headers.get("host"));
    const origin = originForKind(kind);
    const entries = await sitemapForKind(kind);

    if (entries.length > SITEMAP_CHUNK_SIZE) {
      const chunks = Math.ceil(entries.length / SITEMAP_CHUNK_SIZE);
      const locs = Array.from({ length: chunks }, (_, i) => `${origin}/sitemaps/${i}`);
      return new NextResponse(buildSitemapIndexXml(locs), {
        status: 200,
        headers: CACHE_HEADERS,
      });
    }

    return new NextResponse(buildUrlsetXml(entries), {
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
