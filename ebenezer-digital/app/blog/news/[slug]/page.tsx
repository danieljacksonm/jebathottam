import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllNews, readingMinutes } from "../data";
import { getPublicNewsBySlug, listPublicNews } from "@/lib/news-service";
import { NewsArticleView } from "./NewsArticleView";
import { NEWS_URL, canonicalFor, languageAlternatesFor, SITE_ICONS } from "@/lib/site-url";

type Props = { params: { slug: string } };

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getAllNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getPublicNewsBySlug(params.slug);
  if (!article) return { title: "News | Ebenezer" };
  const modified = article.updatedAt || article.publishedAt;
  return {
    title: `${article.title} | E> News`,
    description: article.dek,
    authors: [{ name: article.sourceLabel }],
    openGraph: {
      title: article.title,
      description: article.dek,
      url: canonicalFor(`/blog/news/${article.slug}`),
      images: article.coverImage ? [article.coverImage] : undefined,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: modified,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.dek,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
    alternates: {
      canonical: canonicalFor(`/blog/news/${article.slug}`),
      languages: languageAlternatesFor(`/blog/news/${article.slug}`),
    },
    icons: SITE_ICONS,
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const article = await getPublicNewsBySlug(params.slug);
  if (!article) notFound();
  const all = await listPublicNews();
  const related = all
    .filter((n) => n.id !== article.id && (n.region === article.region || n.topic === article.topic))
    .slice(0, 4);

  const modified = article.updatedAt || article.publishedAt;
  const canonical = canonicalFor(`/blog/news/${article.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.dek,
    image: article.coverImage,
    datePublished: article.publishedAt,
    dateModified: modified,
    author: { "@type": "Organization", name: article.sourceLabel },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "Ebenezer News",
      url: NEWS_URL,
      logo: {
        "@type": "ImageObject",
        url: `${NEWS_URL}/og-news.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    isBasedOn: article.originalUrl || undefined,
    timeRequired: `PT${readingMinutes(article)}M`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NewsArticleView article={article} related={related} />
    </>
  );
}
