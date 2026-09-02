import type { MetadataRoute } from "next";

export type SitemapEntry = MetadataRoute.Sitemap[number];

/** GSC requires hreflang "en" (and usually x-default) to match `<loc>` when present. */
export function validateSitemapEntry(entry: SitemapEntry): string[] {
  const errors: string[] = [];
  const langs = entry.alternates?.languages;
  if (!langs) return errors;

  if (langs.en && langs.en !== entry.url) {
    errors.push(`loc/hreflang en mismatch: ${entry.url} vs ${langs.en}`);
  }
  if (langs["x-default"] && langs.en && langs["x-default"] !== langs.en) {
    errors.push(`hreflang x-default != en: ${langs["x-default"]} vs ${langs.en}`);
  }
  return errors;
}

export function validateSitemap(entries: SitemapEntry[]): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  for (const entry of entries) {
    errors.push(...validateSitemapEntry(entry));
  }
  return { ok: errors.length === 0, errors };
}
