import { NextRequest, NextResponse } from "next/server";
import { sitemapForKind } from "@/lib/site-sitemaps";
import { buildUrlsetXml } from "@/lib/sitemap-xml";
import { getPublishedLocales, isSeoLocale } from "@/lib/i18n/published-locales";
import { originForKind, siteKindFromHost } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const CACHE_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

function localizeEntryUrl(url: string, locale: string, origin: string): string {
  if (locale === "en") return url;
  try {
    const u = new URL(url);
    if (!u.href.startsWith(origin)) return url;
    const pubPath = u.pathname || "/";
    const prefixed = `/${locale}${pubPath === "/" ? "" : pubPath}`;
    return `${origin}${prefixed}`;
  } catch {
    return url;
  }
}

/** Per-locale sitemap: /sitemaps/locale/{locale} */
export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string } }
) {
  const locale = params.locale?.toLowerCase();
  if (!locale || !isSeoLocale(locale) || !getPublishedLocales().includes(locale as never)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const kind = siteKindFromHost(request.headers.get("host"));
    const origin = originForKind(kind);
    const base = await sitemapForKind(kind);
    const entries = base.map((entry) => {
      const localizedUrl = localizeEntryUrl(entry.url, locale, origin);
      const languages = entry.alternates?.languages;
      return {
        ...entry,
        url: localizedUrl,
        alternates: languages
          ? { languages: { ...languages, [locale]: localizedUrl } }
          : undefined,
      };
    });

    return new NextResponse(buildUrlsetXml(entries), {
      status: 200,
      headers: CACHE_HEADERS,
    });
  } catch (error) {
    console.error("Locale sitemap failed", error);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { status: 500, headers: { "Content-Type": "application/xml; charset=utf-8" } }
    );
  }
}
