"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { JournalNav } from "./components/JournalNav";
import { JournalProgress } from "./components/JournalProgress";
import { formatDate, readingTime, splitHeadline, type JournalPost } from "./lib";
import { rotateList, useRotate } from "./useRotate";
import { Suspense } from "react";
import {
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site-contact";
import { SITE_NAV } from "@/lib/site-nav";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import "./journal.css";

const PAGE_SIZE = 24;

export default function BlogIndexClient({
  initialPosts = [],
  initialCategories = [],
}: {
  initialPosts?: JournalPost[];
  initialCategories?: string[];
}) {
  return (
    <Suspense fallback={<div className="journal-root min-h-screen bg-[var(--j-ink)]" />}>
      <BlogIndexInner initialPosts={initialPosts} initialCategories={initialCategories} />
    </Suspense>
  );
}

function BlogIndexInner({
  initialPosts = [],
  initialCategories = [],
}: {
  initialPosts?: JournalPost[];
  initialCategories?: string[];
}) {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<JournalPost[]>(initialPosts);
  const [loading, setLoading] = useState(!initialPosts.length);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [apiCategories, setApiCategories] = useState<string[]>(initialCategories);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : 80]);
  const heroScale = useTransform(scrollY, [0, 600], [1, reduceMotion ? 1 : 1.06]);
  const heroOpacity = useTransform(scrollY, [0, 420], [1, reduceMotion ? 1 : 0.5]);

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (activeCategory && activeCategory !== "ALL") params.set("cat", activeCategory);
    params.set("limit", "48");
    fetch(`/api/blog/list?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setPosts(Array.isArray(data.posts) ? data.posts : []);
        if (Array.isArray(data.categories) && data.categories.length) {
          setApiCategories(data.categories);
        }
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [query, activeCategory]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, activeCategory]);

  const categories = useMemo(() => {
    if (apiCategories.length) return apiCategories;
    const set = new Set(posts.map((p) => p.category).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts, apiCategories]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q));
      const matchesCat = activeCategory === "ALL" || p.category === activeCategory;
      return matchesQuery && matchesCat;
    });
  }, [posts, query, activeCategory]);

  const rotate = useRotate(filtered.length, 120000);
  const rotated = useMemo(() => rotateList(filtered, rotate), [filtered, rotate]);
  const featured = rotated[0];
  const trending = rotated.slice(1, 7);
  const stream = rotated.slice(7, 7 + visible);
  const latest = rotated.slice(7 + visible, 7 + visible + visible);
  const hasMore = 7 + visible + visible < rotated.length;

  return (
    <div className="journal-root relative min-h-screen">
      <div className="journal-grain" />
      <JournalProgress />
      <JournalNav
        categories={categories}
        onSearch={setQuery}
        onCategory={(cat) => setActiveCategory(cat)}
      />

      {/* CINEMATIC INTRO */}
      <section className="journal-hero relative min-h-[72svh] max-h-[820px] overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <Image
            src={featured?.coverImage || "/images/journal/hero.jpg"}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[var(--j-ink)]" />
          <div className="journal-hero-glow pointer-events-none absolute inset-0" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 flex h-full flex-col justify-end px-4 pb-16 sm:px-8 lg:px-12"
        >
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <p className="text-[11px] uppercase tracking-[0.45em] text-[var(--j-brand)]">
              Ebenezer Digital Journal
            </p>
            <span className="hidden h-px w-10 bg-[var(--j-gold)]/50 sm:block" />
            <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--j-muted)]">
              Deep guides · Technology · Business · AI
            </p>
          </div>
          <motion.h1
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            className="journal-hero-title max-w-5xl font-serif text-[14vw] leading-[0.88] tracking-tight sm:text-[9vw] lg:text-[7.5vw]"
          >
            {["DEEP", "GUIDES,", "INSIGHT."].map((line) => (
              <motion.span
                key={line}
                variants={{
                  hidden: { y: "110%", opacity: 0 },
                  show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="block overflow-hidden"
              >
                <span className="block">{line}</span>
              </motion.span>
            ))}
          </motion.h1>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-lg text-base leading-relaxed text-[var(--j-muted)] sm:text-lg">
              Practical tutorials, technology analysis, and business explainers — written for professionals who need clarity.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#featured" className="journal-cta" data-cursor="SCROLL">
                Read featured
              </a>
              <a href="#stream" className="journal-cta journal-cta-ghost" data-cursor="SCROLL">
                Latest guides
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURED STORY */}
      <section id="featured" className="px-4 py-20 sm:px-8 lg:px-12">
        {loading && <p className="text-[var(--j-muted)]">Loading journal…</p>}
        {!loading && !featured && (
          <p className="text-[var(--j-muted)]">No published stories yet.</p>
        )}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group journal-feature block" data-cursor="READ">
            <div className="grid items-end gap-8 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="relative aspect-[16/11] overflow-hidden bg-[#111] journal-feature-frame">
                <Image
                  src={featured.coverImage || "/images/journal/hero.jpg"}
                  alt={featured.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>
              <div className="pb-2">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--j-brand)]">
                  {featured.category}
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                  {splitHeadline(featured.title).map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--j-muted)]">
                  {featured.excerpt}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-[var(--j-muted)]">
                  <span>{readingTime(`${featured.title} ${featured.excerpt}`)} min read</span>
                  <span>{formatDate(featured.publishedAt)}</span>
                  <span className="inline-flex items-center gap-2 text-[var(--j-brand)]">
                    Explore Story <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}
      </section>

      {/* CATEGORY WALL */}
      <section className="relative overflow-hidden border-y border-[var(--j-line)] px-4 py-20 sm:px-8 lg:px-12">
        {activeCategory !== "ALL" && filtered[0]?.coverImage && (
          <div className="pointer-events-none absolute inset-0 opacity-25">
            <Image
              src={filtered[0].coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[var(--j-ink)]/70" />
          </div>
        )}
        <div className="relative">
          <p className="mb-8 text-[11px] uppercase tracking-[0.35em] text-[var(--j-muted)]">Explore</p>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {["ALL", ...categories].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                data-cursor="VIEW"
                className={`font-serif text-4xl transition sm:text-5xl lg:text-6xl ${
                  activeCategory === cat ? "text-[var(--j-brand)]" : "text-[var(--j-paper)]/35 hover:text-[var(--j-paper)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* HORIZONTAL TRENDING */}
      {trending.length > 1 && (
        <section className="py-16">
          <div className="mb-8 flex items-end justify-between px-4 sm:px-8 lg:px-12">
            <h3 className="font-serif text-3xl sm:text-4xl">What we&apos;re reading</h3>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--j-muted)]">Drag / swipe</p>
          </div>
          <div className="flex gap-4 overflow-x-auto px-4 pb-4 sm:px-8 lg:px-12 snap-x snap-mandatory">
            {trending.map((post, i) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                data-cursor="READ"
                className={`group relative shrink-0 snap-start overflow-hidden ${
                  i % 3 === 0 ? "w-[78vw] sm:w-[420px]" : "w-[68vw] sm:w-[320px]"
                } ${i % 2 === 0 ? "aspect-[3/4]" : "aspect-[4/5]"}`}
              >
                <Image
                  src={post.coverImage || "/images/journal/hero.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="420px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--j-brand)]">{post.category}</p>
                  <h4 className="mt-2 font-serif text-2xl leading-tight">{post.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="border-y border-[var(--j-line)] px-4 py-16 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--j-brand)]">Topics</p>
            <h3 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.05] sm:text-5xl">
              Technology, business, and digital transformation.
            </h3>
            <p className="mt-5 max-w-lg text-[var(--j-muted)]">
              Guides and explainers for teams adopting new tools, workflows, and AI — without the hype.
            </p>
          </div>
          <a
            href="/api/blog/rss"
            className="inline-flex min-h-[48px] items-center gap-2 border border-[var(--j-brand)] px-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--j-brand)]"
          >
            Journal RSS <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="border-y border-[var(--j-line)] px-4 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--j-brand)]">Also available</p>
            <h3 className="mt-3 max-w-xl font-serif text-3xl leading-[1.1] sm:text-4xl">
              Want today&apos;s news?
            </h3>
            <p className="mt-3 max-w-lg text-[var(--j-muted)]">
              Current stories live on Ebenezer News — separate from the Journal.
            </p>
          </div>
          <a
            href={SITE_NAV.news}
            className="inline-flex min-h-[48px] items-center gap-2 border border-[var(--j-brand)] px-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--j-brand)] transition hover:bg-[var(--j-brand)] hover:text-[#04110c]"
            data-cursor="NEWS"
          >
            Read Today&apos;s News <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* EDITORIAL STREAM */}
      <section id="stream" className="px-4 py-20 sm:px-8 lg:px-12">
        <h3 className="mb-12 font-serif text-3xl sm:text-5xl">The editorial stream</h3>
        <div className="space-y-16">
          {stream.map((post, i) => {
            const mode = i % 5;
            if (mode === 2) {
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  data-cursor="READ"
                  className="group relative block aspect-[21/9] overflow-hidden"
                >
                  <Image
                    src={post.coverImage || "/images/journal/hero.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-black/45" />
                  <div className="absolute inset-0 flex items-end p-6 sm:p-10">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--j-brand)]">{post.category}</p>
                      <h4 className="mt-3 max-w-3xl font-serif text-3xl sm:text-5xl">{post.title}</h4>
                    </div>
                  </div>
                </Link>
              );
            }

            const reverse = mode === 1;
            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                data-cursor="READ"
                className={`group grid gap-6 md:grid-cols-2 md:items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div className={`relative overflow-hidden ${mode === 3 ? "aspect-[4/5]" : "aspect-[16/11]"}`}>
                  <Image
                    src={post.coverImage || "/images/journal/hero.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className={reverse ? "md:pr-8" : "md:pl-8"}>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--j-brand)]">{post.category}</p>
                  <h4 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">{post.title}</h4>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--j-muted)]">{post.excerpt}</p>
                  <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-[var(--j-muted)]">
                    {post.author} · {readingTime(`${post.title} ${post.excerpt}`)} min
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        {hasMore && (
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="border border-[var(--j-brand)] px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-[var(--j-brand)]"
              data-cursor="MORE"
            >
              Load more lessons ({Math.max(0, rotated.length - 7 - visible)} left)
            </button>
          </div>
        )}
      </section>

      {/* LATEST NUMBERED */}
      <section className="border-t border-[var(--j-line)] px-4 py-20 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-serif text-3xl sm:text-5xl">Latest stories</h3>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--j-muted)]">
            {latest.length} more · rotates every 10s
          </p>
        </div>
        <div className="divide-y divide-[var(--j-line)]">
          {latest.map((post, i) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              data-cursor="READ"
              className="group grid grid-cols-[auto_1fr] items-center gap-4 py-7 sm:grid-cols-[auto_1fr_auto_auto] sm:gap-8"
            >
              <span className="font-serif text-3xl text-[var(--j-brand)] transition group-hover:scale-110 sm:text-5xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--j-muted)]">{post.category}</p>
                <h4 className="mt-2 truncate font-serif text-2xl sm:text-3xl">{post.title}</h4>
                <p className="mt-2 hidden text-sm text-[var(--j-muted)] sm:line-clamp-1">{post.excerpt}</p>
              </div>
              <div className="relative hidden h-20 w-0 overflow-hidden transition-all duration-500 group-hover:w-36 sm:block">
                <Image
                  src={post.coverImage || "/images/journal/hero.jpg"}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="144px"
                />
              </div>
              <ArrowUpRight className="hidden h-5 w-5 text-[var(--j-brand)] transition group-hover:translate-x-1 group-hover:-translate-y-1 sm:block" />
            </Link>
          ))}
        </div>
        {hasMore && (
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="mt-10 text-[11px] uppercase tracking-[0.22em] text-[var(--j-brand)]"
          >
            Show more →
          </button>
        )}
      </section>

      {/* WHY WE EXIST */}
      <section className="px-4 py-24 sm:px-8 lg:px-12">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--j-brand)]">Why we exist</p>
        <h3 className="mt-6 max-w-4xl font-serif text-4xl leading-[1.05] sm:text-6xl">
          We build digital systems.
          <br />
          We publish useful ideas.
        </h3>
        <p className="mt-8 max-w-xl text-[var(--j-muted)]">
          Ebenezer Digital helps businesses with websites, shop systems, and digital operations —
          then shares practical stories so more people can grow online with clarity.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            ["01", "Clear craft"],
            ["02", "Human writing"],
            ["03", "Useful outcomes"],
          ].map(([n, t]) => (
            <div key={n} className="border-t border-[var(--j-line)] pt-5">
              <p className="text-[var(--j-brand)]">{n}</p>
              <p className="mt-2 font-serif text-2xl">{t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative overflow-hidden border-t border-[var(--j-line)] px-4 py-24 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_45%)]" />
        <div className="relative">
          <h3 className="font-serif text-[12vw] leading-[0.85] sm:text-[8vw]">
            KEEP
            <br />
            READING.
          </h3>
          <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <NewsletterSignup
              variant="journal"
              source="journal-footer"
              placeholder="Email for new stories"
            />
            <div className="text-sm text-[var(--j-muted)]">
              <Link href="https://ebenezerdigital.com" className="block text-[var(--j-paper)] hover:text-[var(--j-brand)]">
                Ebenezer Digital Studio
              </Link>
              <Link href="https://ebenezerdigital.com/contact" className="mt-2 block hover:text-[var(--j-brand)]">
                Contact
              </Link>
              <a href={`mailto:${SITE_EMAIL}`} className="mt-2 block hover:text-[var(--j-brand)]">
                {SITE_EMAIL}
              </a>
              <a href={SITE_PHONE_TEL} className="mt-1 block hover:text-[var(--j-brand)]">
                {SITE_PHONE_DISPLAY}
              </a>
              <a
                href={SITE_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block hover:text-[var(--j-brand)]"
              >
                WhatsApp
              </a>
              <p className="mt-8 text-xs">© {new Date().getFullYear()} Ebenezer Digital Journal</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
