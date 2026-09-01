import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cached } from "@/lib/cache";
import { filterEditorialPosts } from "@/lib/journal-filter";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").trim().toLowerCase();
    const cat = (url.searchParams.get("cat") || "").trim();
    const page = Math.max(1, Number(url.searchParams.get("page") || "1") || 1);
    const limit = Math.min(48, Math.max(12, Number(url.searchParams.get("limit") || "36") || 36));
    const cacheKey = `blog:list:${q}:${cat}:${page}:${limit}`;

    const payload = await cached(cacheKey, 120, async () => {
      const all = await db.getBlogPosts(true);
      const categories = Array.from(new Set(all.map((p) => p.category).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
      );

      const filtered = all.filter((p) => {
        const matchesCat = !cat || cat === "ALL" || p.category === cat;
        const matchesQuery =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q));
        return matchesCat && matchesQuery;
      });

      const start = (page - 1) * limit;
      const editorial = filterEditorialPosts(filtered);
      const slice = editorial.slice(start, start + limit).map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        coverImage: p.coverImage,
        category: p.category,
        tags: p.tags,
        author: p.author,
        publishedAt: p.publishedAt,
        relatedSlugs: p.relatedSlugs,
      }));

      return {
        posts: slice,
        total: editorial.length,
        page,
        limit,
        categories,
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
