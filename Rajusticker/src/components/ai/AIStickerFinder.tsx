"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product, RecommendationIntent } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";

const OPTIONS: { value: RecommendationIntent; label: string }[] = [
  { value: "racing", label: "Racing" },
  { value: "jdm", label: "JDM" },
  { value: "motorsport", label: "Motorsport" },
  { value: "chrome", label: "Chrome" },
  { value: "carbon", label: "Carbon" },
  { value: "matte", label: "Matte" },
  { value: "minimal", label: "Minimal" },
  { value: "car-brand", label: "Car brand look" },
  { value: "custom", label: "Custom" },
  { value: "funny", label: "Funny" },
  { value: "motivational", label: "Motivational" },
  { value: "other", label: "Other" },
];

export function AIStickerFinder({ compact = false }: { compact?: boolean }) {
  const [intent, setIntent] = useState<RecommendationIntent>("racing");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [source, setSource] = useState<"local" | "ai" | "">("");
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Recommendation failed");
      setMessage(data.message);
      setSource(data.source);
      setProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={compact ? "container-x" : "container-x py-16"} aria-labelledby="ai-finder-title">
      <div className="border border-[var(--line)] bg-[var(--bg-surface)] p-6 sm:p-10">
        <p className="section-kicker">Find Your Sticker</p>
        <h2 id="ai-finder-title" className="section-title">
          What kind of sticker are you looking for?
        </h2>
        <p className="section-sub mt-2">
          Pick a style. We recommend real products from the Raju Stickers catalogue
          {source ? ` · ${source === "ai" ? "AI assisted" : "catalogue matched"}` : ""}.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="flex flex-wrap gap-2" role="listbox" aria-label="Style options">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={intent === opt.value}
                onClick={() => setIntent(opt.value)}
                className={`px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] border transition-colors ${
                  intent === opt.value
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]"
                    : "border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--line-strong)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="ai-query" className="block text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)] mb-2">
              Optional details
            </label>
            <input
              id="ai-query"
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. holographic roof, matte red, bike accents"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Finding..." : "Get Recommendations"}
          </Button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-[var(--danger)]" role="alert">
            {error}
          </p>
        )}

        {message && (
          <div className="mt-10">
            <p className="text-[var(--ink-2)] mb-6">{message}</p>
            {intent === "custom" && (
              <Link href="/custom-stickers" className="btn btn-secondary mb-8 inline-flex">
                Create Your Sticker
              </Link>
            )}
            {products.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
                {products.slice(0, compact ? 3 : 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
