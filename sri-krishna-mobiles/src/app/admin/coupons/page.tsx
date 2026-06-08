"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Check,
  X,
  Percent,
  Tag,
  Calendar,
  ShoppingCart,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Mock coupons data
const mockCoupons = [
  { id: "1", code: "WELCOME10", type: "percentage", value: 10, minOrder: 500, maxDiscount: 500, usageLimit: 100, usedCount: 45, startDate: "2024-06-01", endDate: "2024-12-31", status: "active", description: "10% off for new customers" },
  { id: "2", code: "SAVE500", type: "fixed", value: 500, minOrder: 2000, maxDiscount: 500, usageLimit: 50, usedCount: 23, startDate: "2024-06-01", endDate: "2024-08-31", status: "active", description: "Flat ₹500 off on orders above ₹2000" },
  { id: "3", code: "FLASH20", type: "percentage", value: 20, minOrder: 1000, maxDiscount: 1000, usageLimit: 200, usedCount: 156, startDate: "2024-06-05", endDate: "2024-06-10", status: "expired", description: "Flash sale - 20% off" },
  { id: "4", code: "VIP25", type: "percentage", value: 25, minOrder: 5000, maxDiscount: 2500, usageLimit: 20, usedCount: 5, startDate: "2024-06-01", endDate: "2024-12-31", status: "active", description: "VIP customers exclusive" },
  { id: "5", code: "FREESHIP", type: "free_shipping", value: 0, minOrder: 999, maxDiscount: 99, usageLimit: 500, usedCount: 234, startDate: "2024-01-01", endDate: "2024-12-31", status: "active", description: "Free shipping on orders above ₹999" },
  { id: "6", code: "MONSOON15", type: "percentage", value: 15, minOrder: 1500, maxDiscount: 1500, usageLimit: 100, usedCount: 0, startDate: "2024-07-01", endDate: "2024-09-30", status: "scheduled", description: "Monsoon sale - Coming soon" },
];

const statusOptions = ["all", "active", "expired", "scheduled", "disabled"];

export default function AdminCouponsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filter coupons
  const filteredCoupons = mockCoupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || coupon.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-[var(--success)]/10 text-[var(--success)]",
      expired: "bg-[var(--foreground-muted)]/10 text-[var(--foreground-muted)]",
      scheduled: "bg-[var(--info)]/10 text-[var(--info)]",
      disabled: "bg-[var(--error)]/10 text-[var(--error)]",
    };
    return (
      <span className={cn("rounded-full px-2 py-1 text-xs font-medium capitalize", styles[status as keyof typeof styles])}>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      percentage: "bg-[var(--primary)]/10 text-[var(--primary)]",
      fixed: "bg-[var(--accent)]/10 text-[var(--accent)]",
      free_shipping: "bg-[var(--info)]/10 text-[var(--info)]",
    };
    const labels = {
      percentage: "% Off",
      fixed: "₹ Off",
      free_shipping: "Free Ship",
    };
    return (
      <span className={cn("rounded-full px-2 py-1 text-xs font-medium", styles[type as keyof typeof styles])}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Coupons & Discounts</h1>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10">
              <Tag className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Total Coupons</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">{mockCoupons.length}</p>
            </div>
          </div>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success)]/10">
              <Check className="h-5 w-5 text-[var(--success)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Active</p>
              <p className="text-2xl font-bold text-[var(--success)]">
                {mockCoupons.filter((c) => c.status === "active").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10">
              <ShoppingCart className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Total Used</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {mockCoupons.reduce((sum, c) => sum + c.usedCount, 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--info)]/10">
              <Percent className="h-5 w-5 text-[var(--info)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Redemption Rate</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {Math.round((mockCoupons.reduce((sum, c) => sum + c.usedCount, 0) / 
                  mockCoupons.reduce((sum, c) => sum + c.usageLimit, 0)) * 100)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <Input
              placeholder="Search coupons by code or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Coupons Table */}
      <Card className="border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Code</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Usage</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Validity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCoupons.map((coupon) => (
                <tr key={coupon.id} className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-[var(--background-secondary)] px-2 py-1 text-sm font-mono font-medium text-[var(--primary)]">
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        className="rounded p-1 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--primary)]"
                      >
                        {copiedCode === coupon.code ? (
                          <Check className="h-4 w-4 text-[var(--success)]" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--foreground)]">{coupon.description}</td>
                  <td className="px-4 py-3">{getTypeBadge(coupon.type)}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-[var(--foreground)]">
                      {coupon.type === "percentage" ? `${coupon.value}%` : formatCurrency(coupon.value)}
                      <p className="text-xs text-[var(--foreground-muted)]">
                        Min: {formatCurrency(coupon.minOrder)}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-[var(--foreground)]">
                      {coupon.usedCount} / {coupon.usageLimit}
                      <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-[var(--background-secondary)]">
                        <div
                          className="h-full rounded-full bg-[var(--primary)]"
                          style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(coupon.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--primary)]">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--error)]/10 hover:text-[var(--error)]">
                        <Trash2 className="h-4 w-4" />
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
            {Math.min(currentPage * itemsPerPage, filteredCoupons.length)} of{" "}
            {filteredCoupons.length} coupons
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

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg border-[var(--border)] bg-[var(--card)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--foreground)]">Create Coupon</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded p-1 hover:bg-[var(--background-secondary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                  Coupon Code
                </label>
                <Input placeholder="e.g., SAVE2024" className="uppercase" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                  Description
                </label>
                <Input placeholder="Brief description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                    Discount Type
                  </label>
                  <select className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                    Value
                  </label>
                  <Input type="number" placeholder="10" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                    Min Order Amount
                  </label>
                  <Input type="number" placeholder="500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                    Max Discount
                  </label>
                  <Input type="number" placeholder="500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                    Usage Limit
                  </label>
                  <Input type="number" placeholder="100" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                    Valid Until
                  </label>
                  <Input type="date" />
                </div>
              </div>
              <Button className="w-full">Create Coupon</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
