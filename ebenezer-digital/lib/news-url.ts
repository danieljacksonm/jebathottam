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
