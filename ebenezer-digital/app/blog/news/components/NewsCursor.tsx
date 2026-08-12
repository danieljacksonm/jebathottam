"use client";

import { useEffect, useRef } from "react";

export function NewsCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const move = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };
    const over = (e: Event) => {
      const host = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      const label = host?.dataset.cursor || "";
      el.textContent = label;
      el.classList.toggle("has-label", Boolean(label));
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
    };
  }, []);

  return <div ref={ref} className="news-cursor" aria-hidden />;
}
