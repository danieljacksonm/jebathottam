"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import type { Product } from "@/types";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { AddToCartButton } from "./AddToCartButton";

export function QuickViewButton({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary text-xs sm:text-sm px-3"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        Quick View
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close quick view"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-auto card-surface p-4 sm:p-6 grid sm:grid-cols-2 gap-5">
            <div className="relative aspect-[4/5] bg-[var(--bg-muted)] overflow-hidden rounded-[var(--radius-sm)]">
              <Image
                src={product.images[0]}
                alt={product.altText}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 400px"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h2 id={titleId} className="font-display text-2xl">
                {product.name}
              </h2>
              <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
              <p className="text-sm text-[var(--text-muted)]">{product.shortDescription}</p>
              <p className="text-xs text-[var(--text-subtle)]">
                Finish: {product.finishLabel} · Material: {product.material}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-2">
                <AddToCartButton product={product} className="flex-1" />
                <Link
                  href={`/stickers/${product.slug}`}
                  className="btn btn-secondary flex-1"
                  onClick={() => setOpen(false)}
                >
                  Full Details
                </Link>
              </div>
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
