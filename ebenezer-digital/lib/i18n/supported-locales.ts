import type { SeoLocale } from "./seo-locales";
import { isSeoLocaleCode } from "./seo-locales";

/**
 * Central multilingual config.
 * Only locales with real, curated translation bundles are published.
 * Do not add a locale here until its data/i18n/messages/{code}.json is complete
 * and free of machine-translation API error strings.
 */
export type LocaleMeta = {
  code: SeoLocale;
  name: string;
  nativeName: string;
  htmlLang: string;
  ogLocale: string;
  dir: "ltr" | "rtl";
};

/** Locales that may appear in URLs, hreflang, sitemap, and the language switcher. */
export const PUBLISHED_LOCALES = ["en", "ta", "hi"] as const satisfies readonly SeoLocale[];

export type PublishedLocale = (typeof PUBLISHED_LOCALES)[number];

export const LOCALE_META: Record<PublishedLocale, LocaleMeta> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    htmlLang: "en",
    ogLocale: "en_US",
    dir: "ltr",
  },
  ta: {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    htmlLang: "ta",
    ogLocale: "ta_IN",
    dir: "ltr",
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    htmlLang: "hi",
    ogLocale: "hi_IN",
    dir: "ltr",
  },
};

export function isPublishedLocaleCode(code: string): code is PublishedLocale {
  return (PUBLISHED_LOCALES as readonly string[]).includes(code);
}

export function assertSeoOrPublished(code: string): SeoLocale | null {
  if (!isSeoLocaleCode(code)) return null;
  return code;
}

/** Detect poisoned machine-translation API dumps (never render these). */
export function isCorruptTranslationText(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const v = value.toUpperCase();
  return (
    v.includes("MYMEMORY WARNING") ||
    v.includes("AVAILABLE FREE TRANSLATIONS") ||
    v.includes("QUERY LENGTH LIMIT") ||
    v.includes("PLEASE USE POST")
  );
}
