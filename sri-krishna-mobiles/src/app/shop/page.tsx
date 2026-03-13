import Link from "next/link";
import type { Category } from "@/generated/prisma/client";

type ProductWithCategory = { id: number; name: string; slug: string; price: number; imageUrl: string | null; category?: Category };

async function getCategories(): Promise<Category[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/categories`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

async function getProducts(category?: string): Promise<ProductWithCategory[]> {
  const url = category
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/products?category=${category}`
    : `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/products`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(category),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Shop</h1>
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/shop"
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !category
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              category === c.slug
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p: ProductWithCategory) => (
          <Link
            key={p.id}
            href={`/product/${p.slug}`}
            className="group rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-square bg-[var(--background)] flex items-center justify-center">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-[var(--muted)]">📱</span>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wider">
                {p.category?.name}
              </p>
              <h2 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                {p.name}
              </h2>
              <p className="text-[var(--accent)] font-medium mt-1">
                ₹{Number(p.price).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-center text-[var(--muted)] py-12">No products in this category.</p>
      )}
    </div>
  );
}
