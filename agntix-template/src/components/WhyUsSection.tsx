"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { whyUs } from "@/data/services";
import { Reveal } from "./Reveal";

export function WhyUsSection() {
  const t = useTranslations("why");

  return (
    <section className="section-pad border-y border-[var(--line)] bg-navy-mid/40">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 font-display text-4xl text-cream md:text-5xl">
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {whyUs.map((item, i) => (
            <Reveal key={item.key} delay={i * 0.05}>
              <article className="card-surface relative aspect-[4/5]">
                <Image
                  src={item.image}
                  alt={t(item.key)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="gold-rule mb-3 w-10" />
                  <h3 className="font-display text-xl text-cream">{t(item.key)}</h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
