"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Loader2, Sparkles, X } from "lucide-react";

export function CatalogAskAi() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function ask(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    setBusy(true);
    setError("");
    setAnswer("");
    try {
      const res = await fetch("/api/catalog/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: question, explain: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      if (data.explanation) {
        setAnswer(data.explanation);
      } else if (data.result?.ranked?.[0]) {
        const top = data.result.ranked.slice(0, 3);
        setAnswer(
          top
            .map(
              (s: { product: { name: string; slug: string }; bestOffer?: { price: number }; reasons: string[] }, i: number) =>
                `${i + 1}. ${s.product.name}${s.bestOffer ? ` — ₹${s.bestOffer.price}` : ""}\n${s.reasons.join("; ")}\nLink: /catalog/p/${s.product.slug}`
            )
            .join("\n\n") +
            "\n\n(AI explanation unavailable right now — showing scored catalog results only.)"
        );
      } else {
        setAnswer("No matching products in catalog. Try a broader budget or category.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(q);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[var(--c-brand)] px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[var(--c-brand-dk)]"
      >
        <Sparkles className="h-4 w-4" />
        Ask Ebenezer AI
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-end p-4 sm:items-center sm:justify-center">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-[var(--c-line)] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--c-line)] px-4 py-3">
              <p className="font-semibold">Product shopping assistant</p>
              <button type="button" onClick={() => setOpen(false)} className="p-1 text-[var(--c-muted)]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-[var(--c-muted)]">
                Grounded in catalog scores. AI will not invent prices or specs.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Laptop under ₹60,000 for coding", "Best SSD for gaming", "16GB RAM laptop under 70000"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="rounded-full border border-[var(--c-line)] px-2.5 py-1 text-[11px] hover:border-teal-400"
                    onClick={() => {
                      setQ(s);
                      ask(s);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <form onSubmit={onSubmit} className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-[var(--c-line)] px-3 py-2 text-sm"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Budget + what you need…"
                />
                <button type="submit" disabled={busy} className="c-btn c-btn-primary !py-2 !px-3 !text-sm">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
                </button>
              </form>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {answer ? (
                <div className="max-h-64 overflow-y-auto rounded-xl bg-slate-50 p-3 text-sm whitespace-pre-wrap text-[var(--c-ink-2)]">
                  {answer}
                </div>
              ) : null}
              <Link href="/catalog/recommend" className="text-xs font-semibold text-[var(--c-brand-dk)] hover:underline">
                Open full recommender →
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
