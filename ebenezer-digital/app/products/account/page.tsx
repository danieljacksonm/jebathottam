"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, FileText, Package } from "lucide-react";
import { StoreNav } from "../components/StoreNav";
import { StoreCursor } from "../components/StoreCursor";
import { StoreCart } from "../components/StoreCart";
import { STORE_PRODUCTS, formatINR, type StoreProduct } from "../data";
import { useStoreI18n } from "../i18n";
import { localizeProduct } from "../product-i18n";

type OwnedItem = {
  productId: string;
  product: StoreProduct;
  license?: string;
  purchasedAt: string;
  orderId?: string;
};

const OWNED_KEY = "ebenezer-store-owned";

export default function StoreAccountPage() {
  const { locale, rtl } = useStoreI18n();
  const [owned, setOwned] = useState<OwnedItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(OWNED_KEY);
      if (raw) setOwned(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="store-root relative min-h-screen" dir={rtl ? "rtl" : "ltr"}>
      <div className="store-grain" />
      <StoreCursor />
      <StoreNav />
      <StoreCart />

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--s-brand)]">Account</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-6xl">My products</h1>
        <p className="mt-4 max-w-xl text-[var(--s-muted)]">
          Downloads and purchases appear here after checkout. Free products can be claimed anytime.
        </p>

        <div className="mt-12 space-y-4">
          {owned.length === 0 && (
            <div className="border border-[var(--s-line)] p-8 text-center">
              <Package className="mx-auto h-8 w-8 text-[var(--s-brand)]" />
              <p className="mt-4 text-[var(--s-muted)]">No products yet.</p>
              <Link href="/products" className="mt-6 inline-block text-[var(--s-brand)]">
                Explore store →
              </Link>
            </div>
          )}

          {owned.map((item) => {
            const catalog = STORE_PRODUCTS.find((p) => p.id === item.productId) || item.product;
            const live = localizeProduct(catalog, locale);
            return (
              <div
                key={`${item.productId}-${item.purchasedAt}`}
                className="flex flex-col gap-4 border border-[var(--s-line)] p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-24 w-20 shrink-0 overflow-hidden">
                  <Image src={live.image} alt={live.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--s-muted)]">{live.category}</p>
                  <h2 className="font-serif text-2xl">{live.name}</h2>
                  <p className="mt-1 text-sm text-[var(--s-muted)]">
                    {formatINR(live.price)} · {new Date(item.purchasedAt).toLocaleDateString("en-US")}
                    {item.license ? ` · ${item.license}` : ""}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  {live.downloadFile && (
                    <a
                      href={live.downloadFile}
                      download={live.fileName}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 bg-[var(--s-brand)] px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#04110c]"
                    >
                      <Download className="h-4 w-4" /> Download ZIP
                    </a>
                  )}
                  {live.pdfs?.map((pdf) => (
                    <a
                      key={pdf.file}
                      href={pdf.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[36px] items-center gap-2 text-xs text-[var(--s-brand)]"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      {pdf.label}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
