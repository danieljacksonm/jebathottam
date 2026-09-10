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
const CACHE_MS = 30 * 60 * 1000;
let inflight: Promise<LiveNewsItem[]> | null = null;

/**
 * In-process RSS must stay OFF by default on this VPS.
 * Sync XML/HTML parsing starves the Node event loop so / and /robots.txt time out.
 * Enable only via cron/admin with LIVE_NEWS_INPROCESS=1.
 */
function liveNewsInProcessEnabled(): boolean {
  return process.env.LIVE_NEWS_INPROCESS === "1";
}

/** Small, stable set — never grow this without moving fetch off the web process. */
const RSS_FEEDS: { url: string; region: NewsRegion; source: string; location: string }[] = [
  { url: "https://www.theguardian.com/world/rss", region: "World", source: "The Guardian", location: "World" },
  { url: "https://feeds.bbci.co.uk/news/world/rss.xml", region: "World", source: "BBC News", location: "World" },
  { url: "https://www.theguardian.com/technology/rss", region: "Tech", source: "The Guardian", location: "Global" },
  { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", region: "Tech", source: "BBC News", location: "Global" },
  { url: "https://www.thehindu.com/news/national/feeder/default.rss", region: "India", source: "The Hindu", location: "India" },
];

const MAX_XML_CHARS = 120_000;
const MAX_ITEMS_PER_FEED = 6;

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

/** Cheap plain-text extract — never run on full article HTML bodies. */
function shortText(html: string, max = 280): string {
  const clean = decodeEntities(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
  return clean.slice(0, max);
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
    attr(block, /<enclosure[^>]+url=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i);
  return safeNewsCover(raw, photoForStory(region, title), title, region);
}

function yieldEventLoop(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

async function fetchText(url: string): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 2000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "EbenezerNews/1.0 (+https://ebenezerdigital.info)" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return text.length > MAX_XML_CHARS ? text.slice(0, MAX_XML_CHARS) : text;
  } finally {
    clearTimeout(t);
  }
}

async function fetchRssFeed(feed: (typeof RSS_FEEDS)[number]): Promise<LiveNewsItem[]> {
  const xml = await fetchText(feed.url);
  await yieldEventLoop();
  const blocks = xml.split(/<item[\s>]/i).slice(1, MAX_ITEMS_PER_FEED + 1);
  const items: LiveNewsItem[] = [];

  for (const raw of blocks) {
    const block = raw.split(/<\/item>/i)[0] || raw;
    // Description only — content:encoded full HTML tanks the event loop on this VPS.
    const title = decodeEntities(tag(block, "title")).replace(/<[^>]+>/g, "");
    const link = decodeEntities(tag(block, "link") || tag(block, "guid"));
    const description = tag(block, "description");
    const dek = shortText(description, 280) || title;
    const pub = tag(block, "pubDate") || tag(block, "dc:date") || tag(block, "updated");
    const creator = decodeEntities(tag(block, "dc:creator") || tag(block, "author"));
    if (!title || title.length < 12) continue;
    items.push({
      id: `live-${slugify(link || title)}`,
      slug: slugify(title),
      title,
      dek,
      body: [dek],
      region: feed.region,
      topic: feed.region,
      location: feed.location,
      sourceLabel: feed.source,
      publishedAt: toIso(pub),
      coverImage: pickImage(description + block.slice(0, 2000), feed.region, title),
      origin: "live",
      originalUrl: link.startsWith("http") ? link : undefined,
      byline: creator || undefined,
      sourceType: "SOURCE_SUMMARY",
    });
    await yieldEventLoop();
  }

  return items;
}

/**
 * Optional wire fetch. Off unless LIVE_NEWS_INPROCESS=1.
 * Always one feed at a time with yields — never batch-parse large HTML bodies.
 */
export async function fetchLiveNews(): Promise<LiveNewsItem[]> {
  if (!liveNewsInProcessEnabled()) return peekLiveNewsCache();
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.items;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const byKey = new Map<string, LiveNewsItem>();
      const push = (item: LiveNewsItem) => {
        if (!item.title || item.title.length < 12) return;
        const key = storyFingerprint(item.title) || item.slug;
        if (!byKey.has(key)) byKey.set(key, item);
      };

      for (const feed of RSS_FEEDS) {
        try {
          const items = await fetchRssFeed(feed);
          items.forEach(push);
        } catch {
          /* feed best-effort */
        }
        await yieldEventLoop();
      }

      const items = Array.from(byKey.values()).sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      if (items[0]) items[0].featured = true;
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
 * No-op on the request path unless LIVE_NEWS_INPROCESS=1.
 * Even then, only schedules if cache is cold — never awaited by callers.
 */
export function scheduleLiveNewsRefresh(): void {
  if (!liveNewsInProcessEnabled()) return;
  if (inflight) return;
  if (cache && Date.now() - cache.at < CACHE_MS) return;
  // Defer well past the response — do not compete with the current request.
  setTimeout(() => {
    void fetchLiveNews().catch(() => {});
  }, 5_000);
}

/** Slug lookup — cache only. Never triggers a feed refresh. */
export async function getLiveNewsBySlug(slug: string): Promise<LiveNewsItem | undefined> {
  return peekLiveNewsCache().find((n) => n.slug === slug);
}
