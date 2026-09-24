import { NextRequest, NextResponse } from "next/server";
import { buildUrlsetXml, EMPTY_URLSET_XML, xmlSitemapHeaders } from "@/lib/sitemap-xml";
import { siteKindFromRequestHeaders } from "@/lib/site-url";
import { factorySitemapEntries, channelForSiteKind } from "@/lib/content-factory/sitemap";
import type { ContentChannel } from "@/lib/content-factory/types";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

const CACHE_HEADERS = xmlSitemapHeaders("public, s-maxage=86400, stale-while-revalidate=604800");

export async function GET(
  request: NextRequest,
  { params }: { params: { channel: string; chunk: string } }
) {
  const channel = params.channel as ContentChannel;
  const chunkId = Number.parseInt(params.chunk, 10);
  const kind = siteKindFromRequestHeaders(request.headers);
  const expected = channelForSiteKind(kind);

  if (!expected || expected !== channel || !Number.isFinite(chunkId) || chunkId < 0) {
    return new NextResponse(EMPTY_URLSET_XML, { status: 200, headers: CACHE_HEADERS });
  }

  try {
    const entries = factorySitemapEntries(channel, chunkId, kind);
    if (!entries.length) {
      return new NextResponse(EMPTY_URLSET_XML, { status: 200, headers: CACHE_HEADERS });
    }
    return new NextResponse(buildUrlsetXml(entries), { status: 200, headers: CACHE_HEADERS });
  } catch (error) {
    console.error("Factory sitemap chunk failed", error);
    return new NextResponse(EMPTY_URLSET_XML, { status: 200, headers: CACHE_HEADERS });
  }
}
