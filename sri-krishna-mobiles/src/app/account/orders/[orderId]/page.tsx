"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Home,
  Download,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  HelpCircle,
} from "lucide-react";

interface TimelineEvent {
  status: string;
  description: string;
  date: string;
  completed: boolean;
  current?: boolean;
}

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  total: number;
  subtotal: number;
  gst: number;
  shipping: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  timeline: TimelineEvent[];
}

// Mock order data
const mockOrder: Order = {
  id: "ORD-2024-001",
  date: "2024-06-05T10:30:00Z",
  status: "shipped",
  items: [
    { id: 1, name: "iPhone 14 Pro Max OLED Display", quantity: 1, price: 15499 },
    { id: 2, name: "iPhone 14 Pro Battery", quantity: 2, price: 3499 },
  ],
  total: 22497,
  subtotal: 19065,
  gst: 3432,
  shipping: 0,
  trackingNumber: "IND123456789",
  estimatedDelivery: "2024-06-08",
  shippingAddress: {
    name: "John Doe",
    phone: "+91 98765 43210",
    address: "123, Park Street, Near City Mall",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
  },
  timeline: [
    {
      status: "Order Placed",
      description: "Your order has been confirmed",
      date: "2024-06-05T10:30:00Z",
      completed: true,
    },
    {
      status: "Processing",
      description: "Order is being prepared",
      date: "2024-06-05T14:00:00Z",
      completed: true,
    },
    {
      status: "Shipped",
      description: "Package has left our facility",
      date: "2024-06-06T09:15:00Z",
      completed: true,
      current: true,
    },
    {
      status: "Out for Delivery",
      description: "Package is with delivery agent",
      date: "",
      completed: false,
    },
    {
      status: "Delivered",
      description: "Package delivered successfully",
      date: "",
      completed: false,
    },
  ],
};

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: HelpCircle,
};

export default function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  const order = mockOrder; // In real app, fetch by orderId

  const StatusIcon = statusIcons[order.status];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/account/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        {/* Order Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              Order {order.id}
            </h1>
            <p className="text-sm text-[var(--foreground-muted)]">
              Placed on {formatDate(order.date)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2",
                order.status === "delivered" && "bg-[var(--success)]/10 text-[var(--success)]",
                order.status === "shipped" && "bg-[var(--accent)]/10 text-[var(--accent)]",
                order.status === "processing" && "bg-[var(--primary)]/10 text-[var(--primary)]",
                order.status === "pending" && "bg-[var(--warning)]/10 text-[var(--warning)]",
                order.status === "cancelled" && "bg-[var(--error)]/10 text-[var(--error)]"
              )}
            >
              <StatusIcon className="h-5 w-5" />
              <span className="font-medium capitalize">{order.status}</span>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Invoice
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking Timeline */}
            <Card className="border-[var(--border)] bg-[var(--card)] p-6">
              <h2 className="mb-6 text-lg font-semibold text-[var(--foreground)]">
                Order Status
              </h2>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--border)]" />

                {/* Timeline Events */}
                <div className="space-y-8">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="relative flex gap-4">
                      {/* Status Dot */}
                      <div
                        className={cn(
                          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                          event.completed
                            ? "border-[var(--success)] bg-[var(--success)] text-white"
                            : event.current
                            ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                            : "border-[var(--border)] bg-[var(--background)]"
                        )}
                      >
                        {event.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : event.current ? (
                          <Truck className="h-4 w-4" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-[var(--border)]" />
                        )}
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 pt-1">
                        <p
                          className={cn(
                            "font-medium",
                            event.completed || event.current
                              ? "text-[var(--foreground)]"
                              : "text-[var(--foreground-muted)]"
                          )}
                        >
                          {event.status}
                        </p>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          {event.description}
                        </p>
                        {event.date && (
                          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                            {formatDateTime(event.date)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking Number */}
              {order.trackingNumber && (
                <div className="mt-6 rounded-lg bg-[var(--background-secondary)] p-4">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    Tracking Number
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-[var(--primary)]">{order.trackingNumber}</p>
                    <Button variant="outline" size="sm">
                      Track Package
                    </Button>
                  </div>
                </div>
              )}

              {/* Estimated Delivery */}
              {order.estimatedDelivery && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-[var(--primary)]/5 p-4 text-[var(--primary)]">
                  <Home className="h-5 w-5" />
                  <span className="font-medium">
                    Estimated delivery by {formatDate(order.estimatedDelivery)}
                  </span>
                </div>
              )}
            </Card>

            {/* Order Items */}
            <Card className="border-[var(--border)] bg-[var(--card)] p-6">
              <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
                Order Items ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg bg-[var(--background-secondary)] p-4"
                  >
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-[var(--background)] text-3xl">
                      📱
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="font-medium text-[var(--foreground)]">
                          {item.name}
                        </p>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-[var(--primary)]">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
                Order Summary
              </h3>
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
                <div className="mt-2 flex justify-between border-t border-[var(--border)] pt-2">
                  <span className="font-semibold text-[var(--foreground)]">Total</span>
                  <span className="font-bold text-[var(--primary)]">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
                <MapPin className="h-5 w-5 text-[var(--primary)]" />
                Shipping Address
              </h3>
              <div className="space-y-1 text-sm">
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
                <div className="mt-2 flex items-center gap-2 text-[var(--foreground-muted)]">
                  <Phone className="h-4 w-4" />
                  {order.shippingAddress.phone}
                </div>
              </div>
            </Card>

            {/* Need Help */}
            <Card className="border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
                Need Help?
              </h3>
              <p className="mb-4 text-sm text-[var(--foreground-muted)]">
                Have questions about your order?
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full gap-2">
                  <Mail className="h-4 w-4" />
                  Email Support
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Phone className="h-4 w-4" />
                  Call Us
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
