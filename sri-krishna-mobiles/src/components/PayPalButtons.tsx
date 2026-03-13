"use client";

import Script from "next/script";
import { useRef, useEffect, useState } from "react";

type CartItem = { productId: number; name: string; price: number; quantity: number };

export default function PayPalButtons({
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

  useEffect(() => {
    if (!sdkReady || !containerRef.current || !clientId || typeof window === "undefined") return;
    const win = window as unknown as { paypal?: { Buttons: (opts: unknown) => { render: (el: HTMLElement) => void } } };
    if (!win.paypal) return;
    containerRef.current.innerHTML = "";
    win.paypal
      .Buttons({
        createOrder: () =>
          fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: cart.map((c) => ({ productId: c.productId, name: c.name, quantity: c.quantity, price: c.price })),
              currency: "USD",
            }),
          })
            .then((r) => r.json())
            .then((d) => d.orderId),
        onApprove: (data: { orderID: string }) =>
          fetch("/api/orders/capture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paypalOrderId: data.orderID,
              email,
              name: name || undefined,
              items: cart.map((c) => ({ productId: c.productId, quantity: c.quantity, price: c.price })),
            }),
          })
            .then((r) => r.json())
            .then((result) => {
              if (result.order) onSuccess(String(result.order.id));
              else throw new Error(result.error ?? "Capture failed");
            }),
      })
      .render(containerRef.current);
  }, [sdkReady, cart, email, name, clientId, onSuccess]);

  if (!clientId) {
    return <p className="text-[var(--muted)] text-sm">PayPal client ID not set.</p>;
  }

  return (
    <>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`}
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />
      <div ref={containerRef} className="min-h-[200px]" />
    </>
  );
}
