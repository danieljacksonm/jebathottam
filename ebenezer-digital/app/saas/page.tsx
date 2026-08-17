"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  loadSaas,
  saveSaas,
  uid,
  nextNumber,
  docTotal,
  type SaasState,
  type DocType,
} from "@/lib/saas-local";
import { SiteContactLinks } from "@/components/SiteContactLinks";

type Tab = "home" | "invoices" | "customers" | "stock" | "expenses" | "settings";

export default function SaasApp() {
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [data, setData] = useState<SaasState>(loadSaas);
  const [docType, setDocType] = useState<DocType>("invoice");
  const [customerId, setCustomerId] = useState("");
  const [lines, setLines] = useState([{ name: "", qty: 1, price: 0 }]);
  const [printId, setPrintId] = useState<string | null>(null);

  useEffect(() => {
    setData(loadSaas());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveSaas(data);
  }, [data, ready]);

  const stats = useMemo(() => {
    const invoices = data.docs.filter((d) => d.type === "invoice");
    const sales = invoices.reduce((s, d) => s + docTotal(d, data.shop.taxPct).total, 0);
    const spend = data.expenses.reduce((s, e) => s + e.amount, 0);
    return { invoices: invoices.length, customers: data.customers.length, sales, spend };
  }, [data]);

  const printDoc = printId ? data.docs.find((d) => d.id === printId) : null;
  const printCust = printDoc ? data.customers.find((c) => c.id === printDoc.customerId) : null;

  const addDoc = () => {
    const clean = lines.filter((l) => l.name.trim() && l.qty > 0);
    if (!clean.length) return;
    const doc = {
      id: uid(),
      type: docType,
      number: nextNumber(data.docs, docType),
      date: new Date().toISOString().slice(0, 10),
      customerId,
      lines: clean,
      notes: "",
      status: "sent" as const,
    };
    const items = data.items.map((it) => {
      const used = clean.find((l) => l.name === it.name);
      if (!used || docType !== "invoice") return it;
      return { ...it, stock: Math.max(0, it.stock - used.qty) };
    });
    setData({ ...data, docs: [doc, ...data.docs], items });
    setLines([{ name: "", qty: 1, price: 0 }]);
    setTab("invoices");
  };

  if (!ready) {
    return (
      <div className="saas-root grid min-h-screen place-items-center">
        Opening Ebenezer SaaS…
      </div>
    );
  }

  return (
    <div className="saas-root">
      <header className="saas-nav saas-no-print">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--s-brand)]">Ebenezer SaaS</p>
          <p className="text-sm">{data.shop.name}</p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {(
            [
              ["home", "Home"],
              ["invoices", "Bills"],
              ["customers", "Customers"],
              ["stock", "Stock"],
              ["expenses", "Expenses"],
              ["settings", "Shop"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`px-3 py-2 text-[11px] uppercase tracking-[0.14em] ${
                tab === id ? "text-[var(--s-brand)]" : "text-[var(--s-muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <Link href="/products/ebenezer-saas" className="text-[11px] uppercase tracking-[0.16em] text-[var(--s-muted)]">
          Store
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        {tab === "home" && (
          <section>
            <h1 className="text-4xl sm:text-6xl">Billing that works in the browser.</h1>
            <p className="mt-4 max-w-xl text-[var(--s-muted)]">
              Create invoices, keep customers and stock, print bills. Data stays on this device for the free plan.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["Invoices", stats.invoices],
                ["Customers", stats.customers],
                ["Sales", stats.sales.toFixed(2)],
                ["Expenses", stats.spend.toFixed(2)],
              ].map(([k, v]) => (
                <div key={String(k)} className="border border-[var(--s-line)] p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--s-muted)]">{k}</p>
                  <p className="mt-2 text-2xl">{v}</p>
                </div>
              ))}
            </div>
            <button type="button" className="saas-btn mt-8" onClick={() => setTab("invoices")}>
              New bill
            </button>
          </section>
        )}

        {tab === "invoices" && (
          <section>
            <h2 className="text-3xl">New bill</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <select value={docType} onChange={(e) => setDocType(e.target.value as DocType)}>
                <option value="invoice">Invoice</option>
                <option value="quote">Quotation</option>
                <option value="credit">Credit note</option>
              </select>
              <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                <option value="">Walk-in customer</option>
                {data.customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-6 space-y-3">
              {lines.map((line, i) => (
                <div key={i} className="grid grid-cols-[1fr_80px_100px] gap-3">
                  <input
                    className="saas-input"
                    placeholder="Item"
                    value={line.name}
                    list="saas-items"
                    onChange={(e) => {
                      const name = e.target.value;
                      const hit = data.items.find((it) => it.name === name);
                      setLines(
                        lines.map((l, idx) =>
                          idx === i ? { ...l, name, price: hit ? hit.price : l.price } : l
                        )
                      );
                    }}
                  />
                  <input
                    className="saas-input"
                    type="number"
                    min={1}
                    value={line.qty}
                    onChange={(e) =>
                      setLines(lines.map((l, idx) => (idx === i ? { ...l, qty: Number(e.target.value) } : l)))
                    }
                  />
                  <input
                    className="saas-input"
                    type="number"
                    min={0}
                    value={line.price}
                    onChange={(e) =>
                      setLines(lines.map((l, idx) => (idx === i ? { ...l, price: Number(e.target.value) } : l)))
                    }
                  />
                </div>
              ))}
            </div>
            <datalist id="saas-items">
              {data.items.map((it) => (
                <option key={it.id} value={it.name} />
              ))}
            </datalist>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="saas-btn saas-btn-ghost"
                onClick={() => setLines([...lines, { name: "", qty: 1, price: 0 }])}
              >
                Add line
              </button>
              <button type="button" className="saas-btn" onClick={addDoc}>
                Save {docType}
              </button>
            </div>

            <h3 className="mt-12 text-2xl">Recent</h3>
            <table className="saas-table mt-4">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.docs.map((d) => {
                  const t = docTotal(d, data.shop.taxPct);
                  return (
                    <tr key={d.id}>
                      <td>{d.number}</td>
                      <td>{d.type}</td>
                      <td>{d.date}</td>
                      <td>{t.total.toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          className="text-[11px] uppercase tracking-[0.14em] text-[var(--s-brand)]"
                          onClick={() => {
                            setPrintId(d.id);
                            setTimeout(() => window.print(), 50);
                          }}
                        >
                          Print
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}

        {tab === "customers" && (
          <People
            title="Customers"
            rows={data.customers}
            onAdd={(row) => setData({ ...data, customers: [{ id: uid(), ...row }, ...data.customers] })}
          />
        )}

        {tab === "stock" && (
          <Stock
            items={data.items}
            onAdd={(row) => setData({ ...data, items: [{ id: uid(), ...row }, ...data.items] })}
          />
        )}

        {tab === "expenses" && (
          <section>
            <h2 className="text-3xl">Expenses</h2>
            <ExpenseForm
              onAdd={(row) => setData({ ...data, expenses: [{ id: uid(), ...row }, ...data.expenses] })}
            />
            <table className="saas-table mt-8">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Label</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.expenses.map((e) => (
                  <tr key={e.id}>
                    <td>{e.date}</td>
                    <td>{e.label}</td>
                    <td>{e.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {tab === "settings" && (
          <section>
            <h2 className="text-3xl">Shop profile</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["name", "Shop name"],
                  ["phone", "Phone"],
                  ["address", "Address"],
                  ["taxName", "Tax name"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="text-sm text-[var(--s-muted)]">
                  {label}
                  <input
                    className="saas-input mt-1"
                    value={data.shop[key]}
                    onChange={(e) => setData({ ...data, shop: { ...data.shop, [key]: e.target.value } })}
                  />
                </label>
              ))}
              <label className="text-sm text-[var(--s-muted)]">
                Tax %
                <input
                  className="saas-input mt-1"
                  type="number"
                  value={data.shop.taxPct}
                  onChange={(e) =>
                    setData({ ...data, shop: { ...data.shop, taxPct: Number(e.target.value) } })
                  }
                />
              </label>
            </div>
          </section>
        )}
      </main>

      <footer className="saas-no-print mx-auto max-w-5xl px-4 pb-10 sm:px-8">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--s-muted)]">Need help?</p>
        <SiteContactLinks className="mt-2 text-sm text-[var(--s-muted)]" linkClassName="hover:text-[var(--s-brand)]" />
      </footer>

      {printDoc && (
        <section className="mx-auto hidden max-w-xl p-8 saas-print">
          <h1 className="text-2xl">{data.shop.name}</h1>
          <p>{data.shop.address}</p>
          <p>{data.shop.phone}</p>
          <hr className="my-4" />
          <p>
            {printDoc.type.toUpperCase()} {printDoc.number}
          </p>
          <p>{printDoc.date}</p>
          {printCust && <p>Bill to: {printCust.name}</p>}
          <table className="saas-table mt-4">
            <tbody>
              {printDoc.lines.map((l, i) => (
                <tr key={i}>
                  <td>
                    {l.name} × {l.qty}
                  </td>
                  <td>{(l.qty * l.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4">
            Total: {docTotal(printDoc, data.shop.taxPct).total.toFixed(2)} (incl. {data.shop.taxName}{" "}
            {data.shop.taxPct}%)
          </p>
        </section>
      )}
    </div>
  );
}

function People({
  title,
  rows,
  onAdd,
}: {
  title: string;
  rows: { id: string; name: string; phone: string; city: string }[];
  onAdd: (row: { name: string; phone: string; city: string }) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  return (
    <section>
      <h2 className="text-3xl">{title}</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <input className="saas-input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="saas-input" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className="saas-input" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <button
        type="button"
        className="saas-btn mt-4"
        onClick={() => {
          if (!name.trim()) return;
          onAdd({ name, phone, city });
          setName("");
          setPhone("");
          setCity("");
        }}
      >
        Save customer
      </button>
      <table className="saas-table mt-8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.phone}</td>
              <td>{r.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function Stock({
  items,
  onAdd,
}: {
  items: { id: string; name: string; sku: string; price: number; stock: number }[];
  onAdd: (row: { name: string; sku: string; price: number; stock: number }) => void;
}) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  return (
    <section>
      <h2 className="text-3xl">Stock</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <input className="saas-input" placeholder="Item" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="saas-input" placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
        <input
          className="saas-input"
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <input
          className="saas-input"
          type="number"
          placeholder="Qty"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />
      </div>
      <button
        type="button"
        className="saas-btn mt-4"
        onClick={() => {
          if (!name.trim()) return;
          onAdd({ name, sku, price, stock });
          setName("");
          setSku("");
          setPrice(0);
          setStock(0);
        }}
      >
        Save item
      </button>
      <table className="saas-table mt-8">
        <thead>
          <tr>
            <th>Item</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td>{it.name}</td>
              <td>{it.sku}</td>
              <td>{it.price}</td>
              <td>{it.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function ExpenseForm({
  onAdd,
}: {
  onAdd: (row: { date: string; label: string; amount: number }) => void;
}) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      <input className="saas-input" placeholder="Rent, power…" value={label} onChange={(e) => setLabel(e.target.value)} />
      <input
        className="saas-input"
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button
        type="button"
        className="saas-btn"
        onClick={() => {
          if (!label.trim() || amount <= 0) return;
          onAdd({ date: new Date().toISOString().slice(0, 10), label, amount });
          setLabel("");
          setAmount(0);
        }}
      >
        Save
      </button>
    </div>
  );
}
