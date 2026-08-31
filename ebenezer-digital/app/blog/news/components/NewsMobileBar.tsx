"use client";

import Link from "next/link";
import { Newspaper, Search } from "lucide-react";
import { useNews } from "./NewsProvider";

export function NewsMobileBar() {
  const { setSearchOpen } = useNews();
  return (
    <nav className="news-bottom" aria-label="Mobile news tools">
      <Link href="/blog/news" className="grid place-items-center py-3 text-[9px] uppercase tracking-[0.16em]">
        <Newspaper className="mb-1 h-4 w-4" />
        Top
      </Link>
      <button type="button" onClick={() => setSearchOpen(true)} className="grid place-items-center py-3 text-[9px] uppercase tracking-[0.16em]">
        <Search className="mb-1 h-4 w-4" />
        Search
      </button>
      <a href="#live" className="grid place-items-center py-3 text-[9px] uppercase tracking-[0.16em] text-[var(--n-live)]">
        Live
      </a>
    </nav>
  );
}
