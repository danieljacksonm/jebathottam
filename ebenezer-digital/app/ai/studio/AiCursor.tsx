"use client";

import { useEffect, useState } from "react";

export function AiCursor() {
  const [pos, setPos] = useState({ x: -80, y: -80 });
  const [label, setLabel] = useState("");
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.body.classList.add("ai-cursor-on");
    setOn(true);

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const target = (e.target as HTMLElement | null)?.closest("[data-cursor]");
      setLabel(target?.getAttribute("data-cursor") || "");
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.classList.remove("ai-cursor-on");
    };
  }, []);

  if (!on) return null;

  return (
    <div
      className={`ai-cursor ${label ? "is-label" : ""}`}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      aria-hidden
    >
      <span className="ai-cursor-dot" />
      {label ? <span className="ai-cursor-label">{label}</span> : null}
    </div>
  );
}
