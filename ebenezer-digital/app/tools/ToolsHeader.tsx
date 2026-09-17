"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { DISCOVER_URL } from "@/lib/site-url";
import { SITE_NAV } from "@/lib/site-nav";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ChannelLogo } from "@/components/ChannelLogo";
import { EcosystemNav } from "@/components/EcosystemNav";

const NAV = [
  { href: "/tools/blog", label: "Blog" },
  { href: "/tools/compare", label: "Compare" },
  { href: DISCOVER_URL, label: "Discover", external: true },
  { href: SITE_NAV.products, label: "Hardware", external: true },
  { href: SITE_NAV.ai, label: "AI", external: true },
];

export function ToolsHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EcosystemNav active="tools" variant="light" />
      <header className="sticky top-0 z-40 border-b border-[var(--aff-line)] bg-white/95 backdrop-blur">
        <div className="aff-page flex h-14 items-center justify-between gap-3">
          <ChannelLogo channel="tools" href="/tools" variant="light" />
          <nav className="tools-nav-desktop hidden items-center gap-3 text-sm text-[var(--aff-muted)] md:flex">
            {NAV.map((item) =>
              item.external ? (
                <a key={item.label} href={item.href} className="hover:text-[var(--aff-brand)]">
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} href={item.href} className="hover:text-[var(--aff-brand)]">
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact variant="light" />
            <button
              type="button"
              className="tools-menu-btn md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="tools-nav-mobile border-t border-[var(--aff-line)] bg-white px-4 py-3 md:hidden">
            {NAV.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="block py-2.5 text-sm font-medium text-[var(--aff-ink)]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-2.5 text-sm font-medium text-[var(--aff-ink)]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        )}
      </header>
    </>
  );
}
