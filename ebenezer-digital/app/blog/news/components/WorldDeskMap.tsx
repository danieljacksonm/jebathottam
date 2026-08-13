"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { WORLD_DESKS, type NewsArticle } from "../data";

export function WorldDeskMap({ stories }: { stories: NewsArticle[] }) {
  const [active, setActive] = useState<(typeof WORLD_DESKS)[number]>(WORLD_DESKS[0]);

  const counts = useMemo(() => {
    const map = new Map<string, NewsArticle[]>();
    for (const desk of WORLD_DESKS) {
      map.set(
        desk.region,
        stories.filter((s) => s.region === desk.region)
      );
    }
    return map;
  }, [stories]);

  const list = counts.get(active.region) || [];
  const top = list[0];

  return (
    <section id="desk-world" className="bg-[#111] px-4 py-20 text-[var(--n-paper)] sm:px-8 lg:px-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="news-kicker text-white/50">World</p>
          <h2 className="news-display mt-3 text-5xl sm:text-7xl">Where the desk is watching.</h2>
        </div>
        <p className="max-w-sm text-sm text-white/55">
          Hover a city. See how many stories are on that desk. Click through to the lead.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-[#161616]">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 40%, rgba(244,240,232,0.12), transparent 35%), radial-gradient(circle at 70% 50%, rgba(180,35,24,0.18), transparent 32%)",
            }}
          />
          <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full opacity-30" aria-hidden>
            <path
              d="M80 180c40-40 90-70 160-60 50 8 70 50 120 48 40-2 55-40 110-38 70 3 90 55 150 50 40-4 70-30 110-20"
              fill="none"
              stroke="#f4f0e8"
              strokeWidth="1.2"
            />
            <path
              d="M120 280c60-10 90 30 150 20 55-8 80-40 140-28 70 14 90 50 160 40 40-6 80-24 130-10"
              fill="none"
              stroke="#f4f0e8"
              strokeWidth="1"
            />
            <path d="M200 360c80 10 140-20 220-8 90 14 120 40 200 28" fill="none" stroke="#f4f0e8" strokeWidth="0.8" />
          </svg>
          {WORLD_DESKS.map((desk) => {
            const n = counts.get(desk.region)?.length || 0;
            return (
              <button
                key={desk.id}
                type="button"
                className={`news-map-dot ${n > 0 ? "is-hot" : ""}`}
                style={{ left: `${desk.x}%`, top: `${desk.y}%` }}
                onMouseEnter={() => setActive(desk)}
                onFocus={() => setActive(desk)}
                aria-label={`${desk.label}, ${n} stories`}
                data-cursor="VIEW"
              />
            );
          })}
        </div>

        <div className="flex flex-col justify-between border-t border-white/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div>
            <p className="news-kicker text-[var(--n-live)]">{active.label}</p>
            <p className="mt-4 font-serif text-4xl">{list.length} stories</p>
            {top ? (
              <>
                <p className="mt-6 text-sm text-white/55">Lead</p>
                <Link href={`/blog/news/${top.slug}`} className="mt-2 block font-serif text-2xl leading-snug" data-cursor="READ">
                  {top.title}
                </Link>
                <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/45">{top.sourceLabel}</p>
                {top.originalUrl && (
                  <a
                    href={top.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-[10px] font-semibold uppercase tracking-[0.18em] text-white"
                    data-cursor="OPEN"
                  >
                    Read on {top.sourceLabel} →
                  </a>
                )}
              </>
            ) : (
              <p className="mt-6 text-sm text-white/50">No stories on this desk yet.</p>
            )}
          </div>
          <Link href="#top-stories" className="mt-8 text-[11px] uppercase tracking-[0.22em] text-white/60" data-cursor="OPEN">
            Open the wire →
          </Link>
        </div>
      </div>
    </section>
  );
}
