"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";

const stepKeys = ["step1", "step2", "step3", "step4"] as const;

export function HowItWorksSection() {
  const t = useTranslations("howItWorks");

  return (
    <section className="section-pad border-y border-[var(--line)] bg-navy-mid/25">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 font-display text-4xl text-cream md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-mist/90">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stepKeys.map((key, index) => (
            <Reveal key={key} delay={index * 0.05}>
              <article className="card-surface h-full p-6">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold-bright">
                  0{index + 1}
                </p>
                <h3 className="mt-3 font-display text-2xl text-white">
                  {t(`${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                  {t(`${key}.body`)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
