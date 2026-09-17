import { getPrisma, prismaEnabled } from "@/lib/prisma";
import { loadMessages } from "@/lib/i18n/load-messages";
import type { SeoLocale } from "@/lib/site-url";

export type LocalizedPage = {
  contentKey: string;
  locale: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  heroImage?: string | null;
  status: string;
};

/** Build a stable content key for journal, service, tool, product pages. */
export function contentKeyFor(type: string, slug: string): string {
  return `${type}:${slug}`;
}

/**
 * Fetch localized body content from MySQL when available.
 * Returns null if no published translation — caller must not index English shell as translation.
 */
function staticJournalFallback(contentKey: string, locale: string): LocalizedPage | null {
  if (locale === "en") return null;
  const slug = contentKey.replace(/^journal:/, "");
  const j = loadMessages(locale as SeoLocale).journal?.[slug];
  if (!j) return null;
  return {
    contentKey,
    locale,
    slug,
    title: j.title,
    excerpt: j.excerpt,
    body: j.body,
    metaTitle: j.title,
    metaDescription: j.excerpt,
    heroImage: null,
    status: "published",
  };
}

export async function resolveLocalizedContent(
  contentKey: string,
  locale: string
): Promise<LocalizedPage | null> {
  if (locale === "en") return null;

  const staticPage = staticJournalFallback(contentKey, locale);
  if (staticPage) return staticPage;

  if (!prismaEnabled()) return null;
  const prisma = getPrisma();
  if (!prisma) return null;
  try {
    const row = await prisma.localizedContent.findFirst({
      where: { contentKey, locale, status: "published" },
    });
    if (!row) return null;
    return {
      contentKey: row.contentKey,
      locale: row.locale,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      body: row.body,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      heroImage: row.heroImage,
      status: row.status,
    };
  } catch {
    return staticPage;
  }
}

/** UI-only fallback: English labels when translation string missing (never for indexable body). */
export function uiFallback<T extends Record<string, string>>(
  catalog: Record<SeoLocale, T>,
  locale: SeoLocale,
  key: keyof T
): string {
  const loc = catalog[locale]?.[key];
  if (loc) return loc;
  return catalog.en[key] || String(key);
}
