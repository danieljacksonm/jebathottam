import fs from "fs";
import path from "path";
import { isLegacySourceDomainSlug, legacySlugFromSourceUrl, slugifyNewsTitle } from "@/lib/news-url";

/** Minimal shape stored for sitemap retention (matches PublicNewsItem fields we need). */
export type ArchivedNewsItem = {
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
  /** Prior public slugs (www-source…) kept for redirect resolution only */
  legacySlugs?: string[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const ARCHIVE_FILE = path.join(DATA_DIR, "news-sitemap-archive.json");

/** Keep news in sitemap + archive for at least this long. */
export const NEWS_SITEMAP_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Max article URLs in news sitemaps (standard + Google News XML).
 * The 7-day window is kept; this cap prevents bloat when ~50 RSS feeds × 20 items
 * accumulate thousands of syndicated URLs. Prioritize CMS, featured, and breaking
 * stories over wire duplicates. Google News XML hard-limits at 5000 — stay well under.
 */
export const NEWS_SITEMAP_MAX_URLS = 400;

function newsSitemapPriority(item: ArchivedNewsItem): number {
  let score = new Date(item.publishedAt).getTime();
  if (item.origin === "cms") score += 1e15;
  if (item.featured) score += 1e14;
  if (item.breaking) score += 1e13;
  if (item.origin === "seed") score += 1e12;
  return score;
}

/** Apply retention window then cap by editorial priority (newest + CMS first). */
export function capNewsForSitemap(items: ArchivedNewsItem[]): ArchivedNewsItem[] {
  const sorted = [...items].sort((a, b) => newsSitemapPriority(b) - newsSitemapPriority(a));
  return sorted.slice(0, NEWS_SITEMAP_MAX_URLS);
}

type ArchiveFile = {
  updatedAt: string;
  items: ArchivedNewsItem[];
};

function loadArchive(): ArchiveFile {
  try {
    if (fs.existsSync(ARCHIVE_FILE)) {
      const raw = fs.readFileSync(ARCHIVE_FILE, "utf-8");
      const parsed = JSON.parse(raw) as ArchiveFile;
      if (Array.isArray(parsed?.items)) return parsed;
    }
  } catch (error) {
    console.error("Failed to load news sitemap archive:", error);
  }
  return { updatedAt: new Date(0).toISOString(), items: [] };
}

function saveArchive(items: ArchivedNewsItem[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    const payload: ArchiveFile = {
      updatedAt: new Date().toISOString(),
      items,
    };
    fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(payload), "utf-8");
  } catch (error) {
    console.error("Failed to save news sitemap archive:", error);
  }
}

function withinRetention(publishedAt: string, now = Date.now()): boolean {
  const t = new Date(publishedAt).getTime();
  if (Number.isNaN(t)) return false;
  return now - t <= NEWS_SITEMAP_RETENTION_MS;
}

/**
 * Remember current news so items stay in the sitemap for ≥ 1 week
 * even after they drop out of live RSS feeds.
 */
export function rememberNewsForSitemap(current: ArchivedNewsItem[]): ArchivedNewsItem[] {
  const now = Date.now();
  const bySlug = new Map<string, ArchivedNewsItem>();

  for (const item of loadArchive().items) {
    if (withinRetention(item.publishedAt, now)) {
      bySlug.set(item.slug, normalizeArchivedSlug(item));
    }
  }

  for (const item of current) {
    if (!withinRetention(item.publishedAt, now) && item.origin === "live") {
      continue;
    }
    const normalized = normalizeArchivedSlug(item);
    const existing = bySlug.get(normalized.slug);
    if (
      !existing ||
      normalized.origin === "cms" ||
      new Date(normalized.publishedAt) >= new Date(existing.publishedAt)
    ) {
      // If replacing a legacy www-* entry, keep the old slug for redirects
      if (existing && isLegacySourceDomainSlug(existing.slug) && existing.slug !== normalized.slug) {
        const legacy = new Set([...(normalized.legacySlugs || []), existing.slug, ...(existing.legacySlugs || [])]);
        normalized.legacySlugs = Array.from(legacy);
        bySlug.delete(existing.slug);
      }
      bySlug.set(normalized.slug, normalized);
    }
  }

  // Drop pure legacy source-domain rows when a clean twin exists (same originalUrl / title)
  for (const [slug, item] of [...bySlug.entries()]) {
    if (!isLegacySourceDomainSlug(slug)) continue;
    const twin = [...bySlug.values()].find(
      (o) =>
        o.slug !== slug &&
        !isLegacySourceDomainSlug(o.slug) &&
        ((item.originalUrl && o.originalUrl === item.originalUrl) ||
          (item.title && o.title && item.title === o.title))
    );
    if (twin) {
      const legacy = new Set([...(twin.legacySlugs || []), slug, ...(item.legacySlugs || [])]);
      twin.legacySlugs = Array.from(legacy);
      bySlug.set(twin.slug, twin);
      bySlug.delete(slug);
    }
  }

  const merged = Array.from(bySlug.values())
    .filter((n) => withinRetention(n.publishedAt, now) || n.origin === "cms" || n.origin === "seed")
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const weekItems = merged.filter((n) => withinRetention(n.publishedAt, now));
  const olderKept = merged.filter((n) => !withinRetention(n.publishedAt, now)).slice(0, 200);
  const toSave = [...weekItems, ...olderKept];

  saveArchive(toSave);
  return toSave;
}

function normalizeArchivedSlug(item: ArchivedNewsItem): ArchivedNewsItem {
  if (!isLegacySourceDomainSlug(item.slug)) return item;
  const clean = slugifyNewsTitle(item.title);
  if (!clean || clean === item.slug) return item;
  const legacy = new Set([...(item.legacySlugs || []), item.slug]);
  if (item.originalUrl) legacy.add(legacySlugFromSourceUrl(item.originalUrl));
  return { ...item, slug: clean, legacySlugs: Array.from(legacy) };
}

/** Items for XML sitemaps: 7-day window, capped by editorial priority. Never emit www-* locs. */
export function listNewsForSitemap(current: ArchivedNewsItem[]): ArchivedNewsItem[] {
  const archived = rememberNewsForSitemap(current);
  const now = Date.now();
  const bySlug = new Map<string, ArchivedNewsItem>();

  for (const item of archived) {
    if (!withinRetention(item.publishedAt, now)) continue;
    const n = normalizeArchivedSlug(item);
    if (isLegacySourceDomainSlug(n.slug)) continue;
    bySlug.set(n.slug, n);
  }
  for (const item of current) {
    if (!withinRetention(item.publishedAt, now)) continue;
    const n = normalizeArchivedSlug(item);
    if (isLegacySourceDomainSlug(n.slug)) continue;
    bySlug.set(n.slug, n);
  }

  return capNewsForSitemap(
    Array.from(bySlug.values()).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  );
}

export function getArchivedNewsBySlug(slug: string): ArchivedNewsItem | undefined {
  const item = loadArchive().items.find(
    (n) => n.slug === slug || n.legacySlugs?.includes(slug)
  );
  if (!item) return undefined;
  if (!withinRetention(item.publishedAt) && item.origin === "live") return undefined;
  return normalizeArchivedSlug(item);
}

/** Resolve Google-indexed www-source slugs to the archived article (if still retained). */
export function findArchivedNewsByLegacySlug(slug: string): ArchivedNewsItem | undefined {
  const items = loadArchive().items;
  for (const n of items) {
    if (n.slug === slug || n.legacySlugs?.includes(slug)) {
      if (!withinRetention(n.publishedAt) && n.origin === "live") continue;
      return normalizeArchivedSlug(n);
    }
    if (n.originalUrl && legacySlugFromSourceUrl(n.originalUrl) === slug) {
      if (!withinRetention(n.publishedAt) && n.origin === "live") continue;
      return normalizeArchivedSlug(n);
    }
  }
  return undefined;
}
