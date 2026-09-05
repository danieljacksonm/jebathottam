import type { NewsRegion } from "@/app/blog/news/data";
import { NEWS_URL } from "@/lib/site-url";

/** Public URL segment for a news desk/region — used in /{category}/{slug}. */
export const NEWS_CATEGORY_SEGMENTS = [
  "world",
  "asia",
  "europe",
  "americas",
  "africa",
  "middle-east",
  "india",
  "technology",
  "business",
  "science",
  "climate",
  "sports",
] as const;

export type NewsCategorySegment = (typeof NEWS_CATEGORY_SEGMENTS)[number];

const REGION_TO_SEGMENT: Record<string, NewsCategorySegment> = {
  World: "world",
  Asia: "asia",
  Europe: "europe",
  Americas: "americas",
  Africa: "africa",
  "Middle East": "middle-east",
  India: "india",
  Tech: "technology",
  Business: "business",
  Science: "science",
  Climate: "climate",
  Sports: "sports",
};

export function newsCategorySegment(region: string): NewsCategorySegment {
  return REGION_TO_SEGMENT[region] || "world";
}

export function isNewsCategorySegment(value: string): value is NewsCategorySegment {
  return (NEWS_CATEGORY_SEGMENTS as readonly string[]).includes(value);
}

/**
 * Editorial slug from headline only — never from source URLs.
 * Avoids /www-nytimes-com-… style paths.
 */
export function slugifyNewsTitle(title: string, maxLen = 72): string {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/www\.[^\s]+/gi, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, maxLen)
    .replace(/-$/g, "");
  return base || "story";
}

/** Canonical public path on the News host: /{category}/{slug} */
export function newsPublicPath(region: string, slug: string): string {
  return `/${newsCategorySegment(region)}/${slug}`;
}

export function newsPublicUrl(region: string, slug: string): string {
  return `${NEWS_URL.replace(/\/$/, "")}${newsPublicPath(region, slug)}`;
}

/** Relative href for in-app News links (pretty category URL). */
export function newsHref(article: { region: string; slug: string }): string {
  return newsPublicPath(article.region, article.slug);
}

/**
 * Reconstruct the historical (buggy) slug derived from a source URL.
 * Used only to resolve Google-indexed legacy paths → clean canonicals.
 */
export function legacySlugFromSourceUrl(url: string): string {
  try {
    const u = new URL(url);
    const raw = `${u.host}${u.pathname}${u.search}`.toLowerCase();
    return (
      raw
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 96)
        .replace(/-$/g, "") || "story"
    );
  } catch {
    return slugifyNewsTitle(url, 96);
  }
}

/** Detect source-domain artifact slugs (www-thehindu-…, bbc-co-uk-…, utm junk). */
export function isLegacySourceDomainSlug(slug: string): boolean {
  const s = slug.toLowerCase();
  if (/-at-medium-rss|-at-campaign-rss|utm_/.test(s)) return true;
  if (/^(www|feeds?|rss|edition)[-.]/.test(s)) return true;
  if (/^(www-)?[a-z0-9-]+-(com|co-uk|org|net|in)-/.test(s)) return true;
  return /(bbc|nytimes|thehindu|reuters|guardian|ndtv|hindustantimes|aljazeera|techcrunch|indianexpress|indiatimes)/.test(
    s
  ) && /(www-|com-|co-uk-|org-|net-)/.test(s);
}

const TRACKING_PARAM =
  /^(utm_|fbclid|gclid|msclkid|mc_|ref$|source$|campaign$)/i;

/** Drop tracking params from a URLSearchParams (mutate copy). */
export function stripTrackingParams(params: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams();
  params.forEach((value, key) => {
    if (TRACKING_PARAM.test(key) || key.toLowerCase().startsWith("utm_")) return;
    next.set(key, value);
  });
  return next;
}

export type NewsSourceType =
  | "ORIGINAL"
  | "SOURCE_SUMMARY"
  | "PARTNER_WIRE"
  | "OPINION"
  | "ANALYSIS";

export function sourceTypeLabel(type: NewsSourceType): string {
  switch (type) {
    case "ORIGINAL":
      return "Original reporting";
    case "SOURCE_SUMMARY":
      return "Source-based summary";
    case "PARTNER_WIRE":
      return "Partner wire";
    case "OPINION":
      return "Opinion";
    case "ANALYSIS":
      return "Analysis";
    default:
      return "Editorial";
  }
}

/** Infer source type when CMS did not set one. */
export function inferNewsSourceType(input: {
  origin?: "seed" | "cms" | "live";
  originalUrl?: string;
  sourceType?: NewsSourceType;
}): NewsSourceType {
  if (input.sourceType) return input.sourceType;
  if (input.origin === "live" || input.originalUrl) return "SOURCE_SUMMARY";
  if (input.origin === "seed") return "ANALYSIS";
  return "ORIGINAL";
}

export function regionFromCategorySegment(segment: string): NewsRegion | null {
  const entry = Object.entries(REGION_TO_SEGMENT).find(([, v]) => v === segment);
  return (entry?.[0] as NewsRegion) || null;
}
