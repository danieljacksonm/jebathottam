"use client";

import { Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { stats, testimonials } from "@/data/testimonials";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "./Reveal";

export function TestimonialsSection() {
  const t = useTranslations("testimonials");
  const ts = useTranslations("stats");
  const locale = useLocale() as Locale;

  return (
    <section className="section-pad border-t border-[var(--line)]">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <Reveal>
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 font-display text-4xl text-cream md:text-5xl">
              {t("title")}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.06}>
                <article className="card-surface h-full p-5">
                  <p className="font-display text-4xl leading-none text-gold/70">“</p>
                  <div className="mt-2 flex gap-0.5 text-gold-bright">
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star key={idx} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-cream/80">
                    {item.text[locale]}
                  </p>
                  <p className="mt-5 text-sm text-gold-bright">{item.name}</p>
                  <p className="text-xs text-mist/60">{item.place}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1} className="flex flex-col justify-center gap-8 lg:pl-6">
          {stats.map((s) => (
            <div key={s.key} className="border-b border-[var(--line)] pb-6 last:border-0">
              <p className="font-display text-4xl text-gold-bright md:text-5xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.16em] text-mist">
                {ts(s.key)}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
