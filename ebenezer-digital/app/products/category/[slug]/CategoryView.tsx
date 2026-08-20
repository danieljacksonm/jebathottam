"use client";

import Link from "next/link";
import { StoreNav } from "../../components/StoreNav";
import { StoreCart } from "../../components/StoreCart";
import { StoreCursor } from "../../components/StoreCursor";
import { ProductCard } from "../../components/ProductCard";
import { useStoreI18n } from "../../i18n";
import type { StoreCategoryPage } from "../../taxonomy";
import { STORE_CATEGORY_PAGES } from "../../taxonomy";
import type { StoreProduct } from "../../data";

export function CategoryView({
  page,
  products,
}: {
  page: StoreCategoryPage;
  products: StoreProduct[];
}) {
  const { lp, rtl } = useStoreI18n();

  return (
    <div className="store-root min-h-screen" dir={rtl ? "rtl" : "ltr"}>
      <StoreCursor />
      <StoreNav />
      <StoreCart />
      <section className="s-page py-14">
        <p className="s-section-label">Category</p>
        <h1 className="font-display text-3xl font-extrabold text-[var(--s-ink)] sm:text-4xl">{page.name}</h1>
        <p className="mt-3 max-w-2xl text-[var(--s-muted)]">{page.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {STORE_CATEGORY_PAGES.map((c) => (
            <Link
              key={c.slug}
              href={lp(`/products/category/${c.slug}`)}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                c.slug === page.slug
                  ? "border-[var(--s-brand)] bg-[var(--s-brand)] text-white"
                  : "border-[var(--s-line)] bg-[var(--s-surface)] text-[var(--s-ink)]"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
      <section className="s-page pb-16">
        {products.length === 0 ? (
          <p className="text-[var(--s-muted)]">No products in this category yet. We only list items when real files or tools exist.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
