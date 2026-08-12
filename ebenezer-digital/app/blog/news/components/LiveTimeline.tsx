"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { formatNewsClock, relativeNewsTime, type NewsArticle } from "../data";

export function LiveTimeline({ stories }: { stories: NewsArticle[] }) {
  const items = stories.slice(0, 8);

  return (
    <section id="live" className="border-y border-[var(--n-line)] px-4 py-16 sm:px-8 lg:px-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="news-kicker text-[var(--n-live)]">Developing</p>
          <h2 className="news-display mt-3 text-6xl sm:text-8xl">LIVE</h2>
        </div>
        <p className="max-w-xs text-sm text-[var(--n-muted)]">
          A real-time desk stream. New lines enter quietly — no flashing, no noise.
        </p>
      </div>

      <ol className="relative mx-auto max-w-3xl border-l border-[var(--n-line-strong)] pl-8">
        {items.map((story, i) => (
          <motion.li
            key={story.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
            className="relative pb-10 last:pb-0"
          >
            <span className="absolute -left-[37px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--n-ink)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--n-muted)]">
              {formatNewsClock(story.publishedAt)} · {story.location}
            </p>
            <Link href={`/blog/news/${story.slug}`} className="mt-2 block font-serif text-2xl leading-snug sm:text-3xl" data-cursor="READ">
              {story.title}
            </Link>
            <p className="mt-2 text-sm text-[var(--n-muted)]">{story.dek}</p>
            <p className="mt-2 text-[11px] text-[var(--n-muted)]">{relativeNewsTime(story.publishedAt)}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
