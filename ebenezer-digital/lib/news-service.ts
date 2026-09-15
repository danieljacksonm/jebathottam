import { cache } from "react";
import { db, type NewsArticleRecord } from "@/lib/db";
import {
  WORLD_NEWS,
  type NewsArticle,
  type NewsRegion,
} from "@/app/blog/news/data";
import { getLiveNewsBySlug, peekLiveNewsCache } from "@/lib/live-news";
import { storyFingerprint, photoForStory, safeNewsCover } from "@/lib/news-photos";
import { originForKind, siteKindFromHost, NEWS_URL } from "@/lib/site-url";
import { inferNewsSourceType, newsPublicUrl, legacySlugFromSourceUrl, isLegacySourceDomainSlug } from "@/lib/news-url";
import {
  getArchivedNewsBySlug,
  listNewsForSitemap,
  rememberNewsForSitemap,
  NEWS_GOOGLE_NEWS_MAX_URLS,
  findArchivedNewsByLegacySlug,
  listArchivedNewsRecent,
} from "@/lib/news-sitemap-archive";

export type PublicNewsItem = NewsArticle & {
  origin: "seed" | "cms" | "live";
  originalUrl?: string;
  byline?: string;
  updatedAt?: string;
};

function recordToPublic(n: NewsArticleRecord): PublicNewsItem {
  const fallback = photoForStory(n.region || "World", n.title, n.topic || "General");
  const originalUrl = n.originalUrl || undefined;
  return {
    id: n.id,
    slug: n.slug,
    title: n.title,
    dek: n.dek,
    body: n.body?.length ? n.body : [n.dek],
    region: (n.region || "World") as NewsRegion,
    topic: n.topic || "General",
    location: n.location || "Global",
    sourceLabel: n.sourceLabel || "Ebenezer News Desk",
    publishedAt: (n.publishedAt || n.createdAt).toISOString(),
    updatedAt: (n.updatedAt || n.publishedAt || n.createdAt).toISOString(),
    coverImage: safeNewsCover(n.coverImage, fallback, n.title, n.dek, n.topic || ""),
    breaking: Boolean(n.breaking),
    featured: Boolean(n.featured),
    pinned: Boolean(n.pinned),
    origin: "cms",
    originalUrl,
    byline: n.byline,
    authorRole: n.authorRole,
    sourceType: inferNewsSourceType({
      origin: "cms",
      originalUrl,
      sourceType: n.sourceType,
    }),
    seoTitle: n.seoTitle,
    seoDescription: n.seoDescription,
    reviewedBy: n.reviewedBy,
    reviewedAt:
      typeof n.reviewedAt === "string"
        ? n.reviewedAt
        : n.reviewedAt instanceof Date
          ? n.reviewedAt.toISOString()
          : undefined,
  };
}

function seedToPublic(n: NewsArticle): PublicNewsItem {
  return {
    ...n,
    origin: "seed",
    sourceType: inferNewsSourceType({ origin: "seed", sourceType: n.sourceType }),
  };
}

/** Short TTL so home + API + sitemap share one merge within a burst. */
const LIST_PUBLIC_TTL_MS = 60_000;
let listPublicMemo: { at: number; data: PublicNewsItem[] } | null = null;

function archiveToPublic(n: {
  id: string;
  slug: string;
  title: string;
  dek: string;
  body: string[];
  region: string;
  topic: string;
  location: string;
  sourceLabel: string;
  publishedAt: string;
  coverImage: string;
  breaking?: boolean;
  featured?: boolean;
  origin: "seed" | "cms" | "live";
  originalUrl?: string;
  byline?: string;
}): PublicNewsItem {
  return {
    id: n.id,
    slug: n.slug,
    title: n.title,
    dek: n.dek,
    body: n.body?.length ? n.body : [n.dek],
    region: (n.region || "World") as NewsRegion,
    topic: n.topic || "General",
    location: n.location || "Global",
    sourceLabel: n.sourceLabel || "Ebenezer News Desk",
    publishedAt: n.publishedAt,
    coverImage: n.coverImage,
    breaking: Boolean(n.breaking),
    featured: Boolean(n.featured),
    origin: n.origin === "cms" ? "cms" : n.origin === "live" ? "live" : "seed",
    originalUrl: n.originalUrl,
    byline: n.byline,
    sourceType: inferNewsSourceType({
      origin: n.origin === "live" ? "live" : n.origin === "cms" ? "cms" : "seed",
      originalUrl: n.originalUrl,
    }),
  };
}

/**
 * Latest published stories for the desk.
 * Priority: CMS → live wire (memory/disk) → archive retention → seed only if empty.
 * Never starts RSS from a page request.
 */
export async function listPublicNews(): Promise<PublicNewsItem[]> {
  const now = Date.now();
  if (listPublicMemo && now - listPublicMemo.at < LIST_PUBLIC_TTL_MS) {
    return listPublicMemo.data;
  }

  const cached = peekLiveNewsCache();
  const cms = await db.getNewsArticles(true).catch(() => []);
  const byKey = new Map<string, PublicNewsItem>();

  const put = (item: PublicNewsItem, force = false) => {
    if (!item?.slug || !item.publishedAt) return;
    const key = storyFingerprint(item.title) || item.slug;
    const existing = byKey.get(key);
    if (!existing || force) {
      byKey.set(key, item);
      return;
    }
    // Prefer newer publishedAt; CMS already forced above.
    if (new Date(item.publishedAt).getTime() > new Date(existing.publishedAt).getTime()) {
      byKey.set(key, item);
    }
  };

  for (const c of cms) put(recordToPublic(c), true);
  for (const l of cached) put(l);
  for (const a of listArchivedNewsRecent(120)) {
    if (a.origin === "seed") continue; // do not revive stale desk seed via archive
    put(archiveToPublic(a));
  }

  // Seed is demo/fallback only — never dominate a desk that has real CMS/wire/archive.
  if (byKey.size === 0) {
    for (const s of WORLD_NEWS) put(seedToPublic(s));
  }

  const list = Array.from(byKey.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  try {
    rememberNewsForSitemap(list);
  } catch {
    /* archive is best-effort */
  }

  listPublicMemo = { at: now, data: list };
  return list;
}

/** Drop list memo after an explicit wire refresh so home/API see new items. */
export function invalidatePublicNewsMemo(): void {
  listPublicMemo = null;
}

/** Cap for News chrome / home client props — never ship the full list. */
export const NEWS_HOME_CLIENT_LIMIT = 60;

export async function listPublicNewsForHome(limit = NEWS_HOME_CLIENT_LIMIT): Promise<PublicNewsItem[]> {
  const list = await listPublicNews();
  const n = Math.max(1, Math.min(limit, NEWS_HOME_CLIENT_LIMIT));
  return list.slice(0, n);
}

/** Latest publishedAt among items — for desk “latest story” labels (not fetch time). */
export function latestNewsPublishedAt(items: { publishedAt?: string }[]): string {
  let max = 0;
  for (const item of items) {
    const t = item.publishedAt ? new Date(item.publishedAt).getTime() : 0;
    if (t > max) max = t;
  }
  return max ? new Date(max).toISOString() : "";
}

/**
 * Cheap peek for hubs that only need a few headlines (Info home).
 * Prefers live disk/memory wire, then archive, then seed — no CMS scan, no archive write.
 */
export function listPublicNewsPreview(limit = 5): PublicNewsItem[] {
  const cached = peekLiveNewsCache();
  const archived = listArchivedNewsRecent(40).filter((a) => a.origin !== "seed");
  const pool: PublicNewsItem[] =
    cached.length >= 3
      ? cached
      : archived.length
        ? archived.map(archiveToPublic)
        : WORLD_NEWS.map(seedToPublic);
  return pool
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, Math.max(1, Math.min(limit, 12)));
}

/** News URLs for sitemaps — every story from the last 7 days (archive + live), even if feeds dropped them. */
export async function listPublicNewsForSitemap(): Promise<PublicNewsItem[]> {
  const current = await listPublicNews();
  return listNewsForSitemap(current) as PublicNewsItem[];
}

/** Request-scoped dedupe for generateMetadata + page (avoids double DB/archive work). */
export const getPublicNewsBySlug = cache(async (slug: string): Promise<PublicNewsItem | undefined> => {
  const cms = await db.getNewsArticleBySlug(slug);
  if (cms) return recordToPublic(cms);
  const live = await getLiveNewsBySlug(slug);
  if (live) return live;
  const archived = getArchivedNewsBySlug(slug);
  if (archived) return archived as PublicNewsItem;
  const seed = WORLD_NEWS.find((n) => n.slug === slug);
  if (seed) return seedToPublic(seed);

  // Legacy www-source-domain slugs → archive/CMS only (never re-fetch RSS feeds)
  if (isLegacySourceDomainSlug(slug)) {
    const fromArchive = findArchivedNewsByLegacySlug(slug);
    if (fromArchive) return fromArchive as PublicNewsItem;
    const cmsAll = await db.getNewsArticles(true);
    const cmsMatch = cmsAll.find(
      (n) => n.originalUrl && legacySlugFromSourceUrl(n.originalUrl) === slug
    );
    if (cmsMatch) return recordToPublic(cmsMatch);
  }
  return undefined;
});

/** Related stories without forcing a live RSS refresh (uses cache + archive + seed). */
export async function listRelatedNews(
  article: PublicNewsItem,
  limit = 4
): Promise<PublicNewsItem[]> {
  const pool = new Map<string, PublicNewsItem>();
  const put = (n: PublicNewsItem) => {
    if (!n?.slug || n.id === article.id) return;
    pool.set(n.slug, n);
  };
  for (const n of peekLiveNewsCache()) put(n);
  for (const n of listArchivedNewsRecent(80)) put(n as PublicNewsItem);
  for (const n of WORLD_NEWS) put(seedToPublic(n));

  return Array.from(pool.values())
    .filter((n) => n.region === article.region || n.topic === article.topic)
    .slice(0, limit);
}

export type NewsSearchParams = {
  q?: string;
  region?: string;
  topic?: string;
  breaking?: boolean;
  featured?: boolean;
  limit?: number;
  offset?: number;
};

export async function searchPublicNews(params: NewsSearchParams = {}) {
  const {
    q = "",
    region,
    topic,
    breaking,
    featured,
    limit = 160,
    offset = 0,
  } = params;

  let list = await listPublicNews();
  const query = q.trim().toLowerCase();

  if (region && region !== "ALL") {
    list = list.filter((n) => n.region.toLowerCase() === region.toLowerCase());
  }
  if (topic) {
    list = list.filter((n) => n.topic.toLowerCase().includes(topic.toLowerCase()));
  }
  if (breaking) list = list.filter((n) => n.breaking);
  if (featured) list = list.filter((n) => n.featured);

  if (query) {
    list = list.filter((n) => {
      const hay = `${n.title} ${n.dek} ${n.topic} ${n.location} ${n.region} ${n.body.join(" ")} ${n.sourceLabel}`.toLowerCase();
      return hay.includes(query);
    });
  }

  // Prefer live world stories so visitors see current events first
  list = [...list].sort((a, b) => {
    const ao = a.origin === "live" ? 0 : 1;
    const bo = b.origin === "live" ? 0 : 1;
    if (ao !== bo) return ao - bo;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const total = list.length;
  const items = list.slice(Math.max(0, offset), Math.max(0, offset) + Math.min(limit, 240));
  const regions = Array.from(new Set(list.map((n) => n.region))).sort();
  const sources = Array.from(new Set(list.map((n) => n.sourceLabel))).sort();

  return { total, items, regions, sources, query: q, region: region || "ALL" };
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildRssXml(items: PublicNewsItem[], siteOrigin: string): string {
  const channelLink = NEWS_URL.replace(/\/$/, "") + "/";
  const lastBuild = items[0]?.publishedAt || new Date().toISOString();
  const origin = siteOrigin.replace(/\/$/, "") || NEWS_URL;

  const entries = items
    .slice(0, 40)
    .map((n) => {
      const link = newsPublicUrl(n.region, n.slug);
      const image = n.coverImage
        ? n.coverImage.startsWith("http")
          ? n.coverImage
          : `${origin}${n.coverImage}`
        : "";
      return `<item>
  <title>${escapeXml(n.title)}</title>
  <link>${link}</link>
  <guid isPermaLink="true">${link}</guid>
  <pubDate>${new Date(n.publishedAt).toUTCString()}</pubDate>
  <category>${escapeXml(n.region)}</category>
  <description>${escapeXml(n.dek)}</description>
  ${image ? `<media:content url="${escapeXml(image)}" medium="image"/>` : ""}
</item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
  <title>E&gt; Ebenezer World News</title>
  <link>${channelLink}</link>
  <atom:link href="${origin}/api/news/rss" rel="self" type="application/rss+xml"/>
  <description>Global news desks from Ebenezer Digital .info — world, Asia, Europe, Americas, Africa, India, tech, climate.</description>
  <language>en</language>
  <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
${entries}
</channel>
</rss>`;
}

export function buildNewsSitemapXml(
  items: PublicNewsItem[],
  siteOrigin: string,
  opts?: { offset?: number; limit?: number }
): string {
  // Google News XML: max 1000 URLs/file — use offset/limit for multi-file indexes.
  const offset = Math.max(0, opts?.offset ?? 0);
  const limit = Math.min(
    NEWS_GOOGLE_NEWS_MAX_URLS,
    Math.max(1, opts?.limit ?? NEWS_GOOGLE_NEWS_MAX_URLS)
  );
  const urls = items.slice(offset, offset + limit).map((n) => {
    const loc = newsPublicUrl(n.region, n.slug);
    const publicationDate = new Date(n.publishedAt).toISOString();
    return `<url>
  <loc>${escapeXml(loc)}</loc>
  <news:news>
    <news:publication>
      <news:name>Ebenezer World News</news:name>
      <news:language>en</news:language>
    </news:publication>
    <news:publication_date>${publicationDate}</news:publication_date>
    <news:title>${escapeXml(n.title)}</news:title>
  </news:news>
  <lastmod>${publicationDate}</lastmod>
</url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
>
${urls.join("\n")}
</urlset>`;
}

/** Sitemap index pointing at /api/news/sitemap/0 … N-1 (1000 URLs each). */
export function buildNewsSitemapIndexXml(totalItems: number, siteOrigin: string): string {
  const origin = siteOrigin.replace(/\/$/, "") || NEWS_URL;
  const chunks = Math.max(1, Math.ceil(totalItems / NEWS_GOOGLE_NEWS_MAX_URLS));
  const lastmod = new Date().toISOString();
  const body = Array.from({ length: chunks }, (_, i) => {
    const loc = `${origin}/api/news/sitemap/${i}`;
    return `<sitemap>
  <loc>${escapeXml(loc)}</loc>
  <lastmod>${lastmod}</lastmod>
</sitemap>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;
}

export function newsSitemapChunkCount(totalItems: number): number {
  return Math.max(1, Math.ceil(Math.max(0, totalItems) / NEWS_GOOGLE_NEWS_MAX_URLS));
}

function icsDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function buildIcal(items: PublicNewsItem[], siteOrigin: string): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ebenezer Digital//World News//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:E> Ebenezer World News",
    "X-WR-CALDESC:Published stories from the Ebenezer .info newsroom",
  ];

  for (const n of items.slice(0, 60)) {
    const start = icsDate(n.publishedAt);
    const endDate = new Date(n.publishedAt);
    endDate.setHours(endDate.getHours() + 1);
    const end = icsDate(endDate.toISOString());
    const link = newsPublicUrl(n.region, n.slug);
    const summary = n.title.replace(/[,;\\]/g, " ");
    const description = `${n.dek} ${link}`.replace(/[,;\\]/g, " ").replace(/\n/g, "\\n");

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:news-${n.id}@ebenezerdigital.info`);
    lines.push(`DTSTAMP:${icsDate(new Date().toISOString())}`);
    lines.push(`DTSTART:${start}`);
    lines.push(`DTEND:${end}`);
    lines.push(`SUMMARY:${summary}`);
    lines.push(`DESCRIPTION:${description}`);
    lines.push(`LOCATION:${n.location.replace(/[,;\\]/g, " ")}`);
    lines.push(`URL:${link}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function resolveSiteOrigin(requestUrl: string, hostHeader?: string | null): string {
  try {
    if (hostHeader) return originForKind(siteKindFromHost(hostHeader));
    const u = new URL(requestUrl);
    return originForKind(siteKindFromHost(u.host));
  } catch {
    return NEWS_URL;
  }
}
