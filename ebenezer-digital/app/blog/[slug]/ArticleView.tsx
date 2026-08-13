"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Share2, Sparkles } from "lucide-react";
import { JournalNav } from "../components/JournalNav";
import { JournalCursor } from "../components/JournalCursor";
import { JournalProgress } from "../components/JournalProgress";
import { JournalMarquee } from "../components/JournalMarquee";
import { GoogleTranslateBar } from "../components/GoogleTranslateBar";
import { formatDate, readingTime, type JournalPost } from "../lib";
import { STORE_PRODUCTS } from "@/app/products/data";
import "../journal.css";

type RelatedLite = Pick<JournalPost, "id" | "title" | "slug" | "excerpt" | "coverImage" | "category" | "author" | "publishedAt">;

function renderBlocks(content: string) {
  const blocks = content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return blocks.map((para, i) => {
    if (para.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-14 font-serif text-3xl text-[var(--j-paper)] sm:text-4xl">
          {para.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (para.startsWith("### ")) {
      return (
        <h3 key={i} className="mt-10 font-serif text-2xl text-[var(--j-paper)]">
          {para.replace(/^###\s+/, "")}
        </h3>
      );
    }
    if (para.startsWith("**Myth:") || para.startsWith("**Truth:")) {
      return (
        <p key={i} className="whitespace-pre-line text-[var(--j-paper)]/90">
          {para.replace(/\*\*/g, "")}
        </p>
      );
    }
    return (
      <motion.p
        key={i}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.45 }}
        className="whitespace-pre-line"
      >
        {para}
      </motion.p>
    );
  });
}

export function ArticleView({ slug }: { slug: string }) {
  const [post, setPost] = useState<JournalPost | null>(null);
  const [related, setRelated] = useState<RelatedLite[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [stickyTitle, setStickyTitle] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.08]);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch(`/api/blog/${encodeURIComponent(slug)}`).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/content").then((r) => r.json()).catch(() => ({ blogPosts: [] })),
    ])
      .then(([detail, content]) => {
        if (!alive) return;
        if (detail?.post) {
          const p = detail.post as JournalPost & { publishedAt?: string | Date };
          setPost({
            ...p,
            publishedAt:
              typeof p.publishedAt === "string"
                ? p.publishedAt
                : p.publishedAt
                  ? new Date(p.publishedAt).toISOString()
                  : undefined,
          });
          setRelated(Array.isArray(detail.related) ? detail.related : []);
        } else {
          setPost(null);
        }
        const list = (Array.isArray(content?.blogPosts) ? content.blogPosts : []) as JournalPost[];
        const cats: string[] = Array.from(
          new Set(list.map((x) => x.category).filter((c): c is string => Boolean(c)))
        );
        setCategories(cats);
      })
      .catch(() => {
        if (alive) setPost(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  useEffect(() => {
    const onScroll = () => setStickyTitle(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const gallery = useMemo(() => {
    const imgs = post?.gallery?.filter(Boolean) || [];
    if (imgs.length >= 5) return imgs.slice(0, 6);
    if (post?.coverImage) return [post.coverImage, ...imgs].slice(0, 6);
    return imgs;
  }, [post]);

  const products = useMemo(() => {
    const slugs = post?.promoteProducts || [];
    return slugs
      .map((s) => STORE_PRODUCTS.find((p) => p.slug === s))
      .filter(Boolean)
      .slice(0, 3);
  }, [post]);

  const minutes = readingTime(`${post?.title || ""} ${post?.excerpt || ""} ${post?.content || ""}`);

  const aiHref = useMemo(() => {
    const q = post?.aiPrompt || `Explain "${post?.title || ""}" simply for a Class 5 student in India.`;
    return `/ai?prefill=${encodeURIComponent(q)}`;
  }, [post]);

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
      <GoogleTranslateBar />
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

        <motion.div style={{ scale: heroScale }} className="relative mx-4 aspect-[21/10] overflow-hidden bg-[#111] sm:mx-8 lg:mx-12">
          <Image
            src={post.coverImage || "/images/journal/hero.jpg"}
            alt={post.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>

        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <p className="font-serif text-2xl leading-relaxed text-[var(--j-paper)]/90">{post.excerpt}</p>

          <div className="mt-12 space-y-7 text-[1.05rem] leading-8 text-[var(--j-muted)]">
            {post.content ? renderBlocks(post.content) : null}
          </div>

          {gallery.length >= 5 && (
            <section className="mt-16">
              <h2 className="font-serif text-3xl text-[var(--j-paper)]">Picture gallery</h2>
              <p className="mt-2 text-sm text-[var(--j-muted)]">
                Related stock photos so you can see the idea, not only read it.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {gallery.map((src, i) => (
                  <div key={src + i} className={`relative overflow-hidden ${i === 0 ? "sm:col-span-2 aspect-[21/9]" : "aspect-[4/3]"}`}>
                    <Image
                      src={src}
                      alt={`${post.title} — visual ${i + 1}`}
                      fill
                      className="object-cover object-center"
                      sizes={i === 0 ? "100vw" : "50vw"}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <aside className="mt-16 border border-[var(--j-line)] bg-[rgba(16,185,129,0.06)] p-6 sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--j-brand)]">Know more with AI</p>
            <h2 className="mt-3 font-serif text-3xl text-[var(--j-paper)]">Still curious?</h2>
            <p className="mt-3 text-[var(--j-muted)]">
              This lesson is written for clear understanding. For more examples, local Indian life stories, or harder words explained gently, open Ebenezer AI.
            </p>
            <Link
              href={aiHref}
              data-cursor="AI"
              className="mt-6 inline-flex items-center gap-2 bg-[var(--j-brand)] px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-black"
            >
              <Sparkles className="h-4 w-4" /> Ask Ebenezer AI
            </Link>
          </aside>

          {products.length > 0 && (
            <aside className="mt-10 border border-[var(--j-line)] p-6 sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--j-brand)]">Build next</p>
              <h2 className="mt-3 font-serif text-3xl text-[var(--j-paper)]">Tools that grow with learning</h2>
              <p className="mt-3 text-sm text-[var(--j-muted)]">
                Every lesson points you toward useful Ebenezer products — kits, playbooks, and SaaS.
              </p>
              <ul className="mt-6 space-y-4">
                {products.map((p) =>
                  p ? (
                    <li key={p.slug}>
                      <Link href={`/products/${p.slug}`} className="group flex items-start justify-between gap-4" data-cursor="SHOP">
                        <div>
                          <p className="font-serif text-xl text-[var(--j-paper)] group-hover:text-[var(--j-brand)]">{p.name}</p>
                          <p className="mt-1 text-sm text-[var(--j-muted)]">{p.tagline}</p>
                        </div>
                        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--j-brand)]" />
                      </Link>
                    </li>
                  ) : null
                )}
              </ul>
              <Link href="/products" className="mt-6 inline-block text-[11px] uppercase tracking-[0.22em] text-[var(--j-brand)]">
                Browse all products →
              </Link>
            </aside>
          )}

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

      <JournalMarquee items={["Continue the chain", "Next lesson", "Ask AI", "Ebenezer Journal"]} />

      <section className="px-4 py-20 sm:px-8 lg:px-12">
        <h2 className="font-serif text-4xl sm:text-5xl">Continue the chain</h2>
        <p className="mt-3 max-w-2xl text-[var(--j-muted)]">
          Linked lessons help you go deeper—one simple idea at a time.
        </p>
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
          <Link href="/ai" className="hover:text-[var(--j-brand)]">
            Ebenezer AI
          </Link>
          <Link href="/products" className="hover:text-[var(--j-brand)]">
            Store
          </Link>
          <a href="/api/blog/rss" className="hover:text-[var(--j-brand)]">
            RSS feed
          </a>
        </div>
      </footer>
    </div>
  );
}
