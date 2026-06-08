"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Download,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Calendar,
  Filter,
  ChevronDown,
  Printer,
  FileSpreadsheet,
} from "lucide-react";

// Mock report data
const salesData = [
  { month: "Jan", sales: 45000, orders: 120, customers: 85 },
  { month: "Feb", sales: 52000, orders: 145, customers: 102 },
  { month: "Mar", sales: 48000, orders: 132, customers: 95 },
  { month: "Apr", sales: 61000, orders: 168, customers: 118 },
  { month: "May", sales: 58000, orders: 155, customers: 110 },
  { month: "Jun", sales: 72000, orders: 195, customers: 142 },
];

const topProducts = [
  { name: "iPhone 14 Pro Display", sku: "SCR-IP14P", sold: 45, revenue: 562455, stock: 15 },
  { name: "iPhone 14 Battery", sku: "BAT-IP14", sold: 78, revenue: 272922, stock: 20 },
  { name: "Samsung S23 Screen", sku: "SCR-S23", sold: 32, revenue: 287968, stock: 8 },
  { name: "OnePlus 11 Display", sku: "SCR-OP11", sold: 28, revenue: 251972, stock: 12 },
  { name: "Type-C Cable", sku: "CBL-TC", sold: 156, revenue: 46644, stock: 100 },
];

const categoryData = [
  { category: "Screens", sales: 1250000, percentage: 45 },
  { category: "Batteries", sales: 680000, percentage: 24 },
  { category: "Cables", sales: 320000, percentage: 12 },
  { category: "Chargers", sales: 280000, percentage: 10 },
  { category: "Accessories", sales: 250000, percentage: 9 },
];

const gstReport = [
  { month: "Jan", taxable: 38136, cgst: 3432, sgst: 3432, igst: 0, total: 6864 },
  { month: "Feb", taxable: 44068, cgst: 3966, sgst: 3966, igst: 0, total: 7932 },
  { month: "Mar", taxable: 40678, cgst: 3661, sgst: 3661, igst: 0, total: 7322 },
  { month: "Apr", taxable: 51695, cgst: 4653, sgst: 4653, igst: 0, total: 9306 },
  { month: "May", taxable: 49153, cgst: 4424, sgst: 4424, igst: 0, total: 8848 },
  { month: "Jun", taxable: 61017, cgst: 5492, sgst: 5492, igst: 0, total: 10983 },
];

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<"sales" | "products" | "customers" | "gst">("sales");
  const [dateRange, setDateRange] = useState("last_30_days");

  const totalSales = salesData.reduce((sum, d) => sum + d.sales, 0);
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
  const totalCustomers = salesData.reduce((sum, d) => sum + d.customers, 0);

  const exportReport = (format: "csv" | "pdf") => {
    alert(`Exporting ${activeTab} report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Reports & Analytics</h1>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          >
            <option value="today">Today</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_3_months">Last 3 Months</option>
            <option value="last_6_months">Last 6 Months</option>
            <option value="this_year">This Year</option>
          </select>
          <Button variant="outline" size="sm" onClick={() => exportReport("csv")} className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportReport("pdf")} className="gap-2">
            <FileText className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border)]">
        {[
          { id: "sales", label: "Sales Report", icon: TrendingUp },
          { id: "products", label: "Product Analytics", icon: Package },
          { id: "customers", label: "Customer Insights", icon: Users },
          { id: "gst", label: "GST Report", icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sales Report */}
      {activeTab === "sales" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-[var(--border)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10">
                  <DollarSign className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground-muted)]">Total Revenue</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{formatCurrency(totalSales)}</p>
                </div>
              </div>
            </Card>
            <Card className="border-[var(--border)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10">
                  <ShoppingCart className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground-muted)]">Total Orders</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{totalOrders}</p>
                </div>
              </div>
            </Card>
            <Card className="border-[var(--border)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success)]/10">
                  <TrendingUp className="h-5 w-5 text-[var(--success)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground-muted)]">Avg Order Value</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    {formatCurrency(totalSales / totalOrders)}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="border-[var(--border)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--info)]/10">
                  <Users className="h-5 w-5 text-[var(--info)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground-muted)]">New Customers</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{totalCustomers}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Monthly Sales Chart */}
          <Card className="border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Monthly Sales Trend</h3>
            <div className="space-y-4">
              {salesData.map((data) => (
                <div key={data.month} className="flex items-center gap-4">
                  <span className="w-12 text-sm font-medium text-[var(--foreground)]">{data.month}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--foreground-secondary)]">{formatCurrency(data.sales)}</span>
                      <span className="text-[var(--foreground-muted)]">{data.orders} orders</span>
                    </div>
                    <div className="mt-1 h-8 overflow-hidden rounded-lg bg-[var(--background-secondary)]">
                      <div
                        className="h-full rounded-lg bg-[var(--primary)]/80 transition-all"
                        style={{ width: `${(data.sales / 80000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Category Breakdown */}
          <Card className="border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Sales by Category</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryData.map((cat) => (
                <div key={cat.category} className="rounded-lg border border-[var(--border)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--foreground)]">{cat.category}</span>
                    <span className="text-sm text-[var(--primary)]">{cat.percentage}%</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{formatCurrency(cat.sales)}</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--background-secondary)]">
                    <div
                      className="h-full rounded-full bg-[var(--primary)]"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Product Analytics */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <Card className="border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Top Selling Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="pb-3 text-left text-sm font-medium text-[var(--foreground)]">Product</th>
                    <th className="pb-3 text-left text-sm font-medium text-[var(--foreground)]">SKU</th>
                    <th className="pb-3 text-right text-sm font-medium text-[var(--foreground)]">Units Sold</th>
                    <th className="pb-3 text-right text-sm font-medium text-[var(--foreground)]">Revenue</th>
                    <th className="pb-3 text-right text-sm font-medium text-[var(--foreground)]">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, i) => (
                    <tr key={product.sku} className="border-b border-[var(--border)]">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)]/10 text-xs font-bold text-[var(--primary)]">
                            {i + 1}
                          </span>
                          <span className="font-medium text-[var(--foreground)]">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-[var(--foreground-secondary)]">{product.sku}</td>
                      <td className="py-3 text-right font-medium text-[var(--foreground)]">{product.sold}</td>
                      <td className="py-3 text-right font-medium text-[var(--success)]">{formatCurrency(product.revenue)}</td>
                      <td className="py-3 text-right">
                        <span className={cn(
                          "rounded-full px-2 py-1 text-xs",
                          product.stock <= 10 ? "bg-[var(--warning)]/10 text-[var(--warning)]" : "bg-[var(--success)]/10 text-[var(--success)]"
                        )}>
                          {product.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Customer Insights */}
      {activeTab === "customers" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-[var(--border)] bg-[var(--card)] p-4">
              <p className="text-sm text-[var(--foreground-muted)]">Total Customers</p>
              <p className="text-3xl font-bold text-[var(--foreground)]">1,248</p>
              <p className="text-sm text-[var(--success)]">+12% from last month</p>
            </Card>
            <Card className="border-[var(--border)] bg-[var(--card)] p-4">
              <p className="text-sm text-[var(--foreground-muted)]">Repeat Customers</p>
              <p className="text-3xl font-bold text-[var(--foreground)]">486</p>
              <p className="text-sm text-[var(--foreground-muted)]">39% of total</p>
            </Card>
            <Card className="border-[var(--border)] bg-[var(--card)] p-4">
              <p className="text-sm text-[var(--foreground-muted)]">Avg Lifetime Value</p>
              <p className="text-3xl font-bold text-[var(--foreground)]">{formatCurrency(2450)}</p>
              <p className="text-sm text-[var(--success)]">+8% from last month</p>
            </Card>
          </div>
        </div>
      )}

      {/* GST Report */}
      {activeTab === "gst" && (
        <div className="space-y-6">
          <Card className="border-[var(--border)] bg-[var(--card)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">GST Summary (6 Months)</h3>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download GSTR-1
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Month</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">Taxable Value</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">CGST (9%)</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">SGST (9%)</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">IGST</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">Total GST</th>
                  </tr>
                </thead>
                <tbody>
                  {gstReport.map((row) => (
                    <tr key={row.month} className="border-b border-[var(--border)]">
                      <td className="px-4 py-3 font-medium text-[var(--foreground)]">{row.month}</td>
                      <td className="px-4 py-3 text-right text-[var(--foreground)]">{formatCurrency(row.taxable)}</td>
                      <td className="px-4 py-3 text-right text-[var(--foreground-secondary)]">{formatCurrency(row.cgst)}</td>
                      <td className="px-4 py-3 text-right text-[var(--foreground-secondary)]">{formatCurrency(row.sgst)}</td>
                      <td className="px-4 py-3 text-right text-[var(--foreground-secondary)]">{formatCurrency(row.igst)}</td>
                      <td className="px-4 py-3 text-right font-medium text-[var(--primary)]">{formatCurrency(row.total)}</td>
                    </tr>
                  ))}
                  <tr className="bg-[var(--background-secondary)]">
                    <td className="px-4 py-3 font-bold text-[var(--foreground)]">Total</td>
                    <td className="px-4 py-3 text-right font-bold text-[var(--foreground)]">
                      {formatCurrency(gstReport.reduce((sum, r) => sum + r.taxable, 0))}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[var(--foreground)]">
                      {formatCurrency(gstReport.reduce((sum, r) => sum + r.cgst, 0))}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[var(--foreground)]">
                      {formatCurrency(gstReport.reduce((sum, r) => sum + r.sgst, 0))}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[var(--foreground)]">
                      {formatCurrency(gstReport.reduce((sum, r) => sum + r.igst, 0))}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[var(--primary)]">
                      {formatCurrency(gstReport.reduce((sum, r) => sum + r.total, 0))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
