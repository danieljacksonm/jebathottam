import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogNav } from "../components/CatalogNav";
import { ProductCard } from "../components/ProductCard";
import { CategoryFilters } from "../components/CategoryFilters";
import { CatalogAskAi } from "../components/CatalogAskAi";
import {
  applyProductFilters,
  getBestOffer,
  getCategory,
  getProductsByCategory,
  paginate,
} from "@/lib/catalog/query";
import { discloseAffiliate } from "@/lib/catalog/affiliate";

type Props = {
  params: { category: string };
  searchParams: Record<string, string | undefined>;
};

const RESERVED = new Set(["compare", "recommend", "p", "go", "guides"]);

export function generateMetadata({ params }: Props): Metadata {
  if (RESERVED.has(params.category)) return { title: "Catalog" };
  const cat = getCategory(params.category);
  if (!cat) return { title: "Category" };
  return {
    title: cat.name,
    description: cat.description,
  };
}

export default function CategoryPage({ params, searchParams }: Props) {
  if (RESERVED.has(params.category)) notFound();
  const cat = getCategory(params.category);
  if (!cat) notFound();

  let products = getProductsByCategory(cat.id);
  const brands = Array.from(new Set(products.map((p) => p.brand))).sort();
  products = applyProductFilters(products, searchParams, getBestOffer);
  const page = Number(searchParams.page || 1);
  const pageData = paginate(products, page, 12);

  return (
    <>
      <CatalogNav />
      <div className="aff-page py-8">
        <p className="text-sm text-[var(--aff-muted)]">
          <Link href="/catalog" className="hover:text-[var(--aff-brand)]">
            Products
          </Link>{" "}
          / {cat.name}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{cat.name}</h1>
        <p className="mt-2 text-[var(--aff-muted)] max-w-2xl">{cat.description}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <Suspense fallback={<div className="c-card p-4 text-sm text-[var(--c-muted)]">Loading filters…</div>}>
            <CategoryFilters categoryId={cat.id} brands={brands} />
          </Suspense>

          <div>
            <p className="text-sm text-[var(--c-muted)] mb-4">
              {pageData.total} product{pageData.total === 1 ? "" : "s"}
              {pageData.totalPages > 1 ? ` · Page ${pageData.page} of ${pageData.totalPages}` : ""}
            </p>
            {pageData.items.length === 0 ? (
              <p className="text-[var(--c-muted)]">No products match these filters.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {pageData.items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
            {pageData.totalPages > 1 ? (
              <div className="mt-6 flex gap-2">
                {Array.from({ length: pageData.totalPages }, (_, i) => i + 1).map((n) => {
                  const sp = new URLSearchParams();
                  Object.entries(searchParams).forEach(([k, v]) => {
                    if (v && k !== "page") sp.set(k, v);
                  });
                  if (n > 1) sp.set("page", String(n));
                  const href = sp.toString() ? `/catalog/${cat.slug}?${sp}` : `/catalog/${cat.slug}`;
                  return (
                    <Link
                      key={n}
                      href={href}
                      className={`rounded-lg border px-3 py-1.5 text-sm ${
                        n === pageData.page
                          ? "border-teal-600 bg-teal-600 text-white"
                          : "border-[var(--c-line)]"
                      }`}
                    >
                      {n}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <p className="c-disclosure mt-10">{discloseAffiliate()}</p>
      </div>
      <CatalogAskAi />
    </>
  );
}
