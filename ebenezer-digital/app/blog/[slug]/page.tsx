import type { Metadata } from "next";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { ArticleView } from "./ArticleView";
import { canonicalFor, publishedLanguageAlternates, SITE_ICONS } from "@/lib/site-url";
import { contentKeyFor, resolveLocalizedContent } from "@/lib/i18n/resolve-content";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let post = await db.getBlogPostBySlug(params.slug);
  if (!post) {
    return { title: "Story not found | Ebenezer Journal" };
  }

  const locale = (headers().get("x-eben-locale") || "en").toLowerCase();
  if (locale !== "en") {
    const localized = await resolveLocalizedContent(contentKeyFor("journal", params.slug), locale);
    if (localized) {
      post = {
        ...post,
        title: localized.title,
        excerpt: localized.excerpt,
        seoTitle: localized.metaTitle || localized.title,
        seoDescription: localized.metaDescription || localized.excerpt,
      };
    }
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
    robots: { index: true, follow: true },
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
      languages: publishedLanguageAlternates(path, undefined, "journal"),
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
            url: "https://journal.ebenezerdigital.info/brand/journal-logo.svg",
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
