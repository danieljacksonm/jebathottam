import Link from "next/link";
import type { ContentChannel } from "@/lib/content-factory/types";
import { CHANNEL_META, CHANNEL_ARTICLE_TARGET } from "@/lib/content-factory/types";
import { channelArticleCount } from "@/lib/content-factory/matrix";
import { indexToSlug } from "@/lib/content-factory/slug";
import { buildFactoryArticle } from "@/lib/content-factory/build";

export function FactoryHubPage({
  channel,
  page = 1,
  pageSize = 24,
}: {
  channel: ContentChannel;
  page?: number;
  pageSize?: number;
}) {
  const meta = CHANNEL_META[channel];
  const total = channelArticleCount(channel);
  const pages = Math.ceil(total / pageSize);
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * pageSize;

  const samples = Array.from({ length: pageSize }, (_, i) => buildFactoryArticle(channel, start + i)).filter(
    (_, i) => start + i < total
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">{meta.label}</p>
      <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
        {total.toLocaleString()} indexed guides
      </h1>
      <p className="mt-3 max-w-2xl text-white/60">
        Explainer library for Ebenezer {channel} — every guide is indexable, unique, and mapped in XML sitemaps.
        Target corpus: {CHANNEL_ARTICLE_TARGET.toLocaleString()} articles.
      </p>

      <ul className="mt-10 divide-y divide-white/10">
        {samples.map((a) => (
          <li key={a.slug} className="py-4">
            <Link href={`${meta.basePath}/${a.slug}`} className="group block">
              <p className="text-xs text-emerald-400/80">{a.category}</p>
              <h2 className="mt-1 text-lg font-semibold text-white group-hover:text-emerald-300">{a.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-white/55">{a.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>

      <nav className="mt-10 flex flex-wrap items-center gap-3 text-sm">
        {safePage > 1 ? (
          <Link href={`${meta.basePath}?page=${safePage - 1}`} className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:border-emerald-500/40">
            ← Newer
          </Link>
        ) : null}
        <span className="text-white/45">
          Page {safePage} of {pages.toLocaleString()}
        </span>
        {safePage < pages ? (
          <Link href={`${meta.basePath}?page=${safePage + 1}`} className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:border-emerald-500/40">
            Older →
          </Link>
        ) : null}
      </nav>

      <p className="mt-8 text-xs text-white/35">
        Sample slugs: {indexToSlug(channel, 0)}, {indexToSlug(channel, 1)}, … {indexToSlug(channel, total - 1)}
      </p>
    </main>
  );
}
