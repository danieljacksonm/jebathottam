import fs from "fs";
import path from "path";
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
/** Disk snapshot keeps the desk warm across PM2 restarts without re-fetching. */
const DISK_MAX_AGE_MS = 6 * 60 * 60 * 1000;
const DATA_DIR = path.join(process.cwd(), "data");
const DISK_FILE = path.join(DATA_DIR, "live-news-cache.json");
let inflight: Promise<LiveNewsItem[]> | null = null;
let diskHydrated = false;

/**
 * In-process RSS must stay OFF by default on this VPS.
 * Sync XML/HTML parsing starves the Node event loop so / and /robots.txt time out.
 * Enable only via cron/admin with LIVE_NEWS_INPROCESS=1, or admin/cron refresh route.
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
const MAX_ITEMS_PER_FEED = 10;

function toIso(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
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

function readDiskCache(): Cache | null {
  try {
    if (!fs.existsSync(DISK_FILE)) return null;
    const raw = JSON.parse(fs.readFileSync(DISK_FILE, "utf8")) as {
      at?: number;
      items?: LiveNewsItem[];
    };
    if (!raw?.at || !Array.isArray(raw.items) || !raw.items.length) return null;
    if (Date.now() - raw.at > DISK_MAX_AGE_MS) return null;
    return { at: raw.at, items: raw.items };
  } catch {
    return null;
  }
}

function writeDiskCache(next: Cache): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    const slim: LiveNewsItem[] = next.items.slice(0, 80).map((item) => ({
      ...item,
      body: item.body?.length ? [String(item.body[0] || item.dek).slice(0, 400)] : [item.dek],
    }));
    fs.writeFileSync(DISK_FILE, JSON.stringify({ at: next.at, items: slim }, null, 0), "utf8");
  } catch {
    /* disk best-effort */
  }
}

function hydrateFromDisk(): void {
  if (diskHydrated || cache) return;
  diskHydrated = true;
  const disk = readDiskCache();
  if (disk) cache = disk;
}

/** Cron may have written a newer snapshot from another worker. */
function reloadDiskIfNewer(): void {
  try {
    if (!fs.existsSync(DISK_FILE)) return;
    const mtime = fs.statSync(DISK_FILE).mtimeMs;
    if (cache && mtime <= cache.at + 1000) return;
    const disk = readDiskCache();
    if (disk && (!cache || disk.at > cache.at)) cache = disk;
  } catch {
    /* disk best-effort */
  }
}

async function fetchText(url: string): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20_000);
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
    const title = decodeEntities(tag(block, "title")).replace(/<[^>]+>/g, "");
    const link = decodeEntities(tag(block, "link") || tag(block, "guid"));
    const description = tag(block, "description");
    const dek = shortText(description, 280) || title;
    const pub = tag(block, "pubDate") || tag(block, "dc:date") || tag(block, "updated");
    const publishedAt = toIso(pub);
    // Skip items without a real feed date — avoids fake "just now" freshness.
    if (!publishedAt) continue;
    const creator = decodeEntities(tag(block, "dc:creator") || tag(block, "author"));
    if (!title || title.length < 12) continue;
    // id must come from the title (or slug), never the source URL —
    // slugifyNewsTitle strips https://… to "" → "story", collapsing the whole desk.
    const slug = slugify(title);
    items.push({
      id: `live-${slug}`,
      slug,
      title,
      dek,
      body: [dek],
      region: feed.region,
      topic: feed.region,
      location: feed.location,
      sourceLabel: feed.source,
      publishedAt,
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

async function runWireFetch(): Promise<LiveNewsItem[]> {
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const byKey = new Map<string, LiveNewsItem>();
      const push = (item: LiveNewsItem) => {
        if (!item.title || item.title.length < 12) return;
        const key = storyFingerprint(item.title) || item.slug;
        if (!byKey.has(key)) byKey.set(key, item);
      };

      const previous = cache?.items || [];
      const failedSources = new Set<string>();
      const results = await Promise.all(
        RSS_FEEDS.map(async (feed) => {
          try {
            const items = await fetchRssFeed(feed);
            return { source: feed.source, items, ok: items.length > 0 };
          } catch {
            return { source: feed.source, items: [] as LiveNewsItem[], ok: false };
          }
        })
      );
      for (const result of results) {
        if (result.ok) result.items.forEach(push);
        else failedSources.add(result.source);
        await yieldEventLoop();
      }
      if (failedSources.size) {
        for (const item of previous) {
          if (failedSources.has(item.sourceLabel)) push(item);
        }
      }

      const items = Array.from(byKey.values()).sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      if (items[0]) items[0].featured = true;
      if (items.length) {
        cache = { at: Date.now(), items };
        writeDiskCache(cache);
      }
      return items;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

/**
 * Optional wire fetch. Off unless LIVE_NEWS_INPROCESS=1.
 * Always one feed at a time with yields — never batch-parse large HTML bodies.
 */
export async function fetchLiveNews(): Promise<LiveNewsItem[]> {
  hydrateFromDisk();
  if (!liveNewsInProcessEnabled()) return peekLiveNewsCache();
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.items;
  return runWireFetch();
}

/**
 * Explicit wire refresh. Does not require LIVE_NEWS_INPROCESS.
 * Homepage loads call this when the snapshot is older than a couple of minutes.
 */
export async function refreshLiveNewsWire(): Promise<{ items: LiveNewsItem[]; fetchedAt: string }> {
  hydrateFromDisk();
  if (cache && Date.now() - cache.at < 60_000 && cache.items.length >= 8) {
    return { items: cache.items, fetchedAt: new Date(cache.at).toISOString() };
  }
  const items = await runWireFetch();
  return { items, fetchedAt: new Date(cache?.at || Date.now()).toISOString() };
}

/** Return cached wire without triggering a refresh. Hydrates from disk once. */
export function peekLiveNewsCache(): LiveNewsItem[] {
  hydrateFromDisk();
  reloadDiskIfNewer();
  return cache?.items || [];
}

/** True when this call pulled the feeds. Page refresh uses this so the desk is not stuck on an old snapshot. */
export async function ensureLiveNewsFresh(maxAgeMs = 2 * 60 * 1000): Promise<boolean> {
  hydrateFromDisk();
  reloadDiskIfNewer();
  if (cache && Date.now() - cache.at < maxAgeMs && cache.items.length >= 8) return false;
  await refreshLiveNewsWire();
  return true;
}

/**
 * No-op on the request path unless LIVE_NEWS_INPROCESS=1.
 * Even then, only schedules if cache is cold — never awaited by callers.
 */
export function scheduleLiveNewsRefresh(): void {
  if (!liveNewsInProcessEnabled()) return;
  if (inflight) return;
  hydrateFromDisk();
  if (cache && Date.now() - cache.at < CACHE_MS) return;
  setTimeout(() => {
    void runWireFetch().catch(() => {});
  }, 5_000);
}

/** Slug lookup — cache only. Never triggers a feed refresh. */
export async function getLiveNewsBySlug(slug: string): Promise<LiveNewsItem | undefined> {
  return peekLiveNewsCache().find((n) => n.slug === slug);
}
