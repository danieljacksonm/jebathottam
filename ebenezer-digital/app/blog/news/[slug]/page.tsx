import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getAllNews, readingMinutes } from "../data";
import { getPublicNewsBySlug, listPublicNews } from "@/lib/news-service";
import { NewsArticleView } from "./NewsArticleView";
import { NEWS_URL, SITE_ICONS } from "@/lib/site-url";
import { inferNewsSourceType, newsPublicUrl, sourceTypeLabel } from "@/lib/news-url";

type Props = { params: { slug: string } };

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getAllNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getPublicNewsBySlug(params.slug);
  if (!article) return { title: "News | Ebenezer" };
  const modified = article.updatedAt || article.publishedAt;
  const canonical = newsPublicUrl(article.region, article.slug);
  const locale = (headers().get("x-eben-locale") || "en").toLowerCase();
  const indexable = locale === "en";
  return {
    title: article.seoTitle || `${article.title} | E> News`,
    description: article.seoDescription || article.dek,
    authors: [{ name: article.sourceLabel }],
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title: article.title,
      description: article.dek,
      url: canonical,
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
      canonical,
      languages: {
        en: canonical,
        "x-default": canonical,
      },
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
  const canonical = newsPublicUrl(article.region, article.slug);
  const sourceType = inferNewsSourceType(article);
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
    genre: sourceTypeLabel(sourceType),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NewsArticleView article={{ ...article, sourceType }} related={related} />
    </>
  );
}
