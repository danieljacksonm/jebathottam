"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RazorpayButton from "@/components/RazorpayButton";
import PayPalButtons from "@/components/PayPalButtons";

type CartItem = { productId: number; name: string; price: number; quantity: number };

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    setCart(raw ? JSON.parse(raw) : []);
    setMounted(true);
  }, []);

  const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  function onSuccess(orderId: string) {
    localStorage.removeItem("cart");
    window.location.href = `/order-success?orderId=${orderId}`;
  }

  if (!mounted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10">
        <p className="text-[var(--muted)]">Loading…</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        <p className="text-[var(--muted)]">Your cart is empty.</p>
        <Link href="/shop" className="mt-4 inline-block text-[var(--accent)] hover:underline">Go to shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Checkout</h1>
      <p className="text-lg font-medium text-[var(--foreground)] mb-4">Total: ₹{total.toLocaleString()}</p>
      <div className="space-y-3 mb-6">
        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] px-4 py-2 bg-[var(--card)]"
        />
        <input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] px-4 py-2 bg-[var(--card)]"
        />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-[var(--foreground)] mb-2">Pay in INR (UPI, Cards, Netbanking)</p>
          <RazorpayButton cart={cart} email={email} name={name} onSuccess={onSuccess} />
        </div>
        <div className="relative">
          <span className="block text-center text-sm text-[var(--muted)] my-2">or</span>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--foreground)] mb-2">Pay with PayPal (international)</p>
          <PayPalButtons cart={cart} email={email} name={name} onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
}
