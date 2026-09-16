"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { categoryMeta } from "@/lib/catalog";
import { SITE_NAME } from "@/lib/constants";
import { SearchBar } from "@/components/search/SearchBar";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/custom-stickers", label: "Custom" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

const CATEGORIES = Object.values(categoryMeta).filter((c) => c.slug !== "custom");

export function Header() {
  const { count, setOpen } = useCart();
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setCatsOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(5,5,6,0.9)] backdrop-blur-md transition-[height,background] duration-200",
        compact ? "h-14" : "h-[var(--header-h)]",
      )}
    >
      <div className="container-x h-full flex items-center gap-6">
        <Link href="/" className="shrink-0 group" aria-label={`${SITE_NAME} home`}>
          <span className="font-display text-[1.65rem] leading-none tracking-[0.06em] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
            RAJU
          </span>
          <span className="block text-[0.58rem] tracking-[0.32em] text-[var(--ink-3)] mt-0.5">
            STICKERS
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 text-[var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors",
                pathname.startsWith(item.href) && "text-[var(--ink)]",
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              className="px-3 py-2 text-[var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-[var(--ink-2)] hover:text-[var(--ink)]"
              aria-expanded={catsOpen}
              onClick={() => setCatsOpen((v) => !v)}
            >
              Collections
            </button>
            {catsOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 surface p-2 shadow-[var(--shadow-soft)] z-50">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/shop/${cat.slug}`}
                    className="block px-3 py-2.5 text-sm text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--bg-hover)]"
                    onClick={() => setCatsOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden md:block flex-1 max-w-sm ml-auto">
          <SearchBar />
        </div>

        <div className="flex items-center gap-1 ml-auto md:ml-2">
          <button
            type="button"
            className="md:hidden btn btn-ghost"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            Search
          </button>
          <Link href="/account" className="hidden md:inline-flex btn btn-ghost text-[var(--text-xs)] tracking-[0.12em]">
            Account
          </Link>
          <button
            type="button"
            className="btn btn-ghost relative text-[var(--text-xs)] tracking-[0.12em]"
            aria-label={`Cart, ${count} items`}
            onClick={() => setOpen(true)}
          >
            Cart
            {count > 0 && (
              <span className="absolute top-1 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--accent)] text-[10px] font-bold flex items-center justify-center text-white">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            className="lg:hidden btn btn-secondary btn-sm ml-1"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            Menu
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="md:hidden border-t border-[var(--line)] bg-[var(--bg)] px-[var(--gutter)] py-3">
          <SearchBar autoFocus />
        </div>
      )}

      {menuOpen && (
        <div id="mobile-menu" className="lg:hidden fixed inset-0 z-[70] bg-[var(--bg)]">
          <div className="container-x h-14 flex items-center justify-between border-b border-[var(--line)]">
            <span className="font-display text-lg tracking-[0.1em]">Menu</span>
            <button type="button" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>
              Close
            </button>
          </div>
          <div className="container-x py-6 space-y-1">
            {[...NAV, { href: "/ai-finder", label: "AI Finder" }, { href: "/faq", label: "FAQ" }, { href: "/contact", label: "Contact" }].map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-3.5 font-display text-2xl tracking-[0.04em] border-b border-[var(--line)]"
                >
                  {item.label}
                </Link>
              ),
            )}
            <p className="pt-8 pb-3 text-[var(--text-xs)] uppercase tracking-[0.2em] text-[var(--ink-3)]">
              Collections
            </p>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop/${cat.slug}`}
                className="block py-2.5 text-[var(--ink-2)]"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
