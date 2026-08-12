"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { localizeTimeline } from "@/data/cinematic";
import { useLocale, useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

export function TravelTimeline() {
  const root = useRef<HTMLElement>(null);
  const locale = useLocale();
  const t = useTranslations("homeCinematic");
  const beats = localizeTimeline(locale);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const panels = gsap.utils.toArray<HTMLElement>("[data-beat]");
    const ctx = gsap.context(() => {
      panels.forEach((panel) => {
        gsap.fromTo(
          panel.querySelectorAll("[data-beat-text]"),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 55%",
              end: "bottom 40%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="bg-navy-mid">
      <div className="mx-auto max-w-4xl px-5 py-20 text-center md:px-8">
        <p className="text-[0.7rem] uppercase tracking-[0.32em] text-gold">
          {t("timelineEyebrow")}
        </p>
        <h2 className="mt-4 font-display text-5xl text-white md:text-6xl">
          {t("timelineTitle")}
        </h2>
      </div>

      {beats.map((beat, i) => (
        <div
          key={beat.id}
          data-beat
          className="relative flex min-h-[85svh] items-center justify-center border-t border-[var(--line)] px-5"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                i % 2 === 0
                  ? "radial-gradient(ellipse at 30% 40%, rgba(214,166,74,0.12), transparent 50%)"
                  : "radial-gradient(ellipse at 70% 50%, rgba(244,210,122,0.1), transparent 50%)",
            }}
          />
          <div className="relative z-10 max-w-3xl text-center">
            <p
              data-beat-text
              className="text-[0.7rem] uppercase tracking-[0.35em] text-gold"
            >
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3
              data-beat-text
              className="mt-5 font-display text-5xl text-white md:text-7xl"
            >
              {beat.title}
            </h3>
            <p
              data-beat-text
              className="mx-auto mt-6 max-w-xl text-lg text-soft-gray md:text-xl"
            >
              {beat.line}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
