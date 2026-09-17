import { NextRequest, NextResponse } from "next/server";
import { buildUrlsetXml } from "@/lib/sitemap-xml";
import { siteKindFromHost } from "@/lib/site-url";
import { factorySitemapEntries } from "@/lib/content-factory/sitemap";
import type { ContentChannel } from "@/lib/content-factory/types";
import { channelForSiteKind } from "@/lib/content-factory/sitemap";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

const CACHE_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
};

export async function GET(
  request: NextRequest,
  { params }: { params: { channel: string; chunk: string } }
) {
  const channel = params.channel as ContentChannel;
  const chunkId = Number.parseInt(params.chunk, 10);
  const kind = siteKindFromHost(request.headers.get("host"));
  const expected = channelForSiteKind(kind);

  if (!expected || expected !== channel || !Number.isFinite(chunkId) || chunkId < 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const entries = factorySitemapEntries(channel, chunkId, kind);
    if (!entries.length) {
      return new NextResponse("Not found", { status: 404 });
    }
    return new NextResponse(buildUrlsetXml(entries), { status: 200, headers: CACHE_HEADERS });
  } catch (error) {
    console.error("Factory sitemap chunk failed", error);
    return new NextResponse("Error", { status: 500 });
  }
}
