import { headers } from "next/headers";
import type { SeoLocale } from "@/lib/site-url";
import { isSeoLocaleCode } from "@/lib/i18n/seo-locales";

/**
 * Server locale — URL wins via middleware `x-eben-locale`.
 * Never read the language cookie here (cookie must not override /en or unprefixed English).
 */
export function resolveRequestLocale(): SeoLocale {
  const fromHeader = headers().get("x-eben-locale")?.toLowerCase();
  if (fromHeader && isSeoLocaleCode(fromHeader)) return fromHeader;
  return "en";
}

export { localeFromCookieHeader, localeFromPathname } from "./locale-utils";
