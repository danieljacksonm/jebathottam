"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

/**
 * Pins the section and scrolls inner content horizontally as user scrolls vertically (The Quake / Apple style).
 */
export default function ScrollDrivenHorizontal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    function update() {
      if (!wrapper || !inner) return;
      const innerWidth = inner.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxScroll = Math.max(0, innerWidth - viewportWidth);
      const rect = wrapper.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const top = rect.top;
      const height = rect.height;
      const raw = (viewportH - top) / (viewportH + height);
      const p = Math.max(0, Math.min(1, raw));
      setTranslateX(-p * maxScroll);
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
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`scroll-driven-horizontal sticky top-0 ${className}`.trim()}>
      <div
        ref={innerRef}
        className="scroll-driven-horizontal-inner flex will-change-transform"
        style={{ transform: `translateX(${translateX}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
