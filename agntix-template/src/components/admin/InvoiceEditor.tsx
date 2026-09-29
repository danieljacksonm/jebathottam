"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatMoney, summarize } from "@/lib/money";

type Line = {
  description: string;
  quantity: number;
  unitMinor: number;
  discountMinor: number;
  taxMinor: number;
};

export function InvoiceEditor({
  id,
  initial,
  paidMinor,
  balanceMinor,
}: {
  id?: string;
  paidMinor: number;
  balanceMinor: number;
  initial: {
    customerName: string;
    email: string;
    phone: string;
    customerAddress: string;
    destination: string;
    reference: string;
    invoiceDate: string;
    dueDate: string;
    travelStart: string;
    travelEnd: string;
    currency: string;
    discountMinor: number;
    companyGst: string;
    paymentTerms: string;
    cancellationNotes: string;
    notes: string;
    status: string;
    items: Line[];
  };
}) {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>(
    initial.items.length
      ? initial.items
      : [{ description: "", quantity: 1, unitMinor: 0, discountMinor: 0, taxMinor: 0 }],
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const summary = summarize(lines, initial.discountMinor);

  async function save(form: HTMLFormElement) {
    const data = new FormData(form);
    setBusy(true);
    setError("");
    const res = await fetch(id ? `/api/admin/crm/invoices/${id}` : "/api/admin/crm/invoices", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: String(data.get("customerName") || ""),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
        customerAddress: String(data.get("customerAddress") || ""),
        destination: String(data.get("destination") || ""),
        reference: String(data.get("reference") || ""),
        invoiceDate: String(data.get("invoiceDate") || ""),
        dueDate: String(data.get("dueDate") || ""),
        travelStart: String(data.get("travelStart") || ""),
        travelEnd: String(data.get("travelEnd") || ""),
        currency: String(data.get("currency") || "INR"),
        discountMinor: Math.round(Number(data.get("discount") || 0) * 100),
        companyGst: String(data.get("companyGst") || ""),
        paymentTerms: String(data.get("paymentTerms") || ""),
        cancellationNotes: String(data.get("cancellationNotes") || ""),
        notes: String(data.get("notes") || ""),
        status: String(data.get("status") || "DRAFT"),
        items: lines,
      }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(json.error || "Could not save invoice");
      return;
    }
    if (!id && json.id) {
      router.push(`/admin/invoices/${json.id}`);
      return;
    }
    router.refresh();
  }

  async function recordPayment(form: HTMLFormElement) {
    if (!id) return;
    const data = new FormData(form);
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/crm/invoices/${id}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amountMinor: Math.round(Number(data.get("amount") || 0) * 100),
        paidOn: String(data.get("paidOn") || ""),
        method: String(data.get("method") || ""),
        reference: String(data.get("paymentRef") || ""),
        notes: String(data.get("paymentNotes") || ""),
      }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(json.error || "Could not record payment");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <form
        className="admin-card"
        onSubmit={(event) => {
          event.preventDefault();
          void save(event.currentTarget);
        }}
      >
        {error ? <p className="admin-error">{error}</p> : null}
        <p>
          Total {formatMoney(summary.totalMinor, initial.currency)} · Paid{" "}
          {formatMoney(paidMinor, initial.currency)} · Balance{" "}
          {formatMoney(id ? balanceMinor : summary.totalMinor, initial.currency)}
        </p>
        <div className="admin-grid-2">
          <Text name="customerName" label="Customer" defaultValue={initial.customerName} />
          <Text name="email" label="Email" defaultValue={initial.email} />
          <Text name="phone" label="Phone" defaultValue={initial.phone} />
          <Text name="destination" label="Destination" defaultValue={initial.destination} />
          <Text name="reference" label="Booking reference" defaultValue={initial.reference} />
          <Text name="invoiceDate" label="Invoice date" type="date" defaultValue={initial.invoiceDate} />
          <Text name="dueDate" label="Due date" type="date" defaultValue={initial.dueDate} />
          <Text name="travelStart" label="Travel start" type="date" defaultValue={initial.travelStart} />
          <Text name="travelEnd" label="Travel end" type="date" defaultValue={initial.travelEnd} />
          <Text name="currency" label="Currency" defaultValue={initial.currency} />
          <Text name="companyGst" label="GST (leave blank if not configured)" defaultValue={initial.companyGst} />
          <Text name="discount" label="Header discount" defaultValue={String(initial.discountMinor / 100)} />
          <div className="admin-field">
            <label>Status</label>
            <select name="status" defaultValue={initial.status}>
              {["DRAFT", "SENT", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
        <Text name="customerAddress" label="Customer address" area defaultValue={initial.customerAddress} />
        <Text name="paymentTerms" label="Payment terms" area defaultValue={initial.paymentTerms} />
        <Text name="cancellationNotes" label="Cancellation" area defaultValue={initial.cancellationNotes} />
        <Text name="notes" label="Notes" area defaultValue={initial.notes} />
        <h3>Items</h3>
        {lines.map((line, index) => (
          <div key={index} className="admin-lines">
            <Text
              label="Description"
              defaultValue={line.description}
              onChange={(value) => patch(index, { description: value })}
            />
            <Text
              label="Qty"
              defaultValue={String(line.quantity)}
              onChange={(value) => patch(index, { quantity: Number(value) || 1 })}
            />
            <Text
              label="Unit price"
              defaultValue={String(line.unitMinor / 100)}
              onChange={(value) => patch(index, { unitMinor: Math.round(Number(value) * 100) })}
            />
            <Text
              label="Tax"
              defaultValue={String(line.taxMinor / 100)}
              onChange={(value) => patch(index, { taxMinor: Math.round(Number(value) * 100) })}
            />
          </div>
        ))}
        <button
          className="admin-btn secondary"
          type="button"
          onClick={() =>
            setLines((current) => [
              ...current,
              { description: "", quantity: 1, unitMinor: 0, discountMinor: 0, taxMinor: 0 },
            ])
          }
        >
          Add line
        </button>
        <div className="admin-actions">
          <button className="admin-btn" disabled={busy}>
            Save
          </button>
          {id ? (
            <a className="admin-btn secondary" href={`/api/admin/crm/invoices/${id}/pdf`}>
              Download PDF
            </a>
          ) : null}
        </div>
      </form>
      {id ? (
        <form
          className="admin-card"
          style={{ marginTop: "1rem" }}
          onSubmit={(event) => {
            event.preventDefault();
            void recordPayment(event.currentTarget);
          }}
        >
          <h2>Record payment</h2>
          <div className="admin-grid-2">
            <Text name="amount" label="Amount" />
            <Text name="paidOn" label="Date" type="date" />
            <Text name="method" label="Method" />
            <Text name="paymentRef" label="Reference" />
          </div>
          <Text name="paymentNotes" label="Notes" />
          <button className="admin-btn" disabled={busy}>
            Add payment
          </button>
        </form>
      ) : null}
    </div>
  );

  function patch(index: number, next: Partial<Line>) {
    setLines((current) =>
      current.map((line, lineIndex) => (lineIndex === index ? { ...line, ...next } : line)),
    );
  }
}

function Text({
  name,
  label,
  defaultValue,
  type,
  area,
  onChange,
}: {
  name?: string;
  label: string;
  defaultValue?: string;
  type?: string;
  area?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {area ? (
        <textarea name={name} defaultValue={defaultValue} onChange={(event) => onChange?.(event.target.value)} />
      ) : (
        <input
          name={name}
          type={type || "text"}
          defaultValue={defaultValue}
          onChange={(event) => onChange?.(event.target.value)}
        />
      )}
    </div>
  );
}
