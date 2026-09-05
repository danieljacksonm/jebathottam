"use client";

import { useState } from "react";
import { NewsImage } from "./NewsImage";
import Link from "next/link";
import { INDIA_STATES, readingMinutes, type NewsArticle } from "../data";
import { OriginalLink } from "./OriginalLink";
import { newsHref } from "@/lib/news-url";

export function IndiaDesk({ stories }: { stories: NewsArticle[] }) {
  const [state, setState] = useState<(typeof INDIA_STATES)[number]>(INDIA_STATES[0]);
  if (!stories.length) return null;
  const featured = stories[INDIA_STATES.indexOf(state) % stories.length];

  return (
    <section id="desk-india" className="px-4 py-20 sm:px-8 lg:px-12">
      <p className="news-kicker text-[var(--n-muted)]">India</p>
      <h2 className="news-display mt-3 max-w-3xl text-5xl sm:text-7xl">A country, read closely.</h2>

      <div className="mt-10 grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="flex flex-col gap-1">
          {INDIA_STATES.map((name) => (
            <button
              key={name}
              type="button"
              onMouseEnter={() => setState(name)}
              onFocus={() => setState(name)}
              onClick={() => setState(name)}
              className={`border-t border-[var(--n-line)] py-3 text-left font-serif text-2xl transition sm:text-3xl ${
                state === name ? "text-[var(--n-ink)]" : "text-[var(--n-ink)]/30 hover:text-[var(--n-ink)]"
              }`}
              data-cursor="VIEW"
            >
              {name}
            </button>
          ))}
        </div>

        <div>
          <Link href={newsHref(featured)} className="group block" data-cursor="READ">
            <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
              <NewsImage
                src={featured.coverImage}
                alt={featured.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-[var(--n-muted)]">
              India desk · {state} · {featured.sourceLabel} · {readingMinutes(featured)} min
            </p>
            <h3 className="mt-3 font-serif text-3xl leading-tight sm:text-5xl">{featured.title}</h3>
            <p className="mt-4 max-w-xl text-sm text-[var(--n-muted)]">{featured.dek}</p>
          </Link>
          <div className="mt-4">
            <OriginalLink story={featured} />
          </div>
        </div>
      </div>
    </section>
  );
}
