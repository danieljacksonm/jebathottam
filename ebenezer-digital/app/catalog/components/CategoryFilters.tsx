"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { CatalogProduct } from "@/app/catalog/types";
import { filtersForCategory } from "@/lib/catalog/filters-schema";

export function CategoryFilters({
  categoryId,
  brands,
}: {
  categoryId: string;
  brands: string[];
  products?: CatalogProduct[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const schema = useMemo(() => filtersForCategory(categoryId), [categoryId]);

  const [local, setLocal] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    schema.forEach((f) => {
      const v = searchParams.get(f.key);
      if (v) init[f.key] = v;
    });
    const q = searchParams.get("q");
    if (q) init.q = q;
    return init;
  });

  function apply() {
    const params = new URLSearchParams();
    Object.entries(local).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function clear() {
    setLocal({});
    router.push(pathname);
  }

  return (
    <div className="c-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm">Filters</h2>
        <button type="button" onClick={clear} className="text-xs text-[var(--c-muted)] hover:text-[var(--c-brand)]">
          Clear
        </button>
      </div>
      <input
        className="w-full rounded-lg border border-[var(--c-line)] px-3 py-2 text-sm"
        placeholder="Search in category"
        value={local.q || ""}
        onChange={(e) => setLocal({ ...local, q: e.target.value })}
      />
      {schema.map((f) => {
        if (f.key === "brand") {
          return (
            <label key={f.key} className="block text-xs">
              <span className="text-[var(--c-muted)]">{f.label}</span>
              <select
                className="mt-1 w-full rounded-lg border border-[var(--c-line)] px-2 py-2 text-sm"
                value={local.brand || ""}
                onChange={(e) => setLocal({ ...local, brand: e.target.value })}
              >
                <option value="">Any</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
          );
        }
        if (f.type === "enum" && f.key === "os") {
          return (
            <label key={f.key} className="block text-xs">
              <span className="text-[var(--c-muted)]">{f.label}</span>
              <select
                className="mt-1 w-full rounded-lg border border-[var(--c-line)] px-2 py-2 text-sm"
                value={local.os || ""}
                onChange={(e) => setLocal({ ...local, os: e.target.value })}
              >
                <option value="">Any</option>
                <option value="Windows 11">Windows 11</option>
                <option value="macOS">macOS</option>
              </select>
            </label>
          );
        }
        return (
          <label key={f.key} className="block text-xs">
            <span className="text-[var(--c-muted)]">{f.label}</span>
            <input
              className="mt-1 w-full rounded-lg border border-[var(--c-line)] px-2 py-2 text-sm"
              value={local[f.key] || ""}
              onChange={(e) => setLocal({ ...local, [f.key]: e.target.value })}
              placeholder={f.type === "price_max" ? "e.g. 60000" : ""}
            />
          </label>
        );
      })}
      <button type="button" onClick={apply} className="c-btn c-btn-primary w-full !py-2 !text-sm">
        Apply filters
      </button>
    </div>
  );
}
