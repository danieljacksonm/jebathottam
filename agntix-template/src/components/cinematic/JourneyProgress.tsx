"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const STAGES = [
  { id: "arrival", until: 0.12 },
  { id: "explore", until: 0.38 },
  { id: "discover", until: 0.62 },
  { id: "sunset", until: 0.82 },
  { id: "night", until: 1 },
] as const;

export function JourneyProgress() {
  const t = useTranslations("journey");
  const [active, setActive] = useState<(typeof STAGES)[number]["id"]>("arrival");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setShow(window.scrollY > 80);
      const stage = STAGES.find((s) => p <= s.until) ?? STAGES[STAGES.length - 1];
      setActive(stage.id);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <aside className="pointer-events-none fixed right-4 top-1/2 z-[45] hidden -translate-y-1/2 md:block">
      <ol className="space-y-4">
        {STAGES.map((stage, i) => {
          const on = stage.id === active;
          return (
            <li key={stage.id} className="flex items-center justify-end gap-3">
              <span
                className={`text-right transition-opacity duration-500 ${
                  on ? "opacity-100" : "opacity-35"
                }`}
              >
                <span className="block font-display text-[0.7rem] tracking-[0.22em] text-gold-bright">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="block text-[0.58rem] uppercase tracking-[0.2em] text-white/80">
                  {t(`stages.${stage.id}`)}
                </span>
              </span>
              <span
                className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                  on
                    ? "scale-125 bg-gold-bright shadow-[0_0_12px_rgba(244,210,122,0.8)]"
                    : "bg-white/35"
                }`}
              />
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
