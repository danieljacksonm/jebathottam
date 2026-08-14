"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Mount heavy below-fold sections only when near viewport.
 * Keeps cinematic content but protects LCP/INP.
 */
export function LazySection({
  children,
  rootMargin = "280px 0px",
  minHeight = "60vh",
  className = "",
}: {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={show ? undefined : { minHeight }}
    >
      {show ? children : null}
    </div>
  );
}
