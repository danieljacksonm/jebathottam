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
      {/* Backdrop */}
      {cartOpen && (
        <button
          type="button"
          aria-label="Close cart"
          className="fixed inset-0 z-[75] bg-black/30 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Panel */}
      <aside
        className={`store-cart-panel ${cartOpen ? "open" : ""}`}
        aria-label="Cart"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--s-line)] px-6 py-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4.5 w-4.5 text-[var(--s-brand)]" />
              <h2 className="font-display text-lg font-bold text-[var(--s-ink)]">Your cart</h2>
            </div>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              aria-label="Close cart"
              className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--s-line)] text-[var(--s-muted)] hover:text-[var(--s-ink)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {cartProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag className="mb-3 h-10 w-10 text-[var(--s-line)]" />
                <p className="font-medium text-[var(--s-ink)]">Your cart is empty</p>
                <p className="mt-1 text-sm text-[var(--s-muted)]">Browse products and add something!</p>
                <Link
                  href="/products"
                  onClick={() => setCartOpen(false)}
                  className="mt-4 text-sm font-semibold text-[var(--s-brand)] hover:underline"
                >
                  Explore products →
                </Link>
              </div>
            ) : (
              cartProducts.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="flex gap-3 rounded-xl border border-[var(--s-line)] p-3"
                >
                  <div className="relative h-18 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--s-line-soft)]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={() => setCartOpen(false)}
                      className="block truncate font-semibold text-sm text-[var(--s-ink)] hover:text-[var(--s-brand)] transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-sm font-bold text-[var(--s-brand)]">
                      {formatINR(product.price)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-lg border border-[var(--s-line)]">
                        <button
                          type="button"
                          className="grid h-7 w-7 place-items-center text-[var(--s-muted)] hover:text-[var(--s-ink)]"
                          onClick={() => setQty(product.id, qty - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-[var(--s-ink)]">{qty}</span>
                        <button
                          type="button"
                          className="grid h-7 w-7 place-items-center text-[var(--s-muted)] hover:text-[var(--s-ink)]"
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="ml-auto text-xs text-[var(--s-muted)] hover:text-red-500 transition-colors"
                        onClick={() => removeFromCart(product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartProducts.length > 0 && (
            <div className="border-t border-[var(--s-line)] p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-[var(--s-muted)]">Subtotal</span>
                <span className="font-display text-xl font-bold text-[var(--s-ink)]">
                  {formatINR(cartTotal)}
                </span>
              </div>
              <p className="mb-4 text-xs text-[var(--s-muted)]">
                Instant digital delivery worldwide · USD pricing
              </p>
              <Link
                href="/products/checkout"
                onClick={() => setCartOpen(false)}
                className="s-btn-primary w-full justify-center rounded-xl"
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
