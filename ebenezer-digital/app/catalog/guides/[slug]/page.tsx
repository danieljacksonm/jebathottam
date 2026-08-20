import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CatalogNav } from "../../components/CatalogNav";
import { getGuideBySlug, getProductById } from "@/lib/catalog/query";

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return { title: "Guide" };
  return {
    title: guide.seoTitle || guide.title,
    description: guide.seoDescription || guide.excerpt,
  };
}

function renderMarkdownLite(content: string) {
  return content.split("\n").map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-8 text-xl font-bold">
          {line.slice(3)}
        </h2>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={i} className="ml-5 list-disc text-[var(--c-ink-2)]">
          {line.slice(2).replace(/\*\*(.*?)\*\*/g, "$1")}
        </li>
      );
    }
    if (/^\d+\.\s/.test(line)) {
      return (
        <li key={i} className="ml-5 list-decimal text-[var(--c-ink-2)]">
          {line.replace(/^\d+\.\s/, "").replace(/\*\*(.*?)\*\*/g, "$1")}
        </li>
      );
    }
    if (!line.trim()) return <br key={i} />;
    const html = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline text-teal-700">$1</a>');
    return (
      <p
        key={i}
        className="mt-3 text-[var(--c-ink-2)] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
      />
    );
  });
}

export default function GuideDetailPage({ params }: Props) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();
  const related = guide.relatedProductIds.map((id) => getProductById(id)).filter(Boolean);

  return (
    <>
      <CatalogNav />
      <article className="c-page py-10 max-w-3xl">
        <p className="text-sm text-[var(--c-muted)]">
          <Link href="/catalog/guides" className="hover:text-[var(--c-brand)]">
            Guides
          </Link>{" "}
          / {guide.title}
        </p>
        <h1 className="mt-3 text-3xl font-bold">{guide.title}</h1>
        <p className="mt-3 text-[var(--c-muted)]">{guide.excerpt}</p>
        <div className="mt-6">{renderMarkdownLite(guide.content)}</div>

        {related.length > 0 ? (
          <section className="mt-12 border-t border-[var(--c-line)] pt-8">
            <h2 className="text-xl font-bold">Related products</h2>
            <ul className="mt-4 space-y-2">
              {related.map((p) =>
                p ? (
                  <li key={p.id}>
                    <Link href={`/catalog/p/${p.slug}`} className="font-semibold text-[var(--c-brand-dk)] hover:underline">
                      {p.name}
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          </section>
        ) : null}
      </article>
    </>
  );
}
