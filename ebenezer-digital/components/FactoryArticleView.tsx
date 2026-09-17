import Link from "next/link";
import type { FactoryArticle } from "@/lib/content-factory/types";
import { CHANNEL_META } from "@/lib/content-factory/types";
import { indexToSlug } from "@/lib/content-factory/slug";
import { channelArticleCount } from "@/lib/content-factory/matrix";

function renderMarkdownish(content: string) {
  return content.split(/\n\n+/).map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-10 text-2xl font-bold text-white">
          {block.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (block.startsWith("### ")) {
      return (
        <h3 key={i} className="mt-6 text-lg font-semibold text-white/90">
          {block.replace(/^###\s+/, "")}
        </h3>
      );
    }
    if (block.startsWith("- ")) {
      return (
        <ul key={i} className="mt-3 list-disc space-y-1 pl-5 text-white/70">
          {block.split("\n").map((line) => (
            <li key={line}>{line.replace(/^-\s+/, "")}</li>
          ))}
        </ul>
      );
    }
    const withLinks = block.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-emerald-400 underline">$1</a>'
    );
    return (
      <p
        key={i}
        className="mt-4 leading-relaxed text-white/70"
        dangerouslySetInnerHTML={{ __html: withLinks }}
      />
    );
  });
}

export function FactoryArticleView({
  article,
  hubHref,
}: {
  article: FactoryArticle;
  hubHref: string;
}) {
  const meta = CHANNEL_META[article.channel];
  const prev =
    article.index > 0 ? `${meta.basePath}/${indexToSlug(article.channel, article.index - 1)}` : null;
  const next =
    article.index < channelArticleCount(article.channel) - 1
      ? `${meta.basePath}/${indexToSlug(article.channel, article.index + 1)}`
      : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-400/80">{article.category}</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{article.title}</h1>
      <p className="mt-4 text-lg text-white/60">{article.excerpt}</p>
      <article className="prose-invert mt-10 border-t border-white/10 pt-8">{renderMarkdownish(article.content)}</article>
      <nav className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-8 text-sm">
        <Link href={hubHref} className="text-emerald-400 hover:underline">
          ← All {meta.label}
        </Link>
        {prev ? (
          <Link href={prev} className="text-white/60 hover:text-white">
            Previous
          </Link>
        ) : null}
        {next ? (
          <Link href={next} className="text-white/60 hover:text-white">
            Next
          </Link>
        ) : null}
      </nav>
    </main>
  );
}
