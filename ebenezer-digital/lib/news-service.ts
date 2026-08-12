import { db, type NewsArticleRecord } from "@/lib/db";
import {
  WORLD_NEWS,
  type NewsArticle,
  type NewsRegion,
} from "@/app/blog/news/data";
import { fetchLiveNews, getLiveNewsBySlug } from "@/lib/live-news";

export type PublicNewsItem = NewsArticle & {
  origin: "seed" | "cms" | "live";
  originalUrl?: string;
  byline?: string;
};

function recordToPublic(n: NewsArticleRecord): PublicNewsItem {
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
    coverImage: n.coverImage || "/images/journal/hero.jpg",
    breaking: Boolean(n.breaking),
    featured: Boolean(n.featured),
    origin: "cms",
  };
}

function seedToPublic(n: NewsArticle): PublicNewsItem {
  return { ...n, origin: "seed" };
}

/** Live world wire + CMS + seed. CMS wins on same slug. Live fills the desk. */
export async function listPublicNews(): Promise<PublicNewsItem[]> {
  const [cms, live] = await Promise.all([db.getNewsArticles(true), fetchLiveNews().catch(() => [])]);
  const bySlug = new Map<string, PublicNewsItem>();

  for (const s of WORLD_NEWS) {
    bySlug.set(s.slug, seedToPublic(s));
  }
  for (const l of live) {
    bySlug.set(l.slug, l);
  }
  for (const c of cms) {
    bySlug.set(c.slug, recordToPublic(c));
  }

  return Array.from(bySlug.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getPublicNewsBySlug(slug: string): Promise<PublicNewsItem | undefined> {
  const cms = await db.getNewsArticleBySlug(slug);
  if (cms) return recordToPublic(cms);
  const live = await getLiveNewsBySlug(slug);
  if (live) return live;
  const seed = WORLD_NEWS.find((n) => n.slug === slug);
  return seed ? seedToPublic(seed) : undefined;
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
    limit = 80,
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
      const hay = `${n.title} ${n.dek} ${n.topic} ${n.location} ${n.region} ${n.body.join(" ")}`.toLowerCase();
      return hay.includes(query);
    });
  }

  const total = list.length;
  const items = list.slice(Math.max(0, offset), Math.max(0, offset) + Math.min(limit, 100));
  const regions = Array.from(new Set((await listPublicNews()).map((n) => n.region))).sort();

  return { total, items, regions, query: q, region: region || "ALL" };
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
  const channelLink = `${siteOrigin}/blog/news`;
  const lastBuild = items[0]?.publishedAt || new Date().toISOString();

  const entries = items
    .slice(0, 40)
    .map((n) => {
      const link = `${siteOrigin}/blog/news/${n.slug}`;
      return `<item>
  <title>${escapeXml(n.title)}</title>
  <link>${link}</link>
  <guid isPermaLink="true">${link}</guid>
  <pubDate>${new Date(n.publishedAt).toUTCString()}</pubDate>
  <category>${escapeXml(n.region)}</category>
  <description>${escapeXml(n.dek)}</description>
</item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>E&gt; Ebenezer World News</title>
  <link>${channelLink}</link>
  <description>Global news desks from Ebenezer Digital .info — world, Asia, Europe, Americas, Africa, India, tech, climate.</description>
  <language>en</language>
  <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
${entries}
</channel>
</rss>`;
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
    const link = `${siteOrigin}/blog/news/${n.slug}`;
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
    const u = new URL(requestUrl);
    if (hostHeader) {
      const host = hostHeader.split(":")[0].toLowerCase();
      if (host.includes("ebenezerdigital.info")) {
        return `https://${host}`;
      }
    }
    return `${u.protocol}//${u.host}`;
  } catch {
    return "https://ebenezerdigital.info";
  }
}
