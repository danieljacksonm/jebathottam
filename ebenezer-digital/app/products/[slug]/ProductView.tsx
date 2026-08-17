"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, FileText, Star } from "lucide-react";
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
} from "../data";
import { AskAiPanel } from "@/components/AskAiPanel";
import { SiteContactLinks } from "@/components/SiteContactLinks";
import { formatProductsForAi } from "@/lib/ai";

export function ProductView({ product: raw }: { product: StoreProduct }) {
  const { addToCart } = useStore();
  const { t, rtl, locale } = useStoreI18n();
  const product = localizeProduct(raw, locale);
  const [activeImage, setActiveImage] = useState(product.gallery[0] || product.image);
  const [license, setLicense] = useState(product.license[0] || "Personal");
  const related = STORE_PRODUCTS.filter((p) => p.id !== raw.id && p.category === raw.category).slice(0, 3);
  const relatedFallback = related.length
    ? related
    : STORE_PRODUCTS.filter((p) => p.id !== raw.id).slice(0, 3);

  return (
    <div className="store-root relative min-h-screen pb-24 md:pb-0" dir={rtl ? "rtl" : "ltr"}>
      <div className="store-grain" />
      <StoreCursor />
      <StoreNav />
      <StoreCart />

      <article className="px-4 pb-20 pt-28 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <motion.div
              key={activeImage}
              initial={{ opacity: 0.6, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/3] overflow-hidden bg-[#111]"
            >
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </motion.div>
            {product.gallery.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {product.gallery.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative h-20 w-28 shrink-0 overflow-hidden border ${
                      activeImage === img ? "border-[var(--s-brand)]" : "border-[var(--s-line)]"
                    }`}
                    data-cursor="EXPLORE"
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="112px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--s-line)] bg-black/40 px-3 py-1.5 backdrop-blur">
              <Image src="/brand/ebenezer-store-mark.svg" alt="" width={16} height={16} />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--s-paper)]/80">
                {product.category} ID
              </span>
            </div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--s-brand)]">{product.category}</p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{product.name}</h1>
            <p className="mt-4 text-[var(--s-muted)]">{product.tagline}</p>
            {product.pdfs?.length ? (
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {product.pdfs.slice(0, 4).map((pdf) => (
                  <a
                    key={pdf.file}
                    href={pdf.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[var(--s-line)] bg-black/25 px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-[var(--s-paper)]/85 hover:border-[var(--s-brand)]"
                  >
                    {pdf.label}
                  </a>
                ))}
              </div>
            ) : null}

            {(product.rating || product.reviews) && (
              <div className="mt-5 flex items-center gap-2 text-sm text-[var(--s-muted)]">
                <div className="flex text-[var(--s-brand)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(product.rating || 0) ? "fill-current" : ""}`}
                    />
                  ))}
                </div>
                {product.reviews != null && <span>{product.reviews} reviews</span>}
              </div>
            )}

            <div className="mt-8 flex items-end gap-3">
              <p className="font-serif text-4xl text-[var(--s-brand)]">{formatINR(product.price)}</p>
              {product.compareAt && (
                <p className="pb-1 text-sm text-[var(--s-muted)] line-through">{formatINR(product.compareAt)}</p>
              )}
            </div>

            {product.license.length > 0 && (
              <div className="mt-8">
                <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--s-muted)]">License</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.license.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLicense(opt)}
                      className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] ${
                        license === opt
                          ? "border-[var(--s-brand)] text-[var(--s-brand)]"
                          : "border-[var(--s-line)] text-[var(--s-muted)]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <a
              href="#kit"
              className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[var(--s-brand)]"
            >
              See every file in this kit <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <div className="mt-8 hidden flex-wrap gap-3 md:flex">
              {product.isSoftware && product.externalUrl ? (
                <Link
                  href={product.externalUrl}
                  className="inline-flex min-h-[52px] flex-1 items-center justify-center bg-[var(--s-brand)] px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#04110c] sm:flex-none"
                  data-cursor="CLICK"
                >
                  {product.externalCta || t("getStartedFree")}
                </Link>
              ) : product.isFree || product.price === 0 ? (
                <Link
                  href={`/products/success?product=${product.slug}&license=${encodeURIComponent(license)}`}
                  className="inline-flex min-h-[52px] flex-1 items-center justify-center bg-[var(--s-brand)] px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#04110c] sm:flex-none"
                  data-cursor="CLICK"
                >
                  {t("getFree")}
                </Link>
              ) : (
                <Link
                  href={`/products/checkout?product=${product.slug}&license=${encodeURIComponent(license)}`}
                  className="inline-flex min-h-[52px] flex-1 items-center justify-center bg-[var(--s-brand)] px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#04110c] sm:flex-none"
                  data-cursor="CLICK"
                >
                  {t("buyNow")}
                </Link>
              )}
              {!product.isSoftware && (
                <button
                  type="button"
                  onClick={() => addToCart(product.id)}
                  className="inline-flex min-h-[52px] items-center justify-center border border-[var(--s-line)] px-6 text-[11px] uppercase tracking-[0.22em]"
                  data-cursor="CART"
                >
                  {t("addToCart")}
                </button>
              )}
            </div>

            <ul className="mt-8 space-y-2 text-sm text-[var(--s-muted)]">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[var(--s-brand)]" />
                {product.isSoftware ? "Cloud access worldwide — no ZIP" : "Instant digital download worldwide"}
              </li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[var(--s-brand)]" /> License: {license}</li>
              {product.whoItIsFor && (
                <li className="flex items-start gap-2 pt-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--s-brand)]" />
                  <span>Best for: {product.whoItIsFor}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* WHY */}
        <section className="mt-24 max-w-4xl">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--s-brand)]">Why this product?</p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl">{product.story}</h2>
          <p className="mt-6 text-lg leading-relaxed text-[var(--s-muted)]">{product.description}</p>
          <div className="mt-8">
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
          </div>
        </section>

        {/* FEATURES */}
        <section className="mt-20 grid gap-8 sm:grid-cols-3">
          {product.features.map((f, i) => (
            <motion.div
              key={f}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border-t border-[var(--s-line)] pt-5"
            >
              <p className="text-[var(--s-brand)]">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-serif text-2xl uppercase tracking-wide">{f}</h3>
            </motion.div>
          ))}
        </section>

        {/* INCLUDED */}
        <section id="kit" className="mt-20 scroll-mt-24">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--s-brand)]">Open the kit</p>
          <h3 className="mt-3 font-serif text-3xl sm:text-5xl">What you actually get</h3>
          <p className="mt-3 max-w-2xl text-sm text-[var(--s-muted)]">
            Instant digital delivery worldwide. No shipping. You see every file before you buy.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {product.includes.map((item) => (
              <div key={item} className="flex items-start gap-3 border border-[var(--s-line)] px-4 py-4 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--s-brand)]" />
                {item}
              </div>
            ))}
          </div>
          {product.pdfs && product.pdfs.length > 0 && (
            <div className="mt-10">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--s-muted)]">Open the PDFs now</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {product.pdfs.map((pdf) => (
                  <a
                    key={pdf.file}
                    href={pdf.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 border border-[var(--s-line)] px-4 py-4 text-sm transition hover:border-[var(--s-brand)]"
                    data-cursor="VIEW"
                  >
                    <FileText className="h-5 w-5 shrink-0 text-[var(--s-brand)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{pdf.label}</span>
                      <span className="block truncate text-[11px] text-[var(--s-muted)]">
                        {pdf.file.split("/").pop()}
                      </span>
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--s-brand)]">Open</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          {product.downloadContentsPlan && product.downloadContentsPlan.length > 0 && (
            <div className="mt-10 border border-[var(--s-line)] p-6">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--s-muted)]">Also in the ZIP pack</p>
              <ol className="mt-4 space-y-2">
                {product.downloadContentsPlan.map((file, i) => (
                  <li key={file} className="flex gap-3 font-mono text-sm text-[var(--s-paper)]">
                    <span className="text-[var(--s-brand)]">{String(i + 1).padStart(2, "0")}</span>
                    {file}
                  </li>
                ))}
              </ol>
              {product.fileName && (
                <p className="mt-4 text-xs text-[var(--s-muted)]">
                  Pack: {product.fileName}
                  {product.fileSize ? ` · ${product.fileSize}` : ""}
                </p>
              )}
            </div>
          )}
        </section>

        {/* COMPAT */}
        <section className="mt-16">
          <h3 className="font-serif text-3xl">Compatibility</h3>
          <div className="mt-6 flex flex-wrap gap-3">
            {product.compatibility.map((c) => (
              <span
                key={c}
                className="rounded-full border border-[var(--s-line)] px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[var(--s-muted)]"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* DEMO STRIP */}
        <section className="relative mt-24 overflow-hidden bg-[#05080c]">
          <div className="relative mx-auto aspect-[21/9] max-w-6xl">
            <Image src={product.image} alt={product.name} fill className="object-cover opacity-90" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/50" />
            <div className="absolute inset-0 flex items-end p-8">
              <h3 className="font-serif text-4xl sm:text-6xl">See it clearly.</h3>
            </div>
          </div>
        </section>
      </article>

      <StoreMarquee items={["You may also like", "More tools", "Keep creating", "Ebenezer Store"]} />

      <section className="px-4 py-20 sm:px-8 lg:px-12">
        <h3 className="font-serif text-3xl sm:text-5xl">You may also like</h3>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {relatedFallback.map((p) => {
            const rp = localizeProduct(p, locale);
            return (
            <Link key={p.id} href={`/products/${rp.slug}`} className="group block" data-cursor="VIEW">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={rp.image}
                  alt={rp.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-serif text-2xl">{rp.name}</p>
                  <ul className="mt-2 space-y-1 text-[11px] text-[var(--s-paper)]/80">
                    {(rp.includes || []).slice(0, 2).map((item) => (
                      <li key={item} className="line-clamp-1">· {item}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-[var(--s-brand)]">{formatINR(rp.price)}</p>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-[var(--s-line)] px-4 py-16 sm:px-8 lg:px-12">
        <h3 className="font-serif text-5xl sm:text-7xl">
          READY
          <br />
          TO CREATE.
        </h3>
        <Link href="/products" className="mt-8 inline-flex items-center gap-2 text-[var(--s-brand)]">
          Back to store <ArrowUpRight className="h-4 w-4" />
        </Link>
        <SiteContactLinks
          className="mt-8 text-sm text-[var(--s-muted)]"
          linkClassName="hover:text-[var(--s-brand)]"
        />
      </footer>

      {/* Mobile sticky buy bar */}
      <div className="store-buy-bar items-center justify-between gap-3">
        <div>
          <p className="truncate text-sm font-medium">{product.name}</p>
          <p className="text-[var(--s-brand)]">{formatINR(product.price)}</p>
        </div>
        <div className="flex gap-2">
          {!product.isSoftware && (
            <button
              type="button"
              onClick={() => addToCart(product.id)}
              className="min-h-[44px] border border-[var(--s-line)] px-3 text-[10px] uppercase tracking-wider"
            >
              Cart
            </button>
          )}
          {product.isSoftware && product.externalUrl ? (
            <Link
              href={product.externalUrl}
              className="min-h-[44px] bg-[var(--s-brand)] px-4 text-[10px] font-semibold uppercase tracking-wider text-[#04110c] leading-[44px]"
            >
              {t("getStartedFree")}
            </Link>
          ) : (
            <Link
              href={
                product.isFree || product.price === 0
                  ? `/products/success?product=${product.slug}`
                  : `/products/checkout?product=${product.slug}&license=${encodeURIComponent(license)}`
              }
              className="min-h-[44px] bg-[var(--s-brand)] px-4 text-[10px] font-semibold uppercase tracking-wider text-[#04110c] leading-[44px]"
            >
              {product.isFree || product.price === 0 ? t("getFree") : t("buyNow")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
