"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { localizeWhyStats } from "@/data/cinematic";
import { safeRevert } from "@/lib/gsap-safe";
import { useLocale, useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

export function WhyKodaikanal() {
  const root = useRef<HTMLElement>(null);
  const locale = useLocale();
  const t = useTranslations("homeCinematic");
  const stats = localizeWhyStats(locale);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | null = null;
    const frame = window.requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-why-copy] > *",
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 70%" },
          },
        );

        gsap.fromTo(
          "[data-why-image]",
          { opacity: 0, scale: 1.08 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 70%" },
          },
        );

        el.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
          const end = Number(node.dataset.count || 0);
          const obj = { val: 0 };
          gsap.to(obj, {
            val: end,
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: { trigger: node, start: "top 85%" },
            onUpdate: () => {
              node.textContent = `${Math.floor(obj.val)}`;
            },
          });
        });
      }, el);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      safeRevert(ctx);
    };
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden bg-navy-mid">
      <div className="mx-auto grid min-h-[90svh] max-w-7xl items-center gap-10 px-5 py-24 md:grid-cols-2 md:px-8 lg:gap-16">
        <div data-why-copy className="relative z-10 max-w-xl">
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-gold">
            {t("whyKodaiEyebrow")}
          </p>
          <h2
            className="mt-5 font-display text-5xl text-white md:text-6xl"
            data-cursor="explore"
          >
            {t("whyKodaiTitle")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-soft-gray">
            {t("whyKodaiBody")}
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="border-t border-[var(--line)] pt-4">
                <p className="font-display text-3xl text-gold-bright md:text-4xl">
                  <span data-count={stat.value}>0</span>
                  {stat.suffix}
                </p>
                <p className="mt-2 text-[0.68rem] uppercase tracking-[0.16em] text-mist">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          data-why-image
          className="relative aspect-[4/5] overflow-hidden rounded-[2rem] opacity-0"
        >
          <Image
            src="/images/kodai/mannavanur.webp"
            alt="Kodaikanal editorial landscape"
            fill
            className="object-cover transition-transform duration-[1.4s] ease-out hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            data-cursor="explore"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
