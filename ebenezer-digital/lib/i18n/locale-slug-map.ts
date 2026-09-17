/**
 * Maps English slugs to localized slugs per content type.
 * Extend when translations use different URL slugs (e.g. Tamil transliteration).
 */
export type ContentSurface = "journal" | "service" | "insight" | "product" | "network-tool";

const SLUG_MAP: Record<ContentSurface, Record<string, Partial<Record<string, string>>>> = {
  journal: {},
  service: {},
  insight: {},
  product: {},
  "network-tool": {},
};

export function localizedSlug(
  surface: ContentSurface,
  enSlug: string,
  locale: string
): string {
  if (locale === "en") return enSlug;
  return SLUG_MAP[surface]?.[enSlug]?.[locale] ?? enSlug;
}

export function englishSlugFromLocalized(
  surface: ContentSurface,
  slug: string,
  locale: string
): string {
  if (locale === "en") return slug;
  const map = SLUG_MAP[surface];
  for (const [en, locales] of Object.entries(map)) {
    if (locales[locale] === slug) return en;
  }
  return slug;
}
