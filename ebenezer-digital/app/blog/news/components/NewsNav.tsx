"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Search, Radio, X } from "lucide-react";
import { NEWS_NAV } from "../data";
import { useNews } from "./NewsProvider";
import { QuietTranslate } from "@/components/QuietTranslate";
import { SITE_NAV } from "@/lib/site-nav";

export function NewsNav() {
  const { setSearchOpen, menuOpen, setMenuOpen, setActiveNav, activeNav } = useNews();
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`news-nav ${solid ? "is-solid" : ""}`}>
        <div className="news-masthead mx-auto flex h-[4.4rem] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em]"
            onClick={() => setMenuOpen(true)}
            data-cursor="OPEN"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
            <span className="hidden sm:inline">Menu</span>
          </button>

          <Link href="/blog/news" className="flex flex-col items-center" data-cursor="HOME" aria-label="Ebenezer News home">
            <span className="text-[9px] font-semibold uppercase tracking-[0.42em] text-[var(--n-gold)]">The</span>
            <span className="news-display text-[17px] tracking-[0.12em] sm:text-[22px]">
              Ebenezer News
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <QuietTranslate variant="news" />
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[var(--n-line)]"
              aria-label="Search"
              data-cursor="FIND"
            >
              <Search className="h-4 w-4" />
            </button>
            <a
              href="#live"
              className="hidden items-center gap-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--n-live)] sm:inline-flex"
              data-cursor="OPEN"
            >
              <Radio className="h-3.5 w-3.5" /> Live
            </a>
            <a
              href="#subscribe"
              className="hidden border border-[var(--n-ink)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] md:inline-flex"
              data-cursor="OPEN"
            >
              Subscribe
            </a>
          </div>
        </div>

        <nav className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10" aria-label="Desks">
          <div className="news-nav-rail">
            {NEWS_NAV.map((item) => (
              <a
                key={item}
                href={`#desk-${item.toLowerCase()}`}
                onClick={() => setActiveNav(item)}
                className={`shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                  activeNav === item ? "text-[var(--n-live)]" : "text-[var(--n-muted)] hover:text-[var(--n-ink)]"
                }`}
                data-cursor="VIEW"
              >
                {item}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[92] bg-[var(--n-paper)] px-6 py-8">
          <div className="mb-10 flex items-center justify-between">
            <p className="news-kicker text-[var(--n-live)]">Sections</p>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {NEWS_NAV.map((item) => (
              <a
                key={item}
                href={`#desk-${item.toLowerCase()}`}
                onClick={() => {
                  setActiveNav(item);
                  setMenuOpen(false);
                }}
                className="news-display border-t border-[var(--n-line)] pt-3 text-4xl"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="mt-12 space-y-3 text-sm text-[var(--n-muted)]">
            <Link href={`${SITE_NAV.ai}?mode=news`} onClick={() => setMenuOpen(false)} className="block text-[var(--n-live)]">
              Ask Eben AI
            </Link>
            <Link href={SITE_NAV.journal} onClick={() => setMenuOpen(false)}>
              Journal
            </Link>
            <Link href={SITE_NAV.store} onClick={() => setMenuOpen(false)} className="block">
              Store
            </Link>
            <a href={SITE_NAV.newsRss} className="block">
              RSS
            </a>
            <a href={SITE_NAV.newsSitemap} className="block">
              News sitemap
            </a>
            <Link href="/blog/newsroom/about" onClick={() => setMenuOpen(false)} className="block">
              About the desk
            </Link>
            <Link href="/blog/newsroom/editorial-policy" onClick={() => setMenuOpen(false)} className="block">
              Editorial policy
            </Link>
            <Link href="/blog/newsroom/feeds" onClick={() => setMenuOpen(false)} className="block">
              Public feeds
            </Link>
            <Link href="/blog/newsroom/contact" onClick={() => setMenuOpen(false)} className="block">
              Contact
            </Link>
            <a href="/api/news/ical" className="block">
              iCal
            </a>
            <Link href={SITE_NAV.home} className="block">
              Studio
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
