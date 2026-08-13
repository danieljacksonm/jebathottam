"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { STORE_CATEGORIES, STORE_PRODUCTS, formatINR } from "../data";
import { useStore } from "./StoreProvider";
import { useStoreI18n, type StoreLocale } from "../i18n";

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
  }, [setSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return STORE_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  return (
    <>
      <header className={cn("store-nav", solid && "is-solid")}>
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <Link href="/products" className="flex items-center gap-3" data-cursor="HOME">
            <Image
              src="/brand/ebenezer-store-mark.svg"
              alt="Ebenezer Store"
              width={36}
              height={36}
              className="rounded-lg"
              priority
            />
            <div className="leading-none">
              <p className="font-serif text-[11px] tracking-[0.35em] text-[var(--s-paper)]">EBENEZER</p>
              <p className="mt-1 text-[10px] tracking-[0.42em] text-[var(--s-brand)]">STORE</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {[
              { href: "#featured", label: t("products") },
              { href: "#categories", label: t("categories") },
              { href: "#bundles", label: t("bundles") },
              { href: "/products/free-enquiry-form-kit", label: t("freeTool") },
              { href: "#freebies", label: t("freebies") },
            ].map((item) =>
              item.href.startsWith("/") ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[11px] uppercase tracking-[0.22em] text-[var(--s-muted)] transition hover:text-[var(--s-brand)]"
                  data-cursor="VIEW"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-[11px] uppercase tracking-[0.22em] text-[var(--s-muted)] transition hover:text-[var(--s-brand)]"
                  data-cursor="VIEW"
                >
                  {item.label}
                </a>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--s-line)]"
              onClick={() => setSearchOpen(true)}
              data-cursor="FIND"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              href="/products/account"
              className="hidden text-[11px] uppercase tracking-[0.2em] text-[var(--s-muted)] hover:text-[var(--s-brand)] md:inline"
            >
              {t("account")}
            </Link>
            <Link
              href="/ai?mode=product"
              className="hidden text-[11px] uppercase tracking-[0.2em] text-[var(--s-muted)] hover:text-[var(--s-brand)] md:inline"
            >
              Ask AI
            </Link>
            <label className="hidden items-center gap-2 rounded-full border border-[var(--s-line)] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--s-muted)] md:flex">
              <span>Lang</span>
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
            <button
              type="button"
              aria-label={`Cart (${cartCount})`}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-[var(--s-line)]"
              onClick={() => setCartOpen(true)}
              data-cursor="CART"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--s-brand)] px-1 text-[10px] font-bold text-[#04110c]">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--s-line)] lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[75] bg-[var(--s-ink)] px-6 py-8 lg:hidden">
          <div className="mb-10 flex justify-between">
            <p className="text-xs tracking-[0.3em] text-[var(--s-brand)]">MENU</p>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-5">
            {STORE_CATEGORIES.map((cat) => (
              <a
                key={cat}
                href="#categories"
                onClick={() => setMenuOpen(false)}
                className="block font-serif text-3xl"
              >
                {cat}
              </a>
            ))}
            <Link
              href="/ai?mode=product"
              onClick={() => setMenuOpen(false)}
              className="block font-serif text-3xl text-[var(--s-brand)]"
            >
              Ask Store AI
            </Link>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[75] flex items-start justify-center bg-black/85 px-4 pt-24 backdrop-blur-md">
          <div className="w-full max-w-3xl">
            <div className="mb-8 flex items-start justify-between gap-4">
              <h2 className="font-serif text-4xl leading-none sm:text-6xl">{t("searchPrompt")}</h2>
              <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
                <X className="h-7 w-7" />
              </button>
            </div>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full border-b border-[var(--s-line)] bg-transparent pb-4 font-serif text-2xl outline-none placeholder:text-[var(--s-muted)] focus:border-[var(--s-brand)]"
            />
            <div className="mt-8 space-y-3">
              {results.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center gap-4 border-b border-[var(--s-line)] py-3 transition hover:border-[var(--s-brand)]"
                  data-cursor="VIEW"
                >
                  <div className="relative h-14 w-12 overflow-hidden">
                    <Image src={p.image} alt="" fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--s-muted)]">{p.category}</p>
                    <p className="truncate font-serif text-xl">{p.name}</p>
                  </div>
                  <p className="text-sm text-[var(--s-brand)]">{formatINR(p.price)}</p>
                </Link>
              ))}
              {query && results.length === 0 && (
                <p className="text-sm text-[var(--s-muted)]">{t("noResults")}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
