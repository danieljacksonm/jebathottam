import type { ArchivedNewsItem } from "@/lib/news-sitemap-archive";
import { getPrisma, prismaEnabled } from "@/lib/prisma";

export type SavedNews = ArchivedNewsItem;

function toSaved(row: {
  id: string;
  slug: string;
  title: string;
  dek: string;
  body: unknown;
  region: string;
  topic: string;
  location: string;
  sourceLabel: string;
  publishedAt: Date;
  coverImage: string;
  origin: string;
  originalUrl: string | null;
  byline: string | null;
}): SavedNews {
  const body = Array.isArray(row.body) ? row.body.map(String) : [row.dek];
  const origin = row.origin === "cms" || row.origin === "seed" ? row.origin : "live";
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    dek: row.dek,
    body,
    region: row.region,
    topic: row.topic,
    location: row.location,
    sourceLabel: row.sourceLabel,
    publishedAt: row.publishedAt.toISOString(),
    coverImage: row.coverImage,
    origin,
    originalUrl: row.originalUrl || undefined,
    byline: row.byline || undefined,
  };
}

/** Persist stories. Never deletes. No-op if DATABASE_URL is unset. */
export async function upsertNewsLibrary(items: SavedNews[]): Promise<number> {
  const prisma = getPrisma();
  if (!prisma || !items.length) return 0;
  let n = 0;
  for (const item of items) {
    if (!item.slug || !item.title || !item.publishedAt) continue;
    const publishedAt = new Date(item.publishedAt);
    if (Number.isNaN(publishedAt.getTime())) continue;
    await prisma.newsArticle.upsert({
      where: { slug: item.slug },
      create: {
        id: item.id || `live-${item.slug}`,
        slug: item.slug,
        title: item.title.slice(0, 500),
        dek: item.dek || item.title,
        body: item.body?.length ? item.body : [item.dek || item.title],
        region: item.region || "World",
        topic: item.topic || "General",
        location: item.location || "Global",
        sourceLabel: item.sourceLabel || "Ebenezer News Desk",
        publishedAt,
        coverImage: item.coverImage || "",
        origin: item.origin || "live",
        originalUrl: item.originalUrl,
        byline: item.byline,
      },
      update: {
        title: item.title.slice(0, 500),
        dek: item.dek || item.title,
        publishedAt,
        coverImage: item.coverImage || "",
        sourceLabel: item.sourceLabel || "Ebenezer News Desk",
        originalUrl: item.originalUrl,
        byline: item.byline,
      },
    });
    n += 1;
  }
  return n;
}

export async function searchNewsLibrary(opts: {
  q?: string;
  since?: string;
  limit: number;
  offset: number;
}): Promise<{ items: SavedNews[]; total: number } | null> {
  if (!prismaEnabled()) return null;
  const prisma = getPrisma();
  if (!prisma) return null;
  try {
    const q = opts.q?.trim();
    const since = opts.since ? new Date(opts.since) : null;
    const where = {
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { dek: { contains: q } },
              { region: { contains: q } },
              { topic: { contains: q } },
              { sourceLabel: { contains: q } },
            ],
          }
        : {}),
      ...(since && !Number.isNaN(since.getTime()) ? { publishedAt: { gt: since } } : {}),
    };
    const [total, rows] = await Promise.all([
      prisma.newsArticle.count({ where }),
      prisma.newsArticle.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: opts.offset,
        take: opts.limit,
      }),
    ]);
    return { items: rows.map(toSaved), total };
  } catch (error) {
    console.error("News library query failed", error);
    return null;
  }
}
