import { NextRequest, NextResponse } from "next/server";
import { sitemapForKind } from "@/lib/site-sitemaps";
import {
  SITEMAP_CHUNK_SIZE,
  buildUrlsetXml,
  EMPTY_URLSET_XML,
  xmlSitemapHeaders,
} from "@/lib/sitemap-xml";
import { siteKindFromRequestHeaders } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const CACHE = "public, s-maxage=3600, stale-while-revalidate=86400";
const RETRY = { ...xmlSitemapHeaders("no-store"), "Retry-After": "60" };

type Props = { params: { id: string } };

/**
 * Chunked urlset. Out-of-range → 404 (do not return empty 200 — GSC recorded Success + 0 pages).
 * Transient build failure → 503 so Google retries instead of caching an empty urlset.
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const id = Number.parseInt(params.id, 10);
    if (!Number.isFinite(id) || id < 0) {
      return new NextResponse("Not found", { status: 404 });
    }

    const kind = siteKindFromRequestHeaders(request.headers);
    const entries = await sitemapForKind(kind);
    const start = id * SITEMAP_CHUNK_SIZE;
    if (start >= entries.length) {
      return new NextResponse("Not found", { status: 404 });
    }

    const slice = entries.slice(start, start + SITEMAP_CHUNK_SIZE);
    if (!slice.length) {
      return new NextResponse(EMPTY_URLSET_XML, {
        status: 503,
        headers: RETRY,
      });
    }

    return new NextResponse(buildUrlsetXml(slice), {
      status: 200,
      headers: xmlSitemapHeaders(CACHE),
    });
  } catch (error) {
    console.error("Sitemap chunk failed", error);
    return new NextResponse(EMPTY_URLSET_XML, {
      status: 503,
      headers: RETRY,
    });
  }
}
