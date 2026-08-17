"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
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
import { markForCategory } from "@/lib/brand-marks";
import {
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site-contact";

function ProductCard({
  product,
  className = "",
}: {
  product: StoreProduct;
  className?: string;
}) {
  const { locale } = useStoreI18n();
  const p = localizeProduct(product, locale);
  return (
    <Link
      href={`/products/${p.slug}`}
      data-cursor="VIEW"
      className={`group relative block overflow-hidden ${className}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#111]">
        <Image
          src={p.image}
          alt={p.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 80vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        {p.badge && (
          <span className="absolute left-4 top-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--s-brand)]">
            {p.badge}
          </span>
        )}
        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-[var(--s-line)] bg-black/45 px-2 py-1 backdrop-blur">
          <Image src={markForCategory(p.category)} alt="" width={18} height={18} className="rounded-sm" />
          <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--s-paper)]/85">
            E · {p.category}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--s-muted)]">{p.category}</p>
          <h3 className="mt-2 font-serif text-2xl leading-tight">{p.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-[var(--s-muted)]">{p.tagline}</p>
          <ul className="mt-3 space-y-1 text-[11px] text-[var(--s-paper)]/80">
            {(p.pdfs && p.pdfs.length
              ? p.pdfs.map((pdf) => `${pdf.label}.pdf`)
              : (p.includes || []).slice(0, 3)
            ).slice(0, 3).map((item) => (
              <li key={item} className="line-clamp-1">
                · {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[var(--s-brand)]">{formatINR(p.price)}</span>
            <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-[var(--s-paper)]">
              See kit <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  const { t, rtl, locale } = useStoreI18n();
  const [activeCat, setActiveCat] = useState<string>("ALL");
  const my = useMotionValue(0);
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const floatY = useTransform(sy, [-0.5, 0.5], [-12, 12]);
  const shelfRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const onMove = (e: MouseEvent) => {
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [my]);

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
  const featuredRaw = catalog.find((p) => p.slug === "ebenezer-saas") || catalog[0];
  const featured = localizeProduct(featuredRaw, locale);
  const sideFeatured = catalog.filter((p) => p.id !== featuredRaw.id).slice(0, 2);
  const bestsellers = catalog.filter((p) =>
    ["creator-landing-kit", "creator-bundle", "shop-pos-starter-pack", "brand-kit-essentials"].includes(p.slug)
  );
  const freebies = catalog.filter((p) => p.isFree && !p.isSoftware);
  const bundles = catalog.filter((p) => p.isBundle);
  const newestRaw = catalog.find((p) => p.slug === "creator-landing-kit") || catalog[1];
  const newest = localizeProduct(newestRaw, locale);
  const filtered = useMemo(
    () =>
      activeCat === "ALL"
        ? catalog
        : catalog.filter((p) => p.category === activeCat),
    [activeCat, catalog]
  );
  const catPreview = filtered[0]?.image;

  return (
    <div className="store-root relative min-h-screen" dir={rtl ? "rtl" : "ltr"}>
      <div className="store-grain" />
      <StoreCursor />
      <StoreNav />
      <StoreCart />

      {/* HERO */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <motion.div style={{ y: floatY }} className="absolute inset-0">
          <Image
            src={featured.image}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--s-ink)] via-black/55 to-black/25" />
        </motion.div>
        <div className="relative z-10 flex min-h-[100svh] items-end px-4 pb-16 pt-28 sm:px-8 lg:px-12">
          <div className="w-full max-w-4xl">
            <p className="mb-6 text-[11px] uppercase tracking-[0.45em] text-[var(--s-brand)]">
              {t("heroKicker")}
            </p>
            <h1 className="font-serif text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
              Digital kits.
              <br />
              Built to use.
            </h1>
            <p className="mt-6 max-w-xl text-sm text-[var(--s-muted)] sm:text-base">
              {t("heroTag")} Prices in USD. Instant download worldwide.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#featured"
                className="inline-flex min-h-[48px] items-center gap-2 bg-[var(--s-brand)] px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#04110c]"
                data-cursor="CLICK"
              >
                {t("exploreProducts")} <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="#bundles"
                className="inline-flex min-h-[48px] items-center border border-[var(--s-line)] px-6 text-[11px] uppercase tracking-[0.22em]"
                data-cursor="VIEW"
              >
                {t("viewBundles")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <StoreMarquee
        items={["Worldwide store", "USD pricing", "Instant download", "See what’s in the kit", "Ebenezer Store"]}
      />

      {/* FEATURED */}
      <section id="featured" className="px-4 py-20 sm:px-8 lg:px-12">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--s-muted)]">{t("featured")}</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <Link href={`/products/${featured.slug}`} className="group relative block overflow-hidden" data-cursor="VIEW">
            <div className="relative aspect-[16/11] overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.name}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                {featured.badge && (
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--s-brand)]">{featured.badge}</p>
                )}
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-6xl">{featured.name}</h2>
                <p className="mt-3 max-w-lg text-sm text-[var(--s-muted)]">{featured.tagline}</p>
                {featured.pdfs?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {featured.pdfs.slice(0, 3).map((pdf) => (
                      <span
                        key={pdf.file}
                        className="border border-white/20 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/85"
                      >
                        {pdf.label}
                      </span>
                    ))}
                  </div>
                ) : null}
                <ul className="mt-4 space-y-1 text-sm text-[var(--s-paper)]/85">
                  {(featured.includes || []).slice(0, 4).map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center gap-4 text-[var(--s-brand)]">
                  <span className="text-lg">{formatINR(featured.price)}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em]">
                    {featured.isSoftware ? t("getStartedFree") : "View product"}{" "}
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {sideFeatured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="relative overflow-hidden border-y border-[var(--s-line)] px-4 py-20 sm:px-8 lg:px-12">
        {catPreview && activeCat !== "ALL" && (
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <Image src={catPreview} alt="" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-[var(--s-ink)]/75" />
          </div>
        )}
        <div className="relative">
          <p className="mb-8 text-[11px] uppercase tracking-[0.35em] text-[var(--s-muted)]">{t("categories")}</p>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {["ALL", ...STORE_CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCat(cat);
                  const url = cat === "ALL" ? "/products#categories" : `/products?cat=${encodeURIComponent(cat)}#categories`;
                  window.history.replaceState(null, "", url);
                }}
                data-cursor="VIEW"
                className={`font-serif text-4xl transition sm:text-5xl lg:text-6xl ${
                  activeCat === cat ? "text-[var(--s-brand)]" : "text-[var(--s-paper)]/35 hover:text-[var(--s-paper)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS SHELF */}
      <section className="py-20">
        <div className="mb-8 flex items-end justify-between px-4 sm:px-8 lg:px-12">
          <h3 className="font-serif text-3xl sm:text-5xl">{t("bestSellers")}</h3>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--s-muted)]">{t("dragSwipe")}</p>
        </div>
        <div ref={shelfRef} className="flex gap-4 overflow-x-auto px-4 pb-4 sm:px-8 lg:px-12">
          {bestsellers.map((p, i) => (
            <div
              key={p.id}
              className={`shrink-0 ${i % 3 === 0 ? "w-[78vw] sm:w-[380px]" : "w-[70vw] sm:w-[300px]"}`}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <StoreMarquee items={["Templates", "UI kits", "Ebooks", "Business tools", "Freebies"]} />

      {/* JUST DROPPED */}
      {newest && (
        <section className="px-4 py-20 sm:px-8 lg:px-12">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--s-brand)]">{t("justDropped")}</p>
          <Link href={`/products/${newest.slug}`} className="group mt-8 grid items-center gap-8 lg:grid-cols-2" data-cursor="VIEW">
            <div className="relative aspect-[16/11] overflow-hidden">
              <Image
                src={newest.image}
                alt={newest.name}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="50vw"
              />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--s-muted)]">{newest.category}</p>
              <h3 className="mt-3 font-serif text-4xl sm:text-6xl">{newest.name}</h3>
              <p className="mt-4 text-[var(--s-muted)]">{newest.tagline}</p>
              <ul className="mt-5 space-y-1 text-sm text-[var(--s-muted)]">
                {(newest.includes || []).slice(0, 4).map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
              <p className="mt-6 text-[var(--s-brand)]">{formatINR(newest.price)}</p>
            </div>
          </Link>
        </section>
      )}

      {/* BUNDLES */}
      <section id="bundles" className="border-t border-[var(--s-line)] px-4 py-20 sm:px-8 lg:px-12">
        <h3 className="font-serif text-3xl sm:text-5xl">{t("bundles")}</h3>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {bundles.map((bundle) => {
            const items = catalog.filter((p) => bundle.bundleItems?.includes(p.id));
            return (
              <Link
                key={bundle.id}
                href={`/products/${bundle.slug}`}
                data-cursor="VIEW"
                className="group relative overflow-hidden border border-[var(--s-line)] p-6 sm:p-8"
              >
                <div className="mb-6 flex h-40 items-end justify-center">
                  {items.map((item, i) => (
                    <div
                      key={item.id}
                      className="relative h-36 w-28 overflow-hidden border border-white/10 transition duration-500 group-hover:translate-y-[-8px]"
                      style={{
                        marginLeft: i === 0 ? 0 : -28,
                        zIndex: items.length - i,
                        transform: `rotate(${(i - 1) * 4}deg)`,
                      }}
                    >
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="112px" />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--s-brand)]">Bundle</p>
                <h4 className="mt-2 font-serif text-3xl">{bundle.name}</h4>
                <p className="mt-2 text-sm text-[var(--s-muted)]">
                  {items.length} kits inside · Real files included
                </p>
                <ul className="mt-3 space-y-1 text-sm text-[var(--s-paper)]/80">
                  {items.map((item) => (
                    <li key={item.id}>· {item.name}</li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-lg text-[var(--s-brand)]">{formatINR(bundle.price)}</span>
                  {bundle.compareAt && (
                    <span className="text-sm text-[var(--s-muted)] line-through">{formatINR(bundle.compareAt)}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FREEBIES */}
      <section id="freebies" className="px-4 py-20 sm:px-8 lg:px-12">
        <h3 className="font-serif text-4xl sm:text-6xl">
          {t("startFree")}
        </h3>
        <p className="mt-4 max-w-md text-[var(--s-muted)]">
          Useful free digital tools to try before you buy.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {freebies.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-[var(--s-line)] px-4 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Worldwide", "Instant digital delivery to any country"],
            ["What’s inside", "Every kit lists real files before you buy"],
            ["USD pricing", "Clear global prices. Free tools stay free."],
            ["Human support", "Help from Ebenezer Digital when you need it"],
          ].map(([t, d]) => (
            <div key={t} className="border-t border-[var(--s-line)] pt-5">
              <p className="font-serif text-xl">{t}</p>
              <p className="mt-2 text-sm text-[var(--s-muted)]">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL */}
      <section className="px-4 py-20 sm:px-8 lg:px-12">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--s-muted)]">From customers</p>
        <blockquote className="mt-8 max-w-4xl font-serif text-3xl leading-tight sm:text-5xl">
          “Clean products. Clear value. Easy to use for real client work.”
        </blockquote>
        <div className="mt-6 flex items-center gap-2 text-sm text-[var(--s-muted)]">
          <div className="flex text-[var(--s-brand)]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <span>Early store buyers · Ebenezer Digital clients</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative overflow-hidden border-t border-[var(--s-line)] px-4 py-24 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.16),transparent_45%)]" />
        <div className="relative">
          <h3 className="font-serif text-[12vw] leading-[0.85] sm:text-[7vw]">
            BUILD
            <br />
            SOMETHING
            <br />
            BETTER.
          </h3>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <div className="space-y-2 text-sm text-[var(--s-muted)]">
              <a href="/products#featured" className="block hover:text-[var(--s-brand)]">Explore products</a>
              <a href="/products#categories" className="block hover:text-[var(--s-brand)]">Categories</a>
              <a href="/products#bundles" className="block hover:text-[var(--s-brand)]">Bundles</a>
              <a href="/products#freebies" className="block hover:text-[var(--s-brand)]">Freebies</a>
              <Link href="/products/free-enquiry-form-kit" className="block text-[var(--s-brand)]">
                Free Tool → Enquiry Form Kit
              </Link>
              <Link href="/products/ebenezer-saas" className="block hover:text-[var(--s-brand)]">
                Ebenezer SaaS (Free)
              </Link>
            </div>
            <div className="space-y-2 text-sm text-[var(--s-muted)]">
              <Link href="https://ebenezerdigital.com/contact" className="block hover:text-[var(--s-brand)]">Support</Link>
              <a href={`mailto:${SITE_EMAIL}`} className="block hover:text-[var(--s-brand)]">
                {SITE_EMAIL}
              </a>
              <a href={SITE_PHONE_TEL} className="block hover:text-[var(--s-brand)]">
                {SITE_PHONE_DISPLAY}
              </a>
              <a
                href={SITE_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-[var(--s-brand)]"
              >
                WhatsApp
              </a>
              <Link href="https://ebenezerdigital.com/terms" className="block hover:text-[var(--s-brand)]">License</Link>
              <Link href="https://ebenezerdigital.com/privacy" className="block hover:text-[var(--s-brand)]">Privacy</Link>
              <Link href="https://ebenezerdigital.com" className="block hover:text-[var(--s-brand)]">Studio</Link>
            </div>
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <p className="text-sm text-[var(--s-muted)]">New drops in your inbox</p>
              <input
                type="email"
                required
                placeholder="Email"
                className="min-h-[48px] border border-[var(--s-line)] bg-transparent px-4 text-sm outline-none focus:border-[var(--s-brand)]"
              />
              <button
                type="submit"
                className="min-h-[48px] bg-[var(--s-brand)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#04110c]"
                data-cursor="CLICK"
              >
                Subscribe
              </button>
            </form>
          </div>
          <p className="mt-16 text-xs text-[var(--s-muted)]">
            © {new Date().getFullYear()} Ebenezer Store · Worldwide digital products
          </p>
        </div>
      </footer>
    </div>
  );
}
