"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { formatINR } from "../data";
import { useStore } from "./StoreProvider";

export function StoreCart() {
  const {
    cartOpen,
    setCartOpen,
    cartProducts,
    cartTotal,
    setQty,
    removeFromCart,
  } = useStore();

  return (
    <>
      {cartOpen && (
        <button
          type="button"
          aria-label="Close cart overlay"
          className="fixed inset-0 z-[75] bg-black/55"
          onClick={() => setCartOpen(false)}
        />
      )}
      <aside className={`store-cart-panel ${cartOpen ? "open" : ""}`} aria-label="Cart">
        <div className="flex h-full flex-col p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[var(--s-brand)]" />
              <h2 className="font-serif text-2xl">Your cart</h2>
            </div>
            <button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto">
            {cartProducts.length === 0 && (
              <p className="text-sm text-[var(--s-muted)]">Your cart is empty. Explore products.</p>
            )}
            {cartProducts.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3 border-b border-[var(--s-line)] pb-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden">
                  <Image src={product.image} alt={product.name} fill className="object-cover" sizes="64px" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={() => setCartOpen(false)}
                    className="block truncate font-serif text-lg hover:text-[var(--s-brand)]"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--s-brand)]">{formatINR(product.price)}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded border border-[var(--s-line)] p-1"
                      onClick={() => setQty(product.id, qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm">{qty}</span>
                    <button
                      type="button"
                      className="rounded border border-[var(--s-line)] p-1"
                      onClick={() => setQty(product.id, qty + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      className="ml-auto text-xs uppercase tracking-wider text-[var(--s-muted)] hover:text-[var(--s-paper)]"
                      onClick={() => removeFromCart(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-[var(--s-line)] pt-4">
            <div className="mb-4 flex justify-between text-sm">
              <span className="text-[var(--s-muted)]">Subtotal</span>
              <span className="font-semibold text-[var(--s-paper)]">{formatINR(cartTotal)}</span>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-[var(--s-muted)]">
              Secure payment &amp; instant digital access will connect here. For now, checkout opens a purchase request.
            </p>
            <Link
              href="/products/checkout"
              onClick={() => setCartOpen(false)}
              className="flex min-h-[48px] items-center justify-center bg-[var(--s-brand)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#04110c]"
              data-cursor="CLICK"
            >
              Continue to checkout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
