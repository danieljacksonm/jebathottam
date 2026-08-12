"use client";

import Link from "next/link";
import { useNews } from "./NewsProvider";

export function NewsTicker() {
  const { articles } = useNews();
  const breaking = articles.filter((a) => a.breaking);
  const items = (breaking.length ? breaking : articles.slice(0, 6)).concat(
    breaking.length ? breaking : articles.slice(0, 6)
  );

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
            Breaking · {a.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
