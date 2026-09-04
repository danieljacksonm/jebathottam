"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, ShieldCheck, Truck, Zap, FileText } from "lucide-react";
import { StoreNav } from "./components/StoreNav";
import { StoreCart } from "./components/StoreCart";
import { ProductCard } from "./components/ProductCard";
import { useStoreI18n } from "./i18n";
import { localizeProduct } from "./product-i18n";
import {
  STORE_CATEGORIES,
  STORE_CATEGORY_PAGES,
  PRODUCT_TYPE_OPTIONS,
  orderedProducts,
  formatINR,
  filterDiscoverProducts,
  collectTechOptions,
  type StoreSort,
} from "./data";
import {
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site-contact";
import { SiteLegalLinks } from "@/components/SiteLegalLinks";

export default function ProductsPage() {
  const { t, rtl, locale, lp } = useStoreI18n();
  const [activeCat, setActiveCat] = useState<string>("ALL");
  const [query, setQuery] = useState("");
  const [productType, setProductType] = useState("all");
  const [technology, setTechnology] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
  const [sort, setSort] = useState<StoreSort>("featured");
  const [pageIndex, setPageIndex] = useState(0);
  const PAGE_SIZE = 12;
  const shelfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const applyFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("cat");
      if (cat) setActiveCat(cat);
      const q = params.get("q");
      if (q) setQuery(q);
      const type = params.get("type");
      if (type) setProductType(type);
      const tech = params.get("tech");
      if (tech) setTechnology(tech);
      const diff = params.get("difficulty");
      if (diff) setDifficulty(diff);
      const price = params.get("price");
      if (price === "free" || price === "paid" || price === "all") setPriceFilter(price);
      const s = params.get("sort") as StoreSort | null;
      if (s) setSort(s);
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
  const techOptions = useMemo(() => collectTechOptions(catalog), [catalog]);
  const featured = catalog
    .filter((p) =>
      ["ebenezer-saas", "invoice-generator", "saas-landing-website-template", "qr-menu-generator"].includes(p.slug)
    )
    .map((p) => localizeProduct(p, locale));
  const bestsellers = catalog.filter((p) =>
    ["invoice-generator", "restaurant-website-template", "ebenezer-saas", "quotation-generator", "qr-menu-generator"].includes(
      p.slug
    )
  );
  const freebies = catalog.filter(
    (p) =>
      p.isFree &&
      (p.productType === "free_resource" || p.productType === "ebook" || p.productType === "documentation")
  );
  const bundles = catalog.filter((p) => p.isBundle);
  const filtered = useMemo(
    () =>
      filterDiscoverProducts(catalog, {
        query,
        category: activeCat,
        productType,
        technology,
        difficulty,
        price: priceFilter,
        sort,
      }),
    [activeCat, catalog, difficulty, priceFilter, productType, query, sort, technology]
  );

  useEffect(() => {
    setPageIndex(0);
  }, [activeCat, query, productType, technology, difficulty, priceFilter, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE);

  const syncUrl = (next: {
    cat?: string;
    q?: string;
    type?: string;
    tech?: string;
    difficulty?: string;
    price?: string;
    sort?: string;
  }) => {
    const params = new URLSearchParams();
    const cat = next.cat ?? activeCat;
    const q = next.q ?? query;
    const type = next.type ?? productType;
    const tech = next.tech ?? technology;
    const diff = next.difficulty ?? difficulty;
    const price = next.price ?? priceFilter;
    const s = next.sort ?? sort;
    if (cat && cat !== "ALL") params.set("cat", cat);
    if (q.trim()) params.set("q", q.trim());
    if (type !== "all") params.set("type", type);
    if (tech !== "all") params.set("tech", tech);
    if (diff !== "all") params.set("difficulty", diff);
    if (price !== "all") params.set("price", price);
    if (s !== "featured") params.set("sort", s);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/products?${qs}#all-products` : "/products#all-products");
  };

  const trustItems = [
    { icon: <Truck className="h-5 w-5 text-[var(--s-brand)]" />, title: "Ready to use", desc: "Software, tools, and real source files — not tip PDFs." },
    { icon: <FileText className="h-5 w-5 text-[var(--s-brand)]" />, title: "Honest file lists", desc: "We show what you get. PDFs are docs, not the whole product." },
    { icon: <ShieldCheck className="h-5 w-5 text-[var(--s-brand)]" />, title: "USD pricing, global", desc: "Clear prices. Free tools stay free." },
    { icon: <Zap className="h-5 w-5 text-[var(--s-brand)]" />, title: "Human support", desc: "Real help from Ebenezer Digital when you need it." },
  ];

  return (
    <div className="store-root" dir={rtl ? "rtl" : "ltr"}>
      <StoreNav />
      <StoreCart />

      <section className="relative overflow-hidden bg-[var(--s-surface)]">
        <div className="s-page py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="s-badge s-badge-free mb-5 inline-flex">Ready-to-use digital products</span>
              <h1 className="font-display text-4xl font-extrabold leading-tight text-[var(--s-ink)] sm:text-5xl lg:text-6xl">
                Build. Create. Automate.
                <br />
                <span className="text-[var(--s-brand)]">Grow.</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg text-[var(--s-muted)]">
                Website templates with real source code, live invoice tools, and billing software. PDFs are only
                supporting docs — never the whole product.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#all-products" className="s-btn-primary">
                  Browse products <ArrowRight className="h-4 w-4" />
                </a>
                <Link href={lp("/products/category/website-templates")} className="s-btn-outline">
                  Website templates
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-[var(--s-muted)]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-[var(--s-brand)]" /> Real files &amp; tools
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-[var(--s-brand)]" /> Instant access
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-[var(--s-brand)]" /> Free starters
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
              {featured.slice(0, 4).map((p, i) => (
                <Link
                  key={p.id}
                  href={lp(`/products/${p.slug}`)}
                  className={`s-card group overflow-hidden ${i === 0 ? "col-span-2 sm:col-span-1 lg:col-span-2" : ""}`}
                >
                  <div
                    className={`relative overflow-hidden bg-[var(--s-line-soft)] ${
                      i === 0 ? "aspect-[16/9]" : "aspect-square"
                    }`}
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
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

      <section className="s-page py-10 border-b border-[var(--s-line)]">
        <span className="s-section-label">How to grow with us</span>
        <h2 className="mb-2 text-2xl font-bold text-[var(--s-ink)]">A clear path — no pressure</h2>
        <p className="mb-6 max-w-2xl text-sm text-[var(--s-muted)]">
          Start free, upgrade only when you need more. Custom work is available when kits are not enough.
        </p>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { step: "1", label: "Free resource", href: lp("/products?price=free"), hint: "Templates & starters" },
            { step: "2", label: "Starter product", href: lp("/products?cat=ALL"), hint: "Paid kits when ready" },
            { step: "3", label: "Premium product", href: lp("/products/category/software"), hint: "Deeper systems" },
            { step: "4", label: "Ebenezer SaaS", href: "https://saas.ebenezerdigital.com", hint: "Live software" },
            { step: "5", label: "Custom development", href: "https://ebenezerdigital.com/contact", hint: "Built for you" },
          ].map((item) => (
            <li key={item.step}>
              <a
                href={item.href}
                className="block h-full rounded-xl border border-[var(--s-line)] bg-[var(--s-surface)] p-4 transition hover:border-[var(--s-brand)]"
              >
                <span className="text-xs font-bold text-[var(--s-brand)]">Step {item.step}</span>
                <p className="mt-1 font-semibold text-sm text-[var(--s-ink)]">{item.label}</p>
                <p className="mt-0.5 text-xs text-[var(--s-muted)]">{item.hint}</p>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section id="categories" className="s-page py-10">
        <span className="s-section-label">Browse by type</span>
        <h2 className="mb-6 text-2xl font-bold text-[var(--s-ink)]">What you can use</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STORE_CATEGORY_PAGES.map((c) => (
            <Link
              key={c.slug}
              href={lp(`/products/category/${c.slug}`)}
              className="rounded-xl border border-[var(--s-line)] bg-[var(--s-surface)] p-4 hover:border-[var(--s-brand)] transition"
            >
              <p className="font-semibold text-[var(--s-ink)]">{c.name}</p>
              <p className="mt-1 text-sm text-[var(--s-muted)] line-clamp-2">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="all-products" className="s-page py-16">
        <div className="mb-8">
          <span className="s-section-label">{t("featured")}</span>
          <h2 className="text-2xl font-bold text-[var(--s-ink)] sm:text-3xl">All products</h2>
          <p className="mt-2 text-sm text-[var(--s-muted)]">
            Filter by type, technology, and price. Search works on name, tags, and use case.{" "}
            <Link href={lp("/products/roadmap")} className="text-[var(--s-brand)] hover:underline">
              See coming soon
            </Link>
          </p>
        </div>
        <div className="mb-4">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              syncUrl({ q: e.target.value });
            }}
            placeholder="Search products, tech, tags…"
            className="w-full max-w-xl rounded-xl border border-[var(--s-line)] bg-[var(--s-surface)] px-4 py-2.5 text-sm text-[var(--s-ink)] outline-none focus:border-[var(--s-brand)]"
          />
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {["ALL", ...STORE_CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCat(cat);
                syncUrl({ cat });
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
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--s-muted)]">
            Type
            <select
              value={productType}
              onChange={(e) => {
                setProductType(e.target.value);
                syncUrl({ type: e.target.value });
              }}
              className="mt-1 w-full rounded-lg border border-[var(--s-line)] bg-[var(--s-surface)] px-3 py-2 text-sm font-medium text-[var(--s-ink)]"
            >
              <option value="all">All types</option>
              {PRODUCT_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--s-muted)]">
            Technology
            <select
              value={technology}
              onChange={(e) => {
                setTechnology(e.target.value);
                syncUrl({ tech: e.target.value });
              }}
              className="mt-1 w-full rounded-lg border border-[var(--s-line)] bg-[var(--s-surface)] px-3 py-2 text-sm font-medium text-[var(--s-ink)]"
            >
              <option value="all">All tech</option>
              {techOptions.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--s-muted)]">
            Price
            <select
              value={priceFilter}
              onChange={(e) => {
                const v = e.target.value as "all" | "free" | "paid";
                setPriceFilter(v);
                syncUrl({ price: v });
              }}
              className="mt-1 w-full rounded-lg border border-[var(--s-line)] bg-[var(--s-surface)] px-3 py-2 text-sm font-medium text-[var(--s-ink)]"
            >
              <option value="all">Any price</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </label>
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--s-muted)]">
            Difficulty
            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value);
                syncUrl({ difficulty: e.target.value });
              }}
              className="mt-1 w-full rounded-lg border border-[var(--s-line)] bg-[var(--s-surface)] px-3 py-2 text-sm font-medium text-[var(--s-ink)]"
            >
              <option value="all">Any level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--s-muted)]">
            Sort
            <select
              value={sort}
              onChange={(e) => {
                const v = e.target.value as StoreSort;
                setSort(v);
                syncUrl({ sort: v });
              }}
              className="mt-1 w-full rounded-lg border border-[var(--s-line)] bg-[var(--s-surface)] px-3 py-2 text-sm font-medium text-[var(--s-ink)]"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
        <p className="mb-4 text-sm text-[var(--s-muted)]">
          {filtered.length} product{filtered.length === 1 ? "" : "s"}
          {filtered.length > PAGE_SIZE ? ` · page ${pageIndex + 1} of ${pageCount}` : ""}
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paged.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {pageCount > 1 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex((n) => Math.max(0, n - 1))}
              className="rounded-lg border border-[var(--s-line)] px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPageIndex(i)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  i === pageIndex
                    ? "border-[var(--s-brand)] bg-[var(--s-brand)] text-white"
                    : "border-[var(--s-line)]"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              disabled={pageIndex >= pageCount - 1}
              onClick={() => setPageIndex((n) => Math.min(pageCount - 1, n + 1))}
              className="rounded-lg border border-[var(--s-line)] px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
        {filtered.length === 0 && (
          <p className="rounded-xl border border-[var(--s-line)] bg-[var(--s-surface)] p-8 text-center text-[var(--s-muted)]">
            No products match these filters. Try clearing search or choosing All types.
          </p>
        )}
      </section>

      <section className="bg-[var(--s-surface)] py-16">
        <div className="s-page">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="s-section-label">{t("bestSellers")}</span>
              <h2 className="text-2xl font-bold text-[var(--s-ink)] sm:text-3xl">Top picks</h2>
            </div>
            <p className="text-sm text-[var(--s-muted)] hidden sm:block">{t("dragSwipe")} →</p>
          </div>
          <div ref={shelfRef} className="flex gap-4 overflow-x-auto pb-2">
            {bestsellers.map((p) => (
              <div key={p.id} className="w-[280px] shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="bundles" className="s-page py-16">
        <span className="s-section-label">{t("bundles")}</span>
        <h2 className="mb-8 text-2xl font-bold text-[var(--s-ink)] sm:text-3xl">Bundles</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {bundles.map((bundle) => {
            const loc = localizeProduct(bundle, locale);
            return (
              <Link
                key={bundle.id}
                href={lp(`/products/${bundle.slug}`)}
                className="s-card group flex gap-5 p-6 hover:shadow-lg transition-all"
              >
                <div className="min-w-0 flex-1">
                  <span className="s-badge s-badge-bundle">Bundle</span>
                  <h4 className="mt-2 font-bold text-lg text-[var(--s-ink)] group-hover:text-[var(--s-brand)]">
                    {loc.name}
                  </h4>
                  <p className="mt-1 text-sm text-[var(--s-muted)]">{loc.tagline}</p>
                  <p className="mt-3 font-bold text-lg text-[var(--s-brand)]">{formatINR(bundle.price)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="freebies" className="bg-[var(--s-surface)] py-16">
        <div className="s-page">
          <span className="s-section-label">{t("freebies")}</span>
          <h2 className="mb-8 text-2xl font-bold text-[var(--s-ink)] sm:text-3xl">Free resources</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {freebies.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--s-line)] bg-[var(--s-ink)] text-[var(--s-muted)]">
        <div className="s-page py-14">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl font-bold text-white">Ebenezer Store</p>
              <p className="mt-1 text-sm">Ready-to-use digital products · Instant access</p>
            </div>
            <a href="#all-products" className="s-btn-primary text-sm">
              Shop now
            </a>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-white mb-3">Products</p>
              <a href={lp("/products#all-products")} className="block hover:text-white transition-colors">
                All products
              </a>
              <Link href={lp("/products/category/website-templates")} className="block hover:text-white transition-colors">
                Website templates
              </Link>
              <Link href={lp("/products/category/software")} className="block hover:text-white transition-colors">
                Software &amp; tools
              </Link>
                <Link href={lp("/products/roadmap")} className="block hover:text-white transition-colors">
                  Product roadmap
                </Link>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-white mb-3">Help</p>
              <Link href="https://ebenezerdigital.com/contact" className="block hover:text-white transition-colors">
                Support
              </Link>
              <a href={`mailto:${SITE_EMAIL}`} className="block hover:text-white transition-colors">
                {SITE_EMAIL}
              </a>
              <a href={SITE_PHONE_TEL} className="block hover:text-white transition-colors">
                {SITE_PHONE_DISPLAY}
              </a>
              <a href={SITE_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">
                WhatsApp
              </a>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-white mb-3">Principle</p>
              <p>We sell implementation you can use: code, tools, software. PDF is documentation only.</p>
            </div>
          </div>
          <SiteLegalLinks className="mt-8 pt-6 border-t border-white/10 text-xs" linkClassName="hover:text-white transition-colors" />
        </div>
      </footer>
    </div>
  );
}
