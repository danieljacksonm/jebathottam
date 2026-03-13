"use client";

import { useRef, useEffect, useState } from "react";

/**
 * Reveals text line by line with a sliding mask (advanced headline reveal).
 */
export default function LineReveal({
  text,
  className = "",
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  as?: "p" | "h1" | "h2" | "h3" | "span";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <Tag className={`line-reveal ${className}`.trim()}>
        {lines.map((line, i) => (
          <span
            key={i}
            className="line-reveal-line block overflow-hidden"
            style={{ transitionDelay: inView ? `${i * 90}ms` : "0ms" }}
          >
            <span className={`line-reveal-inner block ${inView ? "line-reveal-in" : ""}`}>{line}</span>
          </span>
        ))}
      </Tag>
    </div>
  );
}
