"use client";

import { useEffect, useMemo, useState } from "react";

type Heading = { id: string; text: string; level: 2 | 3 };

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export function extractHeadings(content: string): Heading[] {
  const out: Heading[] = [];
  for (const block of content.split(/\n\n+/)) {
    const h2 = block.match(/^##\s+(.+)/);
    const h3 = block.match(/^###\s+(.+)/);
    if (h2) {
      const text = h2[1].trim();
      out.push({ id: slugifyHeading(text), text, level: 2 });
    } else if (h3) {
      const text = h3[1].trim();
      out.push({ id: slugifyHeading(text), text, level: 3 });
    }
  }
  return out;
}

export function JournalTableOfContents({ content }: { content: string }) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const [active, setActive] = useState("");

  useEffect(() => {
    if (headings.length < 3) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5] }
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="journal-toc mb-10 rounded-xl border border-[var(--j-line)] bg-[rgba(255,255,255,0.02)] p-5"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--j-brand)]">
        On this page
      </p>
      <ol className="mt-4 space-y-2">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
            <a
              href={`#${h.id}`}
              className={`block text-sm leading-snug transition ${
                active === h.id ? "text-[var(--j-brand)]" : "text-[var(--j-muted)] hover:text-[var(--j-paper)]"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
