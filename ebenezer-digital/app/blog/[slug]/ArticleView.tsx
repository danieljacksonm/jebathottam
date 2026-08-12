"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Share2 } from "lucide-react";
import { JournalNav } from "../components/JournalNav";
import { JournalCursor } from "../components/JournalCursor";
import { JournalProgress } from "../components/JournalProgress";
import { JournalMarquee } from "../components/JournalMarquee";
import { formatDate, readingTime, type JournalPost } from "../lib";
import "../journal.css";

export function ArticleView({ slug }: { slug: string }) {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [stickyTitle, setStickyTitle] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.08]);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data.blogPosts) ? data.blogPosts : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onScroll = () => setStickyTitle(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const post = useMemo(() => posts.find((p) => p.slug === slug) || null, [posts, slug]);
  const related = useMemo(
    () => posts.filter((p) => p.slug !== slug).slice(0, 3),
    [posts, slug]
  );
  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category).filter(Boolean))),
    [posts]
  );

  const paragraphs = useMemo(() => {
    if (!post?.content) return [];
    return post.content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  }, [post]);

  const minutes = readingTime(`${post?.title || ""} ${post?.excerpt || ""} ${post?.content || ""}`);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share && post) {
      await navigator.share({ title: post.title, text: post.excerpt, url });
      return;
    }
    await navigator.clipboard?.writeText(url);
  };

  if (loading) {
    return (
      <div className="journal-root flex min-h-screen items-center justify-center text-[var(--j-muted)]">
        Loading story…
      </div>
    );
  }

  if (!post) {
    return (
      <div className="journal-root min-h-screen px-6 py-28">
        <h1 className="font-serif text-4xl">Story not found</h1>
        <Link href="/blog" className="mt-6 inline-block text-[var(--j-brand)]">
          ← Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="journal-root relative min-h-screen">
      <div className="journal-grain" />
      <JournalProgress />
      <JournalCursor />
      <JournalNav categories={categories} />

      <div
        className={`fixed left-0 right-0 top-16 z-[65] border-b border-[var(--j-line)] bg-[rgba(7,11,16,0.85)] px-4 py-3 backdrop-blur-md transition sm:px-8 ${
          stickyTitle ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <p className="truncate font-serif text-sm sm:text-base">{post.title}</p>
      </div>

      <article>
        <header className="px-4 pb-10 pt-28 sm:px-8 lg:px-12">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--j-brand)]">{post.category}</p>
          <h1 className="mt-5 max-w-5xl font-serif text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
            {post.title}
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] uppercase tracking-[0.22em] text-[var(--j-muted)]">
            <span>{post.author}</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span>{minutes} min read</span>
            <button
              type="button"
              onClick={share}
              className="inline-flex items-center gap-2 text-[var(--j-brand)]"
              data-cursor="→"
            >
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
          </div>
        </header>

        <motion.div style={{ scale: heroScale }} className="relative mx-4 aspect-[21/10] overflow-hidden sm:mx-8 lg:mx-12">
          <Image
            src={post.coverImage || "/images/journal/hero.jpg"}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>

        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <p className="font-serif text-2xl leading-relaxed text-[var(--j-paper)]/90">{post.excerpt}</p>

          <div className="mt-12 space-y-7 text-[1.05rem] leading-8 text-[var(--j-muted)]">
            {paragraphs.map((para, i) => {
              const isQuote =
                ((para.startsWith('"') && para.endsWith('"')) ||
                  (para.startsWith("“") && para.endsWith("”")) ||
                  (para.length < 90 && i > 0 && i % 3 === 0));

              if (isQuote) {
                return (
                  <motion.blockquote
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    className="my-14 border-l-2 border-[var(--j-brand)] pl-6 font-serif text-3xl leading-tight text-[var(--j-paper)] sm:text-4xl"
                  >
                    {para.replace(/^["“]|["”]$/g, "")}
                  </motion.blockquote>
                );
              }

              return (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.5 }}
                  className="whitespace-pre-line"
                >
                  {para}
                </motion.p>
              );
            })}
          </div>

          <div className="mt-16 flex flex-wrap gap-3">
            {(post.tags || []).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--j-line)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--j-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      <JournalMarquee items={["Continue reading", "More ideas", "Next story", "Ebenezer Journal"]} />

      <section className="px-4 py-20 sm:px-8 lg:px-12">
        <h2 className="font-serif text-4xl sm:text-5xl">Continue reading</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.id}
              href={`/blog/${item.slug}`}
              data-cursor="READ"
              className="group relative aspect-[3/4] overflow-hidden"
            >
              <Image
                src={item.coverImage || "/images/journal/hero.jpg"}
                alt={item.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--j-brand)]">{item.category}</p>
                <h3 className="mt-2 font-serif text-2xl leading-tight">{item.title}</h3>
                <span className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-[var(--j-paper)]">
                  Read <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--j-line)] px-4 py-16 sm:px-8 lg:px-12">
        <h3 className="font-serif text-5xl sm:text-7xl">
          SEE YOU
          <br />
          IN THE NEXT STORY.
        </h3>
        <div className="mt-8 flex flex-wrap gap-6 text-sm text-[var(--j-muted)]">
          <Link href="/blog" className="hover:text-[var(--j-brand)]">
            All stories
          </Link>
          <Link href="https://ebenezerdigital.com/contact" className="hover:text-[var(--j-brand)]">
            Work with Ebenezer
          </Link>
        </div>
      </footer>
    </div>
  );
}
