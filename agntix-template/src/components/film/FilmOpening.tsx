"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AtmosphereLayer } from "./AtmosphereLayer";
import { safeRevert } from "@/lib/gsap-safe";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

function LetterLine({ text }: { text: string }) {
  return (
    <span>
      {text.split("").map((ch, i) => (
        <span key={`${ch}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span
            data-letter
            className="inline-block translate-y-[120%] opacity-0"
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        </span>
      ))}
    </span>
  );
}

export function FilmOpening() {
  const root = useRef<HTMLElement>(null);
  const t = useTranslations("film");
  const line1 = t("openLine1");
  const line2 = t("openLine2");
  const hint = t("openHint");
  const brandSub = t("brandSub");

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      el.querySelectorAll("[data-letter]").forEach((n) => {
        const node = n as HTMLElement;
        node.style.transform = "none";
        node.style.opacity = "1";
      });
      const mist = el.querySelector("[data-open-mist]") as HTMLElement | null;
      if (mist) mist.style.opacity = "0";
      el.querySelectorAll("[data-logo-fade],[data-second-line],[data-open-hint]").forEach(
        (n) => {
          (n as HTMLElement).style.opacity = "1";
        },
      );
      return;
    }

    let ctx: gsap.Context | null = null;
    const frame = window.requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to("[data-open-mist]", { opacity: 0, duration: 3.2, delay: 0.3 })
          .fromTo(
            "[data-logo-fade]",
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 1.4 },
            "-=2.1",
          )
          .to(
            "[data-letter]",
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.028,
              ease: "power3.out",
            },
            "-=0.55",
          )
          .fromTo(
            "[data-second-line]",
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 1.1 },
            "-=0.25",
          )
          .fromTo(
            "[data-open-hint]",
            { opacity: 0 },
            { opacity: 0.85, duration: 1 },
            "-=0.2",
          );

        gsap.to("[data-open-bg]", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
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
  }, [line1]);

  return (
    <section ref={root} className="relative min-h-[100svh] overflow-hidden">
      <div data-open-mist className="pointer-events-none absolute inset-0 z-30 bg-[#d9e4ee]" />

      <div data-open-bg className="absolute inset-0 scale-[1.12]">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80"
          alt="Kodaikanal mist and mountains at dawn"
          fill
          priority
          className="object-cover object-[center_28%]"
          sizes="100vw"
        />
      </div>

      <div className="sun-rays absolute inset-0 z-[1]" />
      <div className="hero-veil absolute inset-0 z-[2]" />
      <div className="relative z-[3] h-full">
        <AtmosphereLayer tone="gold" />
      </div>

      <div className="plane-fly pointer-events-none absolute left-0 top-0 z-[6]">
        <div className="flex items-center">
          <div className="h-px w-44 bg-gradient-to-l from-gold-bright via-gold/60 to-transparent" />
          <svg width="26" height="26" viewBox="0 0 24 24" className="text-gold-bright">
            <path
              d="M2.5 12.5l8.5 1.8L21 5l-2.2 9.2 1.7 6.3-6.5-2.8-4.4 3.5v-4.6L2.5 12.5z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-5 text-center">
        <div data-logo-fade className="mb-10 opacity-0">
          <Image
            src="/brand/canaan-logo.jpeg"
            alt="Canaan Travel Hub"
            width={88}
            height={88}
            className="mx-auto h-20 w-20 rounded-full object-cover ring-1 ring-gold/50 md:h-24 md:w-24"
            priority
          />
          <p className="mt-4 font-script text-4xl text-gold-bright md:text-5xl">
            Canaan
          </p>
          <p className="mt-1 text-[0.62rem] uppercase tracking-[0.36em] text-white/70">
            {brandSub}
          </p>
        </div>

        <h1 className="font-display text-4xl leading-[1.08] text-white md:text-6xl lg:text-7xl">
          <LetterLine text={line1} />
        </h1>
        <p
          data-second-line
          className="mt-6 font-display text-2xl text-gold-bright opacity-0 md:text-4xl"
        >
          {line2}
        </p>
        <p
          data-open-hint
          className="mt-14 text-[0.65rem] uppercase tracking-[0.35em] text-white/55 opacity-0"
        >
          {hint}
        </p>
        <span
          data-open-hint
          className="mt-3 h-12 w-px bg-gradient-to-b from-gold-bright to-transparent opacity-0"
        />
      </div>
    </section>
  );
}
