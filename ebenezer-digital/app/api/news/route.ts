import { NextRequest, NextResponse } from "next/server";
import { searchPublicNews } from "@/lib/news-service";

export const dynamic = "force-dynamic";

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 120;

/** Public search API for E> World News */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q") || undefined;
    const region = searchParams.get("region") || undefined;
    const topic = searchParams.get("topic") || undefined;
    const since = searchParams.get("since") || undefined;
    const breaking = searchParams.get("breaking") === "1" || searchParams.get("breaking") === "true";
    const featured = searchParams.get("featured") === "1" || searchParams.get("featured") === "true";
    const rawLimit = Number(searchParams.get("limit") || DEFAULT_LIMIT);
    const rawOffset = Number(searchParams.get("offset") || 0);
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(1, Math.floor(rawLimit)), MAX_LIMIT)
      : DEFAULT_LIMIT;
    const offset = Number.isFinite(rawOffset) ? Math.max(0, Math.floor(rawOffset)) : 0;

    const result = await searchPublicNews({
      q,
      region,
      topic,
      breaking: breaking || undefined,
      featured: featured || undefined,
      limit,
      offset,
      since,
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
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error("News search error:", error);
    return NextResponse.json({ ok: false, error: "Failed to load news" }, { status: 500 });
  }
}
