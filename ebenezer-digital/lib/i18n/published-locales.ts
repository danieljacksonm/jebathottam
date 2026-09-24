import { SEO_LOCALES, type SeoLocale, isSeoLocaleCode } from "./seo-locales";

/** All SEO locales — static translation bundles ship for every language. */
const ALL_PUBLISHED: SeoLocale[] = [...SEO_LOCALES];

/** Parse comma-separated locale list from env (server + client). Use `all` for every SEO locale. */
function parsePublishedEnv(raw?: string | null): SeoLocale[] {
  if (!raw?.trim()) {
    // Real studio translations today: en + ta + hi. Do not advertise ~70 soft shells by default.
    return parsePublishedEnv("en,ta,hi");
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

/** Locales with published translations — controls hreflang, sitemap, switcher, middleware index. */
export function getPublishedLocales(): readonly SeoLocale[] {
  const raw =
    process.env.NEXT_PUBLIC_EBEN_I18N_PUBLISHED_LOCALES ||
    process.env.EBEN_I18N_PUBLISHED_LOCALES ||
    "en,ta,hi";
  return parsePublishedEnv(raw);
}

export function isPublishedLocale(locale: string): boolean {
  return getPublishedLocales().includes(locale as SeoLocale);
}

export function isSeoLocale(code: string): code is SeoLocale {
  return isSeoLocaleCode(code);
}
