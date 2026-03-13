"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

/**
 * Sets --scroll-progress (0 to 1) on the wrapper based on how far the section
 * has moved through the viewport. Use for parallax and scroll-linked reveals.
 */
export default function ScrollParallax({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const top = rect.top;
      const height = rect.height;
      // 0 when section top is at viewport bottom, 1 when section bottom is at viewport top
      const raw = (viewportH - top) / (viewportH + height);
      const clamped = Math.max(0, Math.min(1, raw));
      setProgress(clamped);
    }

    update();
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ ["--scroll-progress" as string]: progress }}
    >
      {children}
    </div>
  );
}
