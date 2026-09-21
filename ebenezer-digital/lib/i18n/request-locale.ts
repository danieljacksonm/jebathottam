import { cookies, headers } from "next/headers";
import type { SeoLocale } from "@/lib/site-url";
import { localeFromCookieHeader } from "./locale-utils";
import { SEO_LOCALES } from "@/lib/i18n/seo-locales";

function isLocale(value: string | null | undefined): value is SeoLocale {
  return !!value && (SEO_LOCALES as readonly string[]).includes(value);
}

/** Resolve locale from middleware header or cookie (server components / routes). */
export function resolveRequestLocale(): SeoLocale {
  const h = headers();
  const fromHeader = h.get("x-eben-locale")?.toLowerCase();
  if (isLocale(fromHeader)) return fromHeader;

  const fromCookie = cookies().get("eben-locale")?.value?.toLowerCase();
  if (isLocale(fromCookie)) return fromCookie;

  return "en";
}

export { localeFromCookieHeader, localeFromPathname } from "./locale-utils";
