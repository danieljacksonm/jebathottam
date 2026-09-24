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

type Props = { params: { id: string } };

/** Chunked urlset for large hosts (journal). Linked from /sitemap.xml index. */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const id = Number.parseInt(params.id, 10);
    if (!Number.isFinite(id) || id < 0) {
      return new NextResponse(EMPTY_URLSET_XML, {
        status: 200,
        headers: xmlSitemapHeaders(CACHE),
      });
    }

    const kind = siteKindFromRequestHeaders(request.headers);
    const entries = await sitemapForKind(kind);
    const start = id * SITEMAP_CHUNK_SIZE;
    // Stale index may list a chunk that no longer exists — return empty urlset, never 404.
    if (start >= entries.length) {
      return new NextResponse(EMPTY_URLSET_XML, {
        status: 200,
        headers: xmlSitemapHeaders(CACHE),
      });
    }

    const slice = entries.slice(start, start + SITEMAP_CHUNK_SIZE);
    return new NextResponse(buildUrlsetXml(slice), {
      status: 200,
      headers: xmlSitemapHeaders(CACHE),
    });
  } catch (error) {
    console.error("Sitemap chunk failed", error);
    return new NextResponse(EMPTY_URLSET_XML, {
      status: 200,
      headers: xmlSitemapHeaders(CACHE),
    });
  }
}
