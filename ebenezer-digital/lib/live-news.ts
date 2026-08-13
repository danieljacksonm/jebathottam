import type { NewsArticle, NewsRegion } from "@/app/blog/news/data";
import { photoForStory, sanitizeImageUrl, storyFingerprint } from "@/lib/news-photos";

export type LiveNewsItem = NewsArticle & {
  origin: "live";
  originalUrl?: string;
  byline?: string;
};

type Cache = { at: number; items: LiveNewsItem[] };

let cache: Cache | null = null;
const CACHE_MS = 45 * 1000;

const RSS_FEEDS: { url: string; region: NewsRegion; source: string; location: string }[] = [
  { url: "https://www.theguardian.com/world/rss", region: "World", source: "The Guardian", location: "World" },
  { url: "https://www.theguardian.com/world/india/rss", region: "India", source: "The Guardian", location: "India" },
  { url: "https://www.theguardian.com/uk-news/rss", region: "Europe", source: "The Guardian", location: "United Kingdom" },
  { url: "https://www.theguardian.com/us-news/rss", region: "Americas", source: "The Guardian", location: "United States" },
  { url: "https://www.theguardian.com/australia-news/rss", region: "Asia", source: "The Guardian", location: "Australia" },
  { url: "https://www.theguardian.com/business/rss", region: "Business", source: "The Guardian", location: "Global" },
  { url: "https://www.theguardian.com/technology/rss", region: "Tech", source: "The Guardian", location: "Global" },
  { url: "https://www.theguardian.com/science/rss", region: "Science", source: "The Guardian", location: "Global" },
  { url: "https://www.theguardian.com/environment/rss", region: "Climate", source: "The Guardian", location: "Global" },
  { url: "https://www.theguardian.com/sport/rss", region: "Sports", source: "The Guardian", location: "Global" },
  { url: "https://feeds.bbci.co.uk/news/world/rss.xml", region: "World", source: "BBC News", location: "World" },
  { url: "https://feeds.bbci.co.uk/news/world/asia/rss.xml", region: "Asia", source: "BBC News", location: "Asia" },
  { url: "https://feeds.bbci.co.uk/news/world/africa/rss.xml", region: "Africa", source: "BBC News", location: "Africa" },
  { url: "https://feeds.bbci.co.uk/news/world/middle_east/rss.xml", region: "Middle East", source: "BBC News", location: "Middle East" },
  { url: "https://feeds.bbci.co.uk/news/world/europe/rss.xml", region: "Europe", source: "BBC News", location: "Europe" },
  { url: "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml", region: "Americas", source: "BBC News", location: "Americas" },
  { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", region: "Tech", source: "BBC News", location: "Global" },
  { url: "https://feeds.bbci.co.uk/news/business/rss.xml", region: "Business", source: "BBC News", location: "Global" },
  { url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml", region: "Science", source: "BBC News", location: "Global" },
  { url: "https://www.thehindu.com/news/national/feeder/default.rss", region: "India", source: "The Hindu", location: "India" },
  { url: "https://www.thehindu.com/news/international/feeder/default.rss", region: "World", source: "The Hindu", location: "World" },
  { url: "https://www.thehindu.com/business/feeder/default.rss", region: "Business", source: "The Hindu", location: "India" },
  { url: "https://www.thehindu.com/sport/feeder/default.rss", region: "Sports", source: "The Hindu", location: "India" },
  { url: "https://indianexpress.com/section/india/feed/", region: "India", source: "Indian Express", location: "India" },
  { url: "https://indianexpress.com/section/world/feed/", region: "World", source: "Indian Express", location: "World" },
  { url: "https://indianexpress.com/section/business/feed/", region: "Business", source: "Indian Express", location: "India" },
  { url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms", region: "India", source: "Times of India", location: "India" },
  { url: "https://timesofindia.indiatimes.com/rssfeeds/296589292.cms", region: "World", source: "Times of India", location: "World" },
  { url: "https://economictimes.indiatimes.com/rssfeedstopstories.cms", region: "Business", source: "Economic Times", location: "India" },
  { url: "https://feeds.feedburner.com/ndtvnews-top-stories", region: "India", source: "NDTV", location: "India" },
  { url: "https://feeds.feedburner.com/ndtvnews-world-news", region: "World", source: "NDTV", location: "World" },
  { url: "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml", region: "India", source: "Hindustan Times", location: "India" },
  { url: "https://www.hindustantimes.com/feeds/rss/world-news/rssfeed.xml", region: "World", source: "Hindustan Times", location: "World" },
  { url: "https://www.aljazeera.com/xml/rss/all.xml", region: "World", source: "Al Jazeera", location: "World" },
  { url: "https://feeds.reuters.com/Reuters/worldNews", region: "World", source: "Reuters", location: "World" },
  { url: "https://feeds.reuters.com/reuters/INtopNews", region: "India", source: "Reuters", location: "India" },
  { url: "https://feeds.reuters.com/reuters/businessNews", region: "Business", source: "Reuters", location: "Global" },
  { url: "https://feeds.reuters.com/reuters/technologyNews", region: "Tech", source: "Reuters", location: "Global" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", region: "World", source: "The New York Times", location: "World" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml", region: "Business", source: "The New York Times", location: "Global" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", region: "Tech", source: "The New York Times", location: "Global" },
  { url: "https://rss.cnn.com/rss/edition_world.rss", region: "World", source: "CNN", location: "World" },
  { url: "https://feeds.npr.org/1004/rss.xml", region: "World", source: "NPR", location: "World" },
  { url: "https://feeds.bbci.co.uk/news/world/latin_america/rss.xml", region: "Americas", source: "BBC News", location: "Latin America" },
  { url: "https://www.abc.net.au/news/feed/51120/rss.xml", region: "Asia", source: "ABC News Australia", location: "Australia" },
  { url: "https://www.cbc.ca/webfeed/rss/rss-world", region: "Americas", source: "CBC", location: "World" },
  { url: "https://feeds.skynews.com/feeds/rss/world.xml", region: "World", source: "Sky News", location: "World" },
  { url: "https://rss.dw.com/rdf/rss-en-world", region: "Europe", source: "Deutsche Welle", location: "World" },
  { url: "https://www.france24.com/en/rss", region: "Europe", source: "France 24", location: "World" },
  { url: "https://www3.nhk.or.jp/nhkworld/en/news/feeds/rss.xml", region: "Asia", source: "NHK World", location: "Asia" },
  { url: "https://techcrunch.com/feed/", region: "Tech", source: "TechCrunch", location: "Global" },
  { url: "https://www.espn.com/espn/rss/news", region: "Sports", source: "ESPN", location: "Global" },
  { url: "https://news.un.org/feed/subscribe/en/news/all/rss.xml", region: "World", source: "UN News", location: "World" },
];

function toIso(value?: string): string {
  if (!value) return new Date().toISOString();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
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

  return parts.length ? parts : clean ? [clean] : [];
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
  return sanitizeImageUrl(raw, photoForStory(region, title));
}

async function fetchText(url: string): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 9000);
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
  const endpoints = [
    `https://content.guardianapis.com/search?order-by=newest&page-size=40&show-fields=headline,trailText,body,thumbnail,byline,publication,lastModified&api-key=${key}`,
    `https://content.guardianapis.com/search?q=india&order-by=newest&page-size=15&show-fields=headline,trailText,body,thumbnail,byline,publication,lastModified&api-key=${key}`,
    `https://content.guardianapis.com/search?section=technology|business|science|environment|sport&order-by=newest&page-size=20&show-fields=headline,trailText,body,thumbnail,byline,publication,lastModified&api-key=${key}`,
  ];

  const bundles = await Promise.allSettled(
    endpoints.map(async (url) => {
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
      return json.response?.results || [];
    })
  );

  const items: LiveNewsItem[] = [];
  for (const bundle of bundles) {
    if (bundle.status !== "fulfilled") continue;
    for (const r of bundle.value) {
      const fields = r.fields || {};
      const body = htmlToParagraphs(fields.body || fields.trailText || "");
      const dek = htmlToParagraphs(fields.trailText || "")[0] || body[0] || r.webTitle;
      if (!body.length) continue;
      items.push({
        id: `live-${slugify(r.id)}`,
        slug: slugify(r.id),
        title: decodeEntities(fields.headline || r.webTitle),
        dek: dek.replace(/<[^>]+>/g, "").slice(0, 280),
        body,
        region: mapGuardianSection(r.sectionId || r.sectionName || "world"),
        topic: r.sectionName || "World",
        location: r.sectionName || "World",
        sourceLabel: fields.publication || "The Guardian",
        publishedAt: toIso(r.webPublicationDate),
        coverImage: sanitizeImageUrl(fields.thumbnail, photoForStory(mapGuardianSection(r.sectionId || r.sectionName || "world"), fields.headline || r.webTitle)),
        featured: items.length < 3,
        origin: "live",
        originalUrl: r.webUrl,
        byline: fields.byline,
      });
    }
  }
  return items;
}

async function fetchRssFeed(feed: (typeof RSS_FEEDS)[number]): Promise<LiveNewsItem[]> {
  const xml = await fetchText(feed.url);
  const blocks = xml.split(/<item[\s>]/i).slice(1);
  return blocks.slice(0, 12).map((raw) => {
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
      slug: slugify(link || title),
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
    };
  }).filter((n) => n.title && n.body.length);
}

export async function fetchLiveNews(): Promise<LiveNewsItem[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.items;

  const [guardian, ...rss] = await Promise.allSettled([
    fetchGuardianFull(),
    ...RSS_FEEDS.map((feed) => fetchRssFeed(feed)),
  ]);

  const byKey = new Map<string, LiveNewsItem>();
  const score = (item: LiveNewsItem) => {
    const photo = item.coverImage.startsWith("http") && !item.coverImage.includes("unsplash.com") ? 4 : 0;
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

  if (guardian.status === "fulfilled") guardian.value.forEach(push);
  for (const result of rss) {
    if (result.status === "fulfilled") result.value.forEach(push);
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
}

export async function getLiveNewsBySlug(slug: string): Promise<LiveNewsItem | undefined> {
  const items = await fetchLiveNews();
  return items.find((n) => n.slug === slug);
}
