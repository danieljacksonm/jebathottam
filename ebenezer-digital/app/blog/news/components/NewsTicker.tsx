"use client";

import Link from "next/link";
import { useNews } from "./NewsProvider";
import { relativeNewsTime } from "../data";
import { rotateList, useRotate } from "../../useRotate";

export function NewsTicker() {
  const { articles, updatedAt } = useNews();
  const rotate = useRotate(articles.length, 10000);
  const pool = rotateList(articles, rotate).slice(0, 14);
  const items = pool.length ? [...pool, ...pool] : [];

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
