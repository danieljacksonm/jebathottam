"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  experienceCopy,
  kodaiExperiences,
  type ExperienceSlug,
} from "@/data/experiences";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "./Reveal";

export function KodaiExperiences({
  showHeader = true,
}: {
  showHeader?: boolean;
}) {
  const t = useTranslations("experiences");
  const locale = useLocale() as Locale;

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
          {kodaiExperiences.map((item, i) => {
            const copy = experienceCopy[item.slug as ExperienceSlug];
            return (
              <Reveal key={item.slug} delay={i * 0.05}>
                <div className="card-surface relative aspect-[3/4]">
                  <Image
                    src={item.image}
                    alt={copy.name[locale]}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-display text-2xl text-cream">
                      {copy.name[locale]}
                    </h3>
                    <p className="mt-1 text-xs text-cream/75">
                      {copy.tagline[locale]}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 text-center">
          <Link href="/kodaikanal" className="btn-ghost">
            {t("cta")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
