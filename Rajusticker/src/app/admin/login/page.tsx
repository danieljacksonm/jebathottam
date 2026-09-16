"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const password = String(new FormData(event.currentTarget).get("password") || "");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (!response.ok) {
      setError("Incorrect password");
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next && next.startsWith("/") ? next : "/admin/products");
    router.refresh();
  }

  return (
    <main className="min-h-screen grid place-items-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <p className="section-kicker">Staff</p>
        <h1 className="font-display text-4xl mt-2">Desk login</h1>
        <p className="mt-3 text-sm text-[var(--ink-2)]">Catalogue and billing stay behind this counter.</p>
        <input name="password" type="password" required autoFocus className="input mt-8" placeholder="Password" />
        {error && <p className="mt-3 text-sm text-[var(--bad)]">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block mt-4" disabled={pending}>
          {pending ? "Checking…" : "Enter"}
        </button>
      </form>
    </main>
  );
}
