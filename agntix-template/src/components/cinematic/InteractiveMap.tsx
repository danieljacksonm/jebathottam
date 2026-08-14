"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { localizeMapPoints } from "@/data/cinematic";
import { useReveal } from "./motion";

function scrollToScene(id?: string) {
  if (!id) return;
  const node = document.getElementById(`scene-${id}`);
  if (!node) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(node, { offset: 0, duration: 1.4 });
    return;
  }
  node.scrollIntoView({ behavior: "smooth" });
}

export function InteractiveMap() {
  const locale = useLocale();
  const t = useTranslations("homeCinematic");
  const points = localizeMapPoints(locale);
  const [active, setActive] = useState(points[0].id);
  const ref = useReveal([]);
  const point = points.find((p) => p.id === active) ?? points[0];

  useEffect(() => {
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scene-id]"));
    if (!scenes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = visible?.target.getAttribute("data-scene-id");
        if (id) setActive(id);
      },
      { threshold: [0.35, 0.55] },
    );

    scenes.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="section-pad bg-navy-mid"
    >
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="max-w-2xl">
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-gold">
            {t("mapEyebrow")}
          </p>
          <h2 className="mt-4 font-display text-5xl text-white md:text-6xl">
            {t("mapTitle")}
          </h2>
        </div>

        <div
          data-reveal
          className="glass-panel relative mt-12 aspect-[16/10] overflow-hidden rounded-[2rem]"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 45%, #16324f 0%, #04162b 70%), repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(214,166,74,0.04) 29px), repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(214,166,74,0.03) 29px)",
            }}
          />
          <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M12,70 C28,40 40,55 52,38 C64,22 78,30 90,18"
              fill="none"
              stroke="#D6A64A"
              strokeWidth="0.4"
            />
          </svg>

          {points.map((p) => (
            <button
              key={p.id}
              type="button"
              data-cursor="discover"
              onMouseEnter={() => setActive(p.id)}
              onFocus={() => setActive(p.id)}
              onClick={() => {
                setActive(p.id);
                scrollToScene(p.sceneId || p.id);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span
                className={`block h-3 w-3 rounded-full transition-all duration-400 ${
                  active === p.id
                    ? "scale-150 bg-gold-bright shadow-[0_0_20px_rgba(244,210,122,0.8)]"
                    : "bg-gold/70"
                }`}
              />
              <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap text-[0.58rem] uppercase tracking-[0.12em] text-white/80">
                {p.name}
              </span>
            </button>
          ))}

          <div className="absolute bottom-6 left-6 right-6 overflow-hidden rounded-2xl border border-[var(--line)] bg-navy/75 backdrop-blur-md md:left-auto md:w-80">
            <div className="relative h-28">
              <Image
                src={point.image}
                alt={point.name}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
            <div className="px-5 py-4">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">
                {t("mapSelected")}
              </p>
              <p className="mt-2 font-display text-2xl text-white">{point.name}</p>
              <p className="mt-1 text-sm text-mist">{point.blurb}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
