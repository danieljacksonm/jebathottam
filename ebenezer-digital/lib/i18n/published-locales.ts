import { SEO_LOCALES, type SeoLocale, isSeoLocaleCode } from "./seo-locales";
import { PUBLISHED_LOCALES, isPublishedLocaleCode } from "./supported-locales";

/** All SEO locales — static shells may exist; only published are indexable. */
const ALL_PUBLISHED: SeoLocale[] = [...SEO_LOCALES];

/** Parse comma-separated locale list from env. Use `all` only for emergency full set. */
function parsePublishedEnv(raw?: string | null): SeoLocale[] {
  if (!raw?.trim()) {
    return [...PUBLISHED_LOCALES];
  }
  if (raw.trim().toLowerCase() === "all") return ALL_PUBLISHED;
  const set = new Set<SeoLocale>();
  for (const part of raw.split(",")) {
    const code = part.trim().toLowerCase();
    if ((SEO_LOCALES as readonly string[]).includes(code)) {
      set.add(code as SeoLocale);
    }
  }
  if (!set.has("en")) set.add("en");
  return Array.from(set);
}

/**
 * Locales with real published translations — hreflang, sitemap, switcher, middleware index.
 * Default: en, ta, hi (see supported-locales.ts). Override via env only when bundles are ready.
 */
export function getPublishedLocales(): readonly SeoLocale[] {
  const raw =
    process.env.NEXT_PUBLIC_EBEN_I18N_PUBLISHED_LOCALES ||
    process.env.EBEN_I18N_PUBLISHED_LOCALES ||
    PUBLISHED_LOCALES.join(",");
  return parsePublishedEnv(raw);
}

export function isPublishedLocale(locale: string): boolean {
  return getPublishedLocales().includes(locale as SeoLocale);
}

export function isSeoLocale(code: string): code is SeoLocale {
  return isSeoLocaleCode(code);
}

export { isPublishedLocaleCode, PUBLISHED_LOCALES };
