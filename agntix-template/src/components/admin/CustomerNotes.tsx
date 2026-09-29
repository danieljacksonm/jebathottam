"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CustomerNotes({ id, notes }: { id: string; notes: string }) {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <form
      className="admin-card"
      onSubmit={async (event) => {
        event.preventDefault();
        const notesValue = String(new FormData(event.currentTarget).get("notes") || "");
        const res = await fetch(`/api/admin/crm/customers/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: notesValue }),
        });
        if (!res.ok) {
          setError("Could not save notes");
          return;
        }
        router.refresh();
      }}
    >
      <h2>Notes</h2>
      {error ? <p className="admin-error">{error}</p> : null}
      <textarea name="notes" defaultValue={notes} />
      <button className="admin-btn" type="submit">
        Save notes
      </button>
    </form>
  );
}
