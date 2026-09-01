import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { StudioPageShell } from "@/components/studio/StudioPageShell";
import { loadArticles } from "@/lib/content-engine";
import { pageMetadata } from "@/lib/site-url";

export function generateStaticParams() {
  return loadArticles("studio-insights").map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = loadArticles("studio-insights").find((p) => p.slug === params.slug);
  if (!post) return {};
  return pageMetadata({
    title: `${post.title} | Ebenezer Insights`,
    description: post.excerpt,
    path: `/insights/${post.slug}`,
    index: post.indexable,
  });
}

export default function InsightArticlePage({ params }: { params: { slug: string } }) {
  const post = loadArticles("studio-insights").find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <StudioPageShell kicker={post.category} title={post.title} lead={post.excerpt} backHref="/insights" backLabel="All insights">
      <article className="prose prose-invert max-w-none">
        <ReactMarkdown>{post.body}</ReactMarkdown>
      </article>
    </StudioPageShell>
  );
}
