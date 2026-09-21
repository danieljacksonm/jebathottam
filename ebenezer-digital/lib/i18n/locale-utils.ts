import type { SeoLocale } from "@/lib/site-url";
import { SEO_LOCALES } from "@/lib/i18n/seo-locales";

function isLocale(value: string | null | undefined): value is SeoLocale {
  return !!value && (SEO_LOCALES as readonly string[]).includes(value);
}

export function localeFromPathname(pathname: string): SeoLocale {
  const raw = pathname.match(/^\/([a-z]{2})(\/|$)/i)?.[1]?.toLowerCase();
  return isLocale(raw) ? raw : "en";
}

export function localeFromCookieHeader(cookieHeader: string | null): SeoLocale {
  const m = (cookieHeader || "").match(/(?:^|;\s*)eben-locale=([^;]+)/i);
  const raw = m?.[1]?.toLowerCase();
  return isLocale(raw) ? raw : "en";
}
