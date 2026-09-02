"use client";

import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SaasHeader } from "../SaasHeader";
import { SITE_NAV } from "@/lib/site-nav";
import { SiteLegalLinks } from "@/components/SiteLegalLinks";
import "../saas.css";

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
    <main className="saas-root min-h-screen">
      <SaasHeader />
      <div className="saas-section flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <div className="w-full max-w-md border border-[var(--saas-line)] bg-[rgba(255,252,247,0.03)] p-6 sm:p-8">
          <p className="saas-kicker">Yegova Billing</p>
          <h1 className="mt-2 text-3xl font-semibold">Sign in to your shop</h1>
          <p className="mt-2 text-sm text-[var(--saas-muted)]">
            Cloud billing for Indian traders — invoices, stock, GST reports, and thermal print.
          </p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <label className="block text-sm text-[var(--saas-muted)]">
              Email
              <input
                className="saas-input mt-1 w-full"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourshop.com"
              />
            </label>
            <label className="block text-sm text-[var(--saas-muted)]">
              Password
              <input
                className="saas-input mt-1 w-full"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <button type="submit" className="saas-btn saas-btn-gold w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-xs text-[var(--saas-muted)]">
            New shop?{" "}
            <Link href="/saas" className="text-[var(--saas-gold)] hover:underline">
              Start free on the Yegova homepage
            </Link>
            .
          </p>
          <p className="mt-3 text-xs text-[var(--saas-muted)]">
            <Link href="/saas" className="hover:text-[var(--saas-ink)]">
              ← Back to Yegova
            </Link>
            {" · "}
            <a href={SITE_NAV.studio} className="hover:text-[var(--saas-ink)]">
              Ebenezer Digital
            </a>
          </p>
          <SiteLegalLinks className="mt-4 text-xs text-[var(--saas-muted)]" linkClassName="hover:text-[var(--saas-ink)]" />
        </div>
      </div>
    </main>
  );
}

export default function SaasLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="saas-root grid min-h-screen place-items-center px-4 text-[var(--saas-muted)]">
          Loading sign-in…
        </div>
      }
    >
      <SaasLoginInner />
    </Suspense>
  );
}
