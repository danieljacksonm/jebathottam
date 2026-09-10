import type { NewsArticle, NewsRegion } from "@/app/blog/news/data";
import { photoForStory, safeNewsCover, storyFingerprint } from "@/lib/news-photos";
import { slugifyNewsTitle } from "@/lib/news-url";

export type LiveNewsItem = NewsArticle & {
  origin: "live";
  originalUrl?: string;
  byline?: string;
};

type Cache = { at: number; items: LiveNewsItem[] };

let cache: Cache | null = null;
/** Keep wire warm longer — crawlers must not force a 50-feed refresh every few seconds. */
const CACHE_MS = 5 * 60 * 1000;
let inflight: Promise<LiveNewsItem[]> | null = null;
let scheduled: ReturnType<typeof setTimeout> | null = null;

const RSS_FEEDS: { url: string; region: NewsRegion; source: string; location: string }[] = [
  { url: "https://www.theguardian.com/world/rss", region: "World", source: "The Guardian", location: "World" },
  { url: "https://www.theguardian.com/world/india/rss", region: "India", source: "The Guardian", location: "India" },
  { url: "https://www.theguardian.com/uk-news/rss", region: "Europe", source: "The Guardian", location: "United Kingdom" },
  { url: "https://www.theguardian.com/us-news/rss", region: "Americas", source: "The Guardian", location: "United States" },
  { url: "https://www.theguardian.com/technology/rss", region: "Tech", source: "The Guardian", location: "Global" },
  { url: "https://www.theguardian.com/business/rss", region: "Business", source: "The Guardian", location: "Global" },
  { url: "https://feeds.bbci.co.uk/news/world/rss.xml", region: "World", source: "BBC News", location: "World" },
  { url: "https://feeds.bbci.co.uk/news/world/asia/rss.xml", region: "Asia", source: "BBC News", location: "Asia" },
  { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", region: "Tech", source: "BBC News", location: "Global" },
  { url: "https://feeds.bbci.co.uk/news/business/rss.xml", region: "Business", source: "BBC News", location: "Global" },
  { url: "https://www.thehindu.com/news/national/feeder/default.rss", region: "India", source: "The Hindu", location: "India" },
  { url: "https://www.thehindu.com/news/international/feeder/default.rss", region: "World", source: "The Hindu", location: "World" },
  { url: "https://indianexpress.com/section/india/feed/", region: "India", source: "Indian Express", location: "India" },
  { url: "https://feeds.feedburner.com/ndtvnews-top-stories", region: "India", source: "NDTV", location: "India" },
  { url: "https://www.aljazeera.com/xml/rss/all.xml", region: "World", source: "Al Jazeera", location: "World" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", region: "World", source: "The New York Times", location: "World" },
  { url: "https://techcrunch.com/feed/", region: "Tech", source: "TechCrunch", location: "Global" },
  { url: "https://www.espn.com/espn/rss/news", region: "Sports", source: "ESPN", location: "Global" },
];

function toIso(value?: string): string {
  if (!value) return new Date().toISOString();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function slugify(value: string): string {
  return slugifyNewsTitle(value);
}

function decodeEntities(html: string): string {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function htmlToParagraphs(html: string): string[] {
  const clean = decodeEntities(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<figure[\s\S]*?<\/figure>/gi, " ")
    .replace(/<figcaption[\s\S]*?<\/figcaption>/gi, " ")
    .replace(/<\/(p|h[1-6]|li|div|br)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();

  const parts = clean
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40);

  return parts.length ? parts.slice(0, 6) : clean ? [clean.slice(0, 800)] : [];
}

function tag(xml: string, name: string): string {
  const cdata = xml.match(new RegExp(`<${name}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${name}>`, "i"));
  if (cdata?.[1]) return cdata[1].trim();
  const normal = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return (normal?.[1] || "").trim();
}

function attr(xml: string, pattern: RegExp): string {
  const m = xml.match(pattern);
  return (m?.[1] || "").trim();
}

function pickImage(block: string, region: string, title: string): string {
  const raw =
    attr(block, /<media:content[^>]+url=["']([^"']+)["']/i) ||
    attr(block, /<media:thumbnail[^>]+url=["']([^"']+)["']/i) ||
    attr(block, /<enclosure[^>]+url=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i) ||
    attr(block, /<img[^>]+src=["']([^"']+)["']/i);
  return safeNewsCover(raw, photoForStory(region, title), title, region);
}

async function fetchText(url: string): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 2500);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "EbenezerNews/1.0 (+https://ebenezerdigital.info)" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

function yieldEventLoop(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

function mapGuardianSection(section: string): NewsRegion {
  const s = section.toLowerCase();
  if (s.includes("india")) return "India";
  if (s.includes("uk") || s.includes("europe")) return "Europe";
  if (s.includes("us-news") || s.includes("americas")) return "Americas";
  if (s.includes("africa")) return "Africa";
  if (s.includes("middleeast") || s.includes("middle-east")) return "Middle East";
  if (s.includes("australia") || s.includes("asia")) return "Asia";
  if (s.includes("tech")) return "Tech";
  if (s.includes("business") || s.includes("money")) return "Business";
  if (s.includes("science")) return "Science";
  if (s.includes("environment") || s.includes("climate")) return "Climate";
  if (s.includes("sport")) return "Sports";
  return "World";
}

async function fetchGuardianFull(): Promise<LiveNewsItem[]> {
  const key = process.env.GUARDIAN_API_KEY || "test";
  const url = `https://content.guardianapis.com/search?order-by=newest&page-size=40&show-fields=headline,trailText,body,thumbnail,byline,publication,lastModified&api-key=${key}`;

  try {
    const json = JSON.parse(await fetchText(url)) as {
      response?: {
        results?: Array<{
          id: string;
          webTitle: string;
          webUrl: string;
          webPublicationDate: string;
          sectionId?: string;
          sectionName?: string;
          fields?: {
            headline?: string;
            trailText?: string;
            body?: string;
            thumbnail?: string;
            byline?: string;
            publication?: string;
          };
        }>;
      };
    };
    const items: LiveNewsItem[] = [];
    for (const r of json.response?.results || []) {
      const fields = r.fields || {};
      const title = decodeEntities(fields.headline || r.webTitle);
      const region = mapGuardianSection(r.sectionId || r.sectionName || "world");
      const body = htmlToParagraphs(fields.body || fields.trailText || "");
      const dek = htmlToParagraphs(fields.trailText || "")[0] || body[0] || title;
      if (!body.length) continue;
      items.push({
        id: `live-${slugify(r.id)}`,
        slug: slugify(title),
        title,
        dek: dek.replace(/<[^>]+>/g, "").slice(0, 280),
        body,
        region,
        topic: r.sectionName || "World",
        location: r.sectionName || "World",
        sourceLabel: fields.publication || "The Guardian",
        publishedAt: toIso(r.webPublicationDate),
        coverImage: safeNewsCover(
          fields.thumbnail,
          photoForStory(region, title),
          title,
          fields.trailText || ""
        ),
        featured: items.length < 3,
        origin: "live",
        originalUrl: r.webUrl,
        byline: fields.byline,
        sourceType: "SOURCE_SUMMARY",
      });
      if (items.length % 8 === 0) await yieldEventLoop();
    }
    return items;
  } catch {
    return [];
  }
}

async function fetchRssFeed(feed: (typeof RSS_FEEDS)[number]): Promise<LiveNewsItem[]> {
  const xml = await fetchText(feed.url);
  const blocks = xml.split(/<item[\s>]/i).slice(1);
  return blocks
    .slice(0, 10)
    .map((raw) => {
      const block = raw.split(/<\/item>/i)[0] || raw;
      const title = decodeEntities(tag(block, "title")).replace(/<[^>]+>/g, "");
      const link = decodeEntities(tag(block, "link") || tag(block, "guid"));
      const encoded = tag(block, "content:encoded") || tag(block, "content");
      const description = tag(block, "description");
      const body = htmlToParagraphs(encoded || description);
      const dek = (htmlToParagraphs(description)[0] || body[0] || title).slice(0, 280);
      const pub = tag(block, "pubDate") || tag(block, "dc:date") || tag(block, "updated");
      const creator = decodeEntities(tag(block, "dc:creator") || tag(block, "author"));
      return {
        id: `live-${slugify(link || title)}`,
        slug: slugify(title),
        title,
        dek,
        body: body.length ? body : [dek],
        region: feed.region,
        topic: feed.region,
        location: feed.location,
        sourceLabel: feed.source,
        publishedAt: toIso(pub),
        coverImage: pickImage(description + encoded + block, feed.region, title),
        origin: "live" as const,
        originalUrl: link.startsWith("http") ? link : undefined,
        byline: creator || undefined,
        sourceType: "SOURCE_SUMMARY" as const,
      };
    })
    .filter((n) => n.title && n.body.length);
}

/**
 * Fetch wire in small batches and yield between batches so robots.txt / pages
 * are not starved by XML parsing on the Node event loop.
 */
export async function fetchLiveNews(): Promise<LiveNewsItem[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.items;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const byKey = new Map<string, LiveNewsItem>();
      const score = (item: LiveNewsItem) => {
        const photo =
          item.coverImage.startsWith("http") && !item.coverImage.includes("unsplash.com") ? 4 : 0;
        return photo + Math.min(item.body.join(" ").length / 80, 8) + (item.originalUrl ? 1 : 0);
      };
      const push = (item: LiveNewsItem) => {
        if (!item.title || item.title.length < 12) return;
        const key = storyFingerprint(item.title) || item.slug;
        const existing = byKey.get(key);
        if (!existing || score(item) > score(existing)) {
          byKey.set(key, item);
        }
      };

      const guardian = await fetchGuardianFull().catch(() => [] as LiveNewsItem[]);
      guardian.forEach(push);
      await yieldEventLoop();

      const BATCH = 3;
      for (let i = 0; i < RSS_FEEDS.length; i += BATCH) {
        const slice = RSS_FEEDS.slice(i, i + BATCH);
        const results = await Promise.allSettled(slice.map((feed) => fetchRssFeed(feed)));
        for (const result of results) {
          if (result.status === "fulfilled") result.value.forEach(push);
        }
        await yieldEventLoop();
      }

      const items = Array.from(byKey.values()).sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      const now = Date.now();
      if (items[0]) items[0].featured = true;
      items.forEach((n) => {
        const age = now - new Date(n.publishedAt).getTime();
        n.breaking = age >= 0 && age < 90 * 60 * 1000;
      });

      cache = { at: Date.now(), items };
      return items;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

/** Return cached wire without triggering a refresh. */
export function peekLiveNewsCache(): LiveNewsItem[] {
  return cache?.items || [];
}

/**
 * Schedule a background refresh at most once per CACHE_MS.
 * Safe to call from request handlers — never awaited on the hot path.
 */
export function scheduleLiveNewsRefresh(): void {
  if (inflight) return;
  if (cache && Date.now() - cache.at < CACHE_MS) return;
  if (scheduled) return;
  scheduled = setTimeout(() => {
    scheduled = null;
    void fetchLiveNews().catch(() => {});
  }, 50);
}

/** Slug lookup — cache only. Never triggers a full multi-feed refresh. */
export async function getLiveNewsBySlug(slug: string): Promise<LiveNewsItem | undefined> {
  return peekLiveNewsCache().find((n) => n.slug === slug);
}
