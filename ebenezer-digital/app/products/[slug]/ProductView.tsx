"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CheckCircle, Download, FileText, ShieldCheck, Star, Truck, Zap } from "lucide-react";
import { StoreNav } from "../components/StoreNav";
import { StoreCursor } from "../components/StoreCursor";
import { StoreCart } from "../components/StoreCart";
import { StoreMarquee } from "../components/StoreMarquee";
import { useStore } from "../components/StoreProvider";
import { useStoreI18n } from "../i18n";
import { localizeProduct } from "../product-i18n";
import {
  STORE_PRODUCTS,
  formatINR,
  type StoreProduct,
  productTypeLabel,
  productTypeShort,
} from "../data";
import { getRelatedProducts } from "../related";
import { AskAiPanel } from "@/components/AskAiPanel";
import { SiteContactLinks } from "@/components/SiteContactLinks";
import { SiteLegalLinks } from "@/components/SiteLegalLinks";
import { formatProductsForAi } from "@/lib/ai";

const trustItems = [
  { icon: <Truck className="h-4 w-4 text-[var(--s-brand)]" />, label: "Instant worldwide download" },
  { icon: <FileText className="h-4 w-4 text-[var(--s-brand)]" />, label: "Files shown before you buy" },
  { icon: <ShieldCheck className="h-4 w-4 text-[var(--s-brand)]" />, label: "USD pricing" },
  { icon: <Zap className="h-4 w-4 text-[var(--s-brand)]" />, label: "Human support" },
];

export function ProductView({ product: raw }: { product: StoreProduct }) {
  const { addToCart } = useStore();
  const { t, rtl, locale, lp } = useStoreI18n();
  const product = localizeProduct(raw, locale);
  const [activeImage, setActiveImage] = useState(product.gallery[0] || product.image);
  const [imgBroken, setImgBroken] = useState(false);
  const [license, setLicense] = useState(product.license[0] || "Personal");
  const related = getRelatedProducts(raw, 4);
  const relatedFallback = related;

  const isInternalApp = Boolean(product.isSoftware && product.externalUrl?.startsWith("/"));
  const buyHref = product.isSoftware && product.externalUrl
    ? product.externalUrl
    : product.isFree || product.price === 0
    ? lp(`/products/success?product=${product.slug}&license=${encodeURIComponent(license)}`)
    : lp(`/products/checkout?product=${product.slug}&license=${encodeURIComponent(license)}`);

  const buyLabel = product.isSoftware
    ? (product.externalCta || t("getStartedFree"))
    : product.isFree || product.price === 0
    ? t("getFree")
    : t("buyNow");

  return (
    <div className="store-root min-h-screen pb-20 md:pb-0" dir={rtl ? "rtl" : "ltr"}>
      <StoreCursor />
      <StoreNav />
      <StoreCart />

      {/* ── Breadcrumb ──────────────────────────────── */}
      <div className="border-b border-[var(--s-line)] bg-[var(--s-surface)]">
        <div className="s-page flex items-center gap-2 py-3 text-sm text-[var(--s-muted)]">
          <Link href={lp("/products")} className="flex items-center gap-1 hover:text-[var(--s-brand)] transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Store
          </Link>
          <span>/</span>
          <span className="text-[var(--s-ink)]">{product.name}</span>
        </div>
      </div>

      {/* ── Main product section ─────────────────────── */}
      <section className="s-page py-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

          {/* Left — images */}
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--s-line)] bg-[var(--s-line-soft)]">
              <Image
                src={imgBroken ? "/og-store.png" : activeImage}
                alt={product.name}
                fill
                priority
                className="object-cover transition duration-300"
                sizes="(max-width: 1024px) 100vw, 55vw"
                onError={() => setImgBroken(true)}
              />
            </div>
            {product.gallery.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {product.gallery.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      activeImage === img
                        ? "border-[var(--s-brand)] shadow-sm"
                        : "border-[var(--s-line)] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="96px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — info + buy */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--s-brand)]">
              {productTypeShort(product.productType)} · {product.category}
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight text-[var(--s-ink)] sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-[var(--s-muted)]">{product.tagline}</p>

            {/* Rating */}
            {(product.rating || product.reviews) && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex text-[var(--s-brand)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating || 0) ? "fill-current" : "opacity-30"}`} />
                  ))}
                </div>
                {product.reviews != null && (
                  <span className="text-sm text-[var(--s-muted)]">{product.reviews} reviews</span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className={`font-display text-3xl font-extrabold ${product.isFree ? "text-[var(--s-brand)]" : "text-[var(--s-ink)]"}`}>
                {formatINR(product.price)}
              </span>
              {product.compareAt && (
                <span className="text-base text-[var(--s-muted)] line-through">{formatINR(product.compareAt)}</span>
              )}
            </div>

            {/* License selector */}
            {product.license.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--s-muted)]">License</p>
                <div className="flex flex-wrap gap-2">
                  {product.license.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLicense(opt)}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                        license === opt
                          ? "border-[var(--s-brand)] bg-[var(--s-brand-bg)] text-[var(--s-brand-dk)]"
                          : "border-[var(--s-line)] text-[var(--s-ink)] hover:border-[var(--s-brand)]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* See files / preview */}
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="#kit" className="inline-flex items-center gap-1 text-sm text-[var(--s-brand)] hover:underline">
                <FileText className="h-3.5 w-3.5" />
                See what you get
              </a>
              {product.previewUrl && (
                <a
                  href={product.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[var(--s-brand)] hover:underline"
                >
                  Live preview →
                </a>
              )}
              {!product.previewUrl && product.demoUrl && (
                <a
                  href={product.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[var(--s-brand)] hover:underline"
                >
                  Open demo →
                </a>
              )}
            </div>

            {/* Buy buttons — desktop */}
            <div className="mt-6 hidden flex-col gap-3 md:flex">
              <Link
                href={buyHref}
                className="s-btn-primary w-full justify-center rounded-xl text-base"
                {...(product.isSoftware && product.externalUrl && !isInternalApp
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {buyLabel}
              </Link>
              {!product.isSoftware && (
                <button
                  type="button"
                  onClick={() => addToCart(product.id)}
                  className="s-btn-outline w-full justify-center rounded-xl text-base"
                >
                  {t("addToCart")}
                </button>
              )}
            </div>

            {/* Trust chips */}
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
              {trustItems.map((item) => (
                <span key={item.label} className="flex items-center gap-1.5 text-xs text-[var(--s-muted)]">
                  {item.icon}
                  {item.label}
                </span>
              ))}
            </div>

            {/* Who it's for */}
            {product.whoItIsFor && (
              <div className="mt-5 rounded-xl border border-[var(--s-line)] bg-[var(--s-brand-bg)] p-4 text-sm">
                <p className="font-semibold text-[var(--s-brand-dk)]">Best for</p>
                <p className="mt-1 text-[var(--s-muted)]">{product.whoItIsFor}</p>
              </div>
            )}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--s-line)] px-2.5 py-0.5 text-xs text-[var(--s-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Why this product ────────────────────────── */}
      <section className="border-t border-[var(--s-line)] bg-[var(--s-surface)]">
        <div className="s-page py-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <span className="s-section-label">Why this product?</span>
              <h2 className="text-2xl font-bold text-[var(--s-ink)] sm:text-3xl">{product.story}</h2>
              <p className="mt-4 leading-relaxed text-[var(--s-muted)]">{product.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {product.features.map((f, i) => (
                <div key={f} className="rounded-xl border border-[var(--s-line)] p-4">
                  <p className="text-xs font-bold text-[var(--s-brand)]">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-2 font-semibold text-[var(--s-ink)]">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Eben AI ─────────────────────────────────── */}
      <section className="s-page py-8">
        <AskAiPanel
          mode="product"
          tone="store"
          title="Not sure if this fits?"
          placeholder="Ask: Is this good for my shop / church / startup?"
          context={`Current product:\nName: ${product.name}\nSlug: ${product.slug}\nPrice: ${product.isFree ? "FREE" : formatINR(product.price)}\nCategory: ${product.category}\nTagline: ${product.tagline}\nDescription: ${product.description}\nFeatures: ${product.features.join("; ")}\nIncludes: ${product.includes.join("; ")}\nWho: ${product.whoItIsFor || "worldwide"}\n\nCatalog:\n${formatProductsForAi(STORE_PRODUCTS)}`}
          starters={[
            "Is this product right for me?",
            "Compare with similar products",
            "What do I get after purchase?",
          ]}
        />
      </section>

      {/* ── Kit contents ────────────────────────────── */}
      <section id="kit" className="scroll-mt-20 border-t border-[var(--s-line)] bg-[var(--s-surface)]">
        <div className="s-page py-12">
          <span className="s-section-label">What&apos;s inside</span>
          <h2 className="mb-2 text-2xl font-bold text-[var(--s-ink)]">Every file you get</h2>
          <p className="mb-8 max-w-xl text-sm text-[var(--s-muted)]">
            Instant digital delivery worldwide. No shipping. Files shown here are exactly what you receive.
          </p>

          {/* Includes list */}
          <div className="grid gap-3 sm:grid-cols-2">
            {product.includes.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-[var(--s-line)] bg-[var(--s-surface)] p-4 text-sm">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--s-brand)]" />
                <span className="text-[var(--s-ink)]">{item}</span>
              </div>
            ))}
          </div>

          {/* PDF links */}
          {product.pdfs && product.pdfs.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-[var(--s-ink)]">Open PDFs right now</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {product.pdfs.map((pdf) => (
                  <a
                    key={pdf.file}
                    href={pdf.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-[var(--s-line)] bg-[var(--s-surface)] px-4 py-3.5 text-sm transition hover:border-[var(--s-brand)] hover:shadow-sm"
                  >
                    <FileText className="h-5 w-5 shrink-0 text-[var(--s-brand)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-[var(--s-ink)]">{pdf.label}</span>
                      <span className="block truncate text-xs text-[var(--s-muted)]">{pdf.file.split("/").pop()}</span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-[var(--s-brand)]">Open →</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ZIP manifest */}
          {product.downloadContentsPlan && product.downloadContentsPlan.length > 0 && (
            <div className="mt-6 rounded-xl border border-[var(--s-line)] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--s-ink)]">
                <Download className="h-4 w-4 text-[var(--s-brand)]" />
                Files in the ZIP download
              </div>
              <ol className="mt-3 space-y-1.5">
                {product.downloadContentsPlan.map((file, i) => (
                  <li key={file} className="flex gap-3 font-mono text-sm text-[var(--s-ink)]">
                    <span className="w-5 text-[var(--s-brand)]">{i + 1}.</span>
                    {file}
                  </li>
                ))}
              </ol>
              {product.fileName && (
                <p className="mt-3 text-xs text-[var(--s-muted)]">
                  {product.fileName}{product.fileSize ? ` · ${product.fileSize}` : ""}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Specs ───────────────────────────────────── */}
      <section className="s-page py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-[var(--s-line)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--s-muted)]">Product type</p>
            <p className="mt-1 font-semibold text-[var(--s-ink)]">{productTypeLabel(product.productType)}</p>
          </div>
          {product.version && (
            <div className="rounded-xl border border-[var(--s-line)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--s-muted)]">Version</p>
              <p className="mt-1 font-semibold text-[var(--s-ink)]">{product.version}</p>
            </div>
          )}
          {product.accessMethod && (
            <div className="rounded-xl border border-[var(--s-line)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--s-muted)]">Access</p>
              <p className="mt-1 font-semibold text-[var(--s-ink)]">{product.accessMethod.replace("_", " ")}</p>
            </div>
          )}
          {product.techStack && product.techStack.length > 0 && (
            <div className="rounded-xl border border-[var(--s-line)] p-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--s-muted)]">Technology</p>
              <p className="mt-1 font-semibold text-[var(--s-ink)]">{product.techStack.join(" · ")}</p>
            </div>
          )}
          {product.platforms && product.platforms.length > 0 && (
            <div className="rounded-xl border border-[var(--s-line)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--s-muted)]">Platforms</p>
              <p className="mt-1 font-semibold text-[var(--s-ink)]">{product.platforms.join(" · ")}</p>
            </div>
          )}
          {product.fileFormats && product.fileFormats.length > 0 && (
            <div className="rounded-xl border border-[var(--s-line)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--s-muted)]">File format</p>
              <p className="mt-1 font-semibold text-[var(--s-ink)]">{product.fileFormats.join(" · ")}</p>
            </div>
          )}
          {product.setupRequirements && (
            <div className="rounded-xl border border-[var(--s-line)] p-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--s-muted)]">Setup</p>
              <p className="mt-1 text-sm text-[var(--s-ink)]">{product.setupRequirements}</p>
            </div>
          )}
          {product.updatePolicy && (
            <div className="rounded-xl border border-[var(--s-line)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--s-muted)]">Updates</p>
              <p className="mt-1 text-sm text-[var(--s-ink)]">{product.updatePolicy}</p>
            </div>
          )}
          {product.supportInfo && (
            <div className="rounded-xl border border-[var(--s-line)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--s-muted)]">Support</p>
              <p className="mt-1 text-sm text-[var(--s-ink)]">{product.supportInfo}</p>
            </div>
          )}
          {product.difficulty && (
            <div className="rounded-xl border border-[var(--s-line)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--s-muted)]">Difficulty</p>
              <p className="mt-1 font-semibold capitalize text-[var(--s-ink)]">{product.difficulty}</p>
            </div>
          )}
          {product.nextjsVersion && (
            <div className="rounded-xl border border-[var(--s-line)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--s-muted)]">Next.js</p>
              <p className="mt-1 font-semibold text-[var(--s-ink)]">{product.nextjsVersion}</p>
            </div>
          )}
          {product.nodeRequirement && (
            <div className="rounded-xl border border-[var(--s-line)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--s-muted)]">Node</p>
              <p className="mt-1 font-semibold text-[var(--s-ink)]">{product.nodeRequirement}</p>
            </div>
          )}
        </div>
      </section>

      {product.isBundle && product.bundleItems && product.bundleItems.length > 0 && (
        <section className="s-page py-10">
          <span className="s-section-label">Bundle includes</span>
          <h2 className="mb-4 text-2xl font-bold text-[var(--s-ink)]">Open each product</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {product.bundleItems.map((slugOrId) => {
              const item =
                STORE_PRODUCTS.find((p) => p.slug === slugOrId || p.id === slugOrId) ||
                null;
              if (!item || item.status !== "published") {
                return (
                  <div key={slugOrId} className="rounded-lg border border-[var(--s-line)] p-4 text-sm text-[var(--s-muted)]">
                    {slugOrId}
                  </div>
                );
              }
              return (
                <Link
                  key={item.id}
                  href={lp(`/products/${item.slug}`)}
                  className="rounded-lg border border-[var(--s-line)] p-4 text-sm hover:border-[var(--s-brand)]"
                >
                  <p className="font-semibold text-[var(--s-ink)]">{item.name}</p>
                  <p className="mt-1 text-[var(--s-muted)]">{item.tagline}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {product.faq && product.faq.length > 0 && (
        <section className="border-t border-[var(--s-line)] bg-[var(--s-surface)]">
          <div className="s-page py-12">
            <span className="s-section-label">FAQ</span>
            <h2 className="mb-6 text-2xl font-bold text-[var(--s-ink)]">Common questions</h2>
            <div className="mx-auto max-w-3xl space-y-3">
              {product.faq.map((item) => (
                <details
                  key={item.q}
                  className="rounded-xl border border-[var(--s-line)] bg-[var(--s-surface)] px-4 py-3 open:shadow-sm"
                >
                  <summary className="cursor-pointer list-none font-semibold text-[var(--s-ink)]">{item.q}</summary>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--s-muted)]">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Compatibility ───────────────────────────── */}
      <section className="s-page py-10">
        <p className="mb-4 text-sm font-semibold text-[var(--s-ink)]">Works with</p>
        <div className="flex flex-wrap gap-2">
          {product.compatibility.map((c) => (
            <span
              key={c}
              className="rounded-full border border-[var(--s-line)] bg-[var(--s-surface)] px-4 py-1.5 text-sm text-[var(--s-ink)]"
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      <StoreMarquee items={["You may also like", "More free tools", "Ebenezer Store", "USD pricing"]} />

      {/* ── Related products ────────────────────────── */}
      <section className="bg-[var(--s-surface)]">
        <div className="s-page py-12">
          <h3 className="mb-8 text-xl font-bold text-[var(--s-ink)]">You may also need</h3>
          <div className="grid gap-5 sm:grid-cols-3">
            {relatedFallback.map((p) => {
              const rp = localizeProduct(p, locale);
              return (
                <Link key={p.id} href={lp(`/products/${rp.slug}`)} className="s-card group overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[var(--s-line-soft)]">
                    <Image
                      src={rp.image}
                      alt={rp.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="33vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] font-semibold text-[var(--s-muted)]">{rp.category}</p>
                    <p className="mt-1 font-semibold text-[var(--s-ink)] group-hover:text-[var(--s-brand)] transition-colors">{rp.name}</p>
                    <div className="mt-2 flex items-center gap-2">
                      {(rp.includes || []).slice(0, 1).map((item) => (
                        <span key={item} className="flex items-center gap-1 text-xs text-[var(--s-muted)]">
                          <Check className="h-3 w-3 text-[var(--s-brand)]" />{item}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 font-bold text-[var(--s-brand)]">{formatINR(rp.price)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="border-t border-[var(--s-line)] bg-[var(--s-ink)]">
        <div className="s-page py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg font-bold text-white">Ebenezer Store</p>
              <SiteContactLinks
                className="mt-2 text-sm text-[var(--s-muted)]"
                linkClassName="hover:text-white transition-colors"
              />
              <SiteLegalLinks className="mt-4 text-xs" linkClassName="hover:text-white transition-colors" />
            </div>
            <Link href={lp("/products")} className="s-btn-outline rounded-lg border-white/20 text-white hover:border-white hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back to store
            </Link>
          </div>
        </div>
      </footer>

      {/* ── Mobile sticky buy bar ────────────────────── */}
      <div className="store-buy-bar">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--s-ink)]">{product.name}</p>
          <p className={`text-sm font-bold ${product.isFree ? "text-[var(--s-brand)]" : "text-[var(--s-ink)]"}`}>
            {formatINR(product.price)}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {!product.isSoftware && (
            <button
              type="button"
              onClick={() => addToCart(product.id)}
              className="s-btn-outline rounded-lg px-4 text-sm"
            >
              Cart
            </button>
          )}
          <Link
            href={buyHref}
            className="s-btn-primary rounded-lg px-5 text-sm"
            {...(product.isSoftware && product.externalUrl && !isInternalApp
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {buyLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
