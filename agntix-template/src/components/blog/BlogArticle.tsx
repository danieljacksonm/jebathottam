"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";

const ease = [0.22, 1, 0.36, 1] as const;

export function BlogArticle({
  backLabel,
  paragraphs,
  tags,
  image,
  imageAlt,
}: {
  backLabel: string;
  paragraphs: string[];
  tags: string[];
  image: string;
  imageAlt: string;
}) {
  const reduce = useReducedMotion();

  return (
    <article className="relative mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
      <motion.div
        initial={reduce ? false : { opacity: 0, x: -12 }}
        animate={reduce ? undefined : { opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <Link href="/blog" className="text-sm text-gold hover:text-gold-bright">
          ← {backLabel}
        </Link>
      </motion.div>

      <div className="mt-10 space-y-6">
        {paragraphs.map((para, i) => (
          <motion.p
            key={`${i}-${para.slice(0, 24)}`}
            className="text-lg leading-relaxed text-soft-gray"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: reduce ? 0 : i * 0.08, ease }}
          >
            {para}
          </motion.p>
        ))}
      </div>

      <motion.div
        className="mt-10 flex flex-wrap gap-2"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="border border-[var(--line)] px-3 py-1 text-xs uppercase tracking-[0.12em] text-mist"
          >
            {tag}
          </span>
        ))}
      </motion.div>

      <motion.div
        className="relative mt-14 aspect-[21/9] overflow-hidden"
        initial={reduce ? false : { opacity: 0, scale: 0.97 }}
        whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.9, ease }}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04162B]/50 to-transparent" />
      </motion.div>
    </article>
  );
}
