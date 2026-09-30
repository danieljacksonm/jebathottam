import { NextResponse } from "next/server";
import { cached } from "@/lib/cache";
import { getJournalPostsForPage } from "@/lib/journal-list";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").trim().toLowerCase();
    const cat = (url.searchParams.get("cat") || "").trim();
    const locale = (url.searchParams.get("locale") || request.headers.get("x-eben-locale") || "en").toLowerCase();
    const page = Math.max(1, Number(url.searchParams.get("page") || "1") || 1);
    const limit = Math.min(48, Math.max(12, Number(url.searchParams.get("limit") || "36") || 36));
    const cacheKey = `blog:list:${locale}:${q}:${cat}:${page}:${limit}`;

    const payload = await cached(cacheKey, 120, async () => {
      const listed = await getJournalPostsForPage({ q, cat, limit, locale });
      return {
        posts: listed.posts,
        total: listed.posts.length,
        page,
        limit,
        categories: listed.categories,
      };
    });

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Blog list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
