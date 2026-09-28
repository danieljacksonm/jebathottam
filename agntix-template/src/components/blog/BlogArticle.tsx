"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";

const ease = [0.22, 1, 0.36, 1] as const;

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string };

function toBlocks(paragraphs: string[]): Block[] {
  return paragraphs.map((raw) => {
    const text = raw.trim();
    if (text.startsWith("### ")) {
      return { type: "h3", text: text.slice(4).trim() };
    }
    if (text.startsWith("## ")) {
      return { type: "h2", text: text.slice(3).trim() };
    }
    return { type: "p", text };
  });
}

export function BlogArticle({
  backLabel,
  paragraphs,
  tags,
  image,
  imageAlt,
  author,
  date,
  readLabel,
  destinationHref,
  destinationLabel,
  relatedPackages,
  relatedPackagesTitle,
  enquireHref,
  enquireLabel,
  planHref,
  planLabel,
}: {
  backLabel: string;
  paragraphs: string[];
  tags: string[];
  image: string;
  imageAlt: string;
  author?: string;
  date?: string;
  readLabel?: string;
  destinationHref?: string | null;
  destinationLabel?: string | null;
  relatedPackages?: { id: string; title: string; image: string; meta: string }[];
  relatedPackagesTitle?: string;
  enquireHref?: string;
  enquireLabel?: string;
  planHref?: string;
  planLabel?: string;
}) {
  const reduce = useReducedMotion();
  const blocks = toBlocks(paragraphs);
  let inlineImagePlaced = false;

  return (
    <article className="relative mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
      <motion.div
        initial={reduce ? false : { opacity: 0, x: -12 }}
        animate={reduce ? undefined : { opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease }}
      >
        <Link href="/blog" className="text-sm text-gold hover:text-gold-bright">
          ← {backLabel}
        </Link>
      </motion.div>

      {(author || date || readLabel) && (
        <p className="mt-8 text-[0.65rem] uppercase tracking-[0.16em] text-mist">
          {[author, date, readLabel].filter(Boolean).join(" · ")}
        </p>
      )}

      <div className="mt-10 space-y-6">
        {blocks.map((block, i) => {
          const showInline =
            !inlineImagePlaced &&
            block.type === "h2" &&
            i > 4 &&
            i < blocks.length - 4;
          if (showInline) inlineImagePlaced = true;

          return (
            <div key={`${block.type}-${i}-${block.text.slice(0, 20)}`}>
              {showInline ? (
                <motion.div
                  className="relative my-10 aspect-[21/9] overflow-hidden border border-[var(--line)]"
                  initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                  whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.6, ease }}
                >
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    quality={80}
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 768px"
                    unoptimized={image.startsWith("http")}
                  />
                </motion.div>
              ) : null}

              {block.type === "h2" ? (
                <motion.h2
                  className="pt-6 font-display text-3xl text-cream md:text-4xl"
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, ease }}
                >
                  {block.text}
                </motion.h2>
              ) : block.type === "h3" ? (
                <motion.h3
                  className="pt-4 font-display text-2xl text-gold-bright"
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, ease }}
                >
                  {block.text}
                </motion.h3>
              ) : (
                <motion.p
                  className="text-lg leading-relaxed text-soft-gray"
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.5, ease }}
                >
                  {block.text}
                </motion.p>
              )}
            </div>
          );
        })}
      </div>

      {tags.length > 0 ? (
        <motion.div
          className="mt-10 flex flex-wrap gap-2"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease }}
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
      ) : null}

      {destinationHref && destinationLabel ? (
        <p className="mt-8 text-sm text-soft-gray">
          <Link
            href={destinationHref}
            className="text-gold hover:text-gold-bright"
          >
            {destinationLabel} →
          </Link>
        </p>
      ) : null}

      {relatedPackages && relatedPackages.length > 0 ? (
        <section className="mt-14 border-t border-[var(--line)] pt-10">
          <h2 className="font-display text-2xl text-cream">
            {relatedPackagesTitle || "Related packages"}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {relatedPackages.map((pkg) => (
              <Link
                key={pkg.id}
                href={`/packages/${pkg.id}`}
                className="group grid grid-cols-[5.5rem_1fr] gap-3 border border-[var(--line)] bg-[#04101f]/35 p-3 transition hover:border-gold/35"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                    sizes="88px"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[0.58rem] uppercase tracking-[0.12em] text-mist">
                    {pkg.meta}
                  </p>
                  <p className="mt-1 font-display text-lg text-white group-hover:text-gold-bright">
                    {pkg.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {(enquireHref || planHref) && (
        <section className="mt-14 border border-[var(--line)] bg-[#04101f]/45 p-8 text-center">
          <p className="font-script text-2xl text-gold-bright">Canaan</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {enquireHref && enquireLabel ? (
              <Link href={enquireHref} className="btn-gold">
                {enquireLabel}
              </Link>
            ) : null}
            {planHref && planLabel ? (
              <Link href={planHref} className="btn-ghost">
                {planLabel}
              </Link>
            ) : null}
          </div>
        </section>
      )}
    </article>
  );
}
