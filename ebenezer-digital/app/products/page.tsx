"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, FileText, ShieldCheck, Star, Truck, Zap } from "lucide-react";
import { StoreNav } from "./components/StoreNav";
import { StoreCursor } from "./components/StoreCursor";
import { StoreCart } from "./components/StoreCart";
import { StoreMarquee } from "./components/StoreMarquee";
import { useStoreI18n } from "./i18n";
import { localizeProduct } from "./product-i18n";
import {
  STORE_CATEGORIES,
  orderedProducts,
  formatINR,
  type StoreProduct,
} from "./data";
import {
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site-contact";

/* ── Product card — light, clean ─────────────────────────── */
function ProductCard({
  product,
  className = "",
}: {
  product: StoreProduct;
  className?: string;
}) {
  const { locale } = useStoreI18n();
  const p = localizeProduct(product, locale);

  const badgeClass = p.badge === "FREE"
    ? "s-badge s-badge-free"
    : p.badge === "NEW"
    ? "s-badge s-badge-new"
    : p.badge === "BUNDLE"
    ? "s-badge s-badge-bundle"
    : "s-badge s-badge-hot";

  const fileLines = (p.pdfs && p.pdfs.length)
    ? p.pdfs.map((pdf) => pdf.label)
    : (p.includes || []).slice(0, 3);

  return (
    <Link
      href={`/products/${p.slug}`}
      className={`s-card group flex flex-col ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--s-line-soft)]">
        <Image
          src={p.image}
          alt={p.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-103"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {p.badge && (
          <span className={`${badgeClass} absolute left-3 top-3 shadow-sm`}>{p.badge}</span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--s-muted)]">
          {p.category}
        </p>
        <h3 className="mt-1.5 font-semibold leading-snug text-[var(--s-ink)] group-hover:text-[var(--s-brand)] transition-colors duration-200">
          {p.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-[var(--s-muted)]">{p.tagline}</p>

        {/* File list */}
        {fileLines.length > 0 && (
          <ul className="mt-3 space-y-1">
            {fileLines.slice(0, 3).map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-[12px] text-[var(--s-muted)]">
                <FileText className="h-3 w-3 shrink-0 text-[var(--s-brand)]" />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Price row */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className={`font-bold text-lg ${p.isFree ? "text-[var(--s-brand)]" : "text-[var(--s-ink)]"}`}>
            {formatINR(p.price)}
          </span>
          <span className="flex items-center gap-1 text-[12px] font-semibold text-[var(--s-brand)]">
            View kit <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Main page ────────────────────────────────────────────── */
export default function ProductsPage() {
  const { t, rtl, locale } = useStoreI18n();
  const [activeCat, setActiveCat] = useState<string>("ALL");
  const shelfRef = useRef<HTMLDivElement>(null);

  /* Sync cat + hash from URL */
  useEffect(() => {
    const applyFromUrl = () => {
      const cat = new URLSearchParams(window.location.search).get("cat");
      if (cat && (STORE_CATEGORIES as readonly string[]).includes(cat)) setActiveCat(cat);
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    applyFromUrl();
    window.addEventListener("hashchange", applyFromUrl);
    window.addEventListener("popstate", applyFromUrl);
    return () => {
      window.removeEventListener("hashchange", applyFromUrl);
      window.removeEventListener("popstate", applyFromUrl);
    };
  }, []);

  /* Horizontal scroll with mousewheel on shelf */
  useEffect(() => {
    const el = shelfRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const catalog = orderedProducts();
  const featured = catalog.filter((p) =>
    ["ebenezer-saas", "creator-landing-kit", "creator-bundle"].includes(p.slug)
  ).map((p) => localizeProduct(p, locale));
  const bestsellers = catalog.filter((p) =>
    ["creator-landing-kit", "shop-pos-starter-pack", "brand-kit-essentials", "digital-business-playbook"].includes(p.slug)
  );
  const freebies = catalog.filter((p) => p.isFree && !p.isSoftware);
  const bundles = catalog.filter((p) => p.isBundle);
  const filtered = useMemo(
    () => activeCat === "ALL" ? catalog : catalog.filter((p) => p.category === activeCat),
    [activeCat, catalog],
  );

  const trustItems = [
    { icon: <Truck className="h-5 w-5 text-[var(--s-brand)]" />, title: "Instant worldwide delivery", desc: "Download immediately after getting access. No waiting." },
    { icon: <FileText className="h-5 w-5 text-[var(--s-brand)]" />, title: "See every file first", desc: "Full file list shown before you buy anything." },
    { icon: <ShieldCheck className="h-5 w-5 text-[var(--s-brand)]" />, title: "USD pricing, global", desc: "Clear prices in USD. Free tools always stay free." },
    { icon: <Zap className="h-5 w-5 text-[var(--s-brand)]" />, title: "Human support", desc: "Real help from Ebenezer Digital when you need it." },
  ];

  return (
    <div className="store-root" dir={rtl ? "rtl" : "ltr"}>
      <StoreCursor />
      <StoreNav />
      <StoreCart />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--s-surface)] pt-16">
        <div className="s-page py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="s-badge s-badge-free mb-5 inline-flex">Worldwide store · USD pricing</span>
              <h1 className="font-display text-4xl font-extrabold leading-tight text-[var(--s-ink)] sm:text-5xl lg:text-6xl">
                Professional digital kits.<br />
                <span className="text-[var(--s-brand)]">Ready to use.</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg text-[var(--s-muted)]">
                Templates, guides, and software for creators and small businesses — instant download, anywhere in the world.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#all-products" className="s-btn-primary">
                  Browse all products <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#freebies" className="s-btn-outline">
                  Free tools
                </a>
              </div>
              <div className="mt-8 flex items-center gap-5 text-sm text-[var(--s-muted)]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-[var(--s-brand)]" /> Instant download
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-[var(--s-brand)]" /> Files shown upfront
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-[var(--s-brand)]" /> Free tools available
                </span>
              </div>
            </div>

            {/* Hero product previews */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
              {featured.slice(0, 4).map((p, i) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className={`s-card group overflow-hidden ${i === 0 ? "col-span-2 sm:col-span-1 lg:col-span-2" : ""}`}
                >
                  <div className={`relative overflow-hidden bg-[var(--s-line-soft)] ${i === 0 ? "aspect-[16/9]" : "aspect-square"}`}>
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      priority={i === 0}
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    {p.badge && <span className="s-badge s-badge-free absolute left-2 top-2">{p.badge}</span>}
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] font-semibold text-[var(--s-muted)]">{p.category}</p>
                    <p className="mt-0.5 font-semibold text-sm text-[var(--s-ink)] line-clamp-1">{p.name}</p>
                    <p className="mt-0.5 text-[13px] font-bold text-[var(--s-brand)]">{formatINR(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StoreMarquee items={["Worldwide store", "USD pricing", "Instant download", "Files shown upfront", "Free tools available", "Ebenezer Store"]} />

      {/* ── TRUST ────────────────────────────────────────── */}
      <section className="bg-[var(--s-surface)]">
        <div className="s-page py-12">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item.title} className="s-trust-item">
                {item.icon}
                <div>
                  <p className="font-semibold text-sm text-[var(--s-ink)]">{item.title}</p>
                  <p className="mt-0.5 text-xs text-[var(--s-muted)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL PRODUCTS ─────────────────────────────────── */}
      <section id="all-products" className="s-page py-16">
        <div className="mb-8">
          <span className="s-section-label">{t("featured")}</span>
          <h2 className="text-2xl font-bold text-[var(--s-ink)] sm:text-3xl">All products</h2>
        </div>

        {/* Category filter pills */}
        <div id="categories" className="mb-8 flex flex-wrap gap-2">
          {["ALL", ...STORE_CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCat(cat);
                const url = cat === "ALL"
                  ? "/products#all-products"
                  : `/products?cat=${encodeURIComponent(cat)}#all-products`;
                window.history.replaceState(null, "", url);
              }}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
                activeCat === cat
                  ? "border-[var(--s-brand)] bg-[var(--s-brand)] text-white shadow-sm"
                  : "border-[var(--s-line)] bg-[var(--s-surface)] text-[var(--s-ink)] hover:border-[var(--s-brand)] hover:text-[var(--s-brand)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── BEST SELLERS ─────────────────────────────────── */}
      <section className="bg-[var(--s-surface)] py-16">
        <div className="s-page">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="s-section-label">{t("bestSellers")}</span>
              <h2 className="text-2xl font-bold text-[var(--s-ink)] sm:text-3xl">Top picks</h2>
            </div>
            <p className="text-sm text-[var(--s-muted)] hidden sm:block">{t("dragSwipe")} →</p>
          </div>
        </div>
        <div ref={shelfRef} className="flex gap-5 overflow-x-auto pb-4 pl-[var(--s-page-x)] pr-[var(--s-page-x)]">
          {bestsellers.map((p) => (
            <div key={p.id} className="w-72 shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <StoreMarquee items={["Templates", "UI kits", "Ebooks", "Business tools", "Freebies"]} />

      {/* ── BUNDLES ──────────────────────────────────────── */}
      <section id="bundles" className="s-page py-16">
        <span className="s-section-label">{t("bundles")}</span>
        <h2 className="mb-8 text-2xl font-bold text-[var(--s-ink)] sm:text-3xl">
          More value, bundled
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {bundles.map((bundle) => {
            const items = catalog.filter((p) => bundle.bundleItems?.includes(p.id));
            const loc = localizeProduct(bundle, locale);
            return (
              <Link
                key={bundle.id}
                href={`/products/${bundle.slug}`}
                className="s-card group flex gap-5 p-6 hover:shadow-lg transition-all"
              >
                {/* Stacked thumbnails */}
                <div className="relative h-24 w-20 shrink-0">
                  {items.slice(0, 3).map((item, i) => (
                    <div
                      key={item.id}
                      className="absolute h-20 w-16 overflow-hidden rounded-md border border-[var(--s-line)] shadow-sm"
                      style={{ left: i * 6, top: i * 4, zIndex: items.length - i }}
                    >
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                    </div>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="s-badge s-badge-bundle">Bundle</span>
                  <h4 className="mt-2 font-bold text-lg text-[var(--s-ink)] group-hover:text-[var(--s-brand)] transition-colors">
                    {loc.name}
                  </h4>
                  <p className="mt-1 text-sm text-[var(--s-muted)]">
                    {items.length} kits included — everything in one download
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="font-bold text-lg text-[var(--s-brand)]">{formatINR(bundle.price)}</span>
                    {bundle.compareAt && (
                      <span className="text-sm text-[var(--s-muted)] line-through">{formatINR(bundle.compareAt)}</span>
                    )}
                    <span className="ml-auto flex items-center gap-1 text-sm font-medium text-[var(--s-brand)]">
                      View bundle <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── FREEBIES ─────────────────────────────────────── */}
      <section id="freebies" className="bg-[var(--s-brand-bg)] py-16">
        <div className="s-page">
          <span className="s-section-label">{t("startFree")}</span>
          <h2 className="mb-2 text-2xl font-bold text-[var(--s-ink)] sm:text-3xl">Free tools — no payment needed</h2>
          <p className="mb-8 max-w-xl text-[var(--s-muted)]">
            Genuinely useful free digital tools for any small business. Download now, no account required.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {freebies.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ──────────────────────────────────── */}
      <section className="bg-[var(--s-surface)] py-16">
        <div className="s-page text-center">
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 flex justify-center gap-0.5 text-[var(--s-brand)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <blockquote className="font-display text-2xl font-bold text-[var(--s-ink)] sm:text-3xl">
              &ldquo;Clean products. Clear value. Easy to use for real client work.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-[var(--s-muted)]">
              Early store buyers · Ebenezer Digital clients
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-[var(--s-line)] bg-[var(--s-ink)] text-[var(--s-muted)]">
        <div className="s-page py-14">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl font-bold text-white">Ebenezer Store</p>
              <p className="mt-1 text-sm">Worldwide digital products · Instant download</p>
            </div>
            <a href="#all-products" className="s-btn-primary text-sm">
              Shop now
            </a>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-white mb-3">Products</p>
              <a href="/products#all-products" className="block hover:text-white transition-colors">All products</a>
              <a href="/products#categories" className="block hover:text-white transition-colors">Categories</a>
              <a href="/products#bundles" className="block hover:text-white transition-colors">Bundles</a>
              <a href="/products#freebies" className="block hover:text-white transition-colors">Free tools</a>
              <Link href="/products/ebenezer-saas" className="block hover:text-white transition-colors">Ebenezer SaaS</Link>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-white mb-3">Help</p>
              <Link href="https://ebenezerdigital.com/contact" className="block hover:text-white transition-colors">Support</Link>
              <a href={`mailto:${SITE_EMAIL}`} className="block hover:text-white transition-colors">{SITE_EMAIL}</a>
              <a href={SITE_PHONE_TEL} className="block hover:text-white transition-colors">{SITE_PHONE_DISPLAY}</a>
              <a href={SITE_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">WhatsApp</a>
              <Link href="https://ebenezerdigital.com/terms" className="block hover:text-white transition-colors">License terms</Link>
              <Link href="https://ebenezerdigital.com/privacy" className="block hover:text-white transition-colors">Privacy</Link>
            </div>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <p className="font-semibold text-white">Get new drops in your inbox</p>
              <input
                type="email"
                required
                placeholder="Your email address"
                className="min-h-[44px] rounded-lg border border-white/15 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-[var(--s-muted)] focus:border-[var(--s-brand)]"
              />
              <button
                type="submit"
                className="s-btn-primary rounded-lg text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-xs">
            © {new Date().getFullYear()} Ebenezer Store · Worldwide digital products ·{" "}
            <Link href="https://ebenezerdigital.com" className="hover:text-white transition-colors">ebenezerdigital.com</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
