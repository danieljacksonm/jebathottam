"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

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
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/orders")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Failed to load orders");
        return data;
      })
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-[var(--foreground-muted)]">Loading orders…</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">Online Orders</h1>
        <p className="text-sm text-[var(--foreground-muted)]">Orders from the website shop</p>
      </div>

      {error && (
        <Card className="border-[var(--error)]/30 bg-[var(--error)]/5 p-4 text-sm text-[var(--error)]">
          {error}
        </Card>
      )}

      <div className="space-y-3">
        {orders.map((o) => (
          <Card key={o.id} className="border-[var(--border)] p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-[var(--foreground)]">
                  #{o.id} – {o.name || o.email}
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {new Date(o.createdAt).toLocaleString("en-IN")} · {o.status}
                  {o.razorpayPaymentId
                    ? " · Razorpay"
                    : o.paypalOrderId
                      ? " · PayPal"
                      : ""}
                </p>
              </div>
              <p className="text-lg font-semibold text-[var(--primary)]">
                {formatCurrency(Number(o.total))}
              </p>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-[var(--foreground-secondary)]">
              {o.items.map((item, i) => (
                <li key={i}>
                  {item.product.name} × {item.quantity} –{" "}
                  {formatCurrency(Number(item.price * item.quantity))}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {orders.length === 0 && !error && (
        <Card className="p-8 text-center text-sm text-[var(--foreground-muted)]">
          No online orders yet.
        </Card>
      )}
    </div>
  );
}
