"use client";

import { FormEvent, useState } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SaasLoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const next = params.get("next") || "/saas";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/saas/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="saas-root grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md border border-[var(--s-line)] bg-[var(--s-bg)] p-6 sm:p-8">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--s-brand)]">Ebenezer SaaS</p>
        <h1 className="mt-3 text-3xl">Sign in</h1>
        <p className="mt-2 text-sm text-[var(--s-muted)]">
          This login is only for SaaS. Store and admin logins are separate.
        </p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm text-[var(--s-muted)]">
            Email
            <input
              className="saas-input mt-1"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="saas@ebenezerdigital.com"
            />
          </label>
          <label className="block text-sm text-[var(--s-muted)]">
            Password
            <input
              className="saas-input mt-1"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button type="submit" className="saas-btn w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in to SaaS"}
          </button>
        </form>

        <Link href="/" className="mt-5 inline-block text-xs uppercase tracking-[0.14em] text-[var(--s-muted)]">
          Back to site
        </Link>
      </div>
    </div>
  );
}

export default function SaasLoginPage() {
  return (
    <Suspense fallback={<div className="saas-root grid min-h-screen place-items-center px-4">Loading login...</div>}>
      <SaasLoginInner />
    </Suspense>
  );
}
