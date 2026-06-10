"use client";

import Script from "next/script";
import { useState } from "react";

type CartItem = { productId: number; name: string; price: number; quantity: number };

export default function RazorpayButton({
  cart,
  email,
  name,
  onSuccess,
}: {
  cart: CartItem[];
  email: string;
  name: string;
  onSuccess: (orderId: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  async function openCheckout() {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!keyId) {
      setError("Razorpay key not configured.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const createRes = await fetch("/api/orders/razorpay-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((c) => ({ productId: c.productId, quantity: c.quantity, price: c.price })),
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error ?? "Failed to create order");
      const { razorpayOrderId, amount, keyId: k } = createData;
      if (typeof window === "undefined" || !window.Razorpay) {
        setError("Razorpay script not loaded.");
        setLoading(false);
        return;
      }
      const rzp = new window.Razorpay({
        key: k || keyId,
        amount,
        order_id: razorpayOrderId,
        name: "Sri Krishna Mobiles",
        description: "Mobile spares & accessories",
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/orders/razorpay-verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                email,
                name: name || undefined,
                items: cart.map((c) => ({ productId: c.productId, quantity: c.quantity, price: c.price })),
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error ?? "Verification failed");
            if (verifyData.order?.id) onSuccess(String(verifyData.order.id));
          } catch (e) {
            setError(e instanceof Error ? e.message : "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (!keyId) {
    return (
      <p className="text-[var(--muted)] text-sm">Set NEXT_PUBLIC_RAZORPAY_KEY_ID to enable UPI/Cards.</p>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <button
        type="button"
        onClick={openCheckout}
        disabled={loading}
        className="w-full rounded-lg border-2 border-[#0c2451] bg-[#0c2451] text-white py-3 font-medium hover:bg-[#0a1f45] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          "Opening…"
        ) : (
          <>
            <span>Pay with UPI / Cards / Netbanking</span>
            <span className="text-xs opacity-90">(Razorpay)</span>
          </>
        )}
      </button>
    </>
  );
}
