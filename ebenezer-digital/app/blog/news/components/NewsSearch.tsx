"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { readingMinutes, relativeNewsTime } from "../data";
import { useNews } from "./NewsProvider";
import { newsHref } from "@/lib/news-url";

export function NewsSearch() {
  const { articles, searchOpen, setSearchOpen } = useNews();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [searchOpen, setSearchOpen]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return articles.slice(0, 8);
    return articles
      .filter((a) =>
        `${a.title} ${a.dek} ${a.topic} ${a.region} ${a.location}`.toLowerCase().includes(query)
      )
      .slice(0, 12);
  }, [articles, q]);

  if (!searchOpen) return null;

  return (
    <div className="news-search flex items-start justify-center px-4 pt-24 sm:pt-32" role="dialog" aria-modal="true" aria-label="Search news">
      <div className="w-full max-w-3xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <h2 className="news-display text-4xl text-[var(--n-paper)] sm:text-6xl">
            What are you
            <br />
            looking for?
          </h2>
          <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search" className="text-[var(--n-paper)]">
            <X className="h-7 w-7" />
          </button>
        </div>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Stories, desks, topics…"
          className="w-full border-b border-white/25 bg-transparent pb-4 font-serif text-2xl text-[var(--n-paper)] outline-none placeholder:text-white/40 focus:border-white"
        />
        <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-white/50">Stories · Desks · Topics</p>
        <ul className="mt-8 space-y-4">
          {results.map((a) => (
            <li key={a.id}>
              <Link
                href={newsHref(a)}
                onClick={() => setSearchOpen(false)}
                className="block border-t border-white/15 pt-4 text-[var(--n-paper)]"
                data-cursor="READ"
              >
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">
                  {a.region} · {readingMinutes(a)} min · {relativeNewsTime(a.publishedAt)}
                </p>
                <p className="mt-1 font-serif text-2xl leading-tight">{a.title}</p>
              </Link>
            </li>
          ))}
          {results.length === 0 && <li className="text-white/60">No matching stories.</li>}
        </ul>
      </div>
    </div>
  );
}
