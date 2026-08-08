"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cinematicExperiences } from "@/data/cinematic";
import { safeRevert } from "@/lib/gsap-safe";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  /** Pin scroll (home). Off on inner pages to avoid DOM conflicts. */
  pinned?: boolean;
};

export function ImmersiveExperiences({ pinned = true }: Props) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const row = track.current;
    if (!sec || !row) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!pinned) {
      // Native horizontal scroll — no GSAP pin
      return;
    }

    let ctx: gsap.Context | null = null;
    const id = window.requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const getScroll = () =>
          Math.max(0, row.scrollWidth - window.innerWidth + 80);

        gsap.to(row, {
          x: () => -getScroll(),
          ease: "none",
          scrollTrigger: {
            trigger: sec,
            start: "top top",
            end: () => `+=${getScroll()}`,
            scrub: 1,
            pin: true,
            pinType: "fixed",
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, sec);
    });

    return () => {
      window.cancelAnimationFrame(id);
      safeRevert(ctx);
    };
  }, [pinned]);

  return (
    <div className="relative">
      <section ref={section} className="relative overflow-hidden bg-navy">
        <div className="px-5 pb-8 pt-24 md:px-8">
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-gold">
            Immersive experiences
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-5xl text-white md:text-6xl">
            Drift through the hills.
          </h2>
        </div>

        <div
          className={`relative ${
            pinned
              ? "h-[70vh] md:h-[78vh]"
              : "overflow-x-auto pb-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          }`}
        >
          <div
            ref={track}
            className={
              pinned
                ? "absolute left-0 top-0 flex h-full items-stretch gap-6 px-5 will-change-transform md:px-8"
                : "flex w-max items-stretch gap-6 px-5 md:px-8"
            }
          >
            {cinematicExperiences.map((item) => (
              <article
                key={item.id}
                className="lux-card group relative h-[min(70vh,560px)] w-[78vw] shrink-0 self-center overflow-hidden sm:w-[52vw] md:h-[min(68vh,520px)] md:w-[38vw] lg:w-[28vw]"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-3xl text-white">{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
