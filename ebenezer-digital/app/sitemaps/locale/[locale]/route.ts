import { NextRequest, NextResponse } from "next/server";
import { sitemapForKind } from "@/lib/site-sitemaps";
import { buildUrlsetXml, EMPTY_URLSET_XML, xmlSitemapHeaders } from "@/lib/sitemap-xml";
import { getPublishedLocales, isSeoLocale } from "@/lib/i18n/published-locales";
import { originForKind, siteKindFromRequestHeaders } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const CACHE = "public, s-maxage=3600, stale-while-revalidate=86400";
const RETRY = { ...xmlSitemapHeaders("no-store"), "Retry-After": "60" };

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

/**
 * Per-locale sitemap: /sitemaps/locale/{locale}
 * Not listed in the host index by default. News/network are English-only — never emit
 * locale-prefixed locs that would 301.
 * Invalid locale / English-only host → 404 (not empty 200). Build failure → 503.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string } }
) {
  const locale = params.locale?.toLowerCase();
  if (!locale || !isSeoLocale(locale) || !getPublishedLocales().includes(locale as never)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const kind = siteKindFromRequestHeaders(request.headers);
    if (kind === "news" || kind === "network") {
      return new NextResponse("Not found", { status: 404 });
    }

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

    if (!entries.length) {
      return new NextResponse(EMPTY_URLSET_XML, {
        status: 503,
        headers: RETRY,
      });
    }

    return new NextResponse(buildUrlsetXml(entries), {
      status: 200,
      headers: xmlSitemapHeaders(CACHE),
    });
  } catch (error) {
    console.error("Locale sitemap failed", error);
    return new NextResponse(EMPTY_URLSET_XML, {
      status: 503,
      headers: RETRY,
    });
  }
}
