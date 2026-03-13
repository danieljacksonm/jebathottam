import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";

async function getProduct(slug: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/products/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/shop" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] mb-6 inline-block">
        ← Back to shop
      </Link>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <span className="text-8xl text-[var(--muted)]">📱</span>
          )}
        </div>
        <div>
          <p className="text-sm text-[var(--muted)] uppercase tracking-wider">{product.category?.name}</p>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mt-1">{product.name}</h1>
          <p className="text-2xl text-[var(--accent)] font-semibold mt-2">₹{Number(product.price).toLocaleString()}</p>
          <p className="text-[var(--muted)] mt-4 leading-relaxed">{product.description}</p>
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
