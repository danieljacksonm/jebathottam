import type { SeoLocale } from "@/lib/site-url";

/** Prefix internal paths with /ta, /hi, etc. English stays unprefixed. */
export function localePath(path: string, locale: SeoLocale): string {
  if (!locale || locale === "en") return path;
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return `/${locale}`;
  return `/${locale}${clean}`;
}
