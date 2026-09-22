import { NextRequest, NextResponse } from "next/server";
import { sitemapForKind } from "@/lib/site-sitemaps";
import { SITEMAP_CHUNK_SIZE, buildSitemapIndexXml } from "@/lib/sitemap-xml";
import { originForKind, siteKindFromHost, type SiteKind } from "@/lib/site-url";
import { factorySitemapLocsForKind } from "@/lib/content-factory/sitemap";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=86400",
  Vary: "Accept-Encoding",
};

const INDEX_TTL_MS = 30 * 60 * 1000;

type IndexCache = { at: number; xml: string; chunks: number };

const indexCache = new Map<SiteKind, IndexCache>();
const refreshing = new Set<SiteKind>();

function locsFor(kind: SiteKind, chunks: number): string[] {
  const origin = originForKind(kind);
  const count = Math.max(1, chunks);
  const locs = Array.from({ length: count }, (_, i) => `${origin}/sitemaps/${i}`);
  locs.push(...factorySitemapLocsForKind(kind));
  if (kind === "news") locs.push(`${origin}/api/news/sitemap`);
  return locs;
}

function xmlResponse(body: string, status = 200) {
  return new NextResponse(body, { status, headers: CACHE_HEADERS });
}

async function refreshIndex(kind: SiteKind): Promise<void> {
  if (refreshing.has(kind)) return;
  refreshing.add(kind);
  try {
    const entries = await sitemapForKind(kind);
    const chunks = Math.max(1, Math.ceil(entries.length / SITEMAP_CHUNK_SIZE));
    indexCache.set(kind, {
      at: Date.now(),
      chunks,
      xml: buildSitemapIndexXml(locsFor(kind, chunks)),
    });
  } catch (error) {
    console.error("Sitemap index refresh failed", error);
  } finally {
    refreshing.delete(kind);
  }
}

/**
 * Host sitemap index. Returns immediately so Google Search Console can fetch it.
 * Page lists are filled in the background; locale clone sitemaps are not listed
 * (those URLs redirect and made Search Console report "Couldn't fetch").
 */
export async function GET(request: NextRequest) {
  const kind = siteKindFromHost(request.headers.get("host"));
  const hit = indexCache.get(kind);
  if (hit && Date.now() - hit.at < INDEX_TTL_MS) {
    return xmlResponse(hit.xml);
  }

  if (hit) {
    void refreshIndex(kind);
    return xmlResponse(hit.xml);
  }

  const pending = refreshIndex(kind);
  const fresh = await Promise.race([
    pending.then(() => indexCache.get(kind)?.xml || null),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
  ]);

  return xmlResponse(fresh || buildSitemapIndexXml(locsFor(kind, 1)));
}
