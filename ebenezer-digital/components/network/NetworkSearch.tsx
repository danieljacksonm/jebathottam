"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { searchNetworkTools } from "@/lib/network/search";
import { trackNetworkEvent } from "@/lib/network/analytics";
import Link from "next/link";

const EXAMPLES = [
  "Compress an image...",
  "Generate an SEO meta description...",
  "Format JSON...",
  "Calculate GST...",
  "Create a QR code...",
  "Generate a robots.txt...",
  "Convert units...",
  "Decode a JWT...",
];

export function NetworkSearch({ large, initialQuery = "" }: { large?: boolean; initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [placeholder, setPlaceholder] = useState(EXAMPLES[0]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % EXAMPLES.length;
      setPlaceholder(EXAMPLES[i]);
    }, 2800);
    return () => window.clearInterval(id);
  }, []);

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
    <div className="relative max-w-xl">
      <form className="nx-search" onSubmit={submit}>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={large ? "What do you want to do?" : placeholder}
          aria-label="Search tools"
          autoComplete="off"
        />
        <button type="submit" className="nx-btn nx-btn-primary shrink-0">
          Search
        </button>
      </form>
      {open && results.length > 0 ? (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-[var(--nx-line)] bg-[var(--nx-bg-elev)] p-2 shadow-lg">
          {results.map((t) => (
            <Link
              key={t.id}
              href={`/network/tools/${t.slug}`}
              className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--nx-brand-soft)]"
              onClick={() => setOpen(false)}
            >
              <span className="font-semibold">{t.name}</span>
              <span className="mt-0.5 block text-xs text-[var(--nx-muted)]">{t.description}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
