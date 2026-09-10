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

/** Disk writes at most this often — crawlers were triggering sync rewrite storms. */
const ARCHIVE_WRITE_MIN_MS = 5 * 60 * 1000;

type ArchiveFile = {
  updatedAt: string;
  items: ArchivedNewsItem[];
};

type ArchiveIndex = {
  file: ArchiveFile;
  bySlug: Map<string, ArchivedNewsItem>;
  byLegacy: Map<string, ArchivedNewsItem>;
  byOriginalUrl: Map<string, ArchivedNewsItem>;
  byTitle: Map<string, ArchivedNewsItem>;
};

let mem: ArchiveIndex | null = null;
let lastWriteAt = 0;
let writeTimer: ReturnType<typeof setTimeout> | null = null;
let pendingCurrent: ArchivedNewsItem[] | null = null;

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

function withinRetention(publishedAt: string, now = Date.now()): boolean {
  const t = new Date(publishedAt).getTime();
  if (Number.isNaN(t)) return false;
  return now - t <= NEWS_SITEMAP_RETENTION_MS;
}

/** Drop article bodies — sitemap/redirects only need metadata. Shrinks disk + CPU. */
function slimItem(item: ArchivedNewsItem): ArchivedNewsItem {
  return {
    ...item,
    dek: (item.dek || "").slice(0, 320),
    body: item.dek ? [item.dek.slice(0, 320)] : [],
    coverImage: item.coverImage || "",
  };
}

function buildIndex(file: ArchiveFile): ArchiveIndex {
  const bySlug = new Map<string, ArchivedNewsItem>();
  const byLegacy = new Map<string, ArchivedNewsItem>();
  const byOriginalUrl = new Map<string, ArchivedNewsItem>();
  const byTitle = new Map<string, ArchivedNewsItem>();

  for (const raw of file.items) {
    const item = normalizeArchivedSlug(raw);
    bySlug.set(item.slug, item);
    for (const leg of item.legacySlugs || []) byLegacy.set(leg, item);
    if (item.originalUrl) byOriginalUrl.set(item.originalUrl, item);
    if (item.title) byTitle.set(item.title, item);
  }

  return { file: { ...file, items: Array.from(bySlug.values()) }, bySlug, byLegacy, byOriginalUrl, byTitle };
}

function loadArchiveFromDisk(): ArchiveFile {
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

function getIndex(): ArchiveIndex {
  if (!mem) mem = buildIndex(loadArchiveFromDisk());
  return mem;
}

function saveArchiveToDisk(items: ArchivedNewsItem[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    const slim = items.map(slimItem);
    const payload: ArchiveFile = {
      updatedAt: new Date().toISOString(),
      items: slim,
    };
    fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(payload), "utf-8");
    mem = buildIndex(payload);
    lastWriteAt = Date.now();
  } catch (error) {
    console.error("Failed to save news sitemap archive:", error);
  }
}

function mergeArchive(current: ArchivedNewsItem[]): ArchivedNewsItem[] {
  const now = Date.now();
  const idx = getIndex();
  const bySlug = new Map<string, ArchivedNewsItem>();

  for (const item of idx.file.items) {
    if (withinRetention(item.publishedAt, now) || item.origin === "cms" || item.origin === "seed") {
      bySlug.set(item.slug, normalizeArchivedSlug(item));
    }
  }

  for (const item of current) {
    if (!withinRetention(item.publishedAt, now) && item.origin === "live") continue;
    const normalized = slimItem(normalizeArchivedSlug(item));
    const existing = bySlug.get(normalized.slug);
    if (
      !existing ||
      normalized.origin === "cms" ||
      new Date(normalized.publishedAt) >= new Date(existing.publishedAt)
    ) {
      if (existing && isLegacySourceDomainSlug(existing.slug) && existing.slug !== normalized.slug) {
        const legacy = new Set([...(normalized.legacySlugs || []), existing.slug, ...(existing.legacySlugs || [])]);
        normalized.legacySlugs = Array.from(legacy);
        bySlug.delete(existing.slug);
      }
      bySlug.set(normalized.slug, normalized);
    }
  }

  // O(n) twin cleanup (was O(n²) and burned CPU under crawlers)
  const cleanByUrl = new Map<string, ArchivedNewsItem>();
  const cleanByTitle = new Map<string, ArchivedNewsItem>();
  for (const o of bySlug.values()) {
    if (isLegacySourceDomainSlug(o.slug)) continue;
    if (o.originalUrl) cleanByUrl.set(o.originalUrl, o);
    if (o.title) cleanByTitle.set(o.title, o);
  }
  for (const [slug, item] of Array.from(bySlug.entries())) {
    if (!isLegacySourceDomainSlug(slug)) continue;
    const twin =
      (item.originalUrl ? cleanByUrl.get(item.originalUrl) : undefined) ||
      (item.title ? cleanByTitle.get(item.title) : undefined);
    if (twin && twin.slug !== slug) {
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
  return [...weekItems, ...olderKept];
}

/**
 * Remember current news so items stay in the sitemap for ≥ 1 week.
 * Throttled + deferred — never sync-write on the request hot path.
 */
export function rememberNewsForSitemap(current: ArchivedNewsItem[]): ArchivedNewsItem[] {
  pendingCurrent = current;
  const merged = mergeArchive(current);
  // Update memory immediately for readers; disk write is deferred/throttled.
  mem = buildIndex({ updatedAt: new Date().toISOString(), items: merged });

  const due = Date.now() - lastWriteAt >= ARCHIVE_WRITE_MIN_MS;
  if (!due) {
    if (!writeTimer) {
      const wait = Math.max(1_000, ARCHIVE_WRITE_MIN_MS - (Date.now() - lastWriteAt));
      writeTimer = setTimeout(() => {
        writeTimer = null;
        const latest = pendingCurrent || [];
        saveArchiveToDisk(mergeArchive(latest));
      }, wait);
    }
    return merged;
  }

  // Defer past the response so we don't block robots/pages.
  setTimeout(() => {
    const latest = pendingCurrent || current;
    saveArchiveToDisk(mergeArchive(latest));
  }, 0);

  return merged;
}

function normalizeArchivedSlug(item: ArchivedNewsItem): ArchivedNewsItem {
  if (!isLegacySourceDomainSlug(item.slug)) return item;
  const clean = slugifyNewsTitle(item.title);
  if (!clean || clean === item.slug) return item;
  const legacy = new Set([...(item.legacySlugs || []), item.slug]);
  if (item.originalUrl) legacy.add(legacySlugFromSourceUrl(item.originalUrl));
  return { ...item, slug: clean, legacySlugs: Array.from(legacy) };
}

/** Read-only sitemap list — does not rewrite disk on every crawler hit. */
export function listNewsForSitemap(current: ArchivedNewsItem[]): ArchivedNewsItem[] {
  const now = Date.now();
  const bySlug = new Map<string, ArchivedNewsItem>();
  const idx = getIndex();

  for (const item of idx.file.items) {
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

  // Schedule a throttled persist; do not await / sync-write here.
  pendingCurrent = current;
  if (!writeTimer && Date.now() - lastWriteAt >= ARCHIVE_WRITE_MIN_MS) {
    writeTimer = setTimeout(() => {
      writeTimer = null;
      rememberNewsForSitemap(pendingCurrent || current);
    }, 2_000);
  }

  return capNewsForSitemap(
    Array.from(bySlug.values()).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  );
}

export function getArchivedNewsBySlug(slug: string): ArchivedNewsItem | undefined {
  const idx = getIndex();
  const item = idx.bySlug.get(slug) || idx.byLegacy.get(slug);
  if (!item) return undefined;
  if (!withinRetention(item.publishedAt) && item.origin === "live") return undefined;
  return normalizeArchivedSlug(item);
}

/** Resolve Google-indexed www-source slugs to the archived article (if still retained). */
export function findArchivedNewsByLegacySlug(slug: string): ArchivedNewsItem | undefined {
  const idx = getIndex();
  const direct = idx.bySlug.get(slug) || idx.byLegacy.get(slug);
  if (direct) {
    if (!withinRetention(direct.publishedAt) && direct.origin === "live") return undefined;
    return normalizeArchivedSlug(direct);
  }
  for (const n of idx.file.items) {
    if (n.originalUrl && legacySlugFromSourceUrl(n.originalUrl) === slug) {
      if (!withinRetention(n.publishedAt) && n.origin === "live") continue;
      return normalizeArchivedSlug(n);
    }
  }
  return undefined;
}

/** Recent archived items for related-rail (no RSS). */
export function listArchivedNewsRecent(limit = 80): ArchivedNewsItem[] {
  return getIndex()
    .file.items.filter((n) => withinRetention(n.publishedAt) || n.origin === "cms" || n.origin === "seed")
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
    .map(normalizeArchivedSlug);
}
