"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  MoreHorizontal,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  RefreshCw,
} from "lucide-react";

// Mock dashboard data
const kpiData = {
  totalSales: 1250000,
  salesChange: 12.5,
  totalOrders: 1256,
  ordersChange: 8.2,
  totalCustomers: 2485,
  customersChange: 15.3,
  totalProducts: 342,
  lowStockProducts: 8,
};

const recentOrders = [
  { id: "ORD-001", customer: "Rahul Sharma", amount: 2499, status: "delivered", time: "2 min ago" },
  { id: "ORD-002", customer: "Priya Patel", amount: 8999, status: "shipped", time: "5 min ago" },
  { id: "ORD-003", customer: "Amit Kumar", amount: 15499, status: "confirmed", time: "12 min ago" },
  { id: "ORD-004", customer: "Sneha Gupta", amount: 3499, status: "pending", time: "25 min ago" },
  { id: "ORD-005", customer: "Vikram Rao", amount: 12499, status: "processing", time: "1 hour ago" },
];

const salesData = [
  { day: "Mon", sales: 45000 },
  { day: "Tue", sales: 52000 },
  { day: "Wed", sales: 48000 },
  { day: "Thu", sales: 61000 },
  { day: "Fri", sales: 58000 },
  { day: "Sat", sales: 72000 },
  { day: "Sun", sales: 68000 },
];

const activityFeed = [
  { id: 1, type: "order", message: "New order #ORD-001 received", time: "2 min ago", icon: ShoppingCart },
  { id: 2, type: "product", message: "Low stock alert: iPhone 14 Pro Display", time: "15 min ago", icon: AlertTriangle },
  { id: 3, type: "user", message: "New customer registered: Priya Patel", time: "30 min ago", icon: Users },
  { id: 4, type: "order", message: "Order #ORD-890 shipped via Delhivery", time: "1 hour ago", icon: Truck },
  { id: 5, type: "review", message: "New 5-star review on Samsung S23 Screen", time: "2 hours ago", icon: CheckCircle },
];

const topProducts = [
  { name: "iPhone 14 Pro Display", sales: 45, revenue: 562455 },
  { name: "iPhone 14 Battery", sales: 78, revenue: 272922 },
  { name: "Samsung S23 Screen", sales: 32, revenue: 287968 },
  { name: "OnePlus 11 Display", sales: 28, revenue: 251972 },
];

export default function AdminDashboardPage() {
  const maxSales = Math.max(...salesData.map((d) => d.sales));

  const getStatusIcon = (status: string) => {
    const icons = {
      delivered: CheckCircle,
      shipped: Truck,
      confirmed: CheckCircle,
      pending: Clock,
      processing: RefreshCw,
    };
    return icons[status as keyof typeof icons] || Clock;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      delivered: "text-[var(--success)]",
      shipped: "text-[var(--accent)]",
      confirmed: "text-[var(--info)]",
      pending: "text-[var(--warning)]",
      processing: "text-[var(--primary)]",
    };
    return colors[status as keyof typeof colors] || "text-[var(--foreground-muted)]";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
          <p className="text-sm text-[var(--foreground-muted)]">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Last 7 Days
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Sales */}
        <Card className="border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Total Sales</p>
              <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">
                {formatCurrency(kpiData.totalSales)}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm text-[var(--success)]">
                <TrendingUp className="h-4 w-4" />
                <span>+{kpiData.salesChange}%</span>
                <span className="text-[var(--foreground-muted)]">vs last week</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10">
              <DollarSign className="h-5 w-5 text-[var(--primary)]" />
            </div>
          </div>
        </Card>

        {/* Total Orders */}
        <Card className="border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Total Orders</p>
              <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{kpiData.totalOrders}</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-[var(--success)]">
                <TrendingUp className="h-4 w-4" />
                <span>+{kpiData.ordersChange}%</span>
                <span className="text-[var(--foreground-muted)]">vs last week</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10">
              <ShoppingCart className="h-5 w-5 text-[var(--accent)]" />
            </div>
          </div>
        </Card>

        {/* Total Customers */}
        <Card className="border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Total Customers</p>
              <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{kpiData.totalCustomers}</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-[var(--success)]">
                <TrendingUp className="h-4 w-4" />
                <span>+{kpiData.customersChange}%</span>
                <span className="text-[var(--foreground-muted)]">vs last week</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success)]/10">
              <Users className="h-5 w-5 text-[var(--success)]" />
            </div>
          </div>
        </Card>

        {/* Products / Low Stock */}
        <Card className="border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Products</p>
              <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{kpiData.totalProducts}</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-[var(--warning)]">
                <AlertTriangle className="h-4 w-4" />
                <span>{kpiData.lowStockProducts} low stock</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--info)]/10">
              <Package className="h-5 w-5 text-[var(--info)]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart */}
        <Card className="border-[var(--border)] bg-[var(--card)] p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-[var(--foreground)]">Sales Overview</h3>
            <Link href="/admin/reports">
              <Button variant="ghost" size="sm" className="gap-1 text-[var(--primary)]">
                View Report <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="flex items-end gap-2">
            {salesData.map((data) => (
              <div key={data.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full">
                  <div
                    className="rounded-t-lg bg-[var(--primary)]/80 transition-all hover:bg-[var(--primary)]"
                    style={{ height: `${(data.sales / maxSales) * 150}px` }}
                  />
                </div>
                <span className="text-xs text-[var(--foreground-muted)]">{data.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-[var(--foreground-muted)]">
            <span>Total: {formatCurrency(salesData.reduce((sum, d) => sum + d.sales, 0))}</span>
            <span>Avg: {formatCurrency(salesData.reduce((sum, d) => sum + d.sales, 0) / salesData.length)}</span>
          </div>
        </Card>

        {/* Activity Feed */}
        <Card className="border-[var(--border)] bg-[var(--card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-[var(--foreground)]">Activity Feed</h3>
            <Activity className="h-4 w-4 text-[var(--foreground-muted)]" />
          </div>
          <div className="space-y-4">
            {activityFeed.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]/10">
                  <activity.icon className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--foreground)]">{activity.message}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="border-[var(--border)] bg-[var(--card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-[var(--foreground)]">Recent Orders</h3>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="gap-1 text-[var(--primary)]">
                View All <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <div key={order.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", getStatusColor(order.status).replace("text-", "bg-") + "/10")}>
                      <StatusIcon className={cn("h-4 w-4", getStatusColor(order.status))} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{order.id}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[var(--foreground)]">{formatCurrency(order.amount)}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{order.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top Products */}
        <Card className="border-[var(--border)] bg-[var(--card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-[var(--foreground)]">Top Products</h3>
            <Link href="/admin/products">
              <Button variant="ghost" size="sm" className="gap-1 text-[var(--primary)]">
                View All <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)]/10 text-xs font-bold text-[var(--primary)]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">{product.name}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{product.sales} sold</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-[var(--success)]">{formatCurrency(product.revenue)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-[var(--border)] bg-[var(--card)] p-5">
        <h3 className="mb-4 font-semibold text-[var(--foreground)]">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products/new">
            <Button variant="outline" className="gap-2">
              <Package className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
          <Link href="/admin/coupons">
            <Button variant="outline" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Create Coupon
            </Button>
          </Link>
          <Link href="/admin/inventory">
            <Button variant="outline" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Check Inventory
            </Button>
          </Link>
          <Link href="/pos">
            <Button variant="outline" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Open POS
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
