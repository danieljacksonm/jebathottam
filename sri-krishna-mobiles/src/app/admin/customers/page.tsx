"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Mail,
  Ban,
  CheckCircle,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  User,
  Users,
  Download,
} from "lucide-react";

// Mock customers data
const mockCustomers = [
  { id: "1", name: "Rahul Sharma", email: "rahul@email.com", phone: "9876543210", orders: 12, totalSpent: 45000, status: "active", joined: "2024-01-15", lastOrder: "2024-06-05" },
  { id: "2", name: "Priya Patel", email: "priya@email.com", phone: "9876543211", orders: 8, totalSpent: 28000, status: "active", joined: "2024-02-20", lastOrder: "2024-06-03" },
  { id: "3", name: "Amit Kumar", email: "amit@email.com", phone: "9876543212", orders: 25, totalSpent: 125000, status: "active", joined: "2023-11-10", lastOrder: "2024-06-06" },
  { id: "4", name: "Sneha Gupta", email: "sneha@email.com", phone: "9876543213", orders: 3, totalSpent: 8500, status: "blocked", joined: "2024-04-05", lastOrder: "2024-05-20" },
  { id: "5", name: "Vikram Rao", email: "vikram@email.com", phone: "9876543214", orders: 15, totalSpent: 67500, status: "active", joined: "2024-01-08", lastOrder: "2024-06-04" },
  { id: "6", name: "Neha Singh", email: "neha@email.com", phone: "9876543215", orders: 6, totalSpent: 22000, status: "active", joined: "2024-03-12", lastOrder: "2024-06-01" },
  { id: "7", name: "Rajesh Verma", email: "rajesh@email.com", phone: "9876543216", orders: 18, totalSpent: 89000, status: "active", joined: "2023-12-22", lastOrder: "2024-06-06" },
  { id: "8", name: "Anita Desai", email: "anita@email.com", phone: "9876543217", orders: 4, totalSpent: 12000, status: "inactive", joined: "2024-05-15", lastOrder: "2024-05-18" },
];

const statusOptions = ["all", "active", "inactive", "blocked"];

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  // Filter customers
  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery);
    const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedCustomers.length === paginatedCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(paginatedCustomers.map((c) => c.id));
    }
  };

  const toggleSelectCustomer = (id: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-[var(--success)]/10 text-[var(--success)]",
      inactive: "bg-[var(--foreground-muted)]/10 text-[var(--foreground-muted)]",
      blocked: "bg-[var(--error)]/10 text-[var(--error)]",
    };
    return (
      <span className={cn("rounded-full px-2 py-1 text-xs font-medium capitalize", styles[status as keyof typeof styles])}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Customers</h1>
          {selectedCustomers.length > 0 && (
            <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm text-[var(--primary)]">
              {selectedCustomers.length} selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10">
              <Users className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Total Customers</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">{mockCustomers.length}</p>
            </div>
          </div>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success)]/10">
              <CheckCircle className="h-5 w-5 text-[var(--success)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Active</p>
              <p className="text-2xl font-bold text-[var(--success)]">
                {mockCustomers.filter((c) => c.status === "active").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10">
              <ShoppingBag className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Total Orders</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {mockCustomers.reduce((sum, c) => sum + c.orders, 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--warning)]/10">
              <Ban className="h-5 w-5 text-[var(--warning)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Blocked</p>
              <p className="text-2xl font-bold text-[var(--warning)]">
                {mockCustomers.filter((c) => c.status === "blocked").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <Input
                placeholder="Search by name, email, or phone..."
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
                  Status
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
            </div>
          )}
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-[var(--primary)]/5 p-3">
          <span className="text-sm text-[var(--foreground)]">
            {selectedCustomers.length} customers selected
          </span>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Ban className="h-4 w-4" />
              Block
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Activate
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Button>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <Card className="border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-[var(--border)]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Orders</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Total Spent</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Joined</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Last Order</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)]/50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => toggleSelectCustomer(customer.id)}
                      className="rounded border-[var(--border)]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{customer.name}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">ID: {customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-[var(--foreground-secondary)]">{customer.email}</p>
                      <p className="text-sm text-[var(--foreground-muted)]">{customer.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">{customer.orders}</td>
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">{formatCurrency(customer.totalSpent)}</td>
                  <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">{customer.joined}</td>
                  <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">{customer.lastOrder}</td>
                  <td className="px-4 py-3">{getStatusBadge(customer.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/customers/${customer.id}`}>
                        <button className="rounded p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--primary)]">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                      {customer.status === "active" ? (
                        <button className="rounded p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--error)]/10 hover:text-[var(--error)]" title="Block">
                          <Ban className="h-4 w-4" />
                        </button>
                      ) : (
                        <button className="rounded p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--success)]/10 hover:text-[var(--success)]" title="Activate">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
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
            {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of{" "}
            {filteredCustomers.length} customers
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
