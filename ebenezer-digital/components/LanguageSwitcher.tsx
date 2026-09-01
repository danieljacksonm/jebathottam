"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SEO_LOCALES, type SeoLocale } from "@/lib/site-url";

const LABELS: Partial<Record<SeoLocale, string>> = {
  en: "EN",
  hi: "हि",
  ta: "த",
  te: "తె",
  es: "ES",
  fr: "FR",
  ar: "ع",
  de: "DE",
};

function localeHref(pathname: string, locale: SeoLocale): string {
  const clean = pathname.replace(/^\/[a-z]{2}(\/|$)/i, "/") || "/";
  const base = clean === "/" ? "" : clean;
  return locale === "en" ? base || "/" : `/${locale}${base}`;
}

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname() || "/";
  const current =
    (pathname.match(/^\/([a-z]{2})(\/|$)/i)?.[1]?.toLowerCase() as SeoLocale | undefined) ||
    "en";

  const locales = compact
    ? (["en", "hi", "ta", "te", "es", "fr"] as SeoLocale[])
    : SEO_LOCALES;

  return (
    <nav aria-label="Language" className={compact ? "flex flex-wrap gap-1" : "flex flex-wrap gap-2"}>
      {locales.map((loc) => (
        <Link
          key={loc}
          href={localeHref(pathname, loc)}
          className={
            loc === current
              ? "rounded px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-300"
              : "rounded px-2 py-0.5 text-xs text-white/50 hover:text-white"
          }
          hrefLang={loc}
        >
          {LABELS[loc] || loc.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
