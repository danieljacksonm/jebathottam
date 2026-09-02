"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SEO_LOCALES, type SeoLocale } from "@/lib/site-url";

const LABELS: Partial<Record<SeoLocale, string>> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  kn: "Kannada",
  bn: "Bengali",
  mr: "Marathi",
  gu: "Gujarati",
  pa: "Punjabi",
  ur: "Urdu",
  es: "Spanish",
  fr: "French",
  ar: "Arabic",
  de: "German",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  tr: "Turkish",
  id: "Indonesian",
};

const SHORT: Partial<Record<SeoLocale, string>> = {
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

export function LanguageSwitcher({
  compact = false,
  variant = "dark",
}: {
  compact?: boolean;
  variant?: "dark" | "light";
}) {
  const pathname = usePathname() || "/";
  const current =
    (pathname.match(/^\/([a-z]{2})(\/|$)/i)?.[1]?.toLowerCase() as SeoLocale | undefined) ||
    "en";

  const pillLocales = compact
    ? (["en", "hi", "ta", "te", "es", "fr"] as SeoLocale[])
    : SEO_LOCALES;

  const inactiveClass =
    variant === "light"
      ? "rounded px-2 py-0.5 text-xs text-slate-500 hover:text-slate-900"
      : "rounded px-2 py-0.5 text-xs text-white/50 hover:text-white";
  const activeClass =
    variant === "light"
      ? "rounded px-2 py-0.5 text-xs font-medium bg-emerald-500/15 text-emerald-700"
      : "rounded px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-300";
  const selectClass =
    variant === "light" ? "lang-switcher-select lang-switcher-select-light" : "lang-switcher-select";

  return (
    <div className="lang-switcher">
      <nav
        aria-label="Language"
        className={compact ? "hidden items-center gap-1 sm:flex sm:flex-wrap" : "hidden items-center gap-2 md:flex md:flex-wrap"}
      >
        {pillLocales.map((loc) => (
          <Link
            key={loc}
            href={localeHref(pathname, loc)}
            className={loc === current ? activeClass : inactiveClass}
            hrefLang={loc}
          >
            {SHORT[loc] || loc.toUpperCase()}
          </Link>
        ))}
      </nav>
      <label className="sr-only" htmlFor="eben-lang-select">
        Language
      </label>
      <select
        id="eben-lang-select"
        value={current}
        onChange={(e) => {
          const next = e.target.value as SeoLocale;
          window.location.href = localeHref(pathname, next);
        }}
        className={compact ? `${selectClass} sm:hidden` : `${selectClass} md:hidden`}
        aria-label="Language"
      >
        {SEO_LOCALES.map((loc) => (
          <option key={loc} value={loc}>
            {LABELS[loc] || loc.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
