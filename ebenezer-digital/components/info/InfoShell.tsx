"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SITE_NAV } from "@/lib/site-nav";

const LINKS = [
  { href: SITE_NAV.info, label: "Home", match: (p: string) => p === "/info" || p === "/" },
  { href: SITE_NAV.news, label: "News", external: true },
  { href: SITE_NAV.journal, label: "Journal", external: true },
  { href: "/about", label: "About", match: (p: string) => p.includes("/about") },
  { href: "/search", label: "Search", match: (p: string) => p.includes("/search") },
];

export function InfoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const [menuOpen, setMenuOpen] = useState(false);

  function renderLink(l: (typeof LINKS)[number], onNavigate?: () => void) {
    const active = l.match ? l.match(pathname) : false;
    const className = `info-nav-link${active ? " is-active" : ""}`;
    if (l.external) {
      return (
        <a key={l.label} href={l.href} className={className} onClick={onNavigate}>
          {l.label}
        </a>
      );
    }
    return (
      <Link key={l.label} href={l.href} className={className} onClick={onNavigate}>
        {l.label}
      </Link>
    );
  }

  return (
    <div className="info-root">
      <a className="info-skip" href="#main">
        Skip to content
      </a>
      <header className="info-header">
        <div className="info-header-inner">
          <Link href="/" className="info-brand" aria-label="Ebenezer Digital Information — Home">
            <span className="info-brand-mark" aria-hidden />
            <span className="info-brand-text">
              <strong>Ebenezer</strong>
              <em>Information</em>
            </span>
          </Link>
          <nav className="info-nav info-nav-desktop" aria-label="Main">
            {LINKS.map((l) => renderLink(l))}
            <LanguageSwitcher compact />
          </nav>
          <button
            type="button"
            className="info-menu-btn"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="info-nav-mobile" aria-label="Mobile">
            {LINKS.map((l) => renderLink(l, () => setMenuOpen(false)))}
          </nav>
        )}
      </header>
      <main id="main">{children}</main>
      <footer className="info-footer">
        <div className="info-footer-inner">
          <div>
            <p className="info-footer-brand">Ebenezer Digital Information</p>
            <p className="info-footer-note">
              News, stories and useful ideas for the digital world — explained simply.
            </p>
          </div>
          <div className="info-footer-cols">
            <div>
              <p className="info-footer-label">Here</p>
              <a href={SITE_NAV.news}>News</a>
              <a href={SITE_NAV.journal}>Journal</a>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/search">Search</Link>
            </div>
            <div>
              <p className="info-footer-label">More from Ebenezer</p>
              <a href={SITE_NAV.home}>Digital Services</a>
              <a href={SITE_NAV.ai}>AI</a>
              <a href={SITE_NAV.network}>Free Tools</a>
              <a href={SITE_NAV.store}>Digital Products</a>
            </div>
            <div>
              <p className="info-footer-label">Legal</p>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/sitemap">Sitemap</Link>
              <a href={`${SITE_NAV.network}/affiliate-disclosure`}>Affiliate Disclosure</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
