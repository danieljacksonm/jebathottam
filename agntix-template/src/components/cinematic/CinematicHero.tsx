"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HOME_IMAGES } from "@/data/image-registry";
import { BrandFilmModal } from "@/components/film/BrandFilmModal";
import { MagneticCta } from "./MagneticCta";
import { useTranslations } from "next-intl";

function splitWords(text: string) {
  return text.split(" ").map((word, i) => (
    <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-1 align-bottom">
      <span data-hero-word className="inline-block" style={{ animationDelay: `${i * 35}ms` }}>
        {word}&nbsp;
      </span>
    </span>
  ));
}

/** Premium home hero — mist entrance, word stagger, scroll parallax. Fast, GPU-friendly. */
export function CinematicHero() {
  const root = useRef<HTMLElement>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const t = useTranslations("homeCinematic");
  const tv = useTranslations("video");
  const heroTitle = t("heroTitle");

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    let cancelled = false;
    let revert: (() => void) | null = null;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.to("[data-hero-bg]", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }, el);
      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <>
      <section ref={root} className="relative min-h-[100svh] overflow-hidden">
        <div
          data-mist-enter
          className="pointer-events-none absolute inset-0 z-20 bg-[#d8e2ec]"
        />

        <div data-hero-bg className="absolute inset-0 scale-110 will-change-transform">
          <Image
            src={HOME_IMAGES.hero.src}
            alt={HOME_IMAGES.hero.alt}
            fill
            priority
            quality={75}
            className="object-cover object-[center_35%]"
            sizes="100vw"
          />
        </div>

        <div className="sun-rays absolute inset-0 z-[1]" />
        <div className="hero-veil absolute inset-0 z-[2]" />

        <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
          <div className="cloud-drift absolute top-[18%] h-24 w-[42vw] rounded-full bg-white/10 blur-3xl" />
          <div
            className="cloud-drift absolute top-[40%] h-32 w-[50vw] rounded-full bg-white/8 blur-3xl"
            style={{ animationDelay: "18s", animationDuration: "70s" }}
          />
        </div>

        <div className="pointer-events-none absolute left-[16%] top-[26%] z-[4] opacity-45">
          <svg className="bird" width="18" height="10" viewBox="0 0 18 10">
            <path d="M1 6 Q5 1 9 5 Q13 1 17 6" stroke="white" strokeWidth="1" fill="none" />
          </svg>
          <svg
            className="bird ml-8 mt-2"
            width="14"
            height="8"
            viewBox="0 0 18 10"
            style={{ animationDelay: "1.4s" }}
          >
            <path d="M1 6 Q5 1 9 5 Q13 1 17 6" stroke="white" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <div className="plane-fly pointer-events-none absolute left-0 top-0 z-[5]">
          <div className="relative flex items-center">
            <div className="h-px w-36 bg-gradient-to-l from-gold-bright/90 via-gold/50 to-transparent" />
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gold-bright">
              <path
                d="M2 12l9 2 9-8-2 9 2 7-7-3-5 4v-5l-6-2z"
                fill="currentColor"
                opacity="0.95"
              />
            </svg>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-28 pt-32 md:justify-center md:px-8 md:pb-24">
          <p
            data-hero-brand
            className="mb-4 font-script text-4xl text-gold-bright md:text-5xl"
          >
            Canaan
          </p>
          <p className="mb-5 text-[0.7rem] uppercase tracking-[0.35em] text-gold-bright/90">
            {t("heroEyebrow")}
          </p>
          <h1 className="max-w-4xl font-display text-4xl leading-[1.05] text-white md:text-6xl lg:text-7xl">
            {splitWords(heroTitle)}
          </h1>
          <p
            data-hero-sub
            className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
          >
            {t("heroSub")}
          </p>
          <div data-hero-cta className="mt-10 flex flex-wrap items-center gap-3">
            <MagneticCta href="/destinations" className="btn-gold glass">
              {t("heroExplore")}
              <span data-mag-arrow>→</span>
            </MagneticCta>
            <Link href="/plan-your-trip" className="btn-ghost">
              {t("heroPlan")}
            </Link>
            <button
              type="button"
              className="btn-ghost !border-transparent text-white/70 hover:text-gold"
              onClick={() => setVideoOpen(true)}
            >
              <Play size={14} />
              {t("heroWatch")}
            </button>
          </div>
        </div>

        <div
          data-scroll-hint
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-[0.62rem] uppercase tracking-[0.28em] text-white/60">
            {t("heroScroll")}
          </span>
          <span className="h-10 w-px bg-gradient-to-b from-gold-bright to-transparent" />
        </div>
      </section>

      <BrandFilmModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        title={t("heroStoryTitle")}
        closeLabel={tv("close")}
      />
    </>
  );
}
