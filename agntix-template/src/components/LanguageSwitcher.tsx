"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const labels: Record<Locale, string> = {
  en: "EN",
  ta: "தமிழ்",
  hi: "हिंदी",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 rounded-sm border border-[var(--line)] p-0.5">
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => router.replace(pathname, { locale: code })}
            className={`px-2.5 py-1 text-[0.65rem] tracking-[0.08em] transition-colors ${
              active
                ? "bg-gold/15 text-gold-bright"
                : "text-cream/55 hover:text-cream"
            }`}
            aria-pressed={active}
          >
            {labels[code]}
          </button>
        );
      })}
    </div>
  );
}
