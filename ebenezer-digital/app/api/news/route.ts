import { NextRequest, NextResponse } from "next/server";
import { searchPublicNews } from "@/lib/news-service";

export const dynamic = "force-dynamic";

/** Public search API for E> World News */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q") || undefined;
    const region = searchParams.get("region") || undefined;
    const topic = searchParams.get("topic") || undefined;
    const breaking = searchParams.get("breaking") === "1" || searchParams.get("breaking") === "true";
    const featured = searchParams.get("featured") === "1" || searchParams.get("featured") === "true";
    const limit = Number(searchParams.get("limit") || 200);
    const offset = Number(searchParams.get("offset") || 0);

    const result = await searchPublicNews({
      q,
      region,
      topic,
      breaking: breaking || undefined,
      featured: featured || undefined,
      limit: Number.isFinite(limit) ? limit : 50,
      offset: Number.isFinite(offset) ? offset : 0,
    });

    return NextResponse.json(
      {
        ok: true,
        generatedAt: new Date().toISOString(),
        ...result,
        feeds: {
          rss: "/api/news/rss",
          ical: "/api/news/ical",
          search: "/api/news?q=",
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("News search error:", error);
    return NextResponse.json({ ok: false, error: "Failed to load news" }, { status: 500 });
  }
}
