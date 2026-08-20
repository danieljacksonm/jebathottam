"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import "./document-generator.css";

type Line = { name: string; qty: number; rate: number; tax: number };

type Props = {
  kind: "invoice" | "quotation";
  title: string;
  backHref?: string;
};

export function DocumentGenerator({ kind, title, backHref = "/products" }: Props) {
  const [biz, setBiz] = useState("Your Shop Name");
  const [bizMeta, setBizMeta] = useState("City · GSTIN / Tax ID");
  const [client, setClient] = useState("Customer name");
  const [clientMeta, setClientMeta] = useState("Phone / address");
  const [docNo, setDocNo] = useState(kind === "invoice" ? "INV-1001" : "QT-1001");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [valid, setValid] = useState("");
  const [notes, setNotes] = useState(kind === "quotation" ? "Validity 7 days. 50% advance to confirm." : "Thank you for your business.");
  const [lines, setLines] = useState<Line[]>([{ name: "Item / service", qty: 1, rate: 1000, tax: 18 }]);

  const totals = useMemo(() => {
    let sub = 0;
    let tax = 0;
    for (const l of lines) {
      const line = (Number(l.qty) || 0) * (Number(l.rate) || 0);
      sub += line;
      tax += line * ((Number(l.tax) || 0) / 100);
    }
    return { sub, tax, grand: sub + tax };
  }, [lines]);

  const money = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n || 0);

  const setLine = (i: number, patch: Partial<Line>) => {
    setLines((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  };

  return (
    <div className="docgen">
      <header className="docgen-bar">
        <Link href={backHref}>← Store</Link>
        <strong>{title}</strong>
        <button type="button" onClick={() => window.print()}>
          Print / Save PDF
        </button>
      </header>

      <div className="docgen-grid">
        <form className="docgen-form" onSubmit={(e) => e.preventDefault()}>
          <label>
            Your business
            <input value={biz} onChange={(e) => setBiz(e.target.value)} />
          </label>
          <label>
            Business details
            <input value={bizMeta} onChange={(e) => setBizMeta(e.target.value)} />
          </label>
          <label>
            Client
            <input value={client} onChange={(e) => setClient(e.target.value)} />
          </label>
          <label>
            Client details
            <input value={clientMeta} onChange={(e) => setClientMeta(e.target.value)} />
          </label>
          <div className="docgen-row">
            <label>
              {kind === "invoice" ? "Invoice no." : "Quote no."}
              <input value={docNo} onChange={(e) => setDocNo(e.target.value)} />
            </label>
            <label>
              Date
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
          </div>
          {kind === "quotation" && (
            <label>
              Valid until
              <input type="date" value={valid} onChange={(e) => setValid(e.target.value)} />
            </label>
          )}
          <p className="docgen-k">Line items</p>
          {lines.map((l, i) => (
            <div key={i} className="docgen-line">
              <input placeholder="Item" value={l.name} onChange={(e) => setLine(i, { name: e.target.value })} />
              <input type="number" placeholder="Qty" value={l.qty} onChange={(e) => setLine(i, { qty: Number(e.target.value) })} />
              <input type="number" placeholder="Rate" value={l.rate} onChange={(e) => setLine(i, { rate: Number(e.target.value) })} />
              <input type="number" placeholder="Tax %" value={l.tax} onChange={(e) => setLine(i, { tax: Number(e.target.value) })} />
            </div>
          ))}
          <button type="button" onClick={() => setLines((p) => [...p, { name: "", qty: 1, rate: 0, tax: 0 }])}>
            Add line
          </button>
          <label>
            Notes / terms
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
        </form>

        <article className="docgen-paper" id="print-area">
          <p className="docgen-kicker">{kind === "invoice" ? "INVOICE" : "QUOTATION"}</p>
          <h1>{biz}</h1>
          <p>{bizMeta}</p>
          <div className="docgen-meta">
            <div>
              <strong>Bill to</strong>
              <p>{client}</p>
              <p>{clientMeta}</p>
            </div>
            <div>
              <p>No. {docNo}</p>
              <p>Date {date}</p>
              {kind === "quotation" && valid ? <p>Valid until {valid}</p> : null}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Tax</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => {
                const amt = (Number(l.qty) || 0) * (Number(l.rate) || 0);
                return (
                  <tr key={i}>
                    <td>{l.name || "—"}</td>
                    <td>{l.qty}</td>
                    <td>{money(l.rate)}</td>
                    <td>{l.tax}%</td>
                    <td>{money(amt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="docgen-tot">
            <p>Subtotal {money(totals.sub)}</p>
            <p>Tax {money(totals.tax)}</p>
            <p>
              <strong>Total {money(totals.grand)}</strong>
            </p>
          </div>
          <p className="docgen-notes">{notes}</p>
        </article>
      </div>
    </div>
  );
}
