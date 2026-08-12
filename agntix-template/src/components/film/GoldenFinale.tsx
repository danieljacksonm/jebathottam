"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLocalizedPlaceRibbon } from "@/data/film";
import { safeRevert } from "@/lib/gsap-safe";
import { useLocale, useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

export function GoldenFinale() {
  const root = useRef<HTMLElement>(null);
  const locale = useLocale();
  const t = useTranslations("film");
  const ribbon = getLocalizedPlaceRibbon(locale);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | null = null;
    const frame = window.requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-finale-copy]",
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 60%" },
          },
        );
        gsap.to("[data-finale-bg]", {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }, el);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      safeRevert(ctx);
    };
  }, []);

  return (
    <section ref={root} className="relative min-h-[100svh] overflow-hidden">
      <div data-finale-bg className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80"
          alt="Golden sunrise over Kodaikanal"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-navy/55 to-navy" />
      <div className="sun-rays absolute inset-0 opacity-70" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-5 text-center">
        <p
          data-finale-copy
          className="text-[0.7rem] uppercase tracking-[0.34em] text-gold-bright"
        >
          {t("finaleEyebrow")}
        </p>
        <h2
          data-finale-copy
          className="mt-6 font-display text-5xl text-white md:text-7xl"
        >
          {t("finaleTitle")}
        </h2>
        <p
          data-finale-copy
          className="mt-6 max-w-xl text-lg text-soft-gray md:text-xl"
        >
          {t("finaleBody")}
        </p>
      </div>

      <div className="relative z-10 overflow-hidden border-y border-[var(--line)] bg-navy/70 py-4 backdrop-blur-md">
        <div className="flex w-max gap-10 whitespace-nowrap px-4 cloud-drift" style={{ animationDuration: "40s" }}>
          {[...ribbon, ...ribbon].map((place, i) => (
            <span
              key={`${place}-${i}`}
              className="text-[0.72rem] uppercase tracking-[0.22em] text-gold/80"
            >
              {place}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
