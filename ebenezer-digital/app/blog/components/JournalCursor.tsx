"use client";

import { useEffect, useRef } from "react";

export function JournalCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let label = "";
    const move = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };
    const over = (e: Event) => {
      const t = e.target as HTMLElement | null;
      const host = t?.closest?.("[data-cursor]") as HTMLElement | null;
      label = host?.dataset.cursor || "";
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

  return <div ref={ref} className="journal-cursor" aria-hidden />;
}
