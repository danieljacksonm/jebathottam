"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StaffForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <form
      className="admin-card"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        const data = new FormData(event.currentTarget);
        const res = await fetch("/api/admin/staff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: String(data.get("name") || ""),
            role: String(data.get("role") || ""),
            password: String(data.get("password") || ""),
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(json.error || "Could not add the staff account.");
          return;
        }
        event.currentTarget.reset();
        router.refresh();
      }}
    >
      <h2>Add staff</h2>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-field">
        <label htmlFor="staff-name">Name</label>
        <input id="staff-name" name="name" required />
      </div>
      <div className="admin-field">
        <label htmlFor="staff-role">Role</label>
        <select id="staff-role" name="role" defaultValue="EDITOR">
          <option value="ADMIN">Admin</option>
          <option value="EDITOR">Editor</option>
          <option value="FINANCE">Finance</option>
          <option value="MARKETING">Marketing</option>
        </select>
      </div>
      <div className="admin-field">
        <label htmlFor="staff-password">Password</label>
        <input id="staff-password" name="password" type="password" minLength={10} required />
      </div>
      <button className="admin-btn" type="submit">
        Create account
      </button>
    </form>
  );
}
