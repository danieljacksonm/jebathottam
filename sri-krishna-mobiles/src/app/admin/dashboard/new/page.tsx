"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = { id: number; name: string; slug: string };

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [stockQty, setStockQty] = useState("50");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [inStock, setInStock] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setCategories(list);
        if (list.length) setCategoryId(String(list[0].id));
      });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        description,
        price: parseFloat(price) || 0,
        wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : null,
        stockQty: parseInt(stockQty, 10) || 0,
        sku: sku || null,
        categoryId: parseInt(categoryId, 10) || categories[0]?.id,
        imageUrl: imageUrl || null,
        inStock,
      }),
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Failed");
        return data;
      })
      .then((data) => {
        if (data.id) router.push("/admin/products");
        else throw new Error(data.error ?? "Failed");
      })
      .catch((err) => setError(err.message ?? "Failed to create"))
      .finally(() => setLoading(false));
  }

  return (
    <div>
      <Link href="/admin/products" className="mb-4 inline-block text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
        ← Back to Products
      </Link>
      <h1 className="mb-6 text-xl font-bold text-[var(--foreground)] sm:text-2xl">Add product</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="min-h-[44px] w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Slug (optional)</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto from name" className="min-h-[44px] w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Selling price (₹)</label>
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="min-h-[44px] w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Wholesale price (₹)</label>
            <input type="number" step="0.01" value={wholesalePrice} onChange={(e) => setWholesalePrice(e.target.value)} className="min-h-[44px] w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Stock quantity</label>
            <input type="number" value={stockQty} onChange={(e) => setStockQty(e.target.value)} required className="min-h-[44px] w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">SKU / Code</label>
            <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className="min-h-[44px] w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Category</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="min-h-[44px] w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Image URL</label>
          <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="min-h-[44px] w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2" />
        </div>
        <label className="flex min-h-[44px] items-center gap-2">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          <span className="text-sm text-[var(--foreground)]">Show as in stock</span>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="min-h-[48px] w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 font-medium text-white hover:opacity-90 disabled:opacity-50 sm:w-auto">
          {loading ? "Saving…" : "Create product"}
        </button>
      </form>
    </div>
  );
}
