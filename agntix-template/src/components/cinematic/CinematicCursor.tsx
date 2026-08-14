"use client";

import { useEffect, useRef, useState } from "react";

const LABELS: Record<string, string> = {
  explore: "EXPLORE",
  discover: "DISCOVER",
  view: "VIEW",
  book: "BOOK",
};

export function CinematicCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const labelRef = useRef("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.documentElement.classList.add("has-cinematic-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = (e.target as HTMLElement | null)?.closest?.("[data-cursor]");
      const next = LABELS[target?.getAttribute("data-cursor") || ""] || "";
      if (next !== labelRef.current) {
        labelRef.current = next;
        setLabel(next);
      }
    };

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        ring.current.classList.toggle("is-label", Boolean(labelRef.current));
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.documentElement.classList.remove("has-cinematic-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cinematic-cursor-dot hidden md:block" />
      <div ref={ring} className="cinematic-cursor-ring hidden md:block">
        {label ? <span>{label}</span> : null}
      </div>
    </>
  );
}
