"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import { Search, Plus, Package, AlertTriangle, Pencil } from "lucide-react";

type Product = {
  id: number;
  name: string;
  sku?: string | null;
  price: number;
  wholesalePrice?: number | null;
  stockQty: number;
  inStock: boolean;
  category?: { name: string } | null;
  imageUrl?: string | null;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/products")
      .then(async (r) => {
        if (!r.ok) throw new Error("Could not load products. Please login again.");
        return r.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku || "").toLowerCase().includes(q) ||
        (p.category?.name || "").toLowerCase().includes(q);
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "out" && p.stockQty <= 0) ||
        (stockFilter === "low" && p.stockQty > 0 && p.stockQty <= 5);
      return matchesSearch && matchesStock;
    });
  }, [products, searchQuery, stockFilter]);

  const stockBadge = (qty: number) => {
    if (qty <= 0) {
      return (
        <span className="rounded-full bg-[var(--error)]/10 px-2 py-1 text-xs font-medium text-[var(--error)]">
          Out of stock
        </span>
      );
    }
    if (qty <= 5) {
      return (
        <span className="rounded-full bg-[var(--warning)]/10 px-2 py-1 text-xs font-medium text-[var(--warning)]">
          Low ({qty})
        </span>
      );
    }
    return (
      <span className="rounded-full bg-[var(--success)]/10 px-2 py-1 text-xs font-medium text-[var(--success)]">
        In stock ({qty})
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">Products</h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            {loading ? "Loading…" : `${filtered.length} of ${products.length} items`}
          </p>
        </div>
        <Link href="/admin/dashboard/new">
          <Button className="w-full gap-2 sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, SKU, category…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {(
            [
              ["all", "All"],
              ["low", "Low stock"],
              ["out", "Out"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setStockFilter(value)}
              className={cn(
                "min-h-[40px] shrink-0 rounded-full px-3 text-sm font-medium",
                stockFilter === value
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--background-secondary)] text-[var(--foreground-secondary)]"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <Card className="border-[var(--error)]/30 bg-[var(--error)]/5 p-4 text-sm text-[var(--error)]">
          {error}
        </Card>
      )}

      {loading ? (
        <p className="py-10 text-center text-[var(--foreground-muted)]">Loading products…</p>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <Package className="mx-auto h-10 w-10 text-[var(--foreground-muted)]" />
          <p className="mt-3 font-medium text-[var(--foreground)]">No products found</p>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Try another search, or add a new product.
          </p>
        </Card>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((p) => (
              <Card key={p.id} className="border-[var(--border)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--foreground)]">{p.name}</p>
                    <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
                      {p.category?.name || "Uncategorized"}
                      {p.sku ? ` · ${p.sku}` : ""}
                    </p>
                  </div>
                  {stockBadge(p.stockQty)}
                </div>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-[var(--foreground)]">
                      {formatCurrency(p.price)}
                    </p>
                    {p.wholesalePrice != null && (
                      <p className="text-xs text-[var(--foreground-muted)]">
                        Wholesale {formatCurrency(p.wholesalePrice)}
                      </p>
                    )}
                  </div>
                  <Link href={`/admin/dashboard/edit/${p.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop table */}
          <Card className="hidden overflow-hidden border-[var(--border)] md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-[var(--foreground-muted)]">Product</th>
                    <th className="px-4 py-3 font-medium text-[var(--foreground-muted)]">Category</th>
                    <th className="px-4 py-3 font-medium text-[var(--foreground-muted)]">Price</th>
                    <th className="px-4 py-3 font-medium text-[var(--foreground-muted)]">Stock</th>
                    <th className="px-4 py-3 text-right font-medium text-[var(--foreground-muted)]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-[var(--foreground)]">{p.name}</p>
                        {p.sku && (
                          <p className="text-xs text-[var(--foreground-muted)]">{p.sku}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[var(--foreground-secondary)]">
                        {p.category?.name || "—"}
                      </td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(p.price)}</td>
                      <td className="px-4 py-3">{stockBadge(p.stockQty)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/dashboard/edit/${p.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {!loading && products.some((p) => p.stockQty <= 5) && (
        <p className="flex items-center gap-2 text-sm text-[var(--warning)]">
          <AlertTriangle className="h-4 w-4" />
          Some items are low or out of stock — update qty before selling.
        </p>
      )}
    </div>
  );
}
