import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FactoryArticleView } from "@/components/FactoryArticleView";
import { getFactoryArticle } from "@/lib/content-factory/build";
import { EcosystemNav } from "@/components/EcosystemNav";
import { pageMetadata } from "@/lib/site-url";

type Props = { params: { slug: string } };

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: Props): Metadata {
  const article = getFactoryArticle("discover", params.slug);
  if (!article) return { title: "Guide | Ebenezer Discover", robots: { index: false } };
  return pageMetadata({
    title: article.seoTitle,
    description: article.seoDescription,
    path: `/discover/blog/${article.slug}`,
  });
}

export default function DiscoverBlogArticle({ params }: Props) {
  const article = getFactoryArticle("discover", params.slug);
  if (!article) notFound();
  return (
    <div className="discover-root min-h-screen">
      <EcosystemNav active="discover" />
      <FactoryArticleView article={article} hubHref="/discover/blog" />
    </div>
  );
}
