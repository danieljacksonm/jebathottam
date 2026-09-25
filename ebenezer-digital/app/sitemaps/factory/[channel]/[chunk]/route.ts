import { NextRequest, NextResponse } from "next/server";
import { buildUrlsetXml, EMPTY_URLSET_XML, xmlSitemapHeaders } from "@/lib/sitemap-xml";
import { siteKindFromRequestHeaders } from "@/lib/site-url";
import {
  factorySitemapEntries,
  factoryChunkCount,
  channelForSiteKind,
} from "@/lib/content-factory/sitemap";
import type { ContentChannel } from "@/lib/content-factory/types";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

const CACHE = "public, s-maxage=86400, stale-while-revalidate=604800";
const RETRY = { ...xmlSitemapHeaders("no-store"), "Retry-After": "60" };

/**
 * Factory sitemap chunks (opt-in via EBEN_FACTORY_SITEMAPS=1).
 * Wrong channel / OOR chunk → 404. Empty or failed build → 503 (not empty 200).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { channel: string; chunk: string } }
) {
  const channel = params.channel as ContentChannel;
  const chunkId = Number.parseInt(params.chunk, 10);
  const kind = siteKindFromRequestHeaders(request.headers);
  const expected = channelForSiteKind(kind);

  if (!expected || expected !== channel || !Number.isFinite(chunkId) || chunkId < 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (chunkId >= factoryChunkCount(channel)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const entries = factorySitemapEntries(channel, chunkId, kind);
    if (!entries.length) {
      return new NextResponse(EMPTY_URLSET_XML, {
        status: 503,
        headers: RETRY,
      });
    }
    return new NextResponse(buildUrlsetXml(entries), {
      status: 200,
      headers: xmlSitemapHeaders(CACHE),
    });
  } catch (error) {
    console.error("Factory sitemap chunk failed", error);
    return new NextResponse(EMPTY_URLSET_XML, {
      status: 503,
      headers: RETRY,
    });
  }
}
