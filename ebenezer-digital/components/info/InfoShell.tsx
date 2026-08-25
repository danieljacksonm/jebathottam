"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
          <nav className="info-nav" aria-label="Main">
            {LINKS.map((l) => {
              const active = l.match ? l.match(pathname) : false;
              if (l.external) {
                return (
                  <a key={l.label} href={l.href} className="info-nav-link">
                    {l.label}
                  </a>
                );
              }
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`info-nav-link${active ? " is-active" : ""}`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
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
              <a href={`${SITE_NAV.home}/privacy`}>Privacy</a>
              <a href={`${SITE_NAV.home}/terms`}>Terms</a>
              <a href={`${SITE_NAV.network}/affiliate-disclosure`}>Affiliate Disclosure</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
