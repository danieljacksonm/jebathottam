import { notFound } from "next/navigation";
import {
  categoryMeta,
  getAllProducts,
  getProductsByCategory,
} from "@/lib/products";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import type { ProductCategory } from "@/types";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ category: string }>;
};

export const dynamic = "force-dynamic";

const VALID = Object.keys(categoryMeta) as ProductCategory[];

export function generateStaticParams() {
  return VALID.filter((c) => c !== "custom").map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMeta[category as ProductCategory];
  if (!meta) return {};
  return buildMetadata({
    title: meta.seoTitle,
    description: meta.seoDescription,
    path: `/shop/${meta.slug}`,
  });
}

export default async function CategoryShopPage({ params }: PageProps) {
  const { category } = await params;
  if (!VALID.includes(category as ProductCategory) || category === "custom") {
    notFound();
  }

  const meta = categoryMeta[category as ProductCategory];
  const products = await getProductsByCategory(category as ProductCategory);

  // Avoid thin pages: if somehow empty, show all with category hint
  const list = products.length > 0 ? products : await getAllProducts();

  return (
    <div className="container-x py-8 sm:py-12">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: meta.name, path: `/shop/${meta.slug}` },
        ])}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: meta.name },
        ]}
      />
      <h1 className="section-title mb-2">{meta.name}</h1>
      <p className="section-sub mb-8">{meta.description}</p>
      <ShopFilters products={list} initialCategory={category as ProductCategory} />
    </div>
  );
}
