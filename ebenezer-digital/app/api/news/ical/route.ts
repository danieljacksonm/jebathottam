import { NextRequest, NextResponse } from "next/server";
import { buildIcal, listPublicNews, resolveSiteOrigin } from "@/lib/news-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const items = await listPublicNews();
    const origin = resolveSiteOrigin(request.url, request.headers.get("host"));
    const ics = buildIcal(items, origin);
    return new NextResponse(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'inline; filename="ebenezer-world-news.ics"',
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("iCal error:", error);
    return NextResponse.json({ error: "iCal failed" }, { status: 500 });
  }
}
