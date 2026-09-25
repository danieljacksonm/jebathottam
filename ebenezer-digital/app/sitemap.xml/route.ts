import { NextRequest, NextResponse } from "next/server";
import { sitemapForKind } from "@/lib/site-sitemaps";
import { SITEMAP_CHUNK_SIZE, buildSitemapIndexXml } from "@/lib/sitemap-xml";
import {
  originForKind,
  siteKindFromRequestHeaders,
  type SiteKind,
} from "@/lib/site-url";
import { factorySitemapLocsForKind } from "@/lib/content-factory/sitemap";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=86400",
};

const INDEX_TTL_MS = 10 * 60 * 1000;
/** Cold miss: wait for a real entry list so Google never sees an empty child. */
const COLD_WAIT_MS = 12_000;

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

async function refreshIndex(kind: SiteKind): Promise<IndexCache | null> {
  if (refreshing.has(kind)) {
    // Wait briefly for the in-flight refresh to populate cache.
    const started = Date.now();
    while (refreshing.has(kind) && Date.now() - started < COLD_WAIT_MS) {
      await new Promise((r) => setTimeout(r, 50));
      const hit = indexCache.get(kind);
      if (hit) return hit;
    }
    return indexCache.get(kind) || null;
  }
  refreshing.add(kind);
  try {
    const entries = await sitemapForKind(kind);
    const chunks = Math.max(1, Math.ceil(Math.max(entries.length, 1) / SITEMAP_CHUNK_SIZE));
    const next: IndexCache = {
      at: Date.now(),
      chunks,
      xml: buildSitemapIndexXml(locsFor(kind, chunks)),
    };
    indexCache.set(kind, next);
    return next;
  } catch (error) {
    console.error("Sitemap index refresh failed", error);
    return indexCache.get(kind) || null;
  } finally {
    refreshing.delete(kind);
  }
}

/**
 * Host sitemap index.
 * Cold responses wait for a real page list so Search Console does not parse an empty child.
 * Locale clone sitemaps are not listed. Factory locs are opt-in (EBEN_FACTORY_SITEMAPS=1).
 */
export async function GET(request: NextRequest) {
  const kind = siteKindFromRequestHeaders(request.headers);
  const hit = indexCache.get(kind);
  if (hit && Date.now() - hit.at < INDEX_TTL_MS) {
    return xmlResponse(hit.xml);
  }

  if (hit) {
    void refreshIndex(kind);
    return xmlResponse(hit.xml);
  }

  const fresh = await Promise.race([
    refreshIndex(kind),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), COLD_WAIT_MS)),
  ]);

  if (fresh?.xml) return xmlResponse(fresh.xml);

  // Last resort: still advertise chunk 0 only after we know refresh failed —
  // child route will 503 (not empty 200) if the list is unavailable.
  return xmlResponse(buildSitemapIndexXml(locsFor(kind, 1)));
}
