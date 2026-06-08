"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileText,
  Printer,
  RefreshCw,
} from "lucide-react";

// Mock orders data
const mockOrders = [
  { id: "ORD-001", orderNumber: "SKM-240605-001", customer: "Rahul Sharma", email: "rahul@email.com", phone: "9876543210", total: 2499, status: "delivered", paymentStatus: "paid", items: 2, date: "2024-06-05T10:30:00" },
  { id: "ORD-002", orderNumber: "SKM-240605-002", customer: "Priya Patel", email: "priya@email.com", phone: "9876543211", total: 8999, status: "shipped", paymentStatus: "paid", items: 3, date: "2024-06-05T11:15:00" },
  { id: "ORD-003", orderNumber: "SKM-240605-003", customer: "Amit Kumar", email: "amit@email.com", phone: "9876543212", total: 15499, status: "confirmed", paymentStatus: "paid", items: 1, date: "2024-06-05T14:20:00" },
  { id: "ORD-004", orderNumber: "SKM-240605-004", customer: "Sneha Gupta", email: "sneha@email.com", phone: "9876543213", total: 3499, status: "pending", paymentStatus: "pending", items: 2, date: "2024-06-05T16:45:00" },
  { id: "ORD-005", orderNumber: "SKM-240606-001", customer: "Vikram Rao", email: "vikram@email.com", phone: "9876543214", total: 12499, status: "cancelled", paymentStatus: "refunded", items: 4, date: "2024-06-06T09:10:00" },
  { id: "ORD-006", orderNumber: "SKM-240606-002", customer: "Neha Singh", email: "neha@email.com", phone: "9876543215", total: 5999, status: "confirmed", paymentStatus: "cod", items: 2, date: "2024-06-06T10:30:00" },
  { id: "ORD-007", orderNumber: "SKM-240606-003", customer: "Rajesh Verma", email: "rajesh@email.com", phone: "9876543216", total: 18999, status: "shipped", paymentStatus: "paid", items: 3, date: "2024-06-06T11:45:00" },
  { id: "ORD-008", orderNumber: "SKM-240606-004", customer: "Anita Desai", email: "anita@email.com", phone: "9876543217", total: 2999, status: "delivered", paymentStatus: "paid", items: 1, date: "2024-06-06T14:00:00" },
];

const statusOptions = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];
const paymentStatusOptions = ["all", "paid", "pending", "cod", "refunded"];

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Filter orders
  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.phone.includes(searchQuery);
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    const matchesPayment = selectedPaymentStatus === "all" || order.paymentStatus === selectedPaymentStatus;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedOrders.map((o) => o.id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-[var(--warning)]/10 text-[var(--warning)]",
      confirmed: "bg-[var(--info)]/10 text-[var(--info)]",
      shipped: "bg-[var(--accent)]/10 text-[var(--accent)]",
      delivered: "bg-[var(--success)]/10 text-[var(--success)]",
      cancelled: "bg-[var(--error)]/10 text-[var(--error)]",
    };
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      shipped: Truck,
      delivered: Package,
      cancelled: XCircle,
    };
    const Icon = icons[status as keyof typeof icons] || Clock;
    return (
      <span className={cn("flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium", styles[status as keyof typeof styles])}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const styles = {
      paid: "bg-[var(--success)]/10 text-[var(--success)]",
      pending: "bg-[var(--warning)]/10 text-[var(--warning)]",
      cod: "bg-[var(--info)]/10 text-[var(--info)]",
      refunded: "bg-[var(--error)]/10 text-[var(--error)]",
    };
    return (
      <span className={cn("rounded-full px-2 py-1 text-xs font-medium uppercase", styles[status as keyof typeof styles])}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Orders</h1>
          {selectedOrders.length > 0 && (
            <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm text-[var(--primary)]">
              {selectedOrders.length} selected
            </span>
          )}
        </div>
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
          <p className="text-sm text-[var(--foreground-muted)]">Total Orders</p>
          <p className="text-2xl font-bold text-[var(--foreground)]">{mockOrders.length}</p>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-sm text-[var(--foreground-muted)]">Pending</p>
          <p className="text-2xl font-bold text-[var(--warning)]">
            {mockOrders.filter((o) => o.status === "pending").length}
          </p>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-sm text-[var(--foreground-muted)]">Processing</p>
          <p className="text-2xl font-bold text-[var(--accent)]">
            {mockOrders.filter((o) => ["confirmed", "shipped"].includes(o.status)).length}
          </p>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-sm text-[var(--foreground-muted)]">Revenue</p>
          <p className="text-2xl font-bold text-[var(--success)]">
            {formatCurrency(mockOrders.reduce((sum, o) => sum + o.total, 0))}
          </p>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <Input
                placeholder="Search by order number, customer, email, or phone..."
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
                  Order Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Payment Status
                </label>
                <select
                  value={selectedPaymentStatus}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                >
                  {paymentStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === "all" ? "All Payment Status" : status.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-[var(--primary)]/5 p-3">
          <span className="text-sm text-[var(--foreground)]">
            {selectedOrders.length} orders selected
          </span>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm">
              Update Status
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="h-4 w-4" />
              Print Invoices
            </Button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <Card className="border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-[var(--border)]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Order</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Items</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Payment</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)]/50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleSelectOrder(order.id)}
                      className="rounded border-[var(--border)]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-[var(--primary)]">{order.orderNumber}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">{order.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-[var(--foreground)]">{order.customer}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">{order.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">{order.items}</td>
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                  <td className="px-4 py-3">{getPaymentStatusBadge(order.paymentStatus)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/orders/${order.id}`}>
                        <button className="rounded p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--primary)]">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                      <button className="rounded p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--primary)]">
                        <FileText className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--primary)]">
                        <Printer className="h-4 w-4" />
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
            {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
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
