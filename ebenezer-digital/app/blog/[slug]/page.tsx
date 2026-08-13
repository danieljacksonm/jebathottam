import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ArticleView } from "./ArticleView";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await db.getBlogPostBySlug(params.slug);
  if (!post) {
    return { title: "Story not found | Ebenezer Journal" };
  }

  const title = post.seoTitle || `${post.title} | Ebenezer Journal`;
  const description = post.seoDescription || post.excerpt;
  const images = post.coverImage
    ? [{ url: post.coverImage }, ...(post.gallery || []).slice(1, 4).map((url) => ({ url }))]
    : undefined;

  return {
    title,
    description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString?.() || undefined,
      authors: [post.author],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
      types: {
        "application/rss+xml": [{ url: "/api/blog/rss", title: "Ebenezer Journal RSS" }],
      },
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await db.getBlogPostBySlug(params.slug);
  const jsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        author: { "@type": "Person", name: post.author },
        datePublished: post.publishedAt?.toISOString?.() || post.publishedAt,
        dateModified: post.updatedAt?.toISOString?.() || post.updatedAt,
        image: [post.coverImage, ...(post.gallery || [])].filter(Boolean),
        keywords: (post.tags || []).join(", "),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `/blog/${post.slug}`,
        },
        publisher: {
          "@type": "Organization",
          name: "Ebenezer Digital",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ArticleView slug={params.slug} />
    </>
  );
}
