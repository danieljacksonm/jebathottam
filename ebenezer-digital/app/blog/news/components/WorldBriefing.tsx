"use client";

import Link from "next/link";
import { relativeNewsTime, type NewsArticle } from "../data";
import { OriginalLink } from "./OriginalLink";
import { AskAiPanel, NewsBriefButton } from "@/components/AskAiPanel";
import { newsHref } from "@/lib/news-url";

export function WorldBriefing({
  stories,
  totalOnDesk,
}: {
  stories: NewsArticle[];
  totalOnDesk?: number;
}) {
  const wire = stories;
  if (!wire.length) return null;

  const sources = Array.from(new Set(stories.map((s) => s.sourceLabel))).slice(0, 12);
  const regions = Array.from(new Set(stories.map((s) => s.region)));
  const aiContext = wire
    .slice(0, 14)
    .map((s, i) => `${i + 1}. [${s.region}] ${s.title} — ${s.dek}`)
    .join("\n");

  return (
    <section className="border-b border-[var(--n-line)] bg-[#0f0f0f] px-4 py-8 text-[var(--n-paper)] sm:px-8 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="news-kicker text-[var(--n-live)]">World at a glance</p>
          <h2 className="news-display mt-2 text-4xl sm:text-6xl">Know the world in one scan.</h2>
        </div>
        <div className="text-right text-[11px] uppercase tracking-[0.2em] text-white/50">
          <p>{totalOnDesk || stories.length} stories on desk</p>
          <p className="mt-1">{regions.length} regions · {sources.length}+ sources</p>
        </div>
      </div>

      <p className="mt-4 max-w-3xl text-sm text-white/55">
        Live headlines from major world and India desks. Open any line for our briefing, ask AI for a quick world scan, or jump to the original website.
      </p>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start">
        <NewsBriefButton />
        <AskAiPanel
          mode="news"
          tone="news"
          title="Ask about today’s world"
          placeholder="e.g. What is happening in India and Europe?"
          context={aiContext}
          starters={[
            "Summarize the top world stories",
            "What should I know about India today?",
            "Any tech or climate headlines?",
          ]}
          className="w-full max-w-xl"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {sources.map((s) => (
          <span key={s} className="border border-white/15 px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-white/65">
            {s}
          </span>
        ))}
      </div>

      <ol className="mt-8 columns-1 gap-x-10 sm:columns-2 xl:columns-3">
        {wire.map((s, i) => (
          <li key={s.id} className="mb-4 break-inside-avoid border-t border-white/12 pt-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
              {String(i + 1).padStart(2, "0")} · {s.region} · {s.sourceLabel}
            </p>
            <Link href={newsHref(s)} className="mt-1 block font-serif text-lg leading-snug text-white hover:text-white/80" data-cursor="READ">
              {s.title}
            </Link>
            <p className="mt-1 line-clamp-2 text-xs text-white/45">{s.dek}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="text-[10px] text-white/35">{relativeNewsTime(s.publishedAt)}</span>
              <OriginalLink story={s} className="!text-white/80" />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
