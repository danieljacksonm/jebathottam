"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { filmScenes } from "@/data/film";
import { AtmosphereLayer } from "./AtmosphereLayer";
import { safeRevert } from "@/lib/gsap-safe";

gsap.registerPlugin(ScrollTrigger);

/**
 * Sticky CSS for linger (no GSAP pin) — avoids removeChild on route change.
 * Light scrub only on backgrounds/copy.
 */
export function KodaiFilmJourney() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | null = null;
    const frame = window.requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const scenes = gsap.utils.toArray<HTMLElement>("[data-scene]");

        scenes.forEach((scene) => {
          const bg = scene.querySelector("[data-scene-bg]");
          const glass = scene.querySelector("[data-scene-glass]");
          const copy = scene.querySelectorAll("[data-scene-copy]");

          if (bg) {
            gsap.fromTo(
              bg,
              { scale: 1.12 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: scene,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          }

          gsap.fromTo(
            copy,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: scene,
                start: "top 60%",
                toggleActions: "play none none reverse",
              },
            },
          );

          if (glass) {
            gsap.fromTo(
              glass,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: scene,
                  start: "top 55%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }
        });
      }, el);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      safeRevert(ctx);
    };
  }, []);

  return (
    <section ref={root} className="relative bg-navy">
      {filmScenes.map((scene, index) => {
        const minimal = scene.id === "berijam";
        return (
          <article key={scene.id} data-scene className="relative h-[145vh]">
            <div className="sticky top-0 flex h-[100svh] items-end overflow-hidden md:items-center">
              <div data-scene-bg className="absolute inset-0 will-change-transform">
                <Image
                  src={scene.image}
                  alt={scene.place}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index < 2}
                />
              </div>

              <div
                className="absolute inset-0 z-[1]"
                style={{
                  background:
                    scene.tone === "night"
                      ? "linear-gradient(180deg, rgba(4,22,43,0.35), rgba(4,22,43,0.82))"
                      : scene.tone === "gold"
                        ? "linear-gradient(180deg, rgba(4,22,43,0.15), rgba(4,22,43,0.72))"
                        : "linear-gradient(180deg, rgba(4,22,43,0.25), rgba(4,22,43,0.78))",
                }}
              />

              <div className="absolute inset-0 z-[2]">
                <AtmosphereLayer tone={scene.tone} />
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-32 bg-gradient-to-b from-transparent to-navy/70" />

              <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-28 md:flex-row md:items-end md:justify-between md:px-8 md:pb-24">
                <div className={minimal ? "max-w-md" : "max-w-2xl"}>
                  <p
                    data-scene-copy
                    className="text-[0.68rem] uppercase tracking-[0.34em] text-gold-bright"
                  >
                    {String(index + 1).padStart(2, "0")} · {scene.place}
                  </p>
                  {scene.quote ? (
                    <h2
                      data-scene-copy
                      className="mt-5 font-display text-4xl leading-[1.08] text-white md:text-6xl"
                    >
                      {scene.quote}
                    </h2>
                  ) : (
                    <h2
                      data-scene-copy
                      className="mt-5 font-display text-5xl text-white/90 md:text-7xl"
                    >
                      {scene.place}
                    </h2>
                  )}
                  {scene.note && (
                    <p
                      data-scene-copy
                      className={`mt-5 text-soft-gray ${minimal ? "text-sm" : "text-lg"}`}
                    >
                      {scene.note}
                    </p>
                  )}
                </div>

                {!minimal && (
                  <div
                    data-scene-glass
                    className="glass-panel max-w-sm rounded-3xl p-6 opacity-0 md:mb-2"
                  >
                    <p className="text-[0.65rem] uppercase tracking-[0.22em] text-gold">
                      In the film of your day
                    </p>
                    <p className="mt-3 font-display text-2xl text-white">
                      {scene.place}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-soft-gray">
                      Stay with this frame. Let the air settle before you move on.
                    </p>
                  </div>
                )}
              </div>

              {scene.tone === "falls" && (
                <div className="pointer-events-none absolute inset-0 z-[4] opacity-40">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute h-8 w-px bg-gradient-to-b from-white/0 via-white/50 to-white/0"
                      style={{
                        left: `${10 + i * 6}%`,
                        top: `${12 + (i % 4) * 8}%`,
                        animation: `fall-drop ${1.2 + (i % 4) * 0.3}s linear infinite`,
                        animationDelay: `${i * 0.08}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {scene.tone === "night" && (
                <div className="pointer-events-none absolute bottom-[18%] left-[12%] z-[4] h-16 w-16 rounded-full bg-orange-400/30 blur-2xl" />
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}
