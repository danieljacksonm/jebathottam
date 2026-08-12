import { NextRequest, NextResponse } from "next/server";
import { buildRssXml, listPublicNews, resolveSiteOrigin } from "@/lib/news-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const items = await listPublicNews();
    const origin = resolveSiteOrigin(request.url, request.headers.get("host"));
    const xml = buildRssXml(items, origin);
    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("RSS error:", error);
    return NextResponse.json({ error: "RSS failed" }, { status: 500 });
  }
}
