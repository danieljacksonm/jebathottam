"use client";

import { useEffect, useState } from "react";

type Order = {
  id: number;
  paypalOrderId: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  email: string;
  name: string | null;
  total: number;
  status: string;
  createdAt: string;
  items: { quantity: number; price: number; product: { name: string } }[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = sessionStorage.getItem("adminKey");
    if (!key) return;
    fetch("/api/admin/orders", { headers: { "x-admin-key": key } })
      .then((r) => r.json())
      .then((data) => (Array.isArray(data) ? setOrders(data) : setOrders([])))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-[var(--muted)]">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div
            key={o.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-[var(--foreground)]">#{o.id} – {o.email}</p>
                {o.name && <p className="text-sm text-[var(--muted)]">{o.name}</p>}
              </div>
              <p className="font-semibold text-[var(--accent)]">₹{Number(o.total).toLocaleString()}</p>
            </div>
            <p className="text-xs text-[var(--muted)] mb-2">
              {new Date(o.createdAt).toLocaleString()} · {o.status}
              {o.razorpayPaymentId ? " · Razorpay (UPI/Cards)" : o.paypalOrderId ? " · PayPal" : ""}
            </p>
            <ul className="text-sm text-[var(--muted)]">
              {o.items.map((item, i) => (
                <li key={i}>
                  {item.product.name} × {item.quantity} – ₹{Number(item.price * item.quantity).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {orders.length === 0 && <p className="text-[var(--muted)]">No orders yet.</p>}
    </div>
  );
}
