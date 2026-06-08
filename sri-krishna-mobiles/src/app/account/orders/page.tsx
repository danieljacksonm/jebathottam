"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Search,
  Download,
  Eye,
} from "lucide-react";

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
  trackingNumber?: string;
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    date: "2024-06-05T10:30:00Z",
    status: "delivered",
    items: [
      { id: 1, name: "iPhone 14 Pro Max OLED Display", quantity: 1, price: 15499 },
      { id: 2, name: "iPhone 14 Pro Battery", quantity: 2, price: 3499 },
    ],
    total: 22497,
    trackingNumber: "IND123456789",
  },
  {
    id: "ORD-2024-002",
    date: "2024-06-01T14:20:00Z",
    status: "shipped",
    items: [
      { id: 3, name: "Samsung Galaxy S23 Ultra Battery", quantity: 1, price: 2999 },
    ],
    total: 2999,
    trackingNumber: "IND987654321",
  },
  {
    id: "ORD-2024-003",
    date: "2024-05-28T09:15:00Z",
    status: "processing",
    items: [
      { id: 4, name: "OnePlus 11 65W Warp Charger", quantity: 1, price: 1799 },
      { id: 5, name: "USB-C to Lightning Cable", quantity: 2, price: 599 },
    ],
    total: 2997,
  },
  {
    id: "ORD-2024-004",
    date: "2024-05-20T16:45:00Z",
    status: "cancelled",
    items: [
      { id: 6, name: "Pixel 7 Pro Back Glass", quantity: 1, price: 2499 },
    ],
    total: 2499,
  },
  {
    id: "ORD-2024-005",
    date: "2024-05-15T11:00:00Z",
    status: "delivered",
    items: [
      { id: 7, name: "Xiaomi Redmi Note 12 Screen", quantity: 1, price: 3499 },
      { id: 8, name: "Screen Protector", quantity: 2, price: 299 },
    ],
    total: 4097,
    trackingNumber: "IND456789123",
  },
];

const statusConfig = {
  pending: { label: "Pending", color: "text-[var(--warning)]", bgColor: "bg-[var(--warning)]/10", icon: Clock },
  processing: { label: "Processing", color: "text-[var(--primary)]", bgColor: "bg-[var(--primary)]/10", icon: Package },
  shipped: { label: "Shipped", color: "text-[var(--accent)]", bgColor: "bg-[var(--accent)]/10", icon: Truck },
  delivered: { label: "Delivered", color: "text-[var(--success)]", bgColor: "bg-[var(--success)]/10", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-[var(--error)]", bgColor: "bg-[var(--error)]/10", icon: XCircle },
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Order History
          </h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            View and track your orders
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
          <span>{mockOrders.length} orders total</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <Input
            placeholder="Search orders by ID or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="border-[var(--border)] bg-[var(--card)] p-8 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-[var(--foreground-muted)]" />
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              No orders found
            </h3>
            <p className="mt-2 text-[var(--foreground-muted)]">
              Try adjusting your search or filter
            </p>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            const isExpanded = expandedOrder === order.id;

            return (
              <Card
                key={order.id}
                className="border-[var(--border)] bg-[var(--card)] overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full",
                          status.bgColor
                        )}
                      >
                        <StatusIcon className={cn("h-6 w-6", status.color)} />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">
                          {order.id}
                        </p>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          Placed on {formatDate(order.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-[var(--foreground)]">
                          {formatCurrency(order.total)}
                        </p>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                            status.bgColor,
                            status.color
                          )}
                        >
                          {status.label}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleOrderDetails(order.id)}
                        className="rounded-full p-2 hover:bg-[var(--background-secondary)]"
                      >
                        <ChevronRight
                          className={cn(
                            "h-5 w-5 text-[var(--foreground-muted)] transition-transform",
                            isExpanded && "rotate-90"
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mt-4 flex items-center gap-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div
                        key={item.id}
                        className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--background-secondary)] text-lg"
                        style={{ marginLeft: index > 0 ? "-8px" : 0 }}
                      >
                        📱
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--background-secondary)] text-sm text-[var(--foreground-muted)]">
                        +{order.items.length - 3}
                      </div>
                    )}
                    <span className="ml-2 text-sm text-[var(--foreground-muted)]">
                      {order.items.length} {order.items.length === 1 ? "item" : "items"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </Link>
                    {order.status === "delivered" && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Invoice
                      </Button>
                    )}
                    {order.status === "shipped" && order.trackingNumber && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <Truck className="h-4 w-4" />
                        Track Order
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-[var(--border)] bg-[var(--background-secondary)] p-4 sm:p-6">
                    <h4 className="mb-4 text-sm font-semibold text-[var(--foreground)]">
                      Order Items
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-lg bg-[var(--card)] p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--background-secondary)] text-2xl">
                              📱
                            </div>
                            <div>
                              <p className="font-medium text-[var(--foreground)]">
                                {item.name}
                              </p>
                              <p className="text-sm text-[var(--foreground-muted)]">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-medium text-[var(--foreground)]">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-4 rounded-lg bg-[var(--card)] p-4">
                      <div className="flex justify-between text-sm text-[var(--foreground-muted)]">
                        <span>Subtotal</span>
                        <span>{formatCurrency(order.total * 0.85)}</span>
                      </div>
                      <div className="mt-1 flex justify-between text-sm text-[var(--foreground-muted)]">
                        <span>GST (18%)</span>
                        <span>{formatCurrency(order.total * 0.15)}</span>
                      </div>
                      <div className="mt-2 flex justify-between border-t border-[var(--border)] pt-2 font-semibold text-[var(--foreground)]">
                        <span>Total</span>
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {order.trackingNumber && (
                      <div className="mt-4 rounded-lg bg-[var(--primary)]/5 p-4">
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          Tracking Number
                        </p>
                        <p className="text-[var(--primary)]">{order.trackingNumber}</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
