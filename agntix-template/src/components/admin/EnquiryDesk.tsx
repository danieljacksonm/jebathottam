"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "QUOTE_SENT",
  "FOLLOW_UP",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "LOST",
];

export function EnquiryDesk({
  id,
  status,
  priority,
  nextFollowUp,
}: {
  id: string;
  status: string;
  priority: string;
  nextFollowUp: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(payload: Record<string, unknown>) {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/crm/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not update enquiry");
      return;
    }
    if (data.quoteId) {
      router.push(`/admin/quotes/${data.quoteId}`);
      return;
    }
    router.refresh();
  }

  return (
    <div className="admin-card" style={{ marginTop: "1rem" }}>
      <h2>Actions</h2>
      {error ? <p className="admin-error">{error}</p> : null}
      <form
        className="admin-grid-2"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          void send({
            status: String(data.get("status") || ""),
            priority: String(data.get("priority") || ""),
            nextFollowUp: String(data.get("nextFollowUp") || ""),
            note: String(data.get("note") || ""),
            noteKind: String(data.get("noteKind") || "note"),
          });
        }}
      >
        <div className="admin-field">
          <label>Status</label>
          <select name="status" defaultValue={status}>
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="admin-field">
          <label>Priority</label>
          <select name="priority" defaultValue={priority}>
            <option>NORMAL</option>
            <option>HIGH</option>
            <option>LOW</option>
          </select>
        </div>
        <div className="admin-field">
          <label>Next follow-up</label>
          <input name="nextFollowUp" type="date" defaultValue={nextFollowUp} />
        </div>
        <div className="admin-field">
          <label>Activity type</label>
          <select name="noteKind" defaultValue="note">
            <option value="note">Note</option>
            <option value="call">Call</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="reminder">Reminder</option>
          </select>
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Note</label>
          <textarea name="note" placeholder="What happened, and what is next" />
        </div>
        <div className="admin-actions">
          <button className="admin-btn" disabled={busy} type="submit">
            Save
          </button>
          <button
            className="admin-btn secondary"
            type="button"
            disabled={busy}
            onClick={() => void send({ createQuote: true })}
          >
            Create quote
          </button>
        </div>
      </form>
    </div>
  );
}
