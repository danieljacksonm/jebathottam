"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

type Row = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  published: boolean;
  imageUrl: string;
  category: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Row[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/admin/products")
      .then((response) => response.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []));
  }, []);

  const filtered = products.filter((product) => {
    const haystack = `${product.name} ${product.sku} ${product.category}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  async function toggle(product: Row) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !product.published }),
    });
    setProducts((current) =>
      current.map((item) => (item.id === product.id ? { ...item, published: !item.published } : item)),
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="section-kicker">Catalogue</p>
          <h1 className="font-display text-4xl mt-1">Products</h1>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          Add product
        </Link>
      </div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search name or SKU"
        className="input max-w-md mb-6"
      />
      <div className="border-y border-[var(--line)]">
        {filtered.map((product) => (
          <div key={product.id} className="grid grid-cols-12 gap-3 items-center py-4 border-b border-[var(--line)]">
            <div className="col-span-6">
              <p className="font-display text-lg leading-tight">{product.name}</p>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--ink-3)] mt-1">
                {product.sku} · {product.category.replace("-", " ")}
              </p>
            </div>
            <p className="col-span-2 price">{formatPrice(product.price)}</p>
            <p className={`col-span-2 text-sm ${product.stock <= 5 ? "text-[var(--warn)]" : "text-[var(--ink-2)]"}`}>
              {product.stock <= 0 ? "Out" : `${product.stock} stock`}
            </p>
            <div className="col-span-2 flex justify-end gap-3 text-[11px] uppercase tracking-[0.12em]">
              <button type="button" onClick={() => toggle(product)} className="text-[var(--ink-3)] hover:text-[var(--ink)]">
                {product.published ? "Hide" : "Show"}
              </button>
              <Link href={`/admin/products/${product.id}`} className="text-[var(--accent)]">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
