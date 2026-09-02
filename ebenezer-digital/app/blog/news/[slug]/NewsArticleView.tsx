"use client";

import { useEffect, useState } from "react";
import { NewsImage } from "../components/NewsImage";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  formatNewsTime,
  readingMinutes,
  relativeNewsTime,
  splitNewsHeadline,
  type NewsArticle,
} from "../data";
import { AskAiPanel } from "@/components/AskAiPanel";
import { SiteContactLinks } from "@/components/SiteContactLinks";
import { SiteLegalLinks } from "@/components/SiteLegalLinks";

export function NewsArticleView({
  article,
  related,
}: {
  article: NewsArticle;
  related: NewsArticle[];
}) {
  const [saved, setSaved] = useState(false);
  const mins = readingMinutes(article);
  const lines = splitNewsHeadline(article.title);
  const pull = article.body[1] || article.dek;
  const keep = related.slice(0, 3);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSaved((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <article className="px-4 pb-8 pt-8 sm:px-8 lg:px-12">
        <nav className="text-[10px] uppercase tracking-[0.22em] text-[var(--n-muted)]" aria-label="Breadcrumb">
          <Link href="/blog/news">News</Link>
          <span className="mx-2">/</span>
          <span>{article.region}</span>
        </nav>

        <p className="news-kicker mt-8 text-[var(--n-live)]">
          {article.breaking ? "Breaking" : article.region}
        </p>
        <h1 className="news-display mt-4 max-w-5xl text-5xl sm:text-7xl lg:text-8xl">
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--n-muted)]">{article.dek}</p>

        {article.originalUrl ? (
          <p className="mt-4 max-w-2xl rounded border border-[var(--n-line)] bg-[var(--n-paper-2)] px-4 py-3 text-sm leading-relaxed text-[var(--n-muted)]">
            This story summarizes reporting from{" "}
            <span className="font-semibold text-[var(--n-ink)]">{article.sourceLabel}</span>. Read the
            original for full context. Wire items stay in our news sitemap for seven days.{" "}
            <Link href="/blog/newsroom/editorial-policy" className="underline hover:text-[var(--n-ink)]">
              Editorial policy
            </Link>
            .
          </p>
        ) : null}

        {article.originalUrl && (
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-[48px] items-center bg-[var(--n-ink)] px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--n-paper)]"
            data-cursor="OPEN"
          >
            Read full story on {article.sourceLabel} →
          </a>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-[var(--n-line)] py-4 text-[11px] uppercase tracking-[0.16em] text-[var(--n-muted)]">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>{article.byline || article.sourceLabel}</span>
            <span>{formatNewsTime(article.publishedAt)}</span>
            <span>{relativeNewsTime(article.publishedAt)}</span>
            <span>{mins} min read</span>
            <span>{article.topic}</span>
            <span>{article.location}</span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: article.title, url: window.location.href }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href).catch(() => {});
                }
              }}
              className="border border-[var(--n-line)] px-3 py-1.5"
              data-cursor="OPEN"
            >
              Share
            </button>
            <button
              type="button"
              onClick={() => setSaved((v) => !v)}
              className="border border-[var(--n-line)] px-3 py-1.5"
              data-cursor="OPEN"
            >
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        <motion.div layoutId={`news-img-${article.slug}`} className="news-frame relative mt-10 aspect-[16/9]">
          <NewsImage
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
        <p className="mt-3 text-[11px] text-[var(--n-muted)]">
          {article.location} — {article.byline || article.sourceLabel}
        </p>
      </article>

      <div className="sticky top-[var(--news-chrome-offset)] z-40 hidden border-b border-[var(--n-line)] bg-[var(--n-glass)] px-8 py-2 backdrop-blur md:block">
        <p className="truncate font-serif text-lg">{article.title}</p>
      </div>

      <div className="mx-auto max-w-[42rem] px-4 py-12 sm:px-0">
        {article.body.map((para, i) => (
          <p key={`${i}-${para.slice(0, 24)}`} className="mb-6 text-[1.125rem] leading-[1.75]">
            {para}
          </p>
        ))}

        {article.body.length > 1 && (
          <blockquote className="my-14 border-l-2 border-[var(--n-ink)] pl-6 font-serif text-3xl leading-snug">
            {pull}
          </blockquote>
        )}

        {article.originalUrl && (
          <p className="my-10 text-sm text-[var(--n-muted)]">
            This report is published with credit to {article.sourceLabel}.
            {article.body.join(" ").length < 800
              ? " The wire sent a summary; open the original for any extra context."
              : " Full available text from the wire is above."}{" "}
            <a href={article.originalUrl} target="_blank" rel="noopener noreferrer" className="underline" data-cursor="OPEN">
              Read on {article.sourceLabel} →
            </a>
          </p>
        )}

        <p className="text-sm text-[var(--n-muted)]">
          Source: {article.sourceLabel}
          {article.byline ? ` · ${article.byline}` : ""}. Published {formatNewsTime(article.publishedAt)}.
        </p>

        {keep[0] && (
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/blog/news/${keep[0].slug}`}
              className="inline-flex min-h-[48px] items-center bg-[var(--n-ink)] px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--n-paper)]"
              data-cursor="READ"
            >
              Next news → {keep[0].title.slice(0, 42)}{keep[0].title.length > 42 ? "…" : ""}
            </Link>
            <Link
              href="/blog/news"
              className="inline-flex min-h-[48px] items-center border border-[var(--n-ink)] px-5 text-[11px] font-semibold uppercase tracking-[0.18em]"
              data-cursor="OPEN"
            >
              Browse more stories
            </Link>
          </div>
        )}

        <div className="mt-10">
          <AskAiPanel
            mode="news"
            tone="news"
            title="Ask about this story"
            placeholder="Explain simply / what happens next?"
            context={`Title: ${article.title}\nDek: ${article.dek}\nRegion: ${article.region}\nTopic: ${article.topic}\nSource: ${article.sourceLabel}\nBody:\n${article.body.slice(0, 6).join("\n")}`}
            starters={[
              "Explain this story in simple English",
              "Why does this matter?",
              "Give 3 key takeaways",
            ]}
          />
        </div>
      </div>

      {keep.length > 0 && (
        <section className="border-t border-[var(--n-line)] px-4 py-20 sm:px-8 lg:px-12">
          <h2 className="news-display text-5xl sm:text-7xl">Keep reading</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {keep.map((n, i) => (
              <div key={n.id}>
                <Link href={`/blog/news/${n.slug}`} className="group block" data-cursor="READ">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--n-muted)]">
                    {i === 0 ? "Most relevant" : i === 1 ? "Editor’s choice" : "Also developing"}
                  </p>
                  <div className="relative mt-3 aspect-[16/10] overflow-hidden bg-[#111]">
                    <NewsImage
                      src={n.coverImage}
                      alt={n.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="33vw"
                    />
                  </div>
                  <h3 className="mt-4 font-serif text-2xl leading-snug sm:text-3xl">{n.title}</h3>
                  <p className="mt-2 text-sm text-[var(--n-muted)]">{n.dek}</p>
                </Link>
                {n.originalUrl && (
                  <a
                    href={n.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--n-live)]"
                    data-cursor="OPEN"
                  >
                    Read on {n.sourceLabel} →
                  </a>
                )}
              </div>
            ))}
          </div>
          <Link href="/blog/news" className="mt-12 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em]" data-cursor="OPEN">
            Back to the desk <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>
      )}
      <SiteContactLinks
        className="px-4 pb-4 text-sm text-[var(--n-muted)] sm:px-8 lg:px-12"
        linkClassName="hover:text-[var(--n-live)]"
      />
      <SiteLegalLinks
        className="px-4 pb-16 text-xs text-[var(--n-muted)] sm:px-8 lg:px-12"
        linkClassName="hover:text-[var(--n-live)]"
      />
    </>
  );
}
