"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";

export type BlogCardItem = {
  slug: string;
  date: string;
  readMinutes: number;
  title: string;
  excerpt: string;
  tags: string[];
  readLabel: string;
  image: string;
};

type BlogGridLabels = {
  intro: string;
  storiesCount: string;
  readMore: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function BlogGrid({
  posts,
  labels,
}: {
  posts: BlogCardItem[];
  labels: BlogGridLabels;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <motion.div
        className="mb-10 flex flex-wrap items-end justify-between gap-4"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease }}
      >
        <p className="max-w-xl text-sm leading-relaxed text-soft-gray">
          {labels.intro}
        </p>
        <p className="text-[0.65rem] uppercase tracking-[0.16em] text-gold">
          {labels.storiesCount}
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={reduce ? false : { opacity: 0, y: 36 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.75,
              delay: reduce ? 0 : Math.min(i % 9, 8) * 0.05,
              ease,
            }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group relative block overflow-hidden border border-[var(--line)] bg-[rgba(4,22,43,0.55)] transition-[border-color,transform] duration-500 hover:border-gold/40"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04162B] via-transparent to-transparent opacity-80" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="border border-white/15 bg-black/35 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <p className="text-[0.65rem] uppercase tracking-[0.14em] text-mist">
                  {post.date} · {post.readLabel}
                </p>
                <h2 className="mt-3 font-display text-2xl leading-snug text-white transition-colors duration-300 group-hover:text-gold-bright">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                  {post.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-gold">
                  {labels.readMore}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
