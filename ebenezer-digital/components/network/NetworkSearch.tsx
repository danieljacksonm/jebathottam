"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { searchNetworkTools } from "@/lib/network/search";
import { trackNetworkEvent } from "@/lib/network/analytics";
import { categoryLabel } from "@/lib/network/registry";
import Link from "next/link";

const EXAMPLES = [
  "Compress an image",
  "Convert photo to WebP",
  "Calculate GST",
  "Format JSON",
  "Generate a QR code",
  "Create an SEO meta description",
  "Convert units",
  "Clean text",
];

export function NetworkSearch({ large, initialQuery = "" }: { large?: boolean; initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [placeholder, setPlaceholder] = useState(EXAMPLES[0]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (large) return;
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % EXAMPLES.length;
      setPlaceholder(EXAMPLES[i]);
    }, 2800);
    return () => window.clearInterval(id);
  }, [large]);

  const results = useMemo(() => (query.trim().length >= 2 ? searchNetworkTools(query, 6) : []), [query]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    trackNetworkEvent("search", { q });
    if (!q) {
      router.push("/network/tools");
      return;
    }
    router.push(`/network/tools?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className={`relative ${large ? "max-w-xl" : "max-w-xl"}`}>
      <form className="nx-search" onSubmit={submit}>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 180)}
          placeholder={large ? "What do you want to do?" : placeholder}
          aria-label="Search tools"
          autoComplete="off"
        />
        <button type="submit" className="nx-btn nx-btn-primary shrink-0">
          Search
        </button>
      </form>
      {open && query.trim().length >= 2 ? (
        <div
          className="absolute z-20 mt-2 w-full rounded-xl border border-[var(--nx-line)] bg-[var(--nx-bg-elev)] p-2 shadow-lg"
          role="listbox"
        >
          {results.length > 0 ? (
            results.map((t) => (
              <Link
                key={t.id}
                href={`/network/tools/${t.slug}`}
                className="block rounded-lg px-3 py-2.5 text-sm hover:bg-[var(--nx-brand-soft)]"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  trackNetworkEvent("search_result_click", { slug: t.slug, q: query });
                  setOpen(false);
                }}
              >
                <span className="font-semibold">{t.name}</span>
                <span className="mt-0.5 block text-xs text-[var(--nx-muted)]">{t.description}</span>
                <span className="mt-1 inline-block text-[0.65rem] font-bold uppercase tracking-wide text-[var(--nx-brand)]">
                  {categoryLabel(t.category)} · Use Tool
                </span>
              </Link>
            ))
          ) : (
            <div className="px-3 py-4 text-sm text-[var(--nx-muted)]">
              <p className="font-semibold text-[var(--nx-ink)]">We couldn&apos;t find that tool.</p>
              <p className="mt-1">Try: Image, PDF, SEO, Developer, Calculator</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["image", "seo", "developer", "calculators"].map((c) => (
                  <Link key={c} href={`/network/tools/c/${c}`} className="nx-chip">
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
