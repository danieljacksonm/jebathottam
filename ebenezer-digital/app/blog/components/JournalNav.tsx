"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SITE_NAV, journalCategoryHref } from "@/lib/site-nav";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export function JournalNav({
  categories,
  onSearch,
  onCategory,
}: {
  categories: string[];
  onSearch?: (q: string) => void;
  onCategory?: (cat: string) => void;
}) {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const topics = categories.slice(0, 8);

  return (
    <>
      <header
        className={cn(
          "journal-nav journal-nav-v2 fixed inset-x-0 top-0 z-[70] border-b transition-colors duration-300",
          solid
            ? "border-[var(--j-line)] bg-[rgba(6,10,14,0.94)] backdrop-blur-xl"
            : "border-transparent bg-gradient-to-b from-[rgba(6,10,14,0.92)] to-transparent"
        )}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-10">
          <Link href="/blog" className="flex shrink-0 items-center gap-3" data-cursor="HOME">
            <Image
              src="/brand/journal-logo.svg"
              alt="Ebenezer Journal"
              width={180}
              height={40}
              className="h-9 w-auto"
              priority
            />
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto lg:flex" aria-label="Topics">
            {topics.map((cat) => (
              <Link
                key={cat}
                href={journalCategoryHref(cat)}
                onClick={() => onCategory?.(cat)}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--j-muted)] transition hover:bg-white/5 hover:text-[var(--j-paper)]"
              >
                {cat}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              href={SITE_NAV.news}
              className="hidden rounded-full border border-[var(--j-brand)]/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--j-brand)] transition hover:bg-[var(--j-brand)] hover:text-[#04110c] md:inline-flex"
            >
              News
            </Link>
            <LanguageSwitcher compact variant="dark" />
            <button
              type="button"
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--j-line)] text-[var(--j-paper)] transition hover:border-[var(--j-brand)]"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              href="#subscribe"
              className="hidden rounded-full bg-[var(--j-brand)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#04110c] transition hover:brightness-110 lg:inline-flex"
            >
              Subscribe
            </Link>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--j-line)] text-[var(--j-paper)] lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-[var(--j-ink)] px-6 py-8 lg:hidden">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-xs tracking-[0.3em] text-[var(--j-brand)]">Journal</p>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6 text-[var(--j-paper)]" />
            </button>
          </div>
          <div className="space-y-1">
            <Link
              href={SITE_NAV.news}
              className="block border-b border-[var(--j-line)] py-4 font-serif text-2xl text-[var(--j-brand)]"
            >
              Ebenezer News
            </Link>
            {topics.map((cat) => (
              <Link
                key={cat}
                href={journalCategoryHref(cat)}
                onClick={() => {
                  onCategory?.(cat);
                  setMenuOpen(false);
                }}
                className="block border-b border-[var(--j-line)] py-4 font-serif text-2xl text-[var(--j-paper)]"
              >
                {cat}
              </Link>
            ))}
          </div>
          <div id="subscribe" className="mt-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--j-muted)]">Newsletter</p>
            <NewsletterSignup variant="journal" source="journal-nav-mobile" className="mt-4" />
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/90 px-4 pt-28 backdrop-blur-md">
          <div className="w-full max-w-3xl">
            <div className="mb-8 flex items-start justify-between gap-4">
              <h2 className="font-serif text-4xl leading-none text-[var(--j-paper)] sm:text-5xl">Search the Journal</h2>
              <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
                <X className="h-7 w-7 text-[var(--j-paper)]" />
              </button>
            </div>
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              placeholder="Topics, guides, explainers…"
              className="w-full border-b border-[var(--j-line)] bg-transparent pb-4 font-serif text-2xl text-[var(--j-paper)] outline-none placeholder:text-[var(--j-muted)] focus:border-[var(--j-brand)]"
            />
          </div>
        </div>
      )}
    </>
  );
}
