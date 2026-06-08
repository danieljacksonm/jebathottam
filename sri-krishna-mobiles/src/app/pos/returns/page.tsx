"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Search,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Printer,
  Calendar,
  Package,
  X,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

// Mock bills data (same as POS)
interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
}

interface Bill {
  id: string;
  date: string;
  time: string;
  customer: { name: string; phone?: string };
  items: BillItem[];
  subtotal: number;
  gstAmount: number;
  total: number;
  payments: { method: string; amount: number }[];
}

const mockBills: Bill[] = [
  {
    id: "SKM-250108-001",
    date: "2024-01-08",
    time: "14:30",
    customer: { name: "Rahul Sharma", phone: "9876543210" },
    items: [
      { id: "1", name: "iPhone 14 Pro Display", price: 12499, quantity: 1, discount: 0 },
      { id: "2", name: "USB-C Cable", price: 299, quantity: 2, discount: 0 },
    ],
    subtotal: 13097,
    gstAmount: 2357,
    total: 15454,
    payments: [{ method: "cash", amount: 15454 }],
  },
  {
    id: "SKM-250108-002",
    date: "2024-01-08",
    time: "15:45",
    customer: { name: "Priya Patel", phone: "9123456789" },
    items: [
      { id: "3", name: "Samsung S23 Screen", price: 8999, quantity: 1, discount: 500 },
    ],
    subtotal: 8499,
    gstAmount: 1530,
    total: 10029,
    payments: [{ method: "upi", amount: 10029 }],
  },
];

interface ReturnItem extends BillItem {
  returnQuantity: number;
  returnReason: string;
  refundAmount: number;
}

export default function POSReturnsPage() {
  const [bills] = useState<Bill[]>(mockBills);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [returnReason, setReturnReason] = useState("defective");
  const [showReceipt, setShowReceipt] = useState(false);

  // Filter bills
  const filteredBills = bills.filter(
    (bill) =>
      bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.customer.phone?.includes(searchQuery)
  );

  // Calculate return total
  const returnTotal = returnItems.reduce((sum, item) => sum + item.refundAmount, 0);
  const returnGst = Math.round(returnTotal * 0.18);
  const finalRefund = returnTotal + returnGst;

  const handleItemReturn = (item: BillItem) => {
    const existing = returnItems.find((ri) => ri.id === item.id);
    if (existing) {
      setReturnItems(
        returnItems.map((ri) =>
          ri.id === item.id
            ? {
                ...ri,
                returnQuantity: Math.min(ri.returnQuantity + 1, item.quantity),
                refundAmount: (ri.price - ri.discount) * Math.min(ri.returnQuantity + 1, item.quantity),
              }
            : ri
        )
      );
    } else {
      setReturnItems([
        ...returnItems,
        {
          ...item,
          returnQuantity: 1,
          returnReason,
          refundAmount: item.price - item.discount,
        },
      ]);
    }
  };

  const updateReturnQuantity = (itemId: string, quantity: number) => {
    const item = selectedBill?.items.find((i) => i.id === itemId);
    if (!item) return;

    const validQty = Math.max(0, Math.min(quantity, item.quantity));

    if (validQty === 0) {
      setReturnItems(returnItems.filter((ri) => ri.id !== itemId));
    } else {
      setReturnItems(
        returnItems.map((ri) =>
          ri.id === itemId
            ? {
                ...ri,
                returnQuantity: validQty,
                refundAmount: (ri.price - ri.discount) * validQty,
              }
            : ri
        )
      );
    }
  };

  const processReturn = () => {
    if (returnItems.length === 0) return;
    setShowReceipt(true);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/pos"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--background-secondary)] hover:bg-[var(--border)]"
            >
              <ArrowLeft className="h-5 w-5 text-[var(--foreground)]" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">Returns & Refunds</h1>
              <p className="text-sm text-[var(--foreground-muted)]">Process item returns and refunds</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[var(--warning)]/10 px-3 py-1 text-sm text-[var(--warning)]">
              Returns Today: 0
            </span>
          </div>
        </div>
      </header>

      <main className="p-4">
        {!selectedBill ? (
          <div className="mx-auto max-w-4xl space-y-4">
            {/* Search */}
            <Card className="border-[var(--border)] bg-[var(--card)] p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--foreground-muted)]" />
                <Input
                  placeholder="Search by bill number, customer name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-lg"
                />
              </div>
            </Card>

            {/* Recent Bills */}
            <Card className="border-[var(--border)] bg-[var(--card)] p-4">
              <h3 className="mb-3 font-semibold text-[var(--foreground)]">Recent Bills</h3>
              <div className="space-y-2">
                {filteredBills.map((bill) => (
                  <button
                    key={bill.id}
                    onClick={() => setSelectedBill(bill)}
                    className="flex w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-left hover:border-[var(--primary)]"
                  >
                    <div>
                      <p className="font-medium text-[var(--foreground)]">{bill.id}</p>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        {bill.customer.name} • {bill.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[var(--foreground)]">{formatCurrency(bill.total)}</p>
                      <ChevronRight className="ml-auto h-5 w-5 text-[var(--foreground-muted)]" />
                    </div>
                  </button>
                ))}
                {filteredBills.length === 0 && (
                  <p className="py-8 text-center text-[var(--foreground-muted)]">
                    No bills found matching your search
                  </p>
                )}
              </div>
            </Card>
          </div>
        ) : showReceipt ? (
          /* Return Receipt */
          <div className="mx-auto max-w-md">
            <Card className="border-[var(--border)] bg-[var(--card)] p-6">
              <div className="mb-4 text-center">
                <h2 className="text-xl font-bold text-[var(--foreground)]">RETURN RECEIPT</h2>
                <p className="text-sm text-[var(--foreground-muted)]">
                  {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">Original: {selectedBill.id}</p>
              </div>

              <div className="mb-4 space-y-1 border-b border-dashed border-[var(--border)] pb-4 text-sm">
                <p className="text-[var(--foreground)]">{selectedBill.customer.name}</p>
                {selectedBill.customer.phone && (
                  <p className="text-[var(--foreground-muted)]">{selectedBill.customer.phone}</p>
                )}
              </div>

              <div className="mb-4 space-y-2 border-b border-dashed border-[var(--border)] pb-4">
                {returnItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="text-[var(--foreground)]">{item.name}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        {item.returnQuantity} x {formatCurrency(item.price - item.discount)}
                      </p>
                      <p className="text-xs text-[var(--warning)]">{item.returnReason}</p>
                    </div>
                    <p className="font-medium text-[var(--foreground)]">
                      {formatCurrency(item.refundAmount)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mb-4 space-y-1 border-b border-dashed border-[var(--border)] pb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">Subtotal</span>
                  <span className="text-[var(--foreground)]">{formatCurrency(returnTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">GST (18%)</span>
                  <span className="text-[var(--foreground)]">{formatCurrency(returnGst)}</span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span className="text-[var(--success)]">Total Refund</span>
                  <span className="text-[var(--success)]">{formatCurrency(finalRefund)}</span>
                </div>
              </div>

              <div className="mb-4 text-center">
                <div className="inline-block rounded-lg border border-[var(--success)] bg-[var(--success)]/10 p-3">
                  <CheckCircle className="mx-auto mb-1 h-8 w-8 text-[var(--success)]" />
                  <p className="text-sm font-medium text-[var(--success)]">Return Processed</p>
                </div>
              </div>

              <p className="mb-4 text-center text-xs text-[var(--foreground-muted)]">
                Thank you for shopping with Sri Krishna Mobiles
              </p>

              <Button onClick={printReceipt} variant="outline" className="w-full gap-2">
                <Printer className="h-4 w-4" />
                Print Receipt
              </Button>
            </Card>

            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => {
                  setSelectedBill(null);
                  setReturnItems([]);
                  setShowReceipt(false);
                }}
                variant="outline"
                className="flex-1"
              >
                New Return
              </Button>
              <Link href="/pos" className="flex-1">
                <Button className="w-full">Back to POS</Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Return Form */
          <div className="mx-auto max-w-4xl grid gap-4 lg:grid-cols-3">
            {/* Bill Details */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-[var(--border)] bg-[var(--card)] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)]">{selectedBill.id}</h3>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {selectedBill.date} • {selectedBill.time}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedBill(null)}
                    className="rounded-lg p-2 hover:bg-[var(--background-secondary)]"
                  >
                    <X className="h-5 w-5 text-[var(--foreground-muted)]" />
                  </button>
                </div>

                <div className="mb-4 rounded-lg bg-[var(--background-secondary)] p-3">
                  <p className="font-medium text-[var(--foreground)]">{selectedBill.customer.name}</p>
                  {selectedBill.customer.phone && (
                    <p className="text-sm text-[var(--foreground-muted)]">{selectedBill.customer.phone}</p>
                  )}
                </div>

                {/* Return Reason */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                    Return Reason
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                  >
                    <option value="defective">Defective/Damaged</option>
                    <option value="wrong_item">Wrong Item</option>
                    <option value="not_needed">Not Needed</option>
                    <option value="quality">Quality Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Items to Return */}
                <h4 className="mb-2 font-medium text-[var(--foreground)]">Select Items to Return</h4>
                <div className="space-y-2">
                  {selectedBill.items.map((item) => {
                    const returnItem = returnItems.find((ri) => ri.id === item.id);
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "flex items-center justify-between rounded-lg border p-3",
                          returnItem
                            ? "border-[var(--warning)] bg-[var(--warning)]/5"
                            : "border-[var(--border)] bg-[var(--background)]"
                        )}
                      >
                        <div>
                          <p className="font-medium text-[var(--foreground)]">{item.name}</p>
                          <p className="text-sm text-[var(--foreground-muted)]">
                            Original: {item.quantity} x {formatCurrency(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {returnItem ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateReturnQuantity(item.id, returnItem.returnQuantity - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--background-secondary)]"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-medium text-[var(--foreground)]">
                                {returnItem.returnQuantity}
                              </span>
                              <button
                                onClick={() => updateReturnQuantity(item.id, returnItem.returnQuantity + 1)}
                                disabled={returnItem.returnQuantity >= item.quantity}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--background-secondary)] disabled:opacity-50"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => handleItemReturn(item)}>
                              <RotateCcw className="mr-1 h-4 w-4" />
                              Return
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Return Summary */}
            <div>
              <Card className="border-[var(--border)] bg-[var(--card)] p-4 sticky top-20">
                <h3 className="mb-4 font-semibold text-[var(--foreground)]">Return Summary</h3>

                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">Items</span>
                    <span className="text-[var(--foreground)]">{returnItems.reduce((sum, i) => sum + i.returnQuantity, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">Subtotal</span>
                    <span className="text-[var(--foreground)]">{formatCurrency(returnTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">GST (18%)</span>
                    <span className="text-[var(--foreground)]">{formatCurrency(returnGst)}</span>
                  </div>
                  <div className="border-t border-[var(--border)] pt-2">
                    <div className="flex justify-between text-base font-bold">
                      <span className="text-[var(--success)]">Refund Amount</span>
                      <span className="text-[var(--success)]">{formatCurrency(finalRefund)}</span>
                    </div>
                  </div>
                </div>

                {returnItems.length > 0 ? (
                  <Button onClick={processReturn} className="w-full gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Process Refund
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    Select items to return
                  </Button>
                )}

                <p className="mt-3 text-center text-xs text-[var(--foreground-muted)]">
                  Refund will be processed to original payment method
                </p>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
