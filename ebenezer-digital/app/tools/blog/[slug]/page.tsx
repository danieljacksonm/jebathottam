import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolsHeader } from "../../ToolsHeader";
import { FactoryArticleView } from "@/components/FactoryArticleView";
import { getFactoryArticle } from "@/lib/content-factory/build";
import { pageMetadata } from "@/lib/site-url";

type Props = { params: { slug: string } };

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: Props): Metadata {
  const article = getFactoryArticle("tools", params.slug);
  if (!article) return { title: "Guide | Ebenezer Tools", robots: { index: false } };
  return pageMetadata({
    title: article.seoTitle,
    description: article.seoDescription,
    path: `/tools/blog/${article.slug}`,
  });
}

export default function ToolsBlogArticle({ params }: Props) {
  const article = getFactoryArticle("tools", params.slug);
  if (!article) notFound();
  return (
    <>
      <ToolsHeader />
      <FactoryArticleView article={article} hubHref="/tools/blog" />
    </>
  );
}
