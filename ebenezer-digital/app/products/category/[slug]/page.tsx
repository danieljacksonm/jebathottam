import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/site-url";
import { getCategoryPage, STORE_CATEGORY_PAGES } from "../../taxonomy";
import { orderedProducts, productMatchesCategoryPage } from "../../data";
import { CategoryView } from "./CategoryView";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return STORE_CATEGORY_PAGES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const page = getCategoryPage(params.slug);
  if (!page) return { title: "Category | Ebenezer Store" };
  return pageMetadata({
    title: page.seoTitle,
    description: page.description,
    path: `/products/category/${page.slug}`,
  });
}

export default function StoreCategoryPage({ params }: Props) {
  const page = getCategoryPage(params.slug);
  if (!page) notFound();
  const products = orderedProducts().filter((p) => productMatchesCategoryPage(p, page));
  return <CategoryView page={page} products={products} />;
}
