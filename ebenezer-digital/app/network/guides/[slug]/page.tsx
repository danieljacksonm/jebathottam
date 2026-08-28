import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getGuide, NETWORK_GUIDES } from "@/lib/network/guides";
import { getToolBySlug } from "@/lib/network/registry";
import { NETWORK_URL } from "@/lib/site-url";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return NETWORK_GUIDES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const guide = getGuide(params.slug);
  if (!guide) return { title: "Guide" };
  return {
    title: guide.seoTitle,
    description: guide.seoDescription,
    alternates: { canonical: `${NETWORK_URL}/guides/${guide.slug}` },
    openGraph: {
      title: guide.seoTitle,
      description: guide.seoDescription,
      url: `${NETWORK_URL}/guides/${guide.slug}`,
    },
  };
}

export default function GuidePage({ params }: Props) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();
  const related = guide.relatedToolSlugs.map((s) => getToolBySlug(s)).filter(Boolean);

  return (
    <article className="nx-page py-10 max-w-3xl">
      <p className="text-sm text-[var(--nx-muted)]">
        <Link href="/network/guides" className="hover:text-[var(--nx-brand)]">
          Guides
        </Link>{" "}
        / {guide.category}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{guide.title}</h1>
      <p className="mt-2 text-[var(--nx-muted)]">{guide.excerpt}</p>
      <p className="mt-2 text-xs text-[var(--nx-muted)]">Updated {guide.updatedAt}</p>
      <div className="nx-prose mt-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{guide.content}</ReactMarkdown>
      </div>
      {related.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-bold">Related tools</h2>
          <ul className="mt-3 space-y-2">
            {related.map((t) =>
              t ? (
                <li key={t.slug}>
                  <Link href={`/network/tools/${t.slug}`} className="font-semibold text-[var(--nx-brand)] hover:underline">
                    {t.name}
                  </Link>
                  <span className="text-sm text-[var(--nx-muted)]"> — {t.description}</span>
                </li>
              ) : null
            )}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
