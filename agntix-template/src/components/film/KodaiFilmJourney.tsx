"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AtmosphereLayer } from "./AtmosphereLayer";
import { safeRevert } from "@/lib/gsap-safe";
import { useLocale, useTranslations } from "next-intl";
import { getLocalizedFilmScenes } from "@/data/film";

gsap.registerPlugin(ScrollTrigger);

const GIANT: Record<string, string> = {
  "dolphins-nose": "MOUNTAIN",
  "coakers-walk": "MIST",
  "pillar-rocks": "STONE",
  "kodai-lake": "LAKE",
  "pine-forest": "FOREST",
  poombarai: "VILLAGE",
  mannavanur: "MEADOW",
  berijam: "STILL",
  "silver-cascade": "FALLS",
  camping: "NIGHT",
};

export function KodaiFilmJourney() {
  const root = useRef<HTMLElement>(null);
  const locale = useLocale();
  const t = useTranslations("film");
  const j = useTranslations("journey");
  const scenes = getLocalizedFilmScenes(locale);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lite = window.matchMedia("(max-width: 768px)").matches;
    let ctx: gsap.Context | null = null;
    const frame = window.requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const nodes = gsap.utils.toArray<HTMLElement>("[data-scene]");

        nodes.forEach((scene) => {
          const id = scene.dataset.sceneId || "";
          const bg = scene.querySelector("[data-scene-bg]");
          const glass = scene.querySelector("[data-scene-glass]");
          const copy = scene.querySelectorAll("[data-scene-copy]");
          const giant = scene.querySelector("[data-giant]");
          const veil = scene.querySelector("[data-scene-veil]");

          // Mobile: only light fade-in copy — no heavy scrub camera work.
          if (lite) {
            gsap.fromTo(
              copy,
              { opacity: 0, y: 18 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.06,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: scene,
                  start: "top 70%",
                  toggleActions: "play none none reverse",
                },
              },
            );
            return;
          }

          if (bg) {
            const from: gsap.TweenVars = { scale: 1.16 };
            const to: gsap.TweenVars = {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: scene,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.05,
              },
            };
            if (id === "pillar-rocks") {
              from.yPercent = 12;
              to.yPercent = -8;
            } else if (id === "poombarai") {
              from.xPercent = -8;
              to.xPercent = 8;
            } else if (id === "kodai-lake" || id === "berijam") {
              from.scale = 1.08;
              to.scale = 1.18;
            } else if (id === "dolphins-nose") {
              from.scale = 1.28;
              to.scale = 1;
            } else if (id === "silver-cascade") {
              from.yPercent = -18;
              from.clipPath = "inset(0% 0 100% 0)";
              to.yPercent = 0;
              to.clipPath = "inset(0% 0 0% 0)";
            }
            gsap.fromTo(bg, from, to);
          }

          if (veil) {
            gsap.fromTo(
              veil,
              { opacity: id === "dolphins-nose" || id === "camping" ? 0.72 : 0.28 },
              {
                opacity: id === "camping" ? 0.45 : 0.08,
                ease: "none",
                scrollTrigger: {
                  trigger: scene,
                  start: "top 80%",
                  end: "center center",
                  scrub: 1,
                },
              },
            );
          }

          gsap.fromTo(
            copy,
            {
              opacity: 0,
              y: id === "dolphins-nose" ? 10 : 36,
              scale: id === "dolphins-nose" ? 1.18 : 1,
            },
            {
              opacity: 1,
              y: 0,
              scale: id === "dolphins-nose" ? 0.92 : 1,
              duration: id === "mannavanur" ? 1.6 : 1.05,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: scene,
                start: "top 58%",
                toggleActions: "play none none reverse",
              },
            },
          );

          if (glass) {
            gsap.fromTo(
              glass,
              { opacity: 0, y: 24, rotateX: 8 },
              {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 1.1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: scene,
                  start: "top 52%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }

          if (giant) {
            gsap.fromTo(
              giant,
              { yPercent: 20, opacity: 0.08 },
              {
                yPercent: -12,
                opacity: 0.18,
                ease: "none",
                scrollTrigger: {
                  trigger: scene,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.3,
                },
              },
            );
          }

          const trees = scene.querySelectorAll("[data-tree]");
          if (trees.length) {
            gsap.fromTo(
              trees,
              { xPercent: (i) => (i % 2 === 0 ? -18 : 18), opacity: 0.2 },
              {
                xPercent: 0,
                opacity: 0.85,
                ease: "none",
                scrollTrigger: {
                  trigger: scene,
                  start: "top 80%",
                  end: "center center",
                  scrub: 1,
                },
              },
            );
          }

          const water = scene.querySelector("[data-water]");
          if (water) {
            const onMove = (e: MouseEvent) => {
              const r = scene.getBoundingClientRect();
              const px = ((e.clientX - r.left) / r.width - 0.5) * 12;
              gsap.to(water, { x: px, duration: 1.4, ease: "sine.out", overwrite: "auto" });
            };
            scene.addEventListener("mousemove", onMove);
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
      {scenes.map((scene, index) => {
        const minimal = scene.id === "berijam";
        const giant = GIANT[scene.id];
        return (
          <article
            key={scene.id}
            id={`scene-${scene.id}`}
            data-scene
            data-scene-id={scene.id}
            className="relative h-[155vh]"
          >
            <div className="sticky top-0 flex h-[100svh] items-end overflow-hidden md:items-center">
              <div
                data-scene-bg
                className="absolute inset-0 will-change-transform"
                data-cursor="explore"
              >
                <Image
                  src={scene.image}
                  alt={scene.place}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  quality={60}
                  loading={index < 1 ? "eager" : "lazy"}
                  priority={index < 1}
                />
              </div>

              {(scene.id === "kodai-lake" || scene.id === "berijam") && (
                <div data-water className="water-shimmer absolute inset-0 z-[1]" />
              )}

              {scene.id === "pine-forest" && (
                <>
                  <div
                    data-tree
                    className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-[28%] bg-gradient-to-r from-[#04162b] via-[#04162b]/70 to-transparent"
                  />
                  <div
                    data-tree
                    className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-[28%] bg-gradient-to-l from-[#04162b] via-[#04162b]/70 to-transparent"
                  />
                  <div className="sun-rays pointer-events-none absolute inset-0 z-[2] opacity-60" />
                </>
              )}

              <div
                data-scene-veil
                className="absolute inset-0 z-[1]"
                style={{
                  background:
                    scene.tone === "night"
                      ? "linear-gradient(180deg, rgba(4,22,43,0.5), rgba(4,22,43,0.86))"
                      : scene.tone === "gold"
                        ? "linear-gradient(180deg, rgba(4,22,43,0.22), rgba(4,22,43,0.72))"
                        : "linear-gradient(180deg, rgba(4,22,43,0.28), rgba(4,22,43,0.78))",
                }}
              />

              <div className="absolute inset-0 z-[2]">
                <AtmosphereLayer tone={scene.tone} />
              </div>

              {giant && (
                <p
                  data-giant
                  className="pointer-events-none absolute left-1/2 top-[18%] z-[3] -translate-x-1/2 font-display text-[18vw] leading-none text-white/10"
                >
                  {giant}
                </p>
              )}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-32 bg-gradient-to-b from-transparent to-navy/70" />

              <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-28 md:flex-row md:items-end md:justify-between md:px-8 md:pb-24">
                <div className={minimal ? "max-w-md" : "max-w-2xl"}>
                  <p
                    data-scene-copy
                    className="text-[0.68rem] uppercase tracking-[0.34em] text-gold-bright"
                  >
                    {String(index + 1).padStart(2, "0")} · {scene.place}
                  </p>
                  {scene.id === "dolphins-nose" ? (
                    <h2
                      data-scene-copy
                      className="mt-5 font-display text-4xl leading-[1.05] text-white md:text-6xl lg:text-7xl"
                    >
                      {j("dolphinHeadline")}
                    </h2>
                  ) : scene.id === "camping" ? (
                    <h2
                      data-scene-copy
                      className="mt-5 font-display text-4xl leading-[1.05] text-white md:text-6xl"
                    >
                      {j("nightHeadline")}
                    </h2>
                  ) : scene.quote ? (
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
                  {scene.id === "kodai-lake" && (
                    <p data-scene-copy className="mt-4 font-display text-2xl text-gold-bright">
                      {j("lakeLine")}
                    </p>
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
                      {t("frameEyebrow")}
                    </p>
                    <p className="mt-3 font-display text-2xl text-white">{scene.place}</p>
                    <p className="mt-2 text-sm leading-relaxed text-soft-gray">
                      {t("frameBody")}
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
                <div className="pointer-events-none absolute bottom-[18%] left-[12%] z-[4] h-24 w-24 rounded-full bg-orange-400/35 blur-3xl" />
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}
