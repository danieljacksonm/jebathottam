"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPublishedLocales } from "@/lib/i18n/published-locales";
import { LOCALE_LABELS, LOCALE_SHORT } from "@/lib/i18n/locale-registry";
import type { SeoLocale } from "@/lib/site-url";

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
  const UI_LOCALES = getPublishedLocales();
  const current =
    (pathname.match(/^\/([a-z]{2})(\/|$)/i)?.[1]?.toLowerCase() as SeoLocale | undefined) ||
    "en";

  if (UI_LOCALES.length <= 1) {
    return null;
  }

  const useCompactNav = UI_LOCALES.length > 12;

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
      {!useCompactNav && (
        <nav
          aria-label="Language"
          className={compact ? "hidden items-center gap-1 sm:flex sm:flex-wrap" : "hidden items-center gap-2 md:flex md:flex-wrap"}
        >
          {UI_LOCALES.map((loc) => (
            <Link
              key={loc}
              href={localeHref(pathname, loc)}
              className={loc === current ? activeClass : inactiveClass}
              hrefLang={loc}
            >
              {LOCALE_SHORT[loc] || loc.toUpperCase()}
            </Link>
          ))}
        </nav>
      )}
      <label className="sr-only" htmlFor="eben-lang-select">
        Language
      </label>
      <select
        id="eben-lang-select"
        value={UI_LOCALES.includes(current) ? current : "en"}
        onChange={(e) => {
          const next = e.target.value as SeoLocale;
          window.location.href = localeHref(pathname, next);
        }}
        className={
          useCompactNav
            ? selectClass
            : compact
              ? `${selectClass} sm:hidden`
              : `${selectClass} md:hidden`
        }
        aria-label="Language"
      >
        {UI_LOCALES.map((loc) => (
          <option key={loc} value={loc}>
            {LOCALE_LABELS[loc] || loc.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
