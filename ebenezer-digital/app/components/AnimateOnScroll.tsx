"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

type Variant = "fade-up" | "fade-in" | "slide-up" | "slide-up-strong" | "scale" | "from-left" | "from-right" | "reveal" | "stagger-slow" | "blur-up" | "zoom-in";

const STAGGER_MS = 70;

export function AnimateSection({
  children,
  className = "",
  variant = "fade-up",
}: {
  children: ReactNode;
  className?: string;
  variant?: Variant;
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

  return (
    <div
      ref={ref}
      className={`aos-root aos-${variant} ${inView ? "in-view" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
}

export function AnimateOne({
  children,
  className = "",
  variant = "fade-up",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  variant?: Variant;
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
      { rootMargin: "0px 0px -40px 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`aos-one aos-${variant} ${inView ? "in-view" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
