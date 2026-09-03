import { NextRequest, NextResponse } from "next/server";
import { sitemapForKind } from "@/lib/site-sitemaps";
import { SITEMAP_CHUNK_SIZE, buildUrlsetXml } from "@/lib/sitemap-xml";
import { siteKindFromHost } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

type Props = { params: { id: string } };

/** Chunked urlset for large hosts (journal). Linked from /sitemap.xml index. */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const id = Number.parseInt(params.id, 10);
    if (!Number.isFinite(id) || id < 0) {
      return new NextResponse("Not found", { status: 404 });
    }

    const kind = siteKindFromHost(request.headers.get("host"));
    const entries = await sitemapForKind(kind);
    const start = id * SITEMAP_CHUNK_SIZE;
    if (start >= entries.length) {
      return new NextResponse("Not found", { status: 404 });
    }

    const slice = entries.slice(start, start + SITEMAP_CHUNK_SIZE);
    return new NextResponse(buildUrlsetXml(slice), {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Sitemap chunk failed", error);
    return new NextResponse("Sitemap chunk failed", { status: 500 });
  }
}
