"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { AtmosphereLayer } from "./AtmosphereLayer";
import { BrandFilmModal } from "./BrandFilmModal";
import { afterFirstPaint, isMobileLite } from "@/lib/perf";
import { HERO_IMAGE } from "@/lib/media";
import { useTranslations } from "next-intl";

function LetterLine({ text }: { text: string }) {
  return (
    <span>
      {text.split("").map((ch, i) => (
        <span key={`${ch}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span data-letter className="inline-block">
            {ch === " " ? "\u00A0" : ch}
          </span>
        </span>
      ))}
    </span>
  );
}

export function FilmOpening() {
  const root = useRef<HTMLElement>(null);
  const [filmOpen, setFilmOpen] = useState(false);
  const t = useTranslations("film");
  const tv = useTranslations("video");
  const line1 = t("openLine1");
  const line2 = t("openLine2");
  const hint = t("openHint");
  const brandSub = t("brandSub");

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lite = isMobileLite();

    // CSS already shows the opening on mobile. Do not touch LCP nodes after paint.
    if (reduce || lite) {
      return;
    }

    let cancelled = false;
    let cleanupMove: (() => void) | null = null;
    let revert: (() => void) | null = null;

    const stop = afterFirstPaint(() => {
      void (async () => {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled || !root.current) return;
        gsap.registerPlugin(ScrollTrigger);

        const { safeRevert } = await import("@/lib/gsap-safe");
        const host = root.current;
        let onMove: ((e: MouseEvent) => void) | null = null;

        const ctx = gsap.context(() => {
          const layers = host.querySelectorAll<HTMLElement>("[data-depth]");
          const fine = window.matchMedia("(pointer: fine)").matches;

          const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
          tl.fromTo(
            "[data-open-bg]",
            { scale: 1.12, yPercent: 2 },
            { scale: 1.04, yPercent: 0, duration: 2.2 },
          )
            .to("[data-open-mist]", { opacity: 0, duration: 2.2 }, 0)
            .fromTo("[data-open-sun]", { opacity: 0 }, { opacity: 0.8, duration: 1.6 }, 0.3)
            .fromTo(
              "[data-logo-fade]",
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 1 },
              0.5,
            )
            .fromTo(
              "[data-letter]",
              { y: "120%", opacity: 0 },
              { y: "0%", opacity: 1, duration: 0.7, stagger: 0.02, ease: "power3.out" },
              0.85,
            )
            .fromTo(
              "[data-second-line]",
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.9 },
              1.2,
            )
            .fromTo("[data-open-hint]", { opacity: 0 }, { opacity: 0.85, duration: 0.7 }, 1.45)
            .fromTo(
              "[data-traveler]",
              { opacity: 0, y: 18 },
              { opacity: 0.7, y: 0, duration: 1.1 },
              1.1,
            );

          gsap.to("[data-open-bg]", {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: host,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          if (fine) {
            onMove = (e: MouseEvent) => {
              const r = host.getBoundingClientRect();
              const px = (e.clientX - r.left) / r.width - 0.5;
              const py = (e.clientY - r.top) / r.height - 0.5;
              layers.forEach((layer) => {
                const d = Number(layer.dataset.depth || 0);
                gsap.to(layer, {
                  x: px * d * 14,
                  y: py * d * 8,
                  duration: 1,
                  ease: "power3.out",
                  overwrite: "auto",
                });
              });
            };
            host.addEventListener("mousemove", onMove);
          }
        }, host);

        cleanupMove = () => {
          if (onMove) host.removeEventListener("mousemove", onMove);
        };
        revert = () => safeRevert(ctx);
      })();
    }, 120);

    return () => {
      cancelled = true;
      stop();
      cleanupMove?.();
      revert?.();
    };
  }, [line1]);

  return (
    <section ref={root} className="relative min-h-[100svh] overflow-hidden">
      <div
        data-open-mist
        className="pointer-events-none absolute inset-0 z-30 bg-[#cfdbe8] opacity-0 transition-opacity duration-0 md:opacity-100 md:duration-[2.4s]"
      />

      <div data-depth="1" className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#6b8aa8_0%,#1a2c40_55%,#04162b_100%)]" />
      </div>

      <div data-open-bg data-depth="3" className="absolute inset-0 scale-[1.06] will-change-transform">
        <Image
          src={HERO_IMAGE}
          alt="Kodaikanal mist and mountains at dawn"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-[center_28%]"
          sizes="(max-width: 768px) 100vw, 1200px"
          quality={58}
        />
      </div>

      <div
        data-depth="4"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[42%] bg-gradient-to-t from-[#04162b] via-[#04162b]/55 to-transparent"
      />

      <div data-open-sun className="sun-rays absolute inset-0 z-[1] opacity-40 md:opacity-0" />
      <div className="hero-veil absolute inset-0 z-[2]" />
      <div className="relative z-[3] hidden h-full md:block" data-depth="2">
        <AtmosphereLayer tone="gold" />
      </div>

      <svg
        data-traveler
        data-depth="5"
        className="pointer-events-none absolute bottom-[9%] left-[8%] z-[6] hidden h-28 w-20 opacity-0 md:block"
        viewBox="0 0 80 120"
        fill="none"
        aria-hidden
      >
        <path
          d="M40 18c6 0 10 5 10 11s-4 11-10 11-10-5-10-11 4-11 10-11z"
          fill="rgba(4,22,43,0.72)"
        />
        <path
          d="M28 44c4 10 8 14 12 38 4-24 8-28 12-38-8 4-16 4-24 0z"
          fill="rgba(4,22,43,0.62)"
        />
        <path d="M36 82l-6 30M44 82l6 30" stroke="rgba(4,22,43,0.7)" strokeWidth="3" />
      </svg>

      <div
        data-hero-copy
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-5 text-center"
        data-depth="6"
      >
        <div data-logo-fade className="mb-10 opacity-100 md:opacity-0">
          <Image
            src="/brand/canaan-logo.jpeg"
            alt="Canaan Travel Hub"
            width={72}
            height={72}
            className="mx-auto h-16 w-16 rounded-full object-cover ring-1 ring-gold/50 md:h-20 md:w-20"
            priority
          />
          <p className="mt-4 font-script text-4xl text-gold-bright md:text-5xl">Canaan</p>
          <p className="mt-1 text-[0.62rem] uppercase tracking-[0.36em] text-white/70">
            {brandSub}
          </p>
        </div>

        <h1 className="font-display text-4xl leading-[1.08] text-white md:text-6xl lg:text-7xl">
          <LetterLine text={line1} />
        </h1>
        <p
          data-second-line
          className="mt-6 font-display text-2xl text-gold-bright opacity-100 md:opacity-0 md:text-4xl"
        >
          {line2}
        </p>
        <p
          data-open-hint
          className="mt-14 text-[0.65rem] uppercase tracking-[0.35em] text-white/55 opacity-100 md:opacity-0"
        >
          {hint}
        </p>
        <span
          data-open-hint
          className="mt-3 h-12 w-px bg-gradient-to-b from-gold-bright to-transparent opacity-100 md:opacity-0"
        />
        <button
          type="button"
          data-open-hint
          onClick={() => setFilmOpen(true)}
          className="btn-ghost mt-8 inline-flex items-center gap-2 opacity-100 md:opacity-0"
        >
          <Play size={14} aria-hidden />
          {t("watchFilm")}
        </button>
      </div>
      <BrandFilmModal
        open={filmOpen}
        onClose={() => setFilmOpen(false)}
        title={tv("title")}
        closeLabel={tv("close")}
      />
    </section>
  );
}
