"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatMoney, lineTotal, summarize } from "@/lib/money";

type Line = {
  description: string;
  quantity: number;
  unitMinor: number;
  discountMinor: number;
  taxMinor: number;
};

export function QuoteEditor({
  id,
  initial,
}: {
  id?: string;
  initial: {
    customerName: string;
    email: string;
    phone: string;
    destination: string;
    packageSlug: string;
    travelStart: string;
    travelEnd: string;
    travellers: string;
    itinerary: string;
    currency: string;
    discountMinor: number;
    paymentTerms: string;
    cancellationNotes: string;
    validityDate: string;
    notes: string;
    status: string;
    items: Line[];
  };
}) {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>(
    initial.items.length
      ? initial.items
      : [
          {
            description: "",
            quantity: 1,
            unitMinor: 0,
            discountMinor: 0,
            taxMinor: 0,
          },
        ],
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const summary = summarize(lines, initial.discountMinor);

  function payload(form: HTMLFormElement, extra: Record<string, unknown> = {}) {
    const data = new FormData(form);
    return {
      ...extra,
      customerName: String(data.get("customerName") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      destination: String(data.get("destination") || ""),
      packageSlug: String(data.get("packageSlug") || ""),
      travelStart: String(data.get("travelStart") || ""),
      travelEnd: String(data.get("travelEnd") || ""),
      travellers: String(data.get("travellers") || ""),
      itinerary: String(data.get("itinerary") || ""),
      currency: String(data.get("currency") || "INR"),
      discountMinor: Math.round(Number(data.get("discount") || 0) * 100),
      paymentTerms: String(data.get("paymentTerms") || ""),
      cancellationNotes: String(data.get("cancellationNotes") || ""),
      validityDate: String(data.get("validityDate") || ""),
      notes: String(data.get("notes") || ""),
      status: String(data.get("status") || "DRAFT"),
      items: lines,
    };
  }

  async function save(form: HTMLFormElement, extra: Record<string, unknown> = {}) {
    setBusy(true);
    setError("");
    const res = await fetch(id ? `/api/admin/crm/quotes/${id}` : "/api/admin/crm/quotes", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload(form, extra)),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not save quote");
      return;
    }
    if (data.invoiceId) {
      router.push(`/admin/invoices/${data.invoiceId}`);
      return;
    }
    if (!id && data.id) {
      router.push(`/admin/quotes/${data.id}`);
      return;
    }
    router.refresh();
  }

  return (
    <form
      className="admin-card"
      onSubmit={(event) => {
        event.preventDefault();
        void save(event.currentTarget);
      }}
    >
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-grid-2">
        <Field name="customerName" label="Customer" defaultValue={initial.customerName} />
        <Field name="email" label="Email" defaultValue={initial.email} />
        <Field name="phone" label="Phone" defaultValue={initial.phone} />
        <Field name="destination" label="Destination" defaultValue={initial.destination} />
        <Field name="packageSlug" label="Package" defaultValue={initial.packageSlug} />
        <Field name="travellers" label="Travellers" defaultValue={initial.travellers} />
        <Field name="travelStart" label="Start" type="date" defaultValue={initial.travelStart} />
        <Field name="travelEnd" label="End" type="date" defaultValue={initial.travelEnd} />
        <Field name="validityDate" label="Valid until" type="date" defaultValue={initial.validityDate} />
        <Field name="currency" label="Currency" defaultValue={initial.currency || "INR"} />
        <div className="admin-field">
          <label>Status</label>
          <select name="status" defaultValue={initial.status}>
            {["DRAFT", "SENT", "ACCEPTED", "DECLINED", "EXPIRED"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <Field
          name="discount"
          label="Header discount"
          defaultValue={String(initial.discountMinor / 100)}
        />
      </div>
      <Field name="itinerary" label="Itinerary" area defaultValue={initial.itinerary} />
      <Field name="paymentTerms" label="Payment terms" area defaultValue={initial.paymentTerms} />
      <Field name="cancellationNotes" label="Cancellation notes" area defaultValue={initial.cancellationNotes} />
      <Field name="notes" label="Notes" area defaultValue={initial.notes} />
      <h3>Items</h3>
      {lines.map((line, index) => (
        <div key={index} className="admin-grid-2">
          <Field
            label="Description"
            defaultValue={line.description}
            onChange={(value) => update(index, { description: value })}
          />
          <Field
            label="Qty"
            defaultValue={String(line.quantity)}
            onChange={(value) => update(index, { quantity: Number(value) || 1 })}
          />
          <Field
            label="Unit price"
            defaultValue={String(line.unitMinor / 100)}
            onChange={(value) => update(index, { unitMinor: Math.round(Number(value) * 100) })}
          />
          <Field
            label="Line tax"
            defaultValue={String(line.taxMinor / 100)}
            onChange={(value) => update(index, { taxMinor: Math.round(Number(value) * 100) })}
          />
          <p className="admin-muted">Line total {formatMoney(lineTotal(line), initial.currency)}</p>
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
      <p>
        Grand total {formatMoney(summary.totalMinor, initial.currency || "INR")}
      </p>
      <div className="admin-actions">
        <button className="admin-btn" disabled={busy} type="submit">
          Save draft
        </button>
        {id ? (
          <>
            <a className="admin-btn secondary" href={`/api/admin/crm/quotes/${id}/pdf`}>
              Download PDF
            </a>
            <button
              className="admin-btn secondary"
              type="button"
              disabled={busy}
              onClick={(event) => {
                const form = event.currentTarget.form;
                if (form) void save(form, { createInvoice: true, status: "ACCEPTED" });
              }}
            >
              Create invoice
            </button>
          </>
        ) : null}
      </div>
    </form>
  );

  function update(index: number, patch: Partial<Line>) {
    setLines((current) =>
      current.map((line, lineIndex) =>
        lineIndex === index ? { ...line, ...patch } : line,
      ),
    );
  }
}

function Field({
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
        <textarea
          name={name}
          defaultValue={defaultValue}
          onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        />
      ) : (
        <input
          name={name}
          type={type || "text"}
          defaultValue={defaultValue}
          onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        />
      )}
    </div>
  );
}
