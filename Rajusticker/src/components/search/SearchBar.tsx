"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

type Suggestion = {
  slug: string;
  name: string;
  price: number;
};

export function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    timer.current = window.setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`);
      if (!res.ok) return;
      const data = await res.json();
      setSuggestions(data.results || []);
      setOpen(true);
      trackEvent({
        name: "search",
        query,
        resultsCount: (data.results || []).length,
      });
    }, 180);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [query]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <form onSubmit={onSubmit} role="search">
        <label htmlFor="site-search" className="sr-only">
          Search products
        </label>
        <input
          id="site-search"
          className="input"
          placeholder="Search wraps, finishes, colours..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          autoFocus={autoFocus}
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open}
        />
      </form>
      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-40 mt-1 w-full card-surface shadow-[var(--shadow-soft)] overflow-hidden"
        >
          {suggestions.map((item) => (
            <li key={item.slug} role="option" aria-selected={false}>
              <Link
                href={`/stickers/${item.slug}`}
                className="block px-3 py-3 text-sm hover:bg-[var(--bg-hover)]"
                onClick={() => setOpen(false)}
              >
                <span className="block text-[var(--text)]">{item.name}</span>
                <span className="text-xs text-[var(--accent)]">₹{item.price.toLocaleString("en-IN")}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="w-full text-left px-3 py-3 text-xs uppercase tracking-wider text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
              onClick={() => {
                setOpen(false);
                router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
              }}
            >
              View all results
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
