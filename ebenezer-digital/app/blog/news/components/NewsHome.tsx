"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { rotateList, useRotate } from "../../useRotate";
import { NewsImage } from "./NewsImage";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import {
  NEWS_NAV,
  readingMinutes,
  relativeNewsTime,
  splitNewsHeadline,
  storiesForNav,
  type NewsArticle,
} from "../data";
import { useNews } from "./NewsProvider";
import { LiveTimeline } from "./LiveTimeline";
import { WorldDeskMap } from "./WorldDeskMap";
import { IndiaDesk } from "./IndiaDesk";
import { WorldBriefing } from "./WorldBriefing";
import { OriginalLink } from "./OriginalLink";
import { SiteLegalLinks } from "@/components/SiteLegalLinks";
import {
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site-contact";

function StoryLink({
  story,
  className = "",
  children,
}: {
  story: NewsArticle;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <Link href={`/blog/news/${story.slug}`} className="group contents" data-cursor="READ">
        {children}
      </Link>
      <div className="col-span-full mt-2 flex flex-wrap items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--n-muted)]">{story.sourceLabel}</span>
        <OriginalLink story={story} />
      </div>
    </div>
  );
}

export function NewsHome() {
  const { articles, loading, updatedAt } = useNews();
  const [playing, setPlaying] = useState<string | null>(null);
  const featureRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: featureRef,
    offset: ["start start", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const metaOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  // Prefer live wire. Rotate every 10s. Each story appears in only one section.
  const liveFirst = useMemo(() => {
    const live = articles.filter((a) => a.origin === "live");
    const other = articles.filter((a) => a.origin !== "live");
    return live.length ? [...live, ...other] : articles;
  }, [articles]);

  const rotate = useRotate(liveFirst.length, 120000);
  const rotated = useMemo(() => rotateList(liveFirst, rotate), [liveFirst, rotate]);

  const desk = useMemo(() => {
    const used = new Set<string>();
    const heroLead =
      rotated.find((a) => a.pinned) ||
      rotated.find((a) => a.featured) ||
      rotated.find((a) => a.breaking) ||
      rotated[0];
    if (heroLead) used.add(heroLead.id);

    const take = (count: number, list = rotated, pred?: (a: NewsArticle) => boolean) => {
      const out: NewsArticle[] = [];
      for (const a of list) {
        if (used.has(a.id)) continue;
        if (pred && !pred(a)) continue;
        used.add(a.id);
        out.push(a);
        if (out.length >= count) break;
      }
      return out;
    };
    const briefing = take(12);
    const lead = heroLead;
    const secondary = take(4);
    const compact = take(8);
    const wireMore = take(24);
    let live = take(12, rotated, (a) => Boolean(a.breaking));
    if (live.length < 10) live = live.concat(take(10 - live.length));
    const topBig = take(1);
    const topPair = take(2);
    const trending = take(10);
    const mostRead = take(10);
    const visual = take(5);
    const audio = take(4);
    const cinematic = take(1)[0];
    const leftover = rotated.filter((a) => !used.has(a.id));
    return {
      briefing,
      lead,
      secondary,
      compact,
      wireMore,
      live,
      topBig: topBig[0],
      topPair,
      trending,
      mostRead,
      visual,
      audio,
      cinematic,
      india: storiesForNav(leftover, "India"),
      tech: storiesForNav(leftover, "Technology"),
      sports: storiesForNav(leftover, "Sports"),
      opinion: storiesForNav(leftover, "Opinion"),
      leftover,
    };
  }, [rotated]);

  const {
    briefing,
    lead,
    secondary,
    compact,
    wireMore,
    live,
    topBig,
    topPair,
    trending,
    mostRead,
    visual,
    audio,
    cinematic,
    india,
    tech,
    sports,
    opinion,
    leftover,
  } = desk;

  const desks = useMemo(() => {
    const taken = new Set<string>();
    return NEWS_NAV.filter((n) => !["World", "India"].includes(n)).map((name) => {
      const items = storiesForNav(leftover, name)
        .filter((s) => !taken.has(s.id))
        .slice(0, 4);
      items.forEach((s) => taken.add(s.id));
      return { name, items };
    });
  }, [leftover]);

  if (loading) {
    return (
      <div className="px-4 py-24 text-[var(--n-muted)] sm:px-8">
        Loading the desk…
      </div>
    );
  }

  if (!lead) {
    return <p className="px-4 py-24 text-[var(--n-muted)]">No stories on the desk yet.</p>;
  }

  const lines = splitNewsHeadline(lead.title);

  return (
    <>
      <WorldBriefing stories={briefing} totalOnDesk={liveFirst.length} />

      {/* FRONT PAGE */}
      <section className="news-front px-4 pb-10 pt-6 sm:px-8 lg:px-12">
        <div className="news-masthead mb-8 overflow-hidden border-y border-[var(--n-gold)] py-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="news-kicker text-[var(--n-live)]">Ebenezer World News</p>
              <h1 className="news-display mt-2 text-[11vw] leading-[0.9] sm:text-[6vw] lg:text-[4.2vw]">
                THE DESK
                <span className="block text-[var(--n-gold)]">IS LIVE.</span>
              </h1>
            </div>
            <div className="max-w-sm text-right">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--n-muted)]">
                news.ebenezerdigital.info
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--n-muted)]">
                One royal paper desk for the world — wires rotate, no story repeats on this page.
              </p>
              {updatedAt && (
                <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[var(--n-live)]">
                  Desk refreshed {relativeNewsTime(updatedAt).replace("Updated ", "")}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="news-kicker text-[var(--n-muted)]">What is happening now</p>
            <p className="mt-2 max-w-xl text-sm text-[var(--n-muted)]">
              BBC, Reuters, The Hindu, NDTV, NYT, Al Jazeera and more — composed like a morning front page.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <StoryLink story={lead} className="group news-lead-card block">
            <p className="news-kicker text-[var(--n-live)]">{lead.breaking ? "Breaking" : lead.region}</p>
            <h2 className="news-display mt-4 text-[12vw] sm:text-[7.5vw] lg:text-[5.6vw]">
              {lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <motion.div layoutId={`news-img-${lead.slug}`} className="news-frame news-lead-frame relative mt-6 aspect-[16/9] overflow-hidden">
              <NewsImage
                src={lead.coverImage}
                alt={lead.title}
                fill
                priority
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 1024px) 100vw, 70vw"
              />
            </motion.div>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <p className="max-w-xl text-sm leading-relaxed text-[var(--n-muted)]">{lead.dek}</p>
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
                Read full story <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[var(--n-muted)]">
              {lead.sourceLabel} · {relativeNewsTime(lead.publishedAt)} · {readingMinutes(lead)} min
            </p>
          </StoryLink>

          <aside className="flex flex-col border-t border-[var(--n-line)] lg:border-l lg:border-t-0 lg:pl-8">
            <p className="news-kicker py-4 text-[var(--n-muted)]">What matters</p>
            {secondary.map((s) => (
              <StoryLink
                key={s.id}
                story={s}
                className="group border-t border-[var(--n-line)] py-4"
              >
                <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--n-live)]">{s.region}</p>
                <h2 className="mt-2 font-serif text-xl leading-snug transition group-hover:translate-x-0.5 sm:text-2xl">{s.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--n-muted)]">{s.dek}</p>
                <p className="mt-2 text-[11px] text-[var(--n-muted)]">{relativeNewsTime(s.publishedAt)}</p>
              </StoryLink>
            ))}
            {compact.slice(0, 5).map((s) => (
              <StoryLink key={s.id} story={s} className="border-t border-[var(--n-line)] py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--n-muted)]">
                  {s.region} · {s.sourceLabel}
                </p>
                <h3 className="mt-1 font-serif text-lg leading-snug">{s.title}</h3>
              </StoryLink>
            ))}
          </aside>
        </div>
      </section>

      {wireMore.length > 0 && (
        <section className="border-y border-[var(--n-line)] px-4 py-12 sm:px-8 lg:px-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 className="news-display text-4xl sm:text-5xl">More of the wire</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--n-muted)]">{wireMore.length} more stories</p>
          </div>
          <div className="grid gap-x-8 gap-y-1 md:grid-cols-2">
            {wireMore.map((s) => (
              <div key={s.id} className="border-t border-[var(--n-line)] py-3">
                <Link href={`/blog/news/${s.slug}`} className="block" data-cursor="READ">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--n-muted)]">
                    {s.region} · {s.sourceLabel} · {relativeNewsTime(s.publishedAt)}
                  </p>
                  <h3 className="mt-1 font-serif text-xl leading-snug">{s.title}</h3>
                </Link>
                <div className="mt-2">
                  <OriginalLink story={s} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <LiveTimeline stories={live} />

      {/* TOP STORIES — irregular grid */}
      <section id="top-stories" className="px-4 py-20 sm:px-8 lg:px-12">
        <p className="news-kicker text-[var(--n-muted)]">What should I read</p>
        <h2 className="news-display mt-3 text-5xl sm:text-7xl">Top stories</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-6">
          {topBig && (
            <StoryLink story={topBig} className="group md:col-span-4 md:row-span-2">
              <div className="news-frame relative aspect-[16/11] overflow-hidden md:aspect-auto md:h-full md:min-h-[420px]">
                <NewsImage src={topBig.coverImage} alt={topBig.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="70vw" />
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-[var(--n-live)]">{topBig.region}</p>
              <h3 className="mt-2 font-serif text-3xl leading-tight sm:text-5xl">{topBig.title}</h3>
              <p className="mt-3 max-w-xl text-sm text-[var(--n-muted)]">{topBig.dek}</p>
            </StoryLink>
          )}
          {topPair.map((s) => (
            <StoryLink key={s.id} story={s} className="group md:col-span-2">
              <div className="news-frame relative aspect-[4/3]">
                <NewsImage src={s.coverImage} alt={s.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="33vw" />
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[var(--n-muted)]">{s.region}</p>
              <h3 className="mt-2 font-serif text-2xl leading-snug">{s.title}</h3>
            </StoryLink>
          ))}
        </div>
        <div className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {compact.map((s) => (
            <StoryLink key={s.id} story={s} className="group border-t border-[var(--n-line)] py-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--n-muted)]">
                {s.region} · {readingMinutes(s)} min
              </p>
              <h3 className="mt-2 font-serif text-xl leading-snug transition group-hover:translate-x-0.5">{s.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-[var(--n-muted)]">{s.dek}</p>
            </StoryLink>
          ))}
        </div>
      </section>

      {/* CINEMATIC FEATURE */}
      {cinematic && (
        <section ref={featureRef} className="relative h-[160vh]">
          <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#0a0a0a] text-[var(--n-paper)]">
            <motion.div style={{ scale: imgScale }} className="absolute inset-0">
              <NewsImage src={cinematic.coverImage} alt="" fill className="object-cover opacity-70" sizes="100vw" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />
            <motion.div style={{ y: titleY }} className="relative z-10 flex h-full flex-col justify-end px-4 pb-16 sm:px-10">
              <motion.p style={{ opacity: metaOpacity }} className="news-kicker text-white/70">
                Feature
              </motion.p>
              <h2 className="news-display mt-4 max-w-5xl text-5xl sm:text-7xl lg:text-8xl">{cinematic.title}</h2>
              <motion.p style={{ opacity: metaOpacity }} className="mt-6 max-w-lg text-sm text-white/70">
                {cinematic.dek}
              </motion.p>
              <Link href={`/blog/news/${cinematic.slug}`} className="mt-8 inline-flex w-fit items-center gap-2 text-[11px] uppercase tracking-[0.22em]" data-cursor="READ">
                Enter the story <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      <WorldDeskMap stories={leftover} />
      <IndiaDesk stories={india} />

      {/* TRENDING */}
      <section className="py-20">
        <div className="mb-8 flex items-end justify-between px-4 sm:px-8 lg:px-12">
          <h2 className="news-display text-5xl sm:text-7xl">Trending now</h2>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--n-muted)]">Swipe</p>
        </div>
        <div className="flex gap-6 overflow-x-auto px-4 pb-4 sm:px-8 lg:px-12">
          {trending.map((s, i) => (
            <StoryLink key={s.id} story={s} className="w-[78vw] shrink-0 sm:w-[340px]">
              <p className="news-display text-6xl text-[var(--n-ink)]/15">{String(i + 1).padStart(2, "0")}</p>
              <div className="news-frame relative mt-2 aspect-[4/5]">
                <NewsImage src={s.coverImage} alt={s.title} fill className="object-cover" sizes="340px" />
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[var(--n-muted)]">{s.region}</p>
              <h3 className="mt-2 font-serif text-2xl leading-snug">{s.title}</h3>
            </StoryLink>
          ))}
        </div>
      </section>

      {/* MOST READ */}
      <section className="border-y border-[var(--n-line)] px-4 py-16 sm:px-8 lg:px-12">
        <h2 className="news-display text-4xl sm:text-6xl">Most read</h2>
        <ol className="mt-8 divide-y divide-[var(--n-line)]">
          {mostRead.map((s, i) => (
            <li key={s.id}>
              <StoryLink story={s} className="grid grid-cols-[auto_1fr] items-baseline gap-6 py-5">
                <span className="news-display w-10 text-3xl text-[var(--n-ink)]/25">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-serif text-xl leading-snug sm:text-2xl">{s.title}</span>
                  <span className="mt-1 block text-[11px] uppercase tracking-[0.18em] text-[var(--n-muted)]">
                    {s.region} · {readingMinutes(s)} min
                  </span>
                </span>
              </StoryLink>
            </li>
          ))}
        </ol>
      </section>

      {/* TECH */}
      {tech[0] && (
        <section id="desk-technology" className="bg-[#0c0c0c] px-4 py-20 text-[var(--n-paper)] sm:px-8 lg:px-12">
          <p className="news-kicker text-white/50">Technology</p>
          <h2 className="news-display mt-3 text-5xl sm:text-7xl">The machine room.</h2>
          <StoryLink story={tech[0]} className="group mt-10 grid gap-8 lg:grid-cols-2">
            <div className="relative aspect-[16/11] overflow-hidden">
              <NewsImage src={tech[0].coverImage} alt={tech[0].title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="50vw" />
            </div>
            <div className="flex flex-col justify-end">
              <h3 className="font-serif text-4xl leading-tight sm:text-5xl">{tech[0].title}</h3>
              <p className="mt-4 text-sm text-white/60">{tech[0].dek}</p>
            </div>
          </StoryLink>
        </section>
      )}

      {/* SPORTS */}
      {sports[0] && (
        <section id="desk-sports" className="px-4 py-20 sm:px-8 lg:px-12">
          <p className="news-kicker text-[var(--n-live)]">Sports</p>
          <h2 className="news-display mt-3 text-5xl sm:text-7xl">In motion.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {sports.slice(0, 3).map((s) => (
              <StoryLink key={s.id} story={s} className="group">
                <div className="news-frame relative aspect-[3/4]">
                  <NewsImage src={s.coverImage} alt={s.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="33vw" />
                  <span className="absolute left-3 top-3 bg-[var(--n-live)] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white">
                    Live desk
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-2xl leading-snug">{s.title}</h3>
              </StoryLink>
            ))}
          </div>
        </section>
      )}

      {/* OPINION */}
      {opinion[0] && (
        <section id="desk-opinion" className="border-y border-[var(--n-line)] px-4 py-20 sm:px-8 lg:px-12">
          <p className="news-kicker text-[var(--n-muted)]">Opinion</p>
          <h2 className="news-display mt-3 text-5xl sm:text-7xl">A longer view.</h2>
          <blockquote className="mt-10 max-w-4xl font-serif text-3xl leading-tight sm:text-5xl">
            “{opinion[0].dek}”
          </blockquote>
          <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-[var(--n-muted)]">{opinion[0].sourceLabel}</p>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {opinion.slice(0, 2).map((s) => (
              <StoryLink key={s.id} story={s} className="border-t border-[var(--n-line)] pt-6">
                <h3 className="font-serif text-3xl leading-snug">{s.title}</h3>
                <p className="mt-3 text-sm text-[var(--n-muted)]">{s.dek}</p>
              </StoryLink>
            ))}
          </div>
        </section>
      )}

      {/* VISUAL / VIDEO posters — no fake streams */}
      <section className="px-4 py-20 sm:px-8 lg:px-12">
        <p className="news-kicker text-[var(--n-muted)]">Visual desk</p>
        <h2 className="news-display mt-3 text-5xl sm:text-7xl">Field stills.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {visual[0] && (
            <StoryLink story={visual[0]} className="group relative md:col-span-2 md:row-span-2">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#111] md:aspect-auto md:h-full md:min-h-[420px]">
                <NewsImage src={visual[0].coverImage} alt={visual[0].title} fill className="object-cover" sizes="70vw" />
                <span className="absolute left-4 top-4 border border-white/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white">
                  Watch later
                </span>
              </div>
            </StoryLink>
          )}
          {visual.slice(1, 5).map((s) => (
            <StoryLink key={s.id} story={s} className="group relative">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
                <NewsImage src={s.coverImage} alt={s.title} fill className="object-cover" sizes="33vw" />
              </div>
            </StoryLink>
          ))}
        </div>
      </section>

      {/* AUDIO BRIEFING */}
      <section className="border-t border-[var(--n-line)] px-4 py-20 sm:px-8 lg:px-12">
        <p className="news-kicker text-[var(--n-muted)]">Audio briefing</p>
        <h2 className="news-display mt-3 text-5xl sm:text-7xl">Listen to the desk.</h2>
        <div className="mt-10 space-y-4">
          {audio.map((s) => {
            const on = playing === s.id;
            return (
              <div key={s.id} className="flex flex-wrap items-center gap-4 border border-[var(--n-line)] p-4">
                <button
                  type="button"
                  onClick={() => setPlaying(on ? null : s.id)}
                  className="grid h-12 w-12 place-items-center border border-[var(--n-ink)] text-[10px] font-bold uppercase"
                  aria-label={on ? "Pause briefing" : "Play briefing preview"}
                  data-cursor="PLAY"
                >
                  {on ? "II" : "▶"}
                </button>
                <div className={`news-wave ${on ? "is-playing" : ""}`} aria-hidden>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <span key={i} style={{ height: on ? undefined : "30%" }} />
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-xl leading-snug">{s.title}</p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--n-muted)]">
                    {readingMinutes(s)} min read · {s.region}
                  </p>
                </div>
                <Link href={`/blog/news/${s.slug}`} className="text-[11px] uppercase tracking-[0.2em]" data-cursor="READ">
                  Open
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* DATA — real counts only */}
      <section className="px-4 py-20 sm:px-8 lg:px-12">
        <p className="news-kicker text-[var(--n-muted)]">On the desk</p>
        <h2 className="news-display mt-3 text-5xl sm:text-7xl">Coverage, by the numbers.</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            ["Stories live", String(articles.length)],
            ["Desks", String(NEWS_NAV.length)],
            ["Breaking now", String(articles.filter((a) => a.breaking).length)],
          ].map(([label, value]) => (
            <div key={label} className="border-t border-[var(--n-line)] pt-5">
              <p className="news-display text-6xl">{value}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[var(--n-muted)]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OTHER DESKS */}
      {desks.map(
        (d) =>
          d.items[0] && (
            <section key={d.name} id={`desk-${d.name.toLowerCase()}`} className="border-t border-[var(--n-line)] px-4 py-16 sm:px-8 lg:px-12">
              <h2 className="news-display text-4xl sm:text-6xl">{d.name}</h2>
              <div className="mt-8 grid gap-8 md:grid-cols-3">
                {d.items.map((s) => (
                  <StoryLink key={s.id} story={s}>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--n-muted)]">{s.topic}</p>
                    <h3 className="mt-2 font-serif text-2xl leading-snug">{s.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--n-muted)]">{s.dek}</p>
                  </StoryLink>
                ))}
              </div>
            </section>
          )
      )}

      {/* NEWSLETTER */}
      <section id="subscribe" className="border-t border-[var(--n-line)] px-4 py-24 sm:px-8 lg:px-12">
        <h2 className="news-display text-6xl sm:text-8xl">
          The day
          <br />
          in your
          <br />
          inbox.
        </h2>
        <p className="mt-6 max-w-md text-sm text-[var(--n-muted)]">
          One briefing. No clutter. Subscribe to the Ebenezer News desk.
        </p>
        <NewsletterSignup
          variant="news"
          source="news-home"
          className="mt-10 max-w-lg"
          placeholder="Email"
        />
      </section>

      {/* FOOTER */}
      <footer className="bg-[var(--n-ink)] px-4 py-24 text-[var(--n-paper)] sm:px-8 lg:px-12">
        <h2 className="news-display text-[16vw] leading-[0.85] sm:text-[9vw]">
          STAY
          <br />
          INFORMED.
        </h2>
        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          <div className="space-y-2 text-sm text-white/70">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">Sections</p>
            {NEWS_NAV.map((n) => (
              <a key={n} href={`#desk-${n.toLowerCase()}`} className="block hover:text-white">
                {n}
              </a>
            ))}
          </div>
          <div className="space-y-2 text-sm text-white/70">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">The desk</p>
            <Link href="/blog" className="block hover:text-white">Journal</Link>
            <a href="/api/news/rss" className="block hover:text-white">RSS</a>
            <a href="/api/news/sitemap" className="block hover:text-white">News sitemap</a>
            <a href="/api/news/ical" className="block hover:text-white">iCal</a>
            <Link href="/blog/newsroom/feeds" className="block hover:text-white">Submit to Google &amp; Microsoft</Link>
            <Link href="/blog/newsroom/about" className="block hover:text-white">About</Link>
            <Link href="/blog/newsroom/editorial-policy" className="block hover:text-white">Editorial policy</Link>
            <Link href="/blog/newsroom/contact" className="block hover:text-white">Newsroom contact</Link>
            <Link href="https://ebenezerdigital.com/contact" className="block hover:text-white">Studio contact</Link>
            <a href={`mailto:${SITE_EMAIL}`} className="block hover:text-white">
              {SITE_EMAIL}
            </a>
            <a href={SITE_PHONE_TEL} className="block hover:text-white">
              {SITE_PHONE_DISPLAY}
            </a>
            <a
              href={SITE_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-white"
            >
              WhatsApp
            </a>
          </div>
          <div className="space-y-2 text-sm text-white/70">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">Standards</p>
            <p>Authors, times, and sources are shown on every story.</p>
            <p>We do not invent views, ratings, or follower counts.</p>
            <p className="pt-6 text-xs text-white/40">© {new Date().getFullYear()} Ebenezer News · .info</p>
            <SiteLegalLinks className="mt-3 text-xs text-white/50" linkClassName="hover:text-white" />
          </div>
        </div>
      </footer>
    </>
  );
}
