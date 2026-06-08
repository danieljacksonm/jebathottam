"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import {
  AlertTriangle,
  Package,
  Search,
  Filter,
  Plus,
  Minus,
  RefreshCw,
  Download,
  Mail,
  Bell,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Mock inventory data
const mockInventory = [
  { id: "1", name: "iPhone 14 Pro Display OLED", sku: "SCR-IP14P-OLED", stock: 15, minStock: 10, maxStock: 50, reorderPoint: 10, category: "Screens", lastRestocked: "2024-05-20", supplier: "Apple Distributor" },
  { id: "2", name: "iPhone 14 Battery Original", sku: "BAT-IP14-ORG", stock: 20, minStock: 15, maxStock: 100, reorderPoint: 15, category: "Batteries", lastRestocked: "2024-05-25", supplier: "Apple Distributor" },
  { id: "3", name: "Samsung S23 Ultra Screen", sku: "SCR-S23U", stock: 8, minStock: 10, maxStock: 30, reorderPoint: 8, category: "Screens", lastRestocked: "2024-05-18", supplier: "Samsung India" },
  { id: "4", name: "OnePlus 11 Display", sku: "SCR-OP11", stock: 12, minStock: 10, maxStock: 40, reorderPoint: 10, category: "Screens", lastRestocked: "2024-05-22", supplier: "OnePlus India" },
  { id: "5", name: "Xiaomi Redmi Note 12 Screen", sku: "SCR-RN12", stock: 5, minStock: 10, maxStock: 50, reorderPoint: 10, category: "Screens", lastRestocked: "2024-05-15", supplier: "Xiaomi India" },
  { id: "6", name: "iPhone 13 Charging Port", sku: "PRT-IP13-CHG", stock: 0, minStock: 5, maxStock: 30, reorderPoint: 5, category: "Ports", lastRestocked: "2024-05-10", supplier: "Apple Distributor" },
  { id: "7", name: "Samsung A54 Battery", sku: "BAT-A54", stock: 25, minStock: 10, maxStock: 60, reorderPoint: 10, category: "Batteries", lastRestocked: "2024-05-28", supplier: "Samsung India" },
  { id: "8", name: "Universal Type-C Cable", sku: "CBL-TC-UNI", stock: 100, minStock: 50, maxStock: 500, reorderPoint: 50, category: "Cables", lastRestocked: "2024-06-01", supplier: "Generic Supplier" },
];

const mockAlerts = [
  { id: "1", productId: "3", type: "low_stock", message: "Samsung S23 Ultra Screen stock is below reorder point", createdAt: "2024-06-06T10:30:00", status: "unread" },
  { id: "2", productId: "5", type: "low_stock", message: "Xiaomi Redmi Note 12 Screen critically low (5 units)", createdAt: "2024-06-06T09:15:00", status: "unread" },
  { id: "3", productId: "6", type: "out_of_stock", message: "iPhone 13 Charging Port is out of stock", createdAt: "2024-06-05T16:45:00", status: "read" },
];

export default function AdminInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [alerts, setAlerts] = useState(mockAlerts);

  // Filter inventory
  const filteredInventory = mockInventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    let matchesStock = true;
    if (stockFilter === "low") matchesStock = item.stock <= item.reorderPoint && item.stock > 0;
    if (stockFilter === "out") matchesStock = item.stock === 0;
    if (stockFilter === "healthy") matchesStock = item.stock > item.reorderPoint;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockCount = mockInventory.filter((i) => i.stock <= i.reorderPoint && i.stock > 0).length;
  const outOfStockCount = mockInventory.filter((i) => i.stock === 0).length;

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedItems = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const markAlertRead = (alertId: string) => {
    setAlerts((prev) => prev.map((a) => a.id === alertId ? { ...a, status: "read" } : a));
  };

  const getStockStatus = (item: typeof mockInventory[0]) => {
    if (item.stock === 0) {
      return <span className="rounded-full bg-[var(--error)]/10 px-2 py-1 text-xs font-medium text-[var(--error)]">Out of Stock</span>;
    }
    if (item.stock <= item.reorderPoint) {
      return <span className="rounded-full bg-[var(--warning)]/10 px-2 py-1 text-xs font-medium text-[var(--warning)]">Low Stock ({item.stock})</span>;
    }
    return <span className="rounded-full bg-[var(--success)]/10 px-2 py-1 text-xs font-medium text-[var(--success)]">Healthy</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Inventory Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10">
              <Package className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Total Products</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">{mockInventory.length}</p>
            </div>
          </div>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--warning)]/10">
              <AlertTriangle className="h-5 w-5 text-[var(--warning)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Low Stock</p>
              <p className="text-2xl font-bold text-[var(--warning)]">{lowStockCount}</p>
            </div>
          </div>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--error)]/10">
              <XCircle className="h-5 w-5 text-[var(--error)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Out of Stock</p>
              <p className="text-2xl font-bold text-[var(--error)]">{outOfStockCount}</p>
            </div>
          </div>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success)]/10">
              <CheckCircle className="h-5 w-5 text-[var(--success)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Healthy Stock</p>
              <p className="text-2xl font-bold text-[var(--success)]">
                {mockInventory.filter((i) => i.stock > i.reorderPoint).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts Section */}
      {alerts.filter((a) => a.status === "unread").length > 0 && (
        <Card className="border-[var(--border)] border-l-4 border-l-[var(--warning)] bg-[var(--card)] p-4">
          <div className="mb-3 flex items-center gap-2">
            <Bell className="h-5 w-5 text-[var(--warning)]" />
            <h2 className="font-semibold text-[var(--foreground)]">Stock Alerts</h2>
            <span className="rounded-full bg-[var(--warning)]/10 px-2 py-0.5 text-xs text-[var(--warning)]">
              {alerts.filter((a) => a.status === "unread").length} new
            </span>
          </div>
          <div className="space-y-2">
            {alerts.filter((a) => a.status === "unread").map((alert) => (
              <div key={alert.id} className="flex items-center justify-between rounded-lg bg-[var(--background-secondary)] p-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-[var(--warning)]" />
                  <span className="text-sm text-[var(--foreground)]">{alert.message}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--foreground-muted)]">
                    {new Date(alert.createdAt).toLocaleTimeString()}
                  </span>
                  <button
                    onClick={() => markAlertRead(alert.id)}
                    className="rounded p-1 hover:bg-[var(--background)]"
                  >
                    <CheckCircle className="h-4 w-4 text-[var(--success)]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Search & Filters */}
      <Card className="border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <Input
                placeholder="Search by product name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={cn("gap-2", showFilters && "bg-[var(--primary)]/10 text-[var(--primary)]")}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid gap-4 border-t border-[var(--border)] pt-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Stock Status
                </label>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                >
                  <option value="all">All</option>
                  <option value="healthy">Healthy Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                >
                  <option value="All">All Categories</option>
                  <option value="Screens">Screens</option>
                  <option value="Batteries">Batteries</option>
                  <option value="Ports">Ports</option>
                  <option value="Cables">Cables</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Inventory Table */}
      <Card className="border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Current Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Min / Max</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Supplier</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item) => (
                <tr key={item.id} className={cn(
                  "border-b border-[var(--border)] hover:bg-[var(--background-secondary)]/50",
                  item.stock <= item.reorderPoint && item.stock > 0 && "bg-[var(--warning)]/5",
                  item.stock === 0 && "bg-[var(--error)]/5"
                )}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--foreground)]">{item.name}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">Last restocked: {item.lastRestocked}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">{item.sku}</td>
                  <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">{item.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="rounded p-1 hover:bg-[var(--background-secondary)]">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className={cn(
                        "w-12 text-center font-medium",
                        item.stock === 0 ? "text-[var(--error)]" : 
                        item.stock <= item.reorderPoint ? "text-[var(--warning)]" : "text-[var(--success)]"
                      )}>
                        {item.stock}
                      </span>
                      <button className="rounded p-1 hover:bg-[var(--background-secondary)]">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">
                    {item.minStock} / {item.maxStock}
                  </td>
                  <td className="px-4 py-3">{getStockStatus(item)}</td>
                  <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">{item.supplier}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--primary)]" title="Restock">
                        <Plus className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]" title="Email Supplier">
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3">
          <p className="text-sm text-[var(--foreground-muted)]">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredInventory.length)} of{" "}
            {filteredInventory.length} items
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-[var(--border)] p-2 hover:bg-[var(--background-secondary)] disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-[var(--foreground)]">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="rounded-lg border border-[var(--border)] p-2 hover:bg-[var(--background-secondary)] disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
