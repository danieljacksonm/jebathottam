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
};

const GROUPS = [
  {
    title: "Studio",
    links: [
      { label: "Services", href: `${SITE_URL}/services` },
      { label: "Work", href: `${SITE_URL}/work` },
      { label: "Contact", href: `${SITE_URL}/contact` },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Store", href: STORE_URL },
      { label: "Hardware", href: PRODUCTS_URL },
      { label: "SaaS", href: SAAS_URL },
    ],
  },
  {
    title: "Content",
    links: [
      { label: "Journal", href: JOURNAL_URL },
      { label: "News", href: NEWS_URL },
      { label: "Info", href: INFO_URL },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Affiliate tools", href: TOOLS_URL },
      { label: "Free network", href: NETWORK_URL },
      { label: "Discover", href: DISCOVER_URL },
      { label: "AI", href: AI_URL },
    ],
  },
] as const;

export function EcosystemFooter({ variant = "dark" }: Props) {
  const t = useShellMessages();

  return (
    <section
      className={`eco-footer ${variant === "light" ? "eco-footer-light" : ""}`}
      aria-label="Ebenezer ecosystem"
    >
      <div className="eco-footer-inner">
        <div className="eco-footer-brand">
          <p className="eco-footer-kicker">Ebenezer Digital</p>
          <p className="eco-footer-lead">
            {t.services}, {t.store}, {t.tools}, {t.journal}, {t.news}, {t.network}, {t.saas}, AI &amp; Discover — one
            network.
          </p>
        </div>
        <div className="eco-footer-grid">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <p className="eco-footer-col-title">{group.title}</p>
              <ul className="eco-footer-links">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} rel="noopener noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
