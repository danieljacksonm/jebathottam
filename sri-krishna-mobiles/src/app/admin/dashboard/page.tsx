"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  inStock: boolean;
  category: { name: string };
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = sessionStorage.getItem("adminKey");
    if (!key) return;
    fetch("/api/admin/products", { headers: { "x-admin-key": key } })
      .then((r) => r.json())
      .then((data) => (Array.isArray(data) ? setProducts(data) : setProducts([])))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-[var(--muted)]">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Products</h1>
        <Link
          href="/admin/dashboard/new"
          className="rounded-lg bg-[var(--accent)] text-white px-4 py-2 text-sm font-medium hover:bg-[var(--accent-dark)]"
        >
          Add product
        </Link>
      </div>
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[var(--background)]">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-[var(--muted)]">Name</th>
              <th className="px-4 py-3 text-sm font-medium text-[var(--muted)]">Category</th>
              <th className="px-4 py-3 text-sm font-medium text-[var(--muted)]">Price</th>
              <th className="px-4 py-3 text-sm font-medium text-[var(--muted)]">Stock</th>
              <th className="px-4 py-3 text-sm font-medium text-[var(--muted)]" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 font-medium text-[var(--foreground)]">{p.name}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{p.category?.name}</td>
                <td className="px-4 py-3">₹{Number(p.price).toLocaleString()}</td>
                <td className="px-4 py-3">{p.inStock ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/dashboard/edit/${p.id}`} className="text-sm text-[var(--accent)] hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
