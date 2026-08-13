"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useNews } from "./NewsProvider";
import { relativeNewsTime } from "../data";

export function NewsTicker() {
  const { articles, updatedAt } = useNews();
  const [, setTick] = useState(0);
  const breaking = articles.filter((a) => a.breaking);
  const base = breaking.length ? breaking.slice(0, 10) : articles.slice(0, 10);
  const items = [...base, ...base];

  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(t);
  }, []);

  if (!items.length) return null;

  return (
    <div className="news-ticker" role="marquee" aria-label="Breaking news">
      <span className="news-ticker-live">
        <span className="news-pulse" aria-hidden />
        LIVE
      </span>
      <div className="news-ticker-track">
        {items.map((a, i) => (
          <Link key={`${a.id}-${i}`} href={`/blog/news/${a.slug}`} data-cursor="READ">
            {a.breaking ? "Breaking" : a.region} · {a.title}
          </Link>
        ))}
      </div>
      {updatedAt && (
        <span className="news-ticker-age">{relativeNewsTime(updatedAt).replace("Updated ", "desk ")}</span>
      )}
    </div>
  );
}
