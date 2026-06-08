"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle,
  Package,
  Truck,
  Home,
  Mail,
  Download,
  Share2,
  Calendar,
  MapPin,
} from "lucide-react";

// Mock order data - in real app, fetch from API
const mockOrder = {
  id: "ORD-2024-001",
  orderNumber: "SKM-240605-001",
  date: "2024-06-05T10:30:00Z",
  status: "confirmed",
  paymentStatus: "completed",
  paymentMethod: "UPI",
  estimatedDelivery: "2024-06-08",
  items: [
    { id: 1, name: "iPhone 14 Pro Max OLED Display", quantity: 1, price: 15499 },
    { id: 2, name: "iPhone 14 Pro Battery", quantity: 2, price: 3499 },
  ],
  subtotal: 22497,
  gst: 4049,
  shipping: 0,
  discount: 0,
  total: 26546,
  shippingAddress: {
    name: "John Doe",
    address: "123, Park Street, Near City Mall",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    phone: "+91 98765 43210",
  },
};

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const [order] = useState(mockOrder); // In real app, fetch by orderId
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Clear cart on successful order
    localStorage.removeItem("cart");
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--success)]/10">
            <CheckCircle className="h-10 w-10 text-[var(--success)]" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Order Confirmed!
          </h1>
          <p className="mt-2 text-[var(--foreground-muted)]">
            Thank you for your purchase. We&apos;ve sent a confirmation email to your inbox.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          {/* Order Summary Card */}
          <Card className="mb-6 border-[var(--border)] bg-[var(--card)] p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-[var(--foreground-muted)]">Order Number</p>
                <p className="text-lg font-semibold text-[var(--foreground)]">
                  {order.orderNumber}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Invoice
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="mb-6 grid gap-4 border-y border-[var(--border)] py-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-[var(--foreground-muted)]">Order Date</p>
                <p className="font-medium text-[var(--foreground)]">
                  {new Date(order.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground-muted)]">Payment Method</p>
                <p className="font-medium text-[var(--foreground)]">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground-muted)]">Order Total</p>
                <p className="font-medium text-[var(--primary)]">
                  {formatCurrency(order.total)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="mb-4 font-semibold text-[var(--foreground)]">
                Order Items ({order.items.length})
              </h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-lg bg-[var(--background-secondary)] p-3"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[var(--background)] text-2xl">
                      📱
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[var(--foreground)]">{item.name}</p>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-[var(--primary)]">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="rounded-lg bg-[var(--background-secondary)] p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-[var(--foreground-secondary)]">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--foreground-secondary)]">
                  <span>GST (18%)</span>
                  <span>{formatCurrency(order.gst)}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--foreground-secondary)]">
                  <span>Shipping</span>
                  {order.shipping === 0 ? (
                    <span className="text-[var(--success)]">FREE</span>
                  ) : (
                    <span>{formatCurrency(order.shipping)}</span>
                  )}
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-[var(--success)]">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="mt-2 flex justify-between border-t border-[var(--border)] pt-2">
                  <span className="font-semibold text-[var(--foreground)]">Total</span>
                  <span className="font-bold text-[var(--primary)]">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Delivery Info */}
          <Card className="mb-6 border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-[var(--foreground)]">
              <MapPin className="h-5 w-5 text-[var(--primary)]" />
              Delivery Information
            </h3>
            <div className="space-y-1">
              <p className="font-medium text-[var(--foreground)]">
                {order.shippingAddress.name}
              </p>
              <p className="text-[var(--foreground-secondary)]">
                {order.shippingAddress.address}
              </p>
              <p className="text-[var(--foreground-secondary)]">
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.pincode}
              </p>
              <p className="text-[var(--foreground-muted)]">
                Phone: {order.shippingAddress.phone}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-[var(--primary)]/5 p-3 text-[var(--primary)]">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">
                Estimated delivery by{" "}
                {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </div>
          </Card>

          {/* What's Next */}
          <Card className="mb-6 border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="mb-4 font-semibold text-[var(--foreground)]">What&apos;s Next?</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]/10">
                  <Package className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <p className="font-medium text-[var(--foreground)]">Order Processing</p>
                <p className="text-sm text-[var(--foreground-muted)]">
                  We&apos;re preparing your items
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/10">
                  <Truck className="h-6 w-6 text-[var(--accent)]" />
                </div>
                <p className="font-medium text-[var(--foreground)]">Shipped</p>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Track your package
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--success)]/10">
                  <Home className="h-6 w-6 text-[var(--success)]" />
                </div>
                <p className="font-medium text-[var(--foreground)]">Delivered</p>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Enjoy your purchase!
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/account/orders" className="flex-1">
              <Button className="w-full gap-2">
                <Package className="h-4 w-4" />
                View Order Details
              </Button>
            </Link>
            <Link href="/shop" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Email Confirmation */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[var(--foreground-muted)]">
            <Mail className="h-4 w-4" />
            <span>
              We&apos;ve sent a confirmation email to{" "}
              <span className="text-[var(--foreground)]">john@example.com</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
