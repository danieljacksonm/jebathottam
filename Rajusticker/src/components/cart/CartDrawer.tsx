"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { removeFromCart, updateQuantity } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export function CartDrawer() {
  const { items, open, setOpen, subtotal, shipping, total } = useCart();
  const pathname = usePathname();
  const titleId = useId();
  const desk = pathname.startsWith("/admin") || pathname.startsWith("/billing");

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
  }, [open, setOpen]);

  if (desk || !open) return null;

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close cart"
        onClick={() => setOpen(false)}
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--bg-raised)] border-l border-[var(--line)] shadow-[var(--shadow-soft)] flex flex-col">
        <div className="flex items-center justify-between px-5 h-14 border-b border-[var(--line)]">
          <h2 id={titleId} className="font-display text-lg tracking-[0.08em]">
            Your Cart
          </h2>
          <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-[var(--text-muted)]">
              <p className="text-[var(--text)] text-lg mb-2">Your cart is empty</p>
              <p className="mb-6">Browse wraps and add your first finish.</p>
              <Link href="/shop" className="btn btn-primary" onClick={() => setOpen(false)}>
                Shop Stickers
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.sizeId}`} className="flex gap-3 border border-[var(--border)] rounded-[var(--radius-md)] p-3">
                <Link
                  href={item.productId === "custom-sticker" ? "/custom-stickers" : `/stickers/${item.slug}`}
                  className="relative w-20 h-24 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--bg-muted)]"
                  onClick={() => setOpen(false)}
                >
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={item.productId === "custom-sticker" ? "/custom-stickers" : `/stickers/${item.slug}`}
                    className="font-medium hover:text-[var(--accent)] line-clamp-2"
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-[var(--text-subtle)] mt-1">{item.sizeLabel}</p>
                  <p className="price text-sm mt-1">{formatPrice(item.price)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary px-3 min-h-9"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.productId, item.sizeId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      className="btn btn-secondary px-3 min-h-9"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item.productId, item.sizeId, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost text-xs ml-auto"
                      onClick={() => {
                        removeFromCart(item.productId, item.sizeId);
                        trackEvent({ name: "remove_from_cart", productId: item.productId });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[var(--border)] p-4 space-y-3">
            {remaining > 0 ? (
              <p className="text-xs text-[var(--text-muted)]">
                Add {formatPrice(remaining)} more for free shipping.
              </p>
            ) : (
              <p className="text-xs text-[var(--success)]">You qualify for free shipping.</p>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Est. shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="price">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="btn btn-primary w-full" onClick={() => setOpen(false)}>
              Checkout
            </Link>
            <Link href="/cart" className="btn btn-secondary w-full" onClick={() => setOpen(false)}>
              View Cart
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
