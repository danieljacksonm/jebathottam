"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    fetch("/api/admin/orders", {
      headers: { "x-admin-key": password },
    })
      .then((r) => {
        if (r.status === 401) throw new Error("Invalid password");
        return r.json();
      })
      .then(() => {
        if (typeof window !== "undefined") sessionStorage.setItem("adminKey", password);
        router.push("/admin/dashboard");
      })
      .catch(() => setError("Invalid password. Set ADMIN_SECRET in .env and use it here."));
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-[var(--foreground)]">Admin login</h1>
        <input
          type="password"
          placeholder="Admin secret"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] px-4 py-2 bg-[var(--card)]"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-[var(--accent)] text-white py-2 font-medium hover:bg-[var(--accent-dark)]"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
