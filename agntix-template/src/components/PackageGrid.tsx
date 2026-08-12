"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  formatInr,
  getLocalizedPackages,
} from "@/data/packages";
import { Reveal } from "./Reveal";

type Props = {
  limit?: number;
  showHeader?: boolean;
  featuredOnly?: boolean;
};

export function PackageGrid({
  limit,
  showHeader = true,
  featuredOnly = false,
}: Props) {
  const t = useTranslations("packages");
  const locale = useLocale();
  let list = getLocalizedPackages(locale);
  if (featuredOnly) list = list.filter((p) => p.featured);
  if (typeof limit === "number") list = list.slice(0, limit);

  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl">
        {showHeader && (
          <Reveal className="max-w-2xl">
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 font-display text-4xl text-cream md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-mist/90">{t("subtitle")}</p>
          </Reveal>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.map((pkg, index) => {
            return (
              <Reveal key={pkg.id} delay={index * 0.06}>
                <article className="card-surface flex h-full flex-col">
                  <Link href={`/packages/${pkg.id}`} className="relative aspect-[16/10] block">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
                  </Link>
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-2xl text-cream">
                        <Link href={`/packages/${pkg.id}`}>{pkg.title}</Link>
                      </h3>
                      <div className="flex items-center gap-1 text-gold-bright">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm">{pkg.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="mt-1 text-[0.7rem] uppercase tracking-[0.14em] text-mist/70">
                      {t("days", { count: pkg.days })} / {t("nights", { count: pkg.nights })}
                    </p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-mist/85">
                      {pkg.blurb}
                    </p>
                    <p className="mt-2 text-xs text-mist/60">
                      {t("reviews", { count: pkg.reviewCount })}
                    </p>
                    <ul className="mt-4 space-y-1.5 text-xs text-mist/75">
                      {pkg.highlights.slice(0, 3).map((h) => (
                        <li key={h} className="flex gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-5">
                      <div>
                        <p className="text-[0.62rem] uppercase tracking-[0.14em] text-mist/60">
                          {t("from")}
                        </p>
                        <p className="font-display text-2xl text-gold-bright">
                          {formatInr(pkg.priceFrom)}
                        </p>
                        <p className="text-xs text-mist/55">{t("perPerson")}</p>
                      </div>
                      <Link
                        href={`/enquire?package=${pkg.id}`}
                        className="btn-ghost !px-3.5 !py-2 text-[0.65rem]"
                      >
                        {t("enquire")}
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {typeof limit === "number" && (
          <Reveal className="mt-10 text-center">
            <Link href="/packages" className="btn-ghost">
              {t("viewAll")}
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
