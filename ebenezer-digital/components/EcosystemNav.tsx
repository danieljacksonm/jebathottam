"use client";

import {
  AI_URL,
  DISCOVER_URL,
  INFO_URL,
  JOURNAL_URL,
  NETWORK_URL,
  NEWS_URL,
  PRODUCTS_URL,
  SAAS_URL,
  SITE_URL,
  STORE_URL,
  TOOLS_URL,
} from "@/lib/site-url";
import { useShellMessages } from "@/lib/i18n/use-shell-messages";

type Props = {
  variant?: "dark" | "light";
  active?:
    | "services"
    | "store"
    | "tools"
    | "products"
    | "info"
    | "ai"
    | "discover"
    | "journal"
    | "news"
    | "network"
    | "saas";
};

const LINKS = [
  { id: "services" as const, labelKey: "services" as const, href: SITE_URL },
  { id: "store" as const, labelKey: "store" as const, href: STORE_URL },
  { id: "tools" as const, labelKey: "tools" as const, href: TOOLS_URL },
  { id: "products" as const, labelKey: "hardware" as const, href: PRODUCTS_URL },
  { id: "journal" as const, labelKey: "journal" as const, href: JOURNAL_URL },
  { id: "news" as const, labelKey: "news" as const, href: NEWS_URL },
  { id: "network" as const, labelKey: "network" as const, href: NETWORK_URL },
  { id: "ai" as const, labelKey: "ai" as const, href: AI_URL },
  { id: "saas" as const, labelKey: "saas" as const, href: SAAS_URL },
  { id: "discover" as const, labelKey: "discover" as const, href: DISCOVER_URL },
  { id: "info" as const, labelKey: "info" as const, href: INFO_URL },
] as const;

export function EcosystemNav({ variant = "dark", active }: Props) {
  const t = useShellMessages();

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
          {t[l.labelKey]}
        </a>
      ))}
    </nav>
  );
}
