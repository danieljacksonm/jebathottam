"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MagneticButton } from "./motion";

function splitWords(text: string) {
  return text.split(" ").map((word, i) => (
    <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-1 align-bottom">
      <span data-hero-word className="inline-block translate-y-[110%] opacity-0">
        {word}&nbsp;
      </span>
    </span>
  ));
}

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.querySelectorAll("[data-hero-word]").forEach((n) => {
        (n as HTMLElement).style.transform = "none";
        (n as HTMLElement).style.opacity = "1";
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to("[data-mist-enter]", { opacity: 0, duration: 2.6, delay: 0.2 })
        .to(
          "[data-hero-word]",
          { y: 0, opacity: 1, duration: 1.05, stagger: 0.06 },
          "-=1.4",
        )
        .fromTo(
          "[data-hero-sub]",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.45",
        )
        .fromTo(
          "[data-hero-cta]",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5",
        )
        .fromTo(
          "[data-scroll-hint]",
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          "-=0.3",
        );

      gsap.to("[data-hero-bg]", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={root} className="relative min-h-[100svh] overflow-hidden">
        <div
          data-mist-enter
          className="pointer-events-none absolute inset-0 z-20 bg-[#d8e2ec]"
        />

        <div data-hero-bg className="absolute inset-0 scale-110">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80"
            alt="Kodaikanal morning mist and mountains"
            fill
            priority
            className="object-cover object-[center_30%]"
            sizes="100vw"
          />
        </div>

        <div className="sun-rays absolute inset-0 z-[1]" />
        <div className="hero-veil absolute inset-0 z-[2]" />

        {/* Soft clouds */}
        <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
          <div className="cloud-drift absolute top-[18%] h-24 w-[42vw] rounded-full bg-white/10 blur-3xl" />
          <div
            className="cloud-drift absolute top-[40%] h-32 w-[50vw] rounded-full bg-white/8 blur-3xl"
            style={{ animationDelay: "18s", animationDuration: "70s" }}
          />
        </div>

        {/* Birds — minimal silhouettes */}
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

        {/* Plane + gold trail */}
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
          <p className="mb-5 text-[0.7rem] uppercase tracking-[0.35em] text-gold-bright/90">
            Canaan Travel Hub · Kodaikanal
          </p>
          <h1 className="max-w-4xl font-display text-4xl leading-[1.05] text-white md:text-6xl lg:text-7xl">
            {splitWords("Every Journey Begins With Wonder.")}
          </h1>
          <p
            data-hero-sub
            className="mt-5 max-w-xl font-display text-2xl text-gold-bright/95 opacity-0 md:text-3xl"
          >
            Discover Kodaikanal Like Never Before.
          </p>
          <div data-hero-cta className="mt-10 flex flex-wrap gap-3 opacity-0">
            <Link href="/packages" className="btn-gold glass">
              Explore Experiences
            </Link>
            <MagneticButton
              className="btn-ghost"
              onClick={() => setVideoOpen(true)}
            >
              <Play size={14} />
              Watch Story
            </MagneticButton>
          </div>
        </div>

        <div
          data-scroll-hint
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0"
        >
          <span className="text-[0.62rem] uppercase tracking-[0.28em] text-white/60">
            Scroll
          </span>
          <span className="h-10 w-px bg-gradient-to-b from-gold-bright to-transparent" />
        </div>
      </section>

      <AnimatePresence>
        {videoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-5 backdrop-blur-md"
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="glass-panel relative w-full max-w-3xl overflow-hidden rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
                <p className="text-sm text-white">Kodaikanal story</p>
                <button
                  type="button"
                  className="rounded-full border border-[var(--line)] p-2"
                  onClick={() => setVideoOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex aspect-video items-center justify-center bg-black/50 p-8 text-center text-sm text-mist">
                Embed your cinematic Kodaikanal film here.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
