import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { loadArticles } from "@/lib/content-engine";
import { pageMetadata } from "@/lib/site-url";
import { InfoShell } from "@/components/info/InfoShell";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return loadArticles("info-guides").map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = loadArticles("info-guides").find((a) => a.slug === params.slug);
  if (!post) return {};
  return pageMetadata({
    title: `${post.title} | Ebenezer Information`,
    description: post.excerpt,
    path: `/info/guides/${post.slug}`,
    index: post.indexable,
  });
}

export default function InfoGuidePage({ params }: Props) {
  const post = loadArticles("info-guides").find((a) => a.slug === params.slug);
  if (!post) notFound();

  return (
    <InfoShell>
      <div className="info-page">
        <p className="text-sm text-[var(--info-muted,#6b7280)]">
          <Link href="/">Home</Link> / Guides
        </p>
        <h1 className="info-title mt-2">{post.title}</h1>
        <p className="info-lead mt-3">{post.excerpt}</p>
        <article className="prose prose-slate mt-8 max-w-none">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </article>
      </div>
    </InfoShell>
  );
}
