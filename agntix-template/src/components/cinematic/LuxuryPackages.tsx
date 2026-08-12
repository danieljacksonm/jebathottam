"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatInr, getLocalizedPackages } from "@/data/packages";
import { useReveal } from "./motion";

export function LuxuryPackages({ hideIntro = false }: { hideIntro?: boolean }) {
  const locale = useLocale();
  const t = useTranslations("packages");
  const ref = useReveal([]);
  const list = getLocalizedPackages(locale);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="section-pad relative overflow-hidden bg-navy-mid"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(214,166,74,0.08),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl">
        {!hideIntro && (
          <div data-reveal className="max-w-2xl">
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-gold">
              {t("luxuryEyebrow")}
            </p>
            <h2 className="mt-4 font-display text-5xl text-white md:text-6xl">
              {t("luxuryTitle")}
            </h2>
            <p className="mt-5 text-soft-gray">{t("luxuryBody")}</p>
          </div>
        )}

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.map((pkg) => (
            <article key={pkg.id} data-reveal className="lux-card group">
              <Link href={`/packages/${pkg.id}`} className="relative block aspect-[16/11]">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
              </Link>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-3xl text-white">{pkg.title}</h3>
                  <span className="inline-flex items-center gap-1 text-gold-bright">
                    <Star size={14} fill="currentColor" />
                    {pkg.rating.toFixed(1)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-mist">
                  {t("days", { count: pkg.days })} · {t("nights", { count: pkg.nights })}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-soft-gray">{pkg.blurb}</p>
                <div className="mt-6 flex items-end justify-between border-t border-[var(--line)] pt-5">
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.16em] text-mist">
                      {t("from")}
                    </p>
                    <p className="font-display text-3xl text-gold-bright">
                      {formatInr(pkg.priceFrom)}
                    </p>
                  </div>
                  <Link
                    href={`/enquire?package=${pkg.id}`}
                    className="btn-ghost !px-4 !py-2.5 text-[0.65rem]"
                  >
                    {t("enquire")}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
