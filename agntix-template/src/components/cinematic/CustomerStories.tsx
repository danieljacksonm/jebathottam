"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { testimonials } from "@/data/testimonials";
import type { Locale } from "@/i18n/routing";
import { useReveal } from "./motion";

export function CustomerStories() {
  const locale = useLocale() as Locale;
  const t = useTranslations("homeCinematic");
  const [index, setIndex] = useState(0);
  const ref = useReveal([]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((v) => (v + 1) % testimonials.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, []);

  const item = testimonials[index];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="section-pad relative overflow-hidden bg-navy"
    >
      <div className="mx-auto max-w-5xl text-center">
        <p data-reveal className="text-[0.7rem] uppercase tracking-[0.32em] text-gold">
          {t("storiesEyebrow")}
        </p>
        <div data-reveal className="glass-panel relative mx-auto mt-10 min-h-[280px] rounded-[2rem] px-8 py-14 md:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-3xl leading-snug text-white md:text-5xl">
                “{item.text[locale]}”
              </p>
              <p className="mt-8 text-gold-bright">{item.name}</p>
              <p className="mt-1 text-sm text-mist">{item.place}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              aria-label={`Story ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-gold-bright" : "w-3 bg-white/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
