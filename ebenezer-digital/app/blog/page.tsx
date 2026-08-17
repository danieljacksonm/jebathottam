"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { JournalNav } from "./components/JournalNav";
import { JournalCursor } from "./components/JournalCursor";
import { JournalProgress } from "./components/JournalProgress";
import { JournalMarquee } from "./components/JournalMarquee";
import { GoogleTranslateBar } from "./components/GoogleTranslateBar";
import { formatDate, readingTime, splitHeadline, type JournalPost } from "./lib";
import { rotateList, useRotate } from "./useRotate";
import {
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site-contact";
import "./journal.css";

const PAGE_SIZE = 24;

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 120]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.12]);
  const heroOpacity = useTransform(scrollY, [0, 420], [1, 0.35]);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data.blogPosts) ? data.blogPosts : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, activeCategory]);

  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts]);

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

  const learnCount = useMemo(
    () => posts.filter((p) => (p.category || "").toLowerCase().includes("learn")).length,
    [posts]
  );

  const rotate = useRotate(filtered.length, 10000);
  const rotated = useMemo(() => rotateList(filtered, rotate), [filtered, rotate]);
  const featured = rotated[0];
  const trending = rotated.slice(1, 7);
  const stream = rotated.slice(7, 7 + visible);
  const latest = rotated.slice(7 + visible, 7 + visible + visible);
  const hasMore = 7 + visible + visible < rotated.length;

  return (
    <div className="journal-root relative min-h-screen">
      <GoogleTranslateBar />
      <div className="journal-grain" />
      <JournalProgress />
      <JournalCursor />
      <JournalNav
        categories={categories}
        onSearch={setQuery}
        onCategory={(cat) => setActiveCategory(cat)}
      />

      {/* CINEMATIC INTRO */}
      <section className="relative h-[100svh] overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <Image
            src={featured?.coverImage || "/images/journal/hero.jpg"}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-[var(--j-ink)]" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 flex h-full flex-col justify-end px-4 pb-16 sm:px-8 lg:px-12"
        >
          <p className="mb-6 text-[11px] uppercase tracking-[0.45em] text-[var(--j-brand)]">
            Ebenezer Journal / {learnCount > 0 ? `${learnCount}+ learn stories` : "Learn Desk"}
          </p>
          <motion.h1
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            className="max-w-5xl font-serif text-[14vw] leading-[0.9] tracking-tight sm:text-[9vw] lg:text-[7.5vw]"
          >
            {["LEARN", "DIGITAL", "SIMPLY."].map((line) => (
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
          <div className="mt-10 flex items-end justify-between gap-6">
            <p className="max-w-md text-sm text-[var(--j-muted)]">
              How electricity, Wi‑Fi, AI, and the internet work—written so a Class 5 student can follow. Then explore more with{" "}
              <Link href="/ai" className="text-[var(--j-brand)]">
                Ebenezer AI
              </Link>
              .
            </p>
            <a
              href="#featured"
              className="text-[10px] uppercase tracking-[0.35em] text-[var(--j-paper)]"
              data-cursor="SCROLL"
            >
              Scroll
              <span className="mt-2 block h-10 w-px bg-[var(--j-brand)]" />
            </a>
          </div>
        </motion.div>
      </section>

      <JournalMarquee
        items={["Ebenezer Digital", "Ideas", "Stories", "Perspectives", "Digital Culture", "Journal"]}
      />

      {/* FEATURED STORY */}
      <section id="featured" className="px-4 py-20 sm:px-8 lg:px-12">
        {loading && <p className="text-[var(--j-muted)]">Loading journal…</p>}
        {!loading && !featured && (
          <p className="text-[var(--j-muted)]">No published stories yet.</p>
        )}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group block" data-cursor="READ">
            <div className="grid items-end gap-8 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="relative aspect-[16/11] overflow-hidden bg-[#111]">
                <Image
                  src={featured.coverImage || "/images/journal/hero.jpg"}
                  alt={featured.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
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

      <JournalMarquee items={["Stories", "Perspectives", "Digital", "Business", "Faith in craft"]} />

      {/* WORLD NEWS TEASER */}
      <section className="border-y border-[var(--j-line)] px-4 py-20 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--j-brand)]">Learn desk</p>
            <h3 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.05] sm:text-6xl">
              1000+ simple digital lessons.
            </h3>
            <p className="mt-5 max-w-lg text-[var(--j-muted)]">
              From electricity and Wi‑Fi to AI and cloud—each story chains to the next, links to /ai for deeper questions, and points you to store tools when you are ready to build.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/ai"
              className="inline-flex min-h-[48px] items-center gap-2 bg-[var(--j-brand)] px-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#04110c]"
              data-cursor="AI"
            >
              Ask AI <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href="/api/blog/rss"
              className="inline-flex min-h-[48px] items-center gap-2 border border-[var(--j-brand)] px-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--j-brand)]"
              data-cursor="RSS"
            >
              Blog RSS <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* WORLD NEWS TEASER */}
      <section className="border-y border-[var(--j-line)] px-4 py-20 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--j-brand)]">E&gt; News</p>
            <h3 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.05] sm:text-6xl">
              What is happening.
              <br />
              What matters.
            </h3>
            <p className="mt-5 max-w-lg text-[var(--j-muted)]">
              A living world newsroom — not a newspaper clone. Open the desk for breaking, live, India, and long reads.
            </p>
          </div>
          <Link
            href="/blog/news"
            className="inline-flex min-h-[48px] items-center gap-2 border border-[var(--j-brand)] px-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--j-brand)] transition hover:bg-[var(--j-brand)] hover:text-[#04110c]"
            data-cursor="NEWS"
          >
            Open newsroom <ArrowUpRight className="h-4 w-4" />
          </Link>
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
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                type="email"
                required
                placeholder="Email for new stories"
                className="min-h-[52px] flex-1 border border-[var(--j-line)] bg-transparent px-4 text-sm outline-none focus:border-[var(--j-brand)]"
              />
              <button
                type="submit"
                className="min-h-[52px] bg-[var(--j-brand)] px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#04110c]"
                data-cursor="→"
              >
                Subscribe
              </button>
            </form>
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
