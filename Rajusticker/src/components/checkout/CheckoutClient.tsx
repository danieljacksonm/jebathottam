"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { clearCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

type FormState = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
};

const initial: FormState = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  notes: "",
};

export function CheckoutClient() {
  const { items, subtotal, shipping, total } = useCart();
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (items.length > 0) {
      trackEvent({
        name: "begin_checkout",
        itemCount: items.reduce((s, i) => s + i.quantity, 0),
        value: total,
      });
    }
    // intentionally once on mount when cart has items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrors({});
    setMessage("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({
            productId: i.productId,
            sizeId: i.sizeId,
            quantity: i.quantity,
          })),
          shippingMethod: "standard",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        throw new Error(data.error || "Checkout failed");
      }

      setOrderId(data.orderId);
      setStatus("ready");
      setMessage(data.message);
      // Payment gateway not configured — do not fake success purchase event
      clearCart();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Checkout failed");
    }
  }

  if (status === "ready") {
    return (
      <div className="container-x py-12 max-w-2xl">
        <h1 className="section-title mb-4">Order Reserved</h1>
        <div className="card-surface p-6 space-y-3">
          <p className="text-[var(--text-muted)]">{message}</p>
          <p className="text-sm">
            Reference: <span className="text-white font-mono">{orderId}</span>
          </p>
          <p className="text-sm text-[var(--warning)]">
            Payment gateway credentials are not configured. No charge was made.
          </p>
          <Link href="/shop" className="btn btn-primary inline-flex mt-2">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-12">
        <div className="card-surface p-10 text-center">
          <p className="text-lg mb-2">Nothing to checkout</p>
          <p className="text-[var(--text-muted)] mb-6">Your cart is empty.</p>
          <Link href="/shop" className="btn btn-primary">
            Shop Stickers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />
      <h1 className="section-title mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        <form onSubmit={onSubmit} className="card-surface p-5 sm:p-6 space-y-4" noValidate>
          {(
            [
              ["name", "Full name", "text"],
              ["phone", "Phone", "tel"],
              ["email", "Email", "email"],
              ["address", "Address", "text"],
              ["city", "City", "text"],
              ["state", "State", "text"],
              ["postalCode", "Postal code", "text"],
              ["country", "Country", "text"],
            ] as const
          ).map(([key, label, type]) => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm text-[var(--text-muted)] mb-1">
                {label}
              </label>
              <input
                id={key}
                type={type}
                className="input"
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                required
                autoComplete={
                  key === "name"
                    ? "name"
                    : key === "phone"
                      ? "tel"
                      : key === "email"
                        ? "email"
                        : key === "postalCode"
                          ? "postal-code"
                          : key
                }
              />
              {errors[key] && (
                <p className="text-xs text-[var(--danger)] mt-1">{errors[key]}</p>
              )}
            </div>
          ))}

          <div>
            <label htmlFor="notes" className="block text-sm text-[var(--text-muted)] mb-1">
              Order notes (optional)
            </label>
            <textarea
              id="notes"
              className="textarea"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </div>

          {message && status === "error" && (
            <p className="text-sm text-[var(--danger)]" role="alert">
              {message}
            </p>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={status === "loading"}>
            {status === "loading" ? "Processing..." : "Place Order Request"}
          </button>
          <p className="text-xs text-[var(--text-subtle)]">
            Prices are validated server-side. Payment providers (Razorpay/Stripe) can be connected via environment variables without rewriting checkout.
          </p>
        </form>

        <aside className="card-surface p-5 h-fit space-y-4">
          <h2 className="font-display text-xl">Order Summary</h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={`${item.productId}-${item.sizeId}`} className="flex gap-3">
                <div className="relative w-14 h-16 overflow-hidden rounded bg-[var(--bg-muted)] shrink-0">
                  <Image src={item.image} alt="" fill className="object-cover" sizes="56px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm line-clamp-2">{item.name}</p>
                  <p className="text-xs text-[var(--text-subtle)]">
                    {item.sizeLabel} × {item.quantity}
                  </p>
                  <p className="text-sm price">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-[var(--border)] pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="price">{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
