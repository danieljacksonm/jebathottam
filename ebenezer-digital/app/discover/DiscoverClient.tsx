"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import {
  DISCOVER_SUGGESTIONS,
  type DiscoverResult,
} from "@/lib/discover/classify";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { EcosystemNav } from "@/components/EcosystemNav";
import { SiteLegalLinks } from "@/components/SiteLegalLinks";
import { AI_URL, SITE_URL } from "@/lib/site-url";

export default function DiscoverClient({ initialQuery = "" }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<DiscoverResult | null>(null);
  const [hintIndex, setHintIndex] = useState(0);

  const rotating = useMemo(() => DISCOVER_SUGGESTIONS, []);

  useEffect(() => {
    const t = window.setInterval(() => {
      setHintIndex((i) => (i + 1) % rotating.length);
    }, 3200);
    return () => window.clearInterval(t);
  }, [rotating.length]);

  useEffect(() => {
    if (initialQuery.trim()) {
      void run(initialQuery.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run(text: string) {
    const query = text.trim();
    if (!query || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not classify request");
      setResult(data.result as DiscoverResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void run(q);
  }

  async function onDestinationClick(destination: string, href: string) {
    try {
      await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "click",
          query: result?.query || q,
          intent: result?.primaryIntent,
          destination,
        }),
      });
    } catch {
      /* ignore */
    }
    window.location.href = href;
  }

  return (
    <div className="discover-root">
      <EcosystemNav active="discover" />
      <div className="d-page flex justify-end px-4 pt-3 sm:px-6">
        <LanguageSwitcher compact />
      </div>

      <div className="d-page py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            One ecosystem · You choose
          </p>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
            What are you looking for?
          </h1>
          <p className="mt-3 text-lg text-[var(--d-muted)]">
            Tell Ebenezer what you need. We&apos;ll help you find the right solution — without forcing one
            website.
          </p>
        </div>

        <form onSubmit={onSubmit} className="d-glass mt-10 p-4 sm:p-5">
          <label className="sr-only" htmlFor="discover-q">
            Describe what you need
          </label>
          <textarea
            id="discover-q"
            className="d-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={rotating[hintIndex]}
            rows={2}
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--d-muted)]">
              Example: <span className="text-slate-300">{rotating[hintIndex]}</span>
            </p>
            <button type="submit" disabled={busy} className="d-btn d-btn-primary shrink-0">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Find My Solution
              {!busy ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {rotating.slice(0, 5).map((s) => (
            <button
              key={s}
              type="button"
              className="d-chip"
              onClick={() => {
                setQ(s);
                void run(s);
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {error ? <p className="mt-6 text-center text-sm text-red-400">{error}</p> : null}

        {result ? (
          <section className="mt-12 animate-[fadeIn_0.35s_ease]">
            <h2 className="text-2xl font-bold text-center">We found several options for you.</h2>
            <p className="mt-2 text-center text-[var(--d-muted)] max-w-xl mx-auto">{result.summary}</p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="d-chip !text-emerald-300 !border-emerald-500/30">
                Intent: {result.primaryIntent.replace(/_/g, " ")}
              </span>
              {result.budget != null ? (
                <span className="d-chip">Budget ≈ ₹{result.budget.toLocaleString("en-IN")}</span>
              ) : null}
              {result.useCases.map((u) => (
                <span key={u} className="d-chip">
                  {u}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {result.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="d-card text-left"
                  style={{ borderLeft: `3px solid ${o.accent}` }}
                  onClick={() => onDestinationClick(o.id, o.href)}
                >
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--d-muted)]">{o.platform}</p>
                  <p className="text-lg font-bold">{o.title}</p>
                  <p className="text-sm text-[var(--d-muted)]">{o.subtitle}</p>
                  <p className="text-xs text-slate-400 mt-1">{o.why}</p>
                  <span className="mt-auto pt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-300">
                    {o.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              ))}
            </div>

            {result.followUps.length > 0 ? (
              <div className="mt-10 d-glass p-5">
                <p className="text-sm font-semibold">Helpful follow-up questions</p>
                <ul className="mt-3 space-y-1.5 text-sm text-[var(--d-muted)]">
                  {result.followUps.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
                <Link
                  href={`${SITE_URL}/ai?prompt=${encodeURIComponent(result.query)}`}
                  className="mt-4 inline-flex text-sm font-semibold text-emerald-300 hover:underline"
                >
                  Continue with Ebenezer AI →
                </Link>
              </div>
            ) : null}
          </section>
        ) : (
          <>
            <section className="mt-14">
              <h2 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-[var(--d-muted)]">
                Popular intents
              </h2>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {["Build a website", "Compare software", "Buy a laptop", "Free SEO tools", "Billing for my shop"].map(
                  (intent) => (
                    <button
                      key={intent}
                      type="button"
                      className="d-chip"
                      onClick={() => {
                        setQ(intent);
                        void run(intent);
                      }}
                    >
                      {intent}
                    </button>
                  )
                )}
              </div>
            </section>

            <section className="mt-12 d-glass p-6">
              <h2 className="text-lg font-bold">Ecosystem map</h2>
              <p className="mt-2 text-sm text-[var(--d-muted)]">
                Twelve domains, one team — pick the surface that matches your goal.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                {[
                  ["Services", "Custom websites & software", SITE_URL],
                  ["Store", "Ready-made digital products", "https://ebenezerdigital.store"],
                  ["Tools", "Compare AI & SaaS", "https://tools.ebenezerdigital.com"],
                  ["Hardware", "Laptops & electronics", "https://products.ebenezerdigital.com"],
                  ["Guides", "Learn on .info", "https://ebenezerdigital.info"],
                  ["AI", "Ask Ebenezer", AI_URL],
                ].map(([title, sub, href]) => (
                  <a key={title} href={href as string} className="d-card">
                    <p className="font-semibold">{title}</p>
                    <p className="text-[var(--d-muted)] text-xs">{sub}</p>
                  </a>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-[var(--d-muted)]">
                Success paths
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
                {[
                  ["Launch online", "Website → Store → Marketing tools"],
                  ["Run a shop", "SaaS billing → Inventory → Reports"],
                  ["Grow traffic", "SEO tools → Content → Analytics"],
                ].map(([title, path]) => (
                  <div key={title} className="d-card">
                    <p className="font-semibold">{title}</p>
                    <p className="text-xs text-[var(--d-muted)]">{path}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <p className="mt-12 text-center text-xs text-[var(--d-muted)] max-w-lg mx-auto">
          Domains stay separate. This page only helps you choose the right Ebenezer platform — we never invent
          products or prices here.
        </p>
        <SiteLegalLinks className="mt-6 text-center text-xs text-[var(--d-muted)]" linkClassName="hover:text-slate-300" />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
