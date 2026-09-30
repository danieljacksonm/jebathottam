import { db } from "@/lib/db";
import type { JournalPost } from "@/app/blog/lib";
import { sortEditorialFirst } from "@/lib/journal-filter";
import { localizedJournalArticle } from "@/lib/i18n/localize-journal";
import { getPrisma, prismaEnabled } from "@/lib/prisma";

function withLocale<T extends { slug: string; title: string; excerpt: string; category: string }>(
  post: T,
  locale?: string
): T {
  if (!locale || locale === "en") return post;
  const localized = localizedJournalArticle(post.slug, locale);
  if (!localized) return post;
  return { ...post, title: localized.title, excerpt: localized.excerpt, category: localized.category };
}

export async function getJournalPostsForPage(opts?: {
  q?: string;
  cat?: string;
  limit?: number;
  locale?: string;
}): Promise<{ posts: JournalPost[]; categories: string[] }> {
  const q = (opts?.q || "").trim().toLowerCase();
  const cat = (opts?.cat || "").trim();
  const limit = Math.min(48, Math.max(12, opts?.limit ?? 36));

  const filePosts = await db.getBlogPosts(true);
  let dbPosts: JournalPost[] = [];
  if (prismaEnabled()) {
    try {
      const rows = await getPrisma()?.journalPost.findMany({
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        take: 500,
      });
      dbPosts = (rows || []).map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        coverImage: p.coverImage || "/images/journal/hero.jpg",
        category: p.category,
        tags: Array.isArray(p.tags) ? p.tags.map(String) : [],
        author: p.author,
        publishedAt: p.publishedAt.toISOString(),
      }));
    } catch {
      dbPosts = [];
    }
  }
  const seen = new Set(dbPosts.map((p) => p.slug));
  const all = [...dbPosts, ...filePosts.filter((p) => !seen.has(p.slug))].map((p) =>
    withLocale(p, opts?.locale)
  );
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

  const posts: JournalPost[] = sortEditorialFirst(
    filtered.slice(0, limit).map((p) => {
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
    })
  );

  return { posts, categories };
}
