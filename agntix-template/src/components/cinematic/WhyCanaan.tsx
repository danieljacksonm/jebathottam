"use client";

import { Compass, HeartHandshake, Shield, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useReveal } from "./motion";

const keys = [
  { key: "quiet" as const, icon: Sparkles },
  { key: "specialists" as const, icon: Compass },
  { key: "trusted" as const, icon: Shield },
  { key: "human" as const, icon: HeartHandshake },
];

export function WhyCanaan() {
  const ref = useReveal([]);
  const t = useTranslations("homeCinematic");

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="section-pad bg-navy"
    >
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="max-w-2xl">
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-gold">
            {t("whyCanaanEyebrow")}
          </p>
          <h2 className="mt-4 font-display text-5xl text-white md:text-6xl">
            {t("whyCanaanTitle")}
          </h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {keys.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.key}
                data-reveal
                className="lux-card group p-7 transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(214,166,74,0.15)]"
              >
                <Icon
                  className="h-6 w-6 text-gold transition-transform duration-500 group-hover:scale-110"
                  strokeWidth={1.4}
                />
                <h3 className="mt-6 font-display text-2xl text-white">
                  {t(`whyCanaan.${item.key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                  {t(`whyCanaan.${item.key}.body`)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
