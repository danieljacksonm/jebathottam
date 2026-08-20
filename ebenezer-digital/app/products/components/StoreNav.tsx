"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { STORE_CATEGORIES, STORE_PRODUCTS, formatINR } from "../data";
import { useStore } from "./StoreProvider";
import { useStoreI18n, type StoreLocale } from "../i18n";
import { SITE_NAV } from "@/lib/site-nav";

export function StoreNav() {
  const { cartCount, setCartOpen, searchOpen, setSearchOpen } = useStore();
  const { locale, setLocale, t } = useStoreI18n();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchOpen(false); setMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return STORE_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query]);

  const navLinks = [
    { href: "/products#all-products", label: t("products") },
    { href: "/products#categories",   label: t("categories") },
    { href: "/products#bundles",       label: t("bundles") },
    { href: "/products#freebies",      label: t("freebies") },
    { href: "/products/free-enquiry-form-kit", label: t("freeTool") },
    { href: SITE_NAV.journal, label: "Journal" },
    { href: SITE_NAV.news, label: "News" },
  ];

  return (
    <>
      {/* ── Top bar ──────────────────────────────────────── */}
      <header className={cn("store-nav", solid && "is-solid")}>
        <div className="s-page flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/products" className="flex items-center gap-2.5" aria-label="Ebenezer Store home">
            <Image
              src="/brand/ebenezer-store-mark.svg"
              alt="Ebenezer Store"
              width={32}
              height={32}
              className="rounded-lg"
              priority
            />
            <div className="leading-none">
              <p className="font-display text-sm font-bold text-[var(--s-ink)]">Ebenezer</p>
              <p className="text-[10px] font-semibold text-[var(--s-brand)]">Store</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((item) =>
              item.href.includes("#") ? (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-[var(--s-muted)] transition-colors hover:text-[var(--s-brand)]"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-[var(--s-muted)] transition-colors hover:text-[var(--s-brand)]"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--s-line)] bg-[var(--s-surface)] text-[var(--s-muted)] transition hover:border-[var(--s-brand)] hover:text-[var(--s-brand)]"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Account */}
            <Link
              href="/products/account"
              className="hidden text-sm font-medium text-[var(--s-muted)] transition-colors hover:text-[var(--s-brand)] md:block"
            >
              {t("account")}
            </Link>

            {/* AI */}
            <Link
              href={`${SITE_NAV.ai}?mode=product`}
              className="hidden rounded-lg border border-[var(--s-brand)] bg-[var(--s-brand-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--s-brand-dk)] transition hover:bg-[var(--s-brand)] hover:text-white md:block"
            >
              Eben AI
            </Link>

            {/* Language */}
            <label className="hidden items-center rounded-lg border border-[var(--s-line)] bg-[var(--s-surface)] px-2 py-1.5 text-xs font-medium text-[var(--s-muted)] md:flex">
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as StoreLocale)}
                className="bg-transparent outline-none"
                aria-label="Language"
              >
                <option value="en">EN</option>
                <option value="hi">HI</option>
                <option value="ta">TA</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
                <option value="ar">AR</option>
                <option value="de">DE</option>
                <option value="pt">PT</option>
                <option value="ru">RU</option>
                <option value="ja">JA</option>
                <option value="ko">KO</option>
                <option value="zh">ZH</option>
                <option value="tr">TR</option>
                <option value="id">ID</option>
              </select>
            </label>

            {/* Cart */}
            <button
              type="button"
              aria-label={`Cart (${cartCount})`}
              className="relative grid h-9 w-9 place-items-center rounded-lg border border-[var(--s-line)] bg-[var(--s-surface)] text-[var(--s-muted)] transition hover:border-[var(--s-brand)] hover:text-[var(--s-brand)]"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[var(--s-brand)] px-0.5 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--s-line)] bg-[var(--s-surface)] text-[var(--s-muted)] lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ───────────────────────────────────── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[75] overflow-y-auto bg-white px-5 py-5 lg:hidden">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/products" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
              <Image src="/brand/ebenezer-store-mark.svg" alt="" width={28} height={28} className="rounded-lg" />
              <span className="font-display font-bold text-[var(--s-ink)]">Ebenezer Store</span>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--s-line)]"
            >
              <X className="h-5 w-5 text-[var(--s-ink)]" />
            </button>
          </div>

          {/* Main links */}
          <div className="space-y-1">
            {[
              { href: "/products#all-products", label: "All products" },
              { href: "/products#categories",   label: t("categories") },
              { href: "/products#bundles",       label: t("bundles") },
              { href: "/products#freebies",      label: "Free tools" },
              { href: "/products/account",       label: t("account") },
            ].map((item) =>
              item.href.includes("#") ? (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-[var(--s-ink)] hover:bg-[var(--s-line-soft)]"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-[var(--s-ink)] hover:bg-[var(--s-line-soft)]"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>

          {/* Categories */}
          <div className="mt-6 border-t border-[var(--s-line)] pt-5">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--s-muted)]">
              Categories
            </p>
            {STORE_CATEGORIES.map((cat) => (
              <a
                key={cat}
                href={`/products?cat=${encodeURIComponent(cat)}#all-products`}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-[var(--s-muted)] hover:bg-[var(--s-line-soft)] hover:text-[var(--s-ink)]"
              >
                {cat}
              </a>
            ))}
          </div>

          {/* CTA links */}
          <div className="mt-6 space-y-3">
            <Link
              href={`${SITE_NAV.ai}?mode=product`}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl bg-[var(--s-brand)] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Eben AI — Ask a product question
            </Link>
            <Link
              href={SITE_NAV.saas}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl border border-[var(--s-line)] px-4 py-3 text-center text-sm font-semibold text-[var(--s-ink)]"
            >
              SaaS billing
            </Link>
          </div>
        </div>
      )}

      {/* ── Search overlay ────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[75] flex flex-col bg-white/98 px-5 pt-5 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-[var(--s-line)] pb-4">
            <Search className="h-5 w-5 text-[var(--s-brand)]" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 bg-transparent text-lg font-medium text-[var(--s-ink)] outline-none placeholder:text-[var(--s-muted)]"
            />
            <button
              type="button"
              onClick={() => { setSearchOpen(false); setQuery(""); }}
              aria-label="Close search"
              className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--s-line)]"
            >
              <X className="h-5 w-5 text-[var(--s-muted)]" />
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto py-4">
            {results.length > 0 ? (
              <div className="space-y-2">
                {results.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    onClick={() => { setSearchOpen(false); setQuery(""); }}
                    className="flex items-center gap-4 rounded-xl border border-[var(--s-line)] p-3 transition hover:border-[var(--s-brand)] hover:shadow-sm"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--s-line-soft)]">
                      <Image src={p.image} alt="" fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase text-[var(--s-muted)]">{p.category}</p>
                      <p className="truncate font-semibold text-[var(--s-ink)]">{p.name}</p>
                      <p className="text-sm font-bold text-[var(--s-brand)]">{formatINR(p.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query ? (
              <p className="text-[var(--s-muted)]">{t("noResults")}</p>
            ) : (
              <p className="text-sm text-[var(--s-muted)]">
                Type a product name, category, or keyword.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
