"use client";

import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { StoreNav } from "../components/StoreNav";
import { StoreCursor } from "../components/StoreCursor";
import { StoreCart } from "../components/StoreCart";
import { useStore } from "../components/StoreProvider";
import { STORE_PRODUCTS, formatINR } from "../data";
import { useStoreI18n } from "../i18n";
import { localizeProduct } from "../product-i18n";

/**
 * Checkout UI ready for billing APIs.
 * When /api/billing/checkout exists, it creates a payment session.
 * Until then, shows a clear handoff message.
 */
function CheckoutInner() {
  const { t, rtl, locale } = useStoreI18n();
  const params = useSearchParams();
  const router = useRouter();
  const { cartProducts, cartTotal, clearCart } = useStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const productSlug = params.get("product");
  const license = params.get("license") || "Personal";

  const lines = useMemo(() => {
    if (productSlug) {
      const product = STORE_PRODUCTS.find((p) => p.slug === productSlug);
      return product ? [{ product: localizeProduct(product, locale), qty: 1, license }] : [];
    }
    return cartProducts.map((l) => ({
      ...l,
      product: localizeProduct(l.product, locale),
      license: "Personal",
    }));
  }, [productSlug, license, cartProducts, locale]);

  const total = productSlug
    ? lines.reduce((n, l) => n + l.product.price * l.qty, 0)
    : cartTotal;

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          currency: "INR",
          items: lines.map((l) => ({
            productId: l.product.id,
            slug: l.product.slug,
            name: l.product.name,
            price: l.product.price,
            qty: l.qty,
            license: l.license,
          })),
          successUrl: `${window.location.origin}/products/success`,
          cancelUrl: `${window.location.origin}/products/checkout`,
        }),
      });

      if (res.status === 404) {
        setError(
          "Billing API is not connected yet. Finish billing in the other chat, then Buy will open payment automatically."
        );
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      if (data.orderId) {
        clearCart();
        const first = lines[0]?.product.slug || "";
        router.push(`/products/success?product=${first}&order=${data.orderId}&license=${encodeURIComponent(license)}`);
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  };

  return (
    <div className="store-root relative min-h-screen" dir={rtl ? "rtl" : "ltr"}>
      <div className="store-grain" />
      <StoreCursor />
      <StoreNav />
      <StoreCart />

      <main className="mx-auto grid max-w-5xl gap-10 px-4 pb-24 pt-28 lg:grid-cols-[1.1fr_0.9fr] sm:px-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--s-brand)]">Checkout</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">{t("completeOrder")}</h1>
          <form onSubmit={pay} className="mt-10 space-y-6">
            <label className="block text-sm text-[var(--s-muted)]">
              Email for receipt &amp; downloads
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-[var(--s-line)] bg-transparent px-4 py-3 text-[var(--s-paper)] outline-none focus:border-[var(--s-brand)]"
                placeholder="you@email.com"
              />
            </label>
            {error && <p className="text-sm text-amber-300">{error}</p>}
            <button
              type="submit"
              disabled={loading || lines.length === 0}
              className="min-h-[52px] w-full bg-[var(--s-brand)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#04110c] disabled:opacity-50"
              data-cursor="CLICK"
            >
              {loading ? "Starting payment…" : `${t("buyNow")} ${formatINR(total)}`}
            </button>
            <p className="text-xs text-[var(--s-muted)]">
              Secure payment · Instant digital access after confirmation
            </p>
          </form>
        </div>

        <aside className="border border-[var(--s-line)] p-6">
          <h2 className="font-serif text-2xl">Order summary</h2>
          <div className="mt-6 space-y-4">
            {lines.length === 0 && <p className="text-sm text-[var(--s-muted)]">Cart is empty.</p>}
            {lines.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden">
                  <Image src={product.image} alt="" fill className="object-cover" sizes="48px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-lg">{product.name}</p>
                  <p className="text-sm text-[var(--s-muted)]">
                    Qty {qty} · {formatINR(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between border-t border-[var(--s-line)] pt-4">
            <span className="text-[var(--s-muted)]">Total</span>
            <span className="text-[var(--s-brand)]">{formatINR(total)}</span>
          </div>
          <Link href="/products" className="mt-6 inline-block text-sm text-[var(--s-muted)] hover:text-[var(--s-brand)]">
            ← {t("products")}
          </Link>
        </aside>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="store-root flex min-h-screen items-center justify-center">Loading checkout…</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
