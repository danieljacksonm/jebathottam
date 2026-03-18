"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

type Props = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  charDelay?: number;
  /** "fade" | "blur" | "scale" | "up" */
  mode?: "fade" | "blur" | "scale" | "up";
  /** Run on load (hero) or when in view */
  triggerOnView?: boolean;
};

/**
 * Character-by-character reveal – extraordinary, award-site level.
 * Use for hero or key headlines. Splits into spans and staggers each char.
 */
export default function CharReveal({
  text,
  className = "",
  as: Tag = "span",
  delay = 0,
  charDelay = 35,
  mode = "up",
  triggerOnView = false,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };
  const [run, setRun] = useState(!triggerOnView);

  useEffect(() => {
    if (!triggerOnView) {
      setRun(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRun(true);
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [triggerOnView]);

  const chars = Array.from(text);

  const inViewClass = triggerOnView && run ? " in-view" : "";
  const heroClass = !triggerOnView ? " char-reveal-hero" : "";
  return (
    <Tag
      // Callback ref works for any tag (p/span/h1/...)
      ref={setRef as unknown as React.LegacyRef<never>}
      className={`char-reveal-root char-reveal-${mode}${inViewClass}${heroClass} ${className}`.trim()}
    >
      {chars.map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="char-reveal-char inline-block"
          style={
            run
              ? {
                  animationDelay: `${delay + i * charDelay}ms`,
                  transitionDelay: `${delay + i * charDelay}ms`,
                }
              : undefined
          }
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}
