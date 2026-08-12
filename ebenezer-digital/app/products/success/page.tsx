"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Download, CheckCircle2 } from "lucide-react";
import { StoreNav } from "../components/StoreNav";
import { StoreCursor } from "../components/StoreCursor";
import { StoreCart } from "../components/StoreCart";
import { useStore } from "../components/StoreProvider";
import { STORE_PRODUCTS, formatINR, type StoreProduct } from "../data";
import { useStoreI18n } from "../i18n";
import { localizeProduct } from "../product-i18n";

const OWNED_KEY = "ebenezer-store-owned";

function SuccessInner() {
  const params = useSearchParams();
  const slug = params.get("product") || "";
  const license = params.get("license") || "";
  const orderId = params.get("order") || `local-${Date.now()}`;
  const { clearCart } = useStore();
  const { locale, rtl } = useStoreI18n();
  const [saved, setSaved] = useState(false);

  const product = useMemo(() => {
    const raw = STORE_PRODUCTS.find((p) => p.slug === slug) as StoreProduct | undefined;
    return raw ? localizeProduct(raw, locale) : undefined;
  }, [slug, locale]);

  useEffect(() => {
    if (!product || saved) return;
    try {
      const raw = localStorage.getItem(OWNED_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const already = list.some(
        (item: { productId: string; orderId?: string }) =>
          item.productId === product.id && item.orderId === orderId
      );
      if (!already) {
        list.unshift({
          productId: product.id,
          product,
          license,
          purchasedAt: new Date().toISOString(),
          orderId,
        });
        localStorage.setItem(OWNED_KEY, JSON.stringify(list));
      }
      clearCart();
      setSaved(true);
    } catch {
      /* ignore */
    }
  }, [product, license, orderId, clearCart, saved]);

  return (
    <div className="store-root relative min-h-screen" dir={rtl ? "rtl" : "ltr"}>
      <div className="store-grain" />
      <StoreCursor />
      <StoreNav />
      <StoreCart />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-28 text-center sm:px-8">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--s-brand)]" />
        <h1 className="mt-6 font-serif text-4xl leading-tight sm:text-6xl">
          YOUR CREATIVE TOOLKIT
          <br />
          IS READY.
        </h1>

        {product ? (
          <div className="mx-auto mt-12 max-w-md overflow-hidden border border-[var(--s-line)] text-left">
            <div className="relative aspect-[16/10]">
              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="400px" />
            </div>
            <div className="p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--s-brand)]">{product.category}</p>
              <h2 className="mt-2 font-serif text-3xl">{product.name}</h2>
              <p className="mt-2 text-sm text-[var(--s-muted)]">
                {formatINR(product.price)}
                {license ? ` · ${license}` : ""}
              </p>
              {product.downloadFile && (
                <a
                  href={product.downloadFile}
                  download={product.fileName}
                  className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 bg-[var(--s-brand)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#04110c]"
                >
                  <Download className="h-4 w-4" /> Download now
                </a>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-8 text-[var(--s-muted)]">Purchase recorded. Open My Products to download.</p>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/products/account" className="text-[var(--s-brand)]">
            My products
          </Link>
          <Link href="/products" className="text-[var(--s-muted)] hover:text-[var(--s-paper)]">
            Continue shopping
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function StoreSuccessPage() {
  return (
    <Suspense fallback={<div className="store-root flex min-h-screen items-center justify-center">Loading…</div>}>
      <SuccessInner />
    </Suspense>
  );
}
