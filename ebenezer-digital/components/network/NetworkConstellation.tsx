"use client";

import Link from "next/link";

const STAGE = [
  { label: "Developer", href: "/network/tools/c/developer" },
  { label: "SEO", href: "/network/tools/c/seo" },
  { label: "Images", href: "/network/tools/c/image" },
  { label: "AI helpers", href: "/network/tools/c/ai" },
  { label: "Text", href: "/network/tools/c/text" },
  { label: "Calculators", href: "/network/tools/c/calculators" },
  { label: "Business", href: "/network/tools/c/business" },
];

/** Lightweight hero visual — real category links, no fake nodes. */
export function NetworkConstellation() {
  return (
    <div className="nx-stage" aria-label="Tool categories">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--nx-muted)] mb-1">
        Tool workspace
      </p>
      {STAGE.map((n) => (
        <Link key={n.label} href={n.href} className="nx-stage-link">
          {n.label}
          <span aria-hidden>→</span>
        </Link>
      ))}
    </div>
  );
}
