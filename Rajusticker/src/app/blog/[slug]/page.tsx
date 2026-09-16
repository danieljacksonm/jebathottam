import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/blog";
import { getProductBySlug } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FAQ } from "@/components/ui/FAQ";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seoTitle,
    description: post.seoDescription,
    path: `/blog/${post.slug}`,
    image: post.image,
    type: "article",
  });
}

function renderContent(content: string) {
  const blocks = content.trim().split(/\n{2,}/);
  return blocks.map((block, index) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={index} className="font-display text-xl text-white mt-6 mb-2">
          {trimmed.replace(/^### /, "")}
        </h3>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={index} className="font-display text-2xl text-white mt-8 mb-3">
          {trimmed.replace(/^## /, "")}
        </h2>
      );
    }
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").map((l) => l.replace(/^- /, ""));
      return (
        <ul key={index} className="list-disc pl-5 space-y-1 my-3">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n");
      return (
        <ol key={index} className="list-decimal pl-5 space-y-1 my-3">
          {items.map((item) => (
            <li key={item}>{item.replace(/^\d+\.\s/, "")}</li>
          ))}
        </ol>
      );
    }
    return (
      <p key={index} className="my-3">
        {trimmed}
      </p>
    );
  });
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const relatedArticles = getRelatedPosts(post, 3);
  const relatedProducts = (
    await Promise.all(post.relatedProductSlugs.map((s) => getProductBySlug(s)))
  ).filter(Boolean);

  return (
    <article className="container-x py-8 sm:py-12">
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          excerpt: post.excerpt,
          image: post.image,
          date: post.date,
          author: post.author,
          slug: post.slug,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      {post.faq && <JsonLd data={faqJsonLd(post.faq)} />}

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <header className="max-w-3xl mb-8">
        <p className="text-xs text-[var(--text-subtle)] mb-3">
          {post.author} · {post.date} · {post.readingTime}
        </p>
        <h1 className="font-display text-3xl sm:text-5xl text-white">{post.title}</h1>
        <p className="mt-4 text-[var(--text-muted)] text-lg">{post.excerpt}</p>
      </header>

      <div className="relative aspect-[21/9] mb-10 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-muted)]">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="prose-article">{renderContent(post.content)}</div>

      {relatedProducts.length > 0 && (
        <section className="mt-14">
          <h2 className="section-title text-2xl mb-6">Related Products</h2>
          <ProductGrid products={relatedProducts as NonNullable<(typeof relatedProducts)[number]>[]} />
        </section>
      )}

      {post.faq && (
        <section className="mt-14">
          <FAQ items={post.faq} />
        </section>
      )}

      <section className="mt-14">
        <h2 className="section-title text-2xl mb-6">Related Articles</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {relatedArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="card-surface p-4 hover:border-[var(--border-strong)] transition-colors"
            >
              <p className="text-xs text-[var(--text-subtle)] mb-2">{article.readingTime}</p>
              <h3 className="font-display text-xl">{article.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
