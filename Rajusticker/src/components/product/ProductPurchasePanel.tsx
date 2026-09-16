"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { addToCart } from "@/lib/cart-store";
import { getUnitPrice } from "@/lib/catalog";
import { trackEvent } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [sizeId, setSizeId] = useState(product.sizes[0]?.id || "full-roll");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const unitPrice = useMemo(() => getUnitPrice(product, sizeId), [product, sizeId]);
  const size = product.sizes.find((s) => s.id === sizeId) || product.sizes[0];
  const compare =
    product.compareAtPrice && size
      ? Math.round(product.compareAtPrice * size.priceMultiplier)
      : undefined;

  function pushToCart() {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: unitPrice,
      sizeId: size.id,
      sizeLabel: size.label,
      quantity: qty,
    });
    trackEvent({
      name: "add_to_cart",
      productId: product.id,
      quantity: qty,
      price: unitPrice,
    });
  }

  function onAdd() {
    pushToCart();
    setAdded(true);
    window.dispatchEvent(new CustomEvent("raj:open-cart"));
    window.setTimeout(() => setAdded(false), 1500);
  }

  function onBuyNow() {
    pushToCart();
    router.push("/checkout");
  }

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] mb-3">
          {product.finishLabel}
        </p>
        <h1 className="font-display text-[clamp(1.85rem,4vw,2.75rem)] leading-[1.05] break-words">
          {product.name}
        </h1>
        <p className="mt-4 text-[var(--ink-2)] leading-relaxed">{product.shortDescription}</p>
      </div>

      <PriceDisplay price={unitPrice} compareAtPrice={compare} size="lg" />
      <p className="text-[var(--text-xs)] text-[var(--ink-3)] tracking-wide">
        SKU {product.sku} · {product.stock > 0 ? "In stock" : "Out of stock"}
      </p>

      <fieldset>
        <legend className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)] mb-3">
          Size
        </legend>
        <div className="space-y-2">
          {product.sizes.map((s) => (
            <label
              key={s.id}
              className={cn(
                "flex items-center justify-between gap-3 border px-3.5 py-3.5 cursor-pointer transition-colors",
                sizeId === s.id
                  ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                  : "border-[var(--line)] hover:border-[var(--line-strong)]",
              )}
            >
              <span className="flex items-center gap-2.5 text-sm">
                <input
                  type="radio"
                  name="size"
                  value={s.id}
                  checked={sizeId === s.id}
                  onChange={() => setSizeId(s.id)}
                  className="accent-[var(--accent)]"
                />
                {s.label}
              </span>
              <span className="price text-sm">
                {formatPrice(Math.round(product.price * s.priceMultiplier))}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="qty" className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
          Quantity
        </label>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            className="btn btn-secondary btn-sm w-11 px-0"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            id="qty"
            className="input max-w-[4.5rem] text-center"
            type="number"
            min={1}
            max={99}
            value={qty}
            onChange={(e) => setQty(Math.min(99, Math.max(1, Number(e.target.value) || 1)))}
          />
          <button
            type="button"
            className="btn btn-secondary btn-sm w-11 px-0"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="hidden sm:grid grid-cols-2 gap-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onAdd}
          disabled={product.stock < 1}
        >
          {added ? "Added" : "Add to Cart"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBuyNow}
          disabled={product.stock < 1}
        >
          Buy Now
        </button>
      </div>

      <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[rgba(5,5,6,0.96)] backdrop-blur-md p-3 flex gap-2 safe-pb">
        <button
          type="button"
          className="btn btn-primary flex-1"
          onClick={onAdd}
          disabled={product.stock < 1}
        >
          {added ? "Added" : "Add to Cart"}
        </button>
        <button
          type="button"
          className="btn btn-secondary flex-1"
          onClick={onBuyNow}
          disabled={product.stock < 1}
        >
          Buy Now
        </button>
      </div>

      <ul className="text-sm text-[var(--ink-2)] space-y-2 border-t border-[var(--line)] pt-5">
        <li>Ships in 3–7 business days across India</li>
        <li>Free shipping on orders ₹15,000+</li>
        <li>
          {product.material} · {product.thickness} · {product.adhesive}
        </li>
      </ul>
    </div>
  );
}
