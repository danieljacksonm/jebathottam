"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Expense = {
  id: string;
  date: string;
  category: string;
  note: string;
  amount: number;
};

const STORAGE_KEY = "ebenezer-expense-tracker-v1";
const CATEGORIES = ["Rent", "Stock", "Transport", "Staff", "Marketing", "Utilities", "Other"];

const uid = () => Math.random().toString(36).slice(2, 9);

export function ExpenseTrackerClient() {
  const [items, setItems] = useState<Expense[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as Expense[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const total = useMemo(() => items.reduce((s, i) => s + (Number(i.amount) || 0), 0), [items]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const i of items) map.set(i.category, (map.get(i.category) || 0) + i.amount);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [items]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(amount);
    if (!n || n <= 0) return;
    setItems((list) => [{ id: uid(), date, category, note: note.trim(), amount: n }, ...list]);
    setNote("");
    setAmount("");
  };

  const exportCsv = () => {
    const rows = [["Date", "Category", "Note", "Amount"], ...items.map((i) => [i.date, i.category, i.note, String(i.amount)])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Expense report</title>
<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem}
table{width:100%;border-collapse:collapse}th,td{border-bottom:1px solid #ddd;padding:.5rem;text-align:left}
tfoot td{font-weight:700}</style></head><body>
<h1>Expense report</h1>
<p>Total: ₹${total.toFixed(2)}</p>
<table><thead><tr><th>Date</th><th>Category</th><th>Note</th><th>Amount</th></tr></thead>
<tbody>${items
      .map((i) => `<tr><td>${i.date}</td><td>${i.category}</td><td>${i.note}</td><td>₹${i.amount.toFixed(2)}</td></tr>`)
      .join("")}</tbody>
<tfoot><tr><td colspan="3">Total</td><td>₹${total.toFixed(2)}</td></tr></tfoot></table>
<script>window.onload=()=>window.print()</script></body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Free tool · Ebenezer Store</p>
          <h1 className="text-3xl font-bold text-slate-900">Expense Tracker</h1>
          <p className="mt-1 text-slate-600">Log shop expenses in the browser. Data stays on this device.</p>
        </div>
        <Link href="/products/expense-tracker" className="text-sm font-medium text-emerald-800 hover:underline">
          ← Product page
        </Link>
      </div>

      <form onSubmit={add} className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-sm">
          Date
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <label className="text-sm">
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm lg:col-span-2">
          Note
          <input value={note} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="What was this for?" />
        </label>
        <label className="text-sm">
          Amount (₹)
          <input
            required
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="0"
          />
        </label>
        <button type="submit" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white sm:col-span-2 lg:col-span-5">
          Add expense
        </button>
      </form>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-emerald-50 p-4">
          <p className="text-sm text-emerald-800">Total recorded</p>
          <p className="text-3xl font-bold text-emerald-950">₹{total.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-2 text-sm font-semibold text-slate-800">By category</p>
          <ul className="space-y-1 text-sm text-slate-600">
            {byCategory.length === 0 && <li>No expenses yet.</li>}
            {byCategory.map(([cat, sum]) => (
              <li key={cat} className="flex justify-between gap-2">
                <span>{cat}</span>
                <span className="font-medium text-slate-900">₹{sum.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button type="button" onClick={exportCsv} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium">
          Export CSV
        </button>
        <button type="button" onClick={printReport} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium">
          Print report
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm("Clear all expenses on this device?")) setItems([]);
          }}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700"
        >
          Clear all
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Category</th>
              <th className="px-3 py-2 font-medium">Note</th>
              <th className="px-3 py-2 font-medium">Amount</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t border-slate-100">
                <td className="px-3 py-2">{i.date}</td>
                <td className="px-3 py-2">{i.category}</td>
                <td className="px-3 py-2 text-slate-600">{i.note || "—"}</td>
                <td className="px-3 py-2 font-medium">₹{i.amount.toFixed(2)}</td>
                <td className="px-3 py-2">
                  <button type="button" className="text-xs text-red-600" onClick={() => setItems((list) => list.filter((x) => x.id !== i.id))}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                  Add your first expense above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">Saved in your browser only (localStorage). Clearing site data will erase it.</p>
    </div>
  );
}
