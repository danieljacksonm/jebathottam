"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

type Direction = "left" | "right" | "bottom" | "top";

/**
 * Reveals content with a clip-path wipe when it enters view (advanced reveal).
 */
export default function ClipReveal({
  children,
  className = "",
  direction = "left",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const dirClass =
    direction === "left"
      ? "clip-reveal-left"
      : direction === "right"
        ? "clip-reveal-right"
        : direction === "bottom"
          ? "clip-reveal-bottom"
          : "clip-reveal-top";

  return (
    <div
      ref={ref}
      className={`clip-reveal ${dirClass} ${inView ? "clip-reveal-in" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
