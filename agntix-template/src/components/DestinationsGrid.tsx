"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  destinationCopy,
  destinations,
  type DestinationSlug,
} from "@/data/destinations";
import { formatInr } from "@/data/packages";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "./Reveal";

export function DestinationsGrid({
  limit,
  showHeader = true,
}: {
  limit?: number;
  showHeader?: boolean;
}) {
  const t = useTranslations("destinationsSection");
  const locale = useLocale() as Locale;
  const list = typeof limit === "number" ? destinations.slice(0, limit) : destinations;

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

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {list.map((dest, i) => {
            const copy = destinationCopy[dest.slug as DestinationSlug];
            return (
              <Reveal key={dest.slug} delay={i * 0.06}>
                <Link href={`/destinations/${dest.slug}`} className="card-surface block">
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={dest.image}
                      alt={copy.name[locale]}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
                    {dest.featured && (
                      <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-navy">
                        {t("featured")}
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="font-display text-2xl text-cream">
                        {copy.name[locale]}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-cream/75">
                        {copy.tagline[locale]}
                      </p>
                      <p className="mt-3 text-sm text-gold-bright">
                        {t("from")} {formatInr(dest.priceFrom)}
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {typeof limit === "number" && (
          <Reveal className="mt-10 text-center">
            <Link href="/destinations" className="btn-ghost">
              {t("viewAll")}
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
