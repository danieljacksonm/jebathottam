import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ArticleView } from "./ArticleView";
import { canonicalFor, articleLanguageAlternates, SITE_ICONS } from "@/lib/site-url";

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
  const path = `/blog/${post.slug}`;

  return {
    title,
    description,
    keywords: post.tags,
    icons: SITE_ICONS,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: canonicalFor(path),
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
      canonical: canonicalFor(path),
      languages: articleLanguageAlternates(path),
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
          "@id": canonicalFor(`/blog/${post.slug}`),
        },
        publisher: {
          "@type": "Organization",
          name: "Ebenezer Digital",
          logo: {
            "@type": "ImageObject",
            url: "https://ebenezerdigital.info/og-journal.png",
          },
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
