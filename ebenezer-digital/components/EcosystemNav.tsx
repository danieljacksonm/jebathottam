"use client";

import {
  AI_URL,
  DISCOVER_URL,
  JOURNAL_URL,
  PRODUCTS_URL,
  SITE_URL,
  STORE_URL,
  TOOLS_URL,
} from "@/lib/site-url";

type Props = {
  variant?: "dark" | "light";
  active?: "services" | "store" | "tools" | "products" | "info" | "ai" | "discover";
};

const LINKS = [
  { id: "services" as const, label: "Services", href: SITE_URL },
  { id: "store" as const, label: "Products", href: STORE_URL },
  { id: "tools" as const, label: "Tools", href: TOOLS_URL },
  { id: "products" as const, label: "Hardware", href: PRODUCTS_URL },
  { id: "info" as const, label: "Guides", href: JOURNAL_URL },
  { id: "ai" as const, label: "AI", href: AI_URL },
  { id: "discover" as const, label: "Find", href: DISCOVER_URL },
];

export function EcosystemNav({ variant = "dark", active }: Props) {
  return (
    <nav className={`eco-nav ${variant === "light" ? "eco-nav-light" : ""}`} aria-label="Ebenezer ecosystem">
      <span className="font-semibold tracking-[0.08em] text-[0.68rem] opacity-70 mr-1">Ebenezer</span>
      {LINKS.map((l) => (
        <a
          key={l.id}
          href={l.href}
          className={active === l.id ? "is-active" : undefined}
          rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {l.label}
        </a>
      ))}
    </nav>
  );
}
