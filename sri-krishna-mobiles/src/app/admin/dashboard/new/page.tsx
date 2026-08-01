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
    const key = sessionStorage.getItem("adminKey");
    if (!key) { setError("Not logged in"); setLoading(false); return; }
    fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
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
      .then((r) => r.json())
      .then((data) => {
        if (data.id) router.push("/admin/dashboard");
        else throw new Error(data.error ?? "Failed");
      })
      .catch((err) => setError(err.message ?? "Failed to create"))
      .finally(() => setLoading(false));
  }

  return (
    <div>
      <Link href="/admin/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] mb-4 inline-block">← Products</Link>
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Add product</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-lg border border-[var(--border)] px-4 py-2 bg-[var(--card)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Slug</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto from name" className="w-full rounded-lg border border-[var(--border)] px-4 py-2 bg-[var(--card)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="w-full rounded-lg border border-[var(--border)] px-4 py-2 bg-[var(--card)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Price (₹)</label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full rounded-lg border border-[var(--border)] px-4 py-2 bg-[var(--card)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Wholesale price (₹)</label>
          <input type="number" step="0.01" value={wholesalePrice} onChange={(e) => setWholesalePrice(e.target.value)} className="w-full rounded-lg border border-[var(--border)] px-4 py-2 bg-[var(--card)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Stock quantity</label>
          <input type="number" value={stockQty} onChange={(e) => setStockQty(e.target.value)} required className="w-full rounded-lg border border-[var(--border)] px-4 py-2 bg-[var(--card)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">SKU / Code</label>
          <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className="w-full rounded-lg border border-[var(--border)] px-4 py-2 bg-[var(--card)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Category</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-lg border border-[var(--border)] px-4 py-2 bg-[var(--card)]">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Image URL</label>
          <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full rounded-lg border border-[var(--border)] px-4 py-2 bg-[var(--card)]" />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          <span className="text-sm text-[var(--foreground)]">In stock</span>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-lg bg-[var(--accent)] text-white px-4 py-2 font-medium hover:bg-[var(--accent-dark)] disabled:opacity-50">
          {loading ? "Saving…" : "Create product"}
        </button>
      </form>
    </div>
  );
}
