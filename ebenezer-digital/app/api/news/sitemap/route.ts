import { NextRequest, NextResponse } from "next/server";
import { buildNewsSitemapXml, listPublicNewsForSitemap, resolveSiteOrigin } from "@/lib/news-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const items = await listPublicNewsForSitemap();
    const origin = resolveSiteOrigin(request.url, request.headers.get("host"));
    const xml = buildNewsSitemapXml(items, origin);
    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("News sitemap error:", error);
    return NextResponse.json({ error: "News sitemap failed" }, { status: 500 });
  }
}
