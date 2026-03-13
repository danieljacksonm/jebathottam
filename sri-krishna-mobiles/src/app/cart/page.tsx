"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = { productId: number; name: string; price: number; quantity: number };

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    setCart(raw ? JSON.parse(raw) : []);
    setMounted(true);
  }, []);

  function updateQty(productId: number, delta: number) {
    const next = cart.map((c) =>
      c.productId === productId ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c
    ).filter((c) => c.quantity > 0);
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  }

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <p className="text-[var(--muted)]">Loading cart…</p>
      </div>
    );
  }

  const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Cart</h1>
      {cart.length === 0 ? (
        <div>
          <p className="text-[var(--muted)]">Your cart is empty.</p>
          <Link href="/shop" className="mt-4 inline-block text-[var(--accent)] hover:underline">Continue shopping</Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((c) => (
              <li
                key={c.productId}
                className="flex items-center justify-between gap-4 py-3 border-b border-[var(--border)]"
              >
                <div>
                  <p className="font-medium text-[var(--foreground)]">{c.name}</p>
                  <p className="text-sm text-[var(--muted)]">₹{Number(c.price).toLocaleString()} × {c.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQty(c.productId, -1)}
                    className="w-8 h-8 rounded border border-[var(--border)] hover:bg-[var(--border)]"
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{c.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQty(c.productId, 1)}
                    className="w-8 h-8 rounded border border-[var(--border)] hover:bg-[var(--border)]"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-lg font-semibold text-[var(--foreground)]">
            Total: ₹{total.toLocaleString()}
          </p>
          <Link
            href="/checkout"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-[var(--accent)] text-white px-6 py-3 font-medium hover:bg-[var(--accent-dark)] transition-colors"
          >
            Checkout with PayPal
          </Link>
        </>
      )}
    </div>
  );
}
