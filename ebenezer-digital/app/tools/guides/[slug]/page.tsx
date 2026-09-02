import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { loadArticles } from "@/lib/content-engine";
import { pageMetadata } from "@/lib/site-url";
import { SiteLegalLinks } from "@/components/SiteLegalLinks";
import { TOOLS_GUIDES } from "../data";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  const slugs = new Set<string>(TOOLS_GUIDES.map((g) => g.slug));
  for (const a of loadArticles("tools-guides")) slugs.add(a.slug);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const staticGuide = TOOLS_GUIDES.find((g) => g.slug === params.slug);
  const draft = loadArticles("tools-guides").find((a) => a.slug === params.slug);
  const title = draft?.title || staticGuide?.title || "Guide";
  const description = draft?.excerpt || staticGuide?.excerpt || "Ebenezer Tools buying guide";
  return pageMetadata({
    title: `${title} | Ebenezer Tools`,
    description,
    path: `/tools/guides/${params.slug}`,
  });
}

export default function ToolsGuidePage({ params }: Props) {
  const staticGuide = TOOLS_GUIDES.find((g) => g.slug === params.slug);
  const draft = loadArticles("tools-guides").find((a) => a.slug === params.slug);
  if (!staticGuide && !draft) notFound();

  return (
    <div className="aff-page py-10">
      <p className="text-sm text-[var(--aff-muted)]">
        <Link href="/tools" className="hover:text-[var(--aff-brand)]">
          Tools
        </Link>{" "}
        /{" "}
        <Link href="/tools/guides" className="hover:text-[var(--aff-brand)]">
          Guides
        </Link>
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{draft?.title || staticGuide!.title}</h1>
      <p className="mt-3 max-w-2xl text-[var(--aff-muted)]">{draft?.excerpt || staticGuide!.excerpt}</p>

      {draft?.body ? (
        <article className="prose prose-slate mt-8 max-w-none">
          <ReactMarkdown>{draft.body}</ReactMarkdown>
        </article>
      ) : null}

      <div className="mt-10">
        <Link href={staticGuide?.href || "/tools/compare"} className="aff-btn aff-btn-primary">
          Open live comparison →
        </Link>
      </div>

      <SiteLegalLinks className="mt-12 text-xs text-[var(--aff-muted)]" linkClassName="hover:text-[var(--aff-text)]" />
    </div>
  );
}
