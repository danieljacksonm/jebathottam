"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { safeRevert } from "@/lib/gsap-safe";

gsap.registerPlugin(ScrollTrigger);

function hourFromProgress(p: number): "dawn" | "day" | "gold" | "sunset" | "night" {
  if (p < 0.18) return "dawn";
  if (p < 0.42) return "day";
  if (p < 0.62) return "gold";
  if (p < 0.8) return "sunset";
  return "night";
}

export function JourneyAtmosphere() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    if (reduce) return;
    // Keep fog CSS-only on mobile; GSAP plane/clouds are desktop-only.
    if (mobile) {
      document.documentElement.dataset.kodaiHour = "day";
      return;
    }

    let ctx: gsap.Context | null = null;
    const frame = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const fog = el.querySelectorAll("[data-fog]");
        const clouds = el.querySelectorAll("[data-cloud]");
        const plane = el.querySelector("[data-plane]");

        gsap.to(fog, {
          xPercent: 18,
          opacity: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.4,
          },
        });

        clouds.forEach((cloud, i) => {
          gsap.to(cloud, {
            xPercent: i % 2 === 0 ? 40 : -28,
            ease: "none",
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.8 + i * 0.2,
            },
          });
        });

        if (plane && !mobile) {
          gsap.fromTo(
            plane,
            { x: "-12vw", y: "18vh", opacity: 0, rotate: -8 },
            {
              keyframes: [
                { x: "18vw", y: "10vh", opacity: 1, rotate: 6, duration: 0.18 },
                { x: "42vw", y: "28vh", opacity: 0.15, rotate: -4, duration: 0.22 },
                { x: "58vw", y: "16vh", opacity: 1, rotate: 10, duration: 0.2 },
                { x: "88vw", y: "8vh", opacity: 0.9, rotate: -2, duration: 0.22 },
                { x: "110vw", y: "22vh", opacity: 0, rotate: 8, duration: 0.18 },
              ],
              ease: "none",
              scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.2,
              },
            },
          );
        }

        ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const hour = hourFromProgress(self.progress);
            if (document.documentElement.dataset.kodaiHour !== hour) {
              document.documentElement.dataset.kodaiHour = hour;
            }
          },
        });
      }, el);
    });

    return () => {
      cancelAnimationFrame(frame);
      safeRevert(ctx);
      delete document.documentElement.dataset.kodaiHour;
    };
  }, []);

  return (
    <div
      ref={root}
      className="pointer-events-none fixed inset-0 z-[6] overflow-hidden"
      aria-hidden
    >
      <div className="kodai-hour-veil absolute inset-0" />

      <div
        data-fog
        className="absolute -left-[20%] top-[8%] h-48 w-[70%] rounded-full bg-white/12 blur-3xl"
      />
      <div
        data-fog
        className="absolute left-[10%] top-[42%] h-56 w-[80%] rounded-full bg-white/8 blur-3xl"
      />
      <div
        data-fog
        className="absolute -right-[15%] bottom-[18%] h-40 w-[55%] rounded-full bg-white/10 blur-3xl"
      />

      <div
        data-cloud
        className="absolute left-[-10%] top-[14%] h-24 w-[38%] rounded-full bg-white/10 blur-2xl"
      />
      <div
        data-cloud
        className="absolute right-[-8%] top-[28%] h-20 w-[32%] rounded-full bg-white/8 blur-2xl"
      />
      <div
        data-cloud
        className="absolute left-[20%] top-[58%] h-16 w-[28%] rounded-full bg-white/6 blur-2xl"
      />

      <div data-plane className="absolute left-0 top-0 hidden md:block">
        <div className="flex items-center">
          <div className="h-px w-28 bg-gradient-to-l from-gold-bright/80 via-gold/40 to-transparent" />
          <svg width="22" height="22" viewBox="0 0 24 24" className="text-gold-bright">
            <path
              d="M2.5 12.5l8.5 1.8L21 5l-2.2 9.2 1.7 6.3-6.5-2.8-4.4 3.5v-4.6L2.5 12.5z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
