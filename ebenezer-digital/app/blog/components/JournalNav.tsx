"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { JournalLanguage } from "./JournalLanguage";

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
    const onScroll = () => setSolid(window.scrollY > 40);
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

  return (
    <>
      <header className={cn("journal-nav", solid && "is-solid")}>
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/blog" className="flex items-center gap-3" data-cursor="HOME">
            <Image
              src="/brand/ebenezer-journal-mark.svg"
              alt="Ebenezer Journal"
              width={36}
              height={36}
              className="rounded-lg"
              priority
            />
            <div className="leading-none">
              <p className="font-serif text-[11px] tracking-[0.35em] text-[var(--j-paper)]">EBENEZER</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-[10px] tracking-[0.42em] text-[var(--j-brand)]">JOURNAL</p>
                <span className="rounded border border-[var(--j-brand)] px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.2em] text-[var(--j-brand)]">
                  E&gt;
                </span>
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link
              href="/blog/news"
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-[var(--j-brand)] transition hover:text-[var(--j-paper)]"
              data-cursor="NEWS"
            >
              <span className="rounded border border-[var(--j-brand)] px-1 py-0.5 text-[9px] tracking-[0.15em]">E&gt;</span>
              World News
            </Link>
            {categories.slice(0, 5).map((cat) => (
              <a
                key={cat}
                href="#stream"
                onClick={() => onCategory?.(cat)}
                className="text-[11px] uppercase tracking-[0.22em] text-[var(--j-muted)] transition hover:text-[var(--j-brand)]"
                data-cursor="VIEW"
              >
                {cat}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <JournalLanguage />
            <button
              type="button"
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--j-line)] text-[var(--j-paper)] transition hover:border-[var(--j-brand)] hover:text-[var(--j-brand)]"
              onClick={() => setSearchOpen(true)}
              data-cursor="FIND"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--j-line)] text-[var(--j-paper)] md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span className="text-xs tracking-widest">MENU</span>
            </button>
            <Link
              href="/ai?mode=blog"
              className="hidden text-[11px] uppercase tracking-[0.2em] text-[var(--j-muted)] hover:text-[var(--j-brand)] md:inline"
              data-cursor="AI"
            >
              Eben AI
            </Link>
            <Link
              href="https://ebenezerdigital.com"
              className="hidden rounded-full border border-[var(--j-brand)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--j-brand)] transition hover:bg-[var(--j-brand)] hover:text-[#04110c] md:inline-flex"
              data-cursor="→"
            >
              Studio
            </Link>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[75] bg-[var(--j-ink)] px-6 py-8 md:hidden">
          <div className="mb-10 flex justify-between">
            <p className="text-xs tracking-[0.3em] text-[var(--j-brand)]">MENU</p>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-5">
            <Link href="/blog/news" className="block font-serif text-3xl text-[var(--j-brand)]">
              E&gt; World News
            </Link>
            {categories.map((cat) => (
              <a
                key={cat}
                href="#stream"
                onClick={() => {
                  onCategory?.(cat);
                  setMenuOpen(false);
                }}
                className="block font-serif text-3xl text-[var(--j-paper)]"
              >
                {cat}
              </a>
            ))}
            <Link href="/ai?mode=blog" className="block pt-6 text-[var(--j-brand)]">
              Eben AI
            </Link>
            <Link href="https://ebenezerdigital.com" className="block pt-2 text-[var(--j-brand)]">
              Ebenezer Digital Studio →
            </Link>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[75] flex items-start justify-center bg-black/85 px-4 pt-28 backdrop-blur-md">
          <div className="w-full max-w-3xl">
            <div className="mb-8 flex items-start justify-between gap-4">
              <h2 className="font-serif text-4xl leading-none text-[var(--j-paper)] sm:text-6xl">
                What are you
                <br />
                looking for?
              </h2>
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
              placeholder="Search stories, ideas, topics…"
              className="w-full border-b border-[var(--j-line)] bg-transparent pb-4 font-serif text-2xl text-[var(--j-paper)] outline-none placeholder:text-[var(--j-muted)] focus:border-[var(--j-brand)]"
            />
            <p className="mt-4 text-sm text-[var(--j-muted)]">
              Press Esc to close. Results filter the stream below.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
