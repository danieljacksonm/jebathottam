"use client";

import { useEffect, useRef } from "react";
import "./brand-cursor.css";

/** Shared luxury cursor: emerald brand + white ring, visible on black and cream. */
export function BrandCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.documentElement.classList.add("brand-cursor-on");
    let x = -80;
    let y = -80;
    let tx = -80;
    let ty = -80;
    let raf = 0;

    const tick = () => {
      tx += (x - tx) * 0.38;
      ty += (y - ty) * 0.38;
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const over = (e: Event) => {
      const host = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      const label = host?.dataset.cursor || "";
      const text = el.querySelector(".brand-cursor-label");
      if (text) text.textContent = label;
      el.classList.toggle("has-label", Boolean(label));
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.documentElement.classList.remove("brand-cursor-on");
    };
  }, []);

  return (
    <div ref={ref} className="brand-cursor" aria-hidden>
      <span className="brand-cursor-dot" />
      <span className="brand-cursor-label" />
    </div>
  );
}
