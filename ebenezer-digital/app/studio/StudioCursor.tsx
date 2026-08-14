"use client";

import { useEffect, useState } from "react";

export function StudioCursor() {
  const [pos, setPos] = useState({ x: -80, y: -80 });
  const [label, setLabel] = useState("");
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    document.body.classList.add("studio-cursor-on");
    setOn(true);
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const hit = (e.target as HTMLElement | null)?.closest("[data-cursor]");
      setLabel(hit?.getAttribute("data-cursor") || "");
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.classList.remove("studio-cursor-on");
    };
  }, []);

  if (!on) return null;
  return (
    <div
      className={`studio-cursor ${label ? "is-label" : ""}`}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      aria-hidden
    >
      <span>{label}</span>
    </div>
  );
}
