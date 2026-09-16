"use client";

import { useEffect, useMemo, useState } from "react";
import { getTradeUnitPrice, getUnitPrice } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

type Line = {
  key: string;
  product: Product;
  sizeId: string;
  quantity: number;
  discount: number;
};

type PaymentMethod = "cash" | "upi" | "card";

type SavedBill = {
  id: string;
  total: number;
  gstAmount: number;
  subtotal: number;
  discountTotal: number;
  customerName?: string | null;
  customerPhone?: string | null;
  createdAt?: string;
  items: { name: string; sizeLabel: string; quantity: number; unitPrice: number; discount: number; lineTotal: number }[];
  payments: { method: string; amount: number }[];
};

const PAY_METHODS = ["cash", "upi", "card"] as const;

export function BillingDesk() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [saleType, setSaleType] = useState<"retail" | "trade">("retail");
  const [gstEnabled, setGstEnabled] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("upi");
  const [amounts, setAmounts] = useState({ cash: 0, upi: 0, card: 0 });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<SavedBill | null>(null);
  const [today, setToday] = useState({ cash: 0, upi: 0, card: 0, bills: 0, revenue: 0 });
  const [dayBills, setDayBills] = useState<SavedBill[]>([]);

  async function loadToday() {
    const response = await fetch("/api/billing/summary");
    if (!response.ok) return;
    const data = await response.json();
    setToday(data.totals);
    setDayBills(Array.isArray(data.bills) ? data.bills : []);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`/api/billing/products?q=${encodeURIComponent(query)}`)
        .then((response) => (response.ok ? response.json() : []))
        .then(setProducts)
        .catch(() => setProducts([]));
    }, 180);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    void loadToday();
  }, []);

  function unitFor(product: Product, sizeId: string) {
    return saleType === "trade" ? getTradeUnitPrice(product, sizeId) : getUnitPrice(product, sizeId);
  }

  const totals = useMemo(() => {
    const subtotal = lines.reduce((sum, line) => sum + unitFor(line.product, line.sizeId) * line.quantity, 0);
    const discount = lines.reduce((sum, line) => sum + line.discount, 0);
    const taxable = Math.max(0, subtotal - discount);
    const gst = gstEnabled ? Math.round(taxable * 0.18) : 0;
    return { subtotal, discount, gst, total: taxable + gst };
  }, [lines, saleType, gstEnabled]);

  useEffect(() => {
    setAmounts((current) => {
      const active = PAY_METHODS.filter((method) => current[method] > 0);
      if (active.length > 1) return current;
      const method = active[0] || payMethod;
      if ((active.length === 0 && totals.total === 0) || (active.length === 1 && current[method] === totals.total)) {
        return current;
      }
      return { cash: 0, upi: 0, card: 0, [method]: totals.total };
    });
  }, [totals.total, payMethod]);

  const paid = amounts.cash + amounts.upi + amounts.card;

  function fillMethod(method: PaymentMethod, total: number) {
    setPayMethod(method);
    setAmounts({ cash: 0, upi: 0, card: 0, [method]: total });
  }

  function addProduct(product: Product) {
    if (product.stock <= 0) return;
    setLines((current) => {
      const existing = current.find((line) => line.product.id === product.id && line.sizeId === product.sizes[0]?.id);
      if (existing) {
        return current.map((line) =>
          line.key === existing.key ? { ...line, quantity: Math.min(product.stock, line.quantity + 1) } : line,
        );
      }
      return [
        ...current,
        {
          key: `${product.id}-${product.sizes[0]?.id || "full"}`,
          product,
          sizeId: product.sizes[0]?.id || "full-roll",
          quantity: 1,
          discount: 0,
        },
      ];
    });
  }

  async function charge() {
    setBusy(true);
    setError("");
    const response = await fetch("/api/billing/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: name,
        customerPhone: phone,
        saleType,
        gstEnabled,
        items: lines.map((line) => ({
          productId: line.product.id,
          sizeId: line.sizeId,
          quantity: line.quantity,
          discount: line.discount,
        })),
        payments: PAY_METHODS.filter((method) => amounts[method] > 0).map((method) => ({
          method,
          amount: amounts[method],
        })),
      }),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(data.error || "Bill failed");
      return;
    }
    setReceipt(data.bill);
    setLines([]);
    setName("");
    setPhone("");
    setAmounts({ cash: 0, upi: 0, card: 0 });
    void loadToday();
  }

  function shareWhatsApp() {
    if (!receipt) return;
    const text = [
      `Raju Stickers  ${receipt.id}`,
      receipt.customerName ? `For ${receipt.customerName}` : "",
      ...receipt.items.map((item) => `${item.quantity} × ${item.name} (${item.sizeLabel}) — ₹${item.lineTotal}`),
      receipt.gstAmount ? `GST ₹${receipt.gstAmount}` : "GST exempt",
      `Total ₹${receipt.total}`,
      ...receipt.payments.map((payment) => `${payment.method} ₹${payment.amount}`),
    ]
      .filter(Boolean)
      .join("\n");
    const target = receipt.customerPhone ? `91${receipt.customerPhone.replace(/\D/g, "").slice(-10)}` : "";
    window.open(`https://wa.me/${target}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  return (
    <div className="grid xl:grid-cols-12 gap-6">
      <section className="xl:col-span-7 print:hidden">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <p className="section-kicker">Counter</p>
            <h1 className="font-display text-4xl">Billing</h1>
          </div>
          <div className="text-right text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
            <p>{today.bills} bills today</p>
            <p className="text-[var(--ink)] mt-1">{formatPrice(today.revenue)}</p>
          </div>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            const needle = query.trim().toLowerCase();
            const exact = products.find(
              (product) => product.sku.toLowerCase() === needle || product.name.toLowerCase() === needle,
            );
            if (!exact) return;
            event.preventDefault();
            addProduct(exact);
            setQuery("");
          }}
          placeholder="Search name, SKU, or scan a code"
          className="input"
          autoFocus
        />
        <ul className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {products.map((product) => (
            <li key={product.id}>
              <button
                type="button"
                onClick={() => addProduct(product)}
                disabled={product.stock <= 0}
                className="w-full flex items-center justify-between gap-4 py-3 text-left hover:text-[var(--accent)] disabled:opacity-40"
              >
                <span>
                  <span className="block font-display text-lg leading-tight">{product.name}</span>
                  <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
                    {product.sku} · {product.stock} in stock
                  </span>
                </span>
                <span className="price">{formatPrice(unitFor(product, product.sizes[0]?.id || "full-roll"))}</span>
              </button>
            </li>
          ))}
        </ul>
        <dl className="mt-6 grid grid-cols-3 gap-3 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
          <div className="border border-[var(--line)] py-3">
            Cash
            <dd className="mt-1 text-[var(--ink)] normal-case tracking-normal">{formatPrice(today.cash)}</dd>
          </div>
          <div className="border border-[var(--line)] py-3">
            UPI
            <dd className="mt-1 text-[var(--ink)] normal-case tracking-normal">{formatPrice(today.upi)}</dd>
          </div>
          <div className="border border-[var(--line)] py-3">
            Card
            <dd className="mt-1 text-[var(--ink)] normal-case tracking-normal">{formatPrice(today.card)}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">Today’s bills</p>
          <ul className="mt-2 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {dayBills.length === 0 && <li className="py-3 text-sm text-[var(--ink-3)]">No counter sales yet today.</li>}
            {dayBills.map((bill) => (
              <li key={bill.id}>
                <button
                  type="button"
                  onClick={() => setReceipt(bill)}
                  className="w-full flex items-center justify-between gap-3 py-3 text-left hover:text-[var(--accent)]"
                >
                  <span>
                    <span className="block font-display text-lg leading-tight">{bill.id}</span>
                    <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
                      {bill.customerName || "Walk-in"}
                      {bill.createdAt
                        ? ` · ${new Date(bill.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
                        : ""}
                    </span>
                  </span>
                  <span className="price">{formatPrice(bill.total)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <aside className="xl:col-span-5 border border-[var(--line)] bg-[var(--bg-raised)] p-5 print:border-0 print:bg-white print:text-black">
        <div className="flex gap-2 mb-4 print:hidden">
          {(["retail", "trade"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setSaleType(mode)}
              className={`btn btn-sm ${saleType === mode ? "btn-primary" : "btn-secondary"}`}
            >
              {mode}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setGstEnabled((value) => !value)}
            className={`btn btn-sm ml-auto ${gstEnabled ? "btn-secondary" : "btn-ghost"}`}
          >
            GST {gstEnabled ? "18%" : "off"}
          </button>
        </div>

        {receipt ? (
          <div>
            <p className="section-kicker">Bill {receipt.id}</p>
            <h2 className="font-display text-3xl mt-2">Paid</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {receipt.items.map((item) => (
                <li key={`${item.name}-${item.sizeLabel}`} className="flex justify-between gap-3">
                  <span>
                    {item.quantity} × {item.name}
                    <span className="block text-[11px] text-[var(--ink-3)] print:text-neutral-500">{item.sizeLabel}</span>
                  </span>
                  <span>{formatPrice(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--ink-3)] print:text-neutral-500">Subtotal</dt>
                <dd>{formatPrice(receipt.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--ink-3)] print:text-neutral-500">Discount</dt>
                <dd>{formatPrice(receipt.discountTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--ink-3)] print:text-neutral-500">GST</dt>
                <dd>{formatPrice(receipt.gstAmount)}</dd>
              </div>
              <div className="flex justify-between font-display text-3xl pt-2">
                <dt>Total</dt>
                <dd>{formatPrice(receipt.total)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)] print:text-neutral-500">
              {receipt.payments.map((payment) => `${payment.method} ${formatPrice(payment.amount)}`).join(" · ")}
            </p>
            <div className="mt-6 flex gap-2 print:hidden">
              <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                Print
              </button>
              <button type="button" className="btn btn-secondary" onClick={shareWhatsApp}>
                WhatsApp
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setReceipt(null)}>
                New bill
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="font-display text-2xl">Ticket</p>
            <div className="grid grid-cols-2 gap-3 mt-4 print:hidden">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer" className="input" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="input" />
            </div>
            <ul className="mt-5 space-y-4">
              {lines.map((line) => {
                const unit = unitFor(line.product, line.sizeId);
                return (
                  <li key={line.key} className="border-b border-[var(--line)] pb-3">
                    <div className="flex justify-between gap-3">
                      <p className="font-display">{line.product.name}</p>
                      <button
                        type="button"
                        className="text-[11px] uppercase tracking-[0.12em] text-[var(--ink-3)]"
                        onClick={() => setLines((current) => current.filter((entry) => entry.key !== line.key))}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <select
                        value={line.sizeId}
                        className="input"
                        onChange={(event) =>
                          setLines((current) =>
                            current.map((entry) =>
                              entry.key === line.key ? { ...entry, sizeId: event.target.value } : entry,
                            ),
                          )
                        }
                      >
                        {line.product.sizes.map((size) => (
                          <option key={size.id} value={size.id}>
                            {size.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        max={line.product.stock}
                        value={line.quantity}
                        className="input"
                        onChange={(event) =>
                          setLines((current) =>
                            current.map((entry) =>
                              entry.key === line.key
                                ? { ...entry, quantity: Math.max(1, Number(event.target.value) || 1) }
                                : entry,
                            ),
                          )
                        }
                      />
                      <input
                        type="number"
                        min={0}
                        value={line.discount}
                        className="input"
                        aria-label="Line discount"
                        onChange={(event) =>
                          setLines((current) =>
                            current.map((entry) =>
                              entry.key === line.key
                                ? { ...entry, discount: Math.max(0, Number(event.target.value) || 0) }
                                : entry,
                            ),
                          )
                        }
                      />
                    </div>
                    <p className="mt-2 text-right text-sm">{formatPrice(unit * line.quantity - line.discount)}</p>
                  </li>
                );
              })}
            </ul>
            {lines.length === 0 && <p className="mt-8 text-sm text-[var(--ink-3)]">Add a wrap to start the bill.</p>}
            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--ink-3)]">Subtotal</dt>
                <dd>{formatPrice(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--ink-3)]">Discount</dt>
                <dd>{formatPrice(totals.discount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--ink-3)]">GST</dt>
                <dd>{formatPrice(totals.gst)}</dd>
              </div>
              <div className="flex justify-between font-display text-2xl pt-2">
                <dt>Total</dt>
                <dd>{formatPrice(totals.total)}</dd>
              </div>
            </dl>
            <div className="mt-5 grid grid-cols-3 gap-2 print:hidden">
              {PAY_METHODS.map((method) => (
                <label key={method} className="block text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
                  <button
                    type="button"
                    onClick={() => fillMethod(method, totals.total)}
                    className={`mb-2 w-full btn btn-sm ${payMethod === method ? "btn-primary" : "btn-secondary"}`}
                  >
                    {method}
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={amounts[method] || ""}
                    placeholder="0"
                    className="input"
                    onChange={(event) => {
                      const value = Math.max(0, Number(event.target.value) || 0);
                      setPayMethod(method);
                      setAmounts((current) => ({ ...current, [method]: value }));
                    }}
                  />
                </label>
              ))}
            </div>
            {paid !== totals.total && lines.length > 0 && (
              <p className="mt-3 text-sm text-[var(--warn)] print:hidden">
                {paid < totals.total
                  ? `${formatPrice(totals.total - paid)} still to split`
                  : `${formatPrice(paid - totals.total)} over the total`}
              </p>
            )}
            {error && <p className="mt-3 text-sm text-[var(--bad)]">{error}</p>}
            <button
              type="button"
              className="btn btn-primary btn-block mt-4 print:hidden"
              disabled={busy || lines.length === 0 || totals.total <= 0 || paid !== totals.total}
              onClick={charge}
            >
              {busy ? "Saving…" : `Charge ${formatPrice(totals.total)}`}
            </button>
          </>
        )}
      </aside>
    </div>
  );
}
