"use client";

import { useMemo, useState } from "react";
import type { Product, ProductCategory } from "@/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { categoryMeta } from "@/lib/catalog";
import { SearchBar } from "@/components/search/SearchBar";

type SortKey = "newest" | "best" | "price-asc" | "price-desc" | "name";

export function ShopFilters({
  products,
  initialQuery = "",
  initialCategory,
  focusSearch = false,
}: {
  products: Product[];
  initialQuery?: string;
  initialCategory?: ProductCategory;
  focusSearch?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<ProductCategory | "all">(initialCategory || "all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "all") {
      list = list.filter((p) => p.category === category || p.categories.includes(category));
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        [p.name, p.description, p.shortDescription, p.color, p.finishLabel, ...p.tags, ...p.keywords]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }

    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Number.POSITIVE_INFINITY;
    list = list.filter((p) => p.price >= min && p.price <= max);

    switch (sort) {
      case "best":
        list.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller) || b.price - a.price);
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => Number(b.newArrival) - Number(a.newArrival) || Number(b.featured) - Number(a.featured));
    }

    return list;
  }, [products, category, query, sort, minPrice, maxPrice]);

  const categories = Object.values(categoryMeta).filter((c) => c.slug !== "custom");

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-8">
      <aside className="space-y-4">
        <div className="lg:hidden">
          <button
            type="button"
            className="btn btn-secondary w-full"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
          >
            {filtersOpen ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className={`${filtersOpen ? "block" : "hidden"} lg:block space-y-5 border border-[var(--line)] bg-[var(--bg-surface)] p-5`}>
          <div>
            <label className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)]">Search</label>
            <input
              className="input mt-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Racing, chrome, matte..."
              autoFocus={focusSearch}
            />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)] mb-2">Category</p>
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setCategory("all")}
                className={`block w-full text-left px-2.5 py-2 text-sm transition-colors ${
                  category === "all" ? "bg-[var(--accent-soft)] text-[var(--ink)]" : "text-[var(--ink-2)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setCategory(cat.slug as ProductCategory)}
                  className={`block w-full text-left px-2.5 py-2 text-sm transition-colors ${
                    category === cat.slug
                      ? "bg-[var(--accent-soft)] text-[var(--ink)]"
                      : "text-[var(--ink-2)] hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)] mb-2">Price (₹)</p>
            <div className="flex gap-2">
              <input
                className="input"
                inputMode="numeric"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value.replace(/[^\d]/g, ""))}
                aria-label="Minimum price"
              />
              <input
                className="input"
                inputMode="numeric"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value.replace(/[^\d]/g, ""))}
                aria-label="Maximum price"
              />
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <p className="text-xs uppercase tracking-wider text-[var(--text-subtle)] mb-2">Quick search</p>
          <SearchBar />
        </div>
      </aside>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <p className="text-sm text-[var(--text-muted)]">
            Showing <span className="text-white">{filtered.length}</span> products
          </p>
          <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            Sort
            <select
              className="select max-w-[220px]"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="newest">Newest</option>
              <option value="best">Best selling</option>
              <option value="price-asc">Price: low → high</option>
              <option value="price-desc">Price: high → low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
