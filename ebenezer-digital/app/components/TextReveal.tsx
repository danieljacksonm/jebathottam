"use client";

import { useRef, useEffect, useState } from "react";

type Props = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  wordDelay?: number;
};

/**
 * Splits text into words and reveals each word with a stagger (Poppr / Roger Junior style).
 */
export default function TextReveal({
  text,
  className = "",
  as: Tag = "span",
  delay = 0,
  wordDelay = 40,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const words = text.split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className="text-reveal-wrap inline">
      <Tag className={className}>
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className={`text-reveal-word ${inView ? "in-view" : ""}`}
            style={{ animationDelay: `${delay + i * wordDelay}ms` }}
          >
            {word}&nbsp;
          </span>
        ))}
      </Tag>
    </span>
  );
}
