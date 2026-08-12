import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ArticleView } from "./ArticleView";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await db.getBlogPostBySlug(params.slug);
  if (!post) {
    return { title: "Story not found | Ebenezer Journal" };
  }

  const title = `${post.title} | Ebenezer Journal`;
  const description = post.excerpt;
  const images = post.coverImage ? [{ url: post.coverImage }] : undefined;

  return {
    title,
    description,
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
        image: post.coverImage,
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
