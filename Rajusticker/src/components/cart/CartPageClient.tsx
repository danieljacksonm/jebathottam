"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { removeFromCart, updateQuantity } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function CartPageClient() {
  const { items, subtotal, shipping, total } = useCart();

  return (
    <div className="container-x py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="section-title mb-8">Cart</h1>

      {items.length === 0 ? (
        <div className="card-surface p-10 text-center">
          <p className="text-lg mb-2">Your cart is empty</p>
          <p className="text-[var(--text-muted)] mb-6">Add a wrap finish to get started.</p>
          <Link href="/shop" className="btn btn-primary">
            Shop Stickers
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.sizeId}`}
                className="card-surface p-4 flex gap-4"
              >
                <Link
                  href={item.productId === "custom-sticker" ? "/custom-stickers" : `/stickers/${item.slug}`}
                  className="relative w-24 h-28 shrink-0 overflow-hidden rounded bg-[var(--bg-muted)]"
                >
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                </Link>
                <div className="flex-1">
                  <Link
                    href={item.productId === "custom-sticker" ? "/custom-stickers" : `/stickers/${item.slug}`}
                    className="font-display text-xl hover:text-[var(--accent)]"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-[var(--text-subtle)] mt-1">{item.sizeLabel}</p>
                  <p className="price mt-2">{formatPrice(item.price)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary px-3 min-h-9"
                      onClick={() => updateQuantity(item.productId, item.sizeId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      className="btn btn-secondary px-3 min-h-9"
                      onClick={() => updateQuantity(item.productId, item.sizeId, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost ml-auto text-xs"
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
            ))}
          </div>

          <aside className="card-surface p-5 h-fit space-y-3">
            <h2 className="font-display text-xl">Summary</h2>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Est. shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-[var(--border)] pt-3">
              <span>Total</span>
              <span className="price">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="btn btn-primary w-full">
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
