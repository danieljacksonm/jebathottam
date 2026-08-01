"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Download,
  Printer,
  Banknote,
  Smartphone,
  CreditCard,
  Receipt,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Calendar,
  FileText,
} from "lucide-react";

interface SalesSummary {
  date: string;
  totalSales: number;
  totalTransactions: number;
  totalItems: number;
  averageOrderValue: number;
  payments: {
    cash: number;
    upi: number;
    card: number;
    credit: number;
  };
  refunds: number;
  expenses: number;
  netCash: number;
}

interface Bill {
  id: string;
  date: string;
  total: number;
  paymentMethod: string;
  items: number;
  customer?: string;
}

const emptySummary: SalesSummary = {
  date: new Date().toISOString().split("T")[0],
  totalSales: 0,
  totalTransactions: 0,
  totalItems: 0,
  averageOrderValue: 0,
  payments: { cash: 0, upi: 0, card: 0, credit: 0 },
  refunds: 0,
  expenses: 0,
  netCash: 0,
};

export default function DayEndSummaryPage() {
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    setLoading(true);
    fetch(`/api/pos/summary?date=${selectedDate}`)
      .then((r) => r.json())
      .then((payload) => {
        setSummary(payload.summary || null);
        setBills(payload.bills || []);
      })
      .catch(() => {
        setSummary(null);
        setBills([]);
      })
      .finally(() => setLoading(false));
  }, [selectedDate]);

  const data = summary || emptySummary;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card)] px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/pos">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to POS
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Day-End Summary
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            />
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4">
        {loading ? (
          <p className="text-center text-[var(--foreground-muted)] py-12">Loading day summary...</p>
        ) : (
        <>
        {/* Overview Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success)]/10">
                <TrendingUp className="h-5 w-5 text-[var(--success)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--foreground-muted)]">Total Sales</p>
                <p className="text-xl font-bold text-[var(--foreground)]">
                  {formatCurrency(data.totalSales)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10">
                <ShoppingCart className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--foreground-muted)]">Transactions</p>
                <p className="text-xl font-bold text-[var(--foreground)]">
                  {data.totalTransactions}
                </p>
              </div>
            </div>
          </Card>
          <Card className="border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10">
                <Users className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--foreground-muted)]">Avg Order</p>
                <p className="text-xl font-bold text-[var(--foreground)]">
                  {formatCurrency(data.averageOrderValue)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--error)]/10">
                <TrendingDown className="h-5 w-5 text-[var(--error)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--foreground-muted)]">Net Cash</p>
                <p className="text-xl font-bold text-[var(--foreground)]">
                  {formatCurrency(data.netCash)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Payment Breakdown */}
          <Card className="border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
              Payment Breakdown
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-[var(--success)]" />
                  <span className="text-[var(--foreground)]">Cash</span>
                </div>
                <span className="font-medium">{formatCurrency(data.payments.cash)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-[var(--primary)]" />
                  <span className="text-[var(--foreground)]">UPI</span>
                </div>
                <span className="font-medium">{formatCurrency(data.payments.upi)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[var(--accent)]" />
                  <span className="text-[var(--foreground)]">Card</span>
                </div>
                <span className="font-medium">{formatCurrency(data.payments.card)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-[var(--warning)]" />
                  <span className="text-[var(--foreground)]">Credit</span>
                </div>
                <span className="font-medium">{formatCurrency(data.payments.credit)}</span>
              </div>
              <div className="border-t border-[var(--border)] pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--foreground)]">Total</span>
                  <span className="font-bold text-[var(--primary)]">
                    {formatCurrency(data.totalSales)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Cash Summary */}
          <Card className="border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
              Cash Summary
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[var(--foreground)]">
                <span>Opening Cash</span>
                <span>Rs. 5,000</span>
              </div>
              <div className="flex items-center justify-between text-[var(--success)]">
                <span>+ Cash Sales</span>
                <span>+ {formatCurrency(data.payments.cash)}</span>
              </div>
              <div className="flex items-center justify-between text-[var(--error)]">
                <span>- Refunds</span>
                <span>- {formatCurrency(data.refunds)}</span>
              </div>
              <div className="flex items-center justify-between text-[var(--error)]">
                <span>- Expenses</span>
                <span>- {formatCurrency(data.expenses)}</span>
              </div>
              <div className="border-t border-[var(--border)] pt-3">
                <div className="flex items-center justify-between text-lg font-bold text-[var(--foreground)]">
                  <span>Closing Cash</span>
                  <span className="text-[var(--primary)]">
                    {formatCurrency(5000 + data.payments.cash - data.refunds - data.expenses)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Expenses */}
        <Card className="mt-6 border-[var(--border)] bg-[var(--card)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Expenses</h2>
            <Button variant="outline" size="sm">
              + Add Expense
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="pb-2 text-left text-sm font-medium text-[var(--foreground-muted)]">
                    Category
                  </th>
                  <th className="pb-2 text-left text-sm font-medium text-[var(--foreground-muted)]">
                    Note
                  </th>
                  <th className="pb-2 text-right text-sm font-medium text-[var(--foreground-muted)]">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} className="py-6 text-center text-[var(--foreground-muted)]">
                    No expenses recorded for this day. Add expense tracking in a future update.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Bills List */}
        <Card className="mt-6 border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
            Bills ({bills.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="pb-2 text-left text-sm font-medium text-[var(--foreground-muted)]">
                    Bill ID
                  </th>
                  <th className="pb-2 text-left text-sm font-medium text-[var(--foreground-muted)]">
                    Time
                  </th>
                  <th className="pb-2 text-left text-sm font-medium text-[var(--foreground-muted)]">
                    Customer
                  </th>
                  <th className="pb-2 text-center text-sm font-medium text-[var(--foreground-muted)]">
                    Items
                  </th>
                  <th className="pb-2 text-right text-sm font-medium text-[var(--foreground-muted)]">
                    Total
                  </th>
                  <th className="pb-2 text-right text-sm font-medium text-[var(--foreground-muted)]">
                    Payment
                  </th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id} className="border-b border-[var(--border)]">
                    <td className="py-3 text-[var(--primary)]">{bill.id}</td>
                    <td className="py-3 text-[var(--foreground-muted)]">
                      {new Date(bill.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-3 text-[var(--foreground)]">
                      {bill.customer || "Walk-in"}
                    </td>
                    <td className="py-3 text-center text-[var(--foreground)]">
                      {bill.items}
                    </td>
                    <td className="py-3 text-right font-medium text-[var(--foreground)]">
                      {formatCurrency(bill.total)}
                    </td>
                    <td className="py-3 text-right">
                      <span className={cn(
                        "rounded-full px-2 py-1 text-xs capitalize",
                        bill.paymentMethod === "cash" && "bg-[var(--success)]/10 text-[var(--success)]",
                        bill.paymentMethod === "upi" && "bg-[var(--primary)]/10 text-[var(--primary)]",
                        bill.paymentMethod === "card" && "bg-[var(--accent)]/10 text-[var(--accent)]",
                        bill.paymentMethod === "credit" && "bg-[var(--warning)]/10 text-[var(--warning)]"
                      )}>
                        {bill.paymentMethod}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        </>
        )}
      </main>
    </div>
  );
}
