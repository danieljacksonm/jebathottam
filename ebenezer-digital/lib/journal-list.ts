import { db } from "@/lib/db";
import type { JournalPost } from "@/app/blog/lib";

export async function getJournalPostsForPage(opts?: {
  q?: string;
  cat?: string;
  limit?: number;
}): Promise<{ posts: JournalPost[]; categories: string[] }> {
  const q = (opts?.q || "").trim().toLowerCase();
  const cat = (opts?.cat || "").trim();
  const limit = Math.min(48, Math.max(12, opts?.limit ?? 36));

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

  const posts: JournalPost[] = filtered.slice(0, limit).map((p) => {
    const publishedAt =
      p.publishedAt instanceof Date
        ? p.publishedAt.toISOString()
        : typeof p.publishedAt === "string"
          ? p.publishedAt
          : undefined;
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      category: p.category,
      tags: p.tags,
      author: p.author,
      publishedAt,
      relatedSlugs: p.relatedSlugs,
    };
  });

  return { posts, categories };
}
