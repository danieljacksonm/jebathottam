import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FactoryArticleView } from "@/components/FactoryArticleView";
import { getFactoryArticle } from "@/lib/content-factory/build";
import { pageMetadata } from "@/lib/site-url";

type Props = { params: { slug: string } };

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: Props): Metadata {
  const article = getFactoryArticle("studio", params.slug);
  if (!article) return { title: "Guide | Ebenezer Digital", robots: { index: false } };
  return pageMetadata({
    title: article.seoTitle,
    description: article.seoDescription,
    path: `/guides/${article.slug}`,
  });
}

export default function StudioGuideArticle({ params }: Props) {
  const article = getFactoryArticle("studio", params.slug);
  if (!article) notFound();
  return <FactoryArticleView article={article} hubHref="/guides" />;
}
