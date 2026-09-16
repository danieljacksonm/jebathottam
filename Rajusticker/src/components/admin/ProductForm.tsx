"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { categoryMeta } from "@/lib/catalog";
import type { Product, ProductCategory } from "@/types";

const FINISHES = [
  { value: "chrome-mirror", label: "Chrome Mirror" },
  { value: "metallic-gloss", label: "Metallic Gloss" },
  { value: "matte", label: "Matte" },
  { value: "carbon-fiber", label: "Carbon Fiber" },
  { value: "holographic", label: "Holographic" },
  { value: "iridescent", label: "Iridescent" },
  { value: "gloss-solid", label: "Gloss Solid" },
];

const DEFAULT_SIZES = [
  { id: "full-roll", label: "Full Roll 1.52m × 18m", widthCm: 152, lengthM: 18, priceMultiplier: 1 },
  { id: "half-roll", label: "Half Roll 1.52m × 9m", widthCm: 152, lengthM: 9, priceMultiplier: 0.55 },
  { id: "sample", label: "Sample Swatch 30cm × 30cm", widthCm: 30, lengthM: 0.3, priceMultiplier: 0.05 },
];

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState(product?.images[0] || "");
  const categories = Object.values(categoryMeta).filter((item) => item.slug !== "custom");

  async function onUpload(file: File) {
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Upload failed");
      return;
    }
    setImageUrl(data.url);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const finish = String(form.get("finish"));
    const payload = {
      name: String(form.get("name")),
      slug: String(form.get("slug") || ""),
      price: Number(form.get("price")),
      compareAtPrice: form.get("compareAtPrice") ? Number(form.get("compareAtPrice")) : null,
      tradePrice: form.get("tradePrice") ? Number(form.get("tradePrice")) : null,
      sku: String(form.get("sku")),
      category: String(form.get("category")),
      finish,
      finishLabel: FINISHES.find((item) => item.value === finish)?.label || finish,
      color: String(form.get("color")),
      stock: Number(form.get("stock")),
      shortDescription: String(form.get("shortDescription")),
      description: String(form.get("description")),
      imageUrl,
      featured: form.get("featured") === "on",
      bestSeller: form.get("bestSeller") === "on",
      newArrival: form.get("newArrival") === "on",
      published: form.get("published") === "on",
      sizes:
        product?.sizes?.length
          ? product.sizes.map((size) => ({
              id: size.id,
              label: size.label,
              widthCm: size.widthCm,
              lengthM: size.lengthM,
              priceMultiplier: size.priceMultiplier,
            }))
          : DEFAULT_SIZES,
    };

    const response = await fetch(product ? `/api/admin/products/${product.id}` : "/api/admin/products", {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) {
      setError(data.error || "Could not save");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7 space-y-4">
        <label className="block text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
          Name
          <input name="name" required defaultValue={product?.name} className="input mt-2" />
        </label>
        <label className="block text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
          Slug
          <input name="slug" defaultValue={product?.slug} placeholder="auto from name" className="input mt-2" />
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
            SKU
            <input name="sku" required defaultValue={product?.sku} className="input mt-2" />
          </label>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
            Colour
            <input name="color" required defaultValue={product?.color} className="input mt-2" />
          </label>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="block text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
            Price
            <input name="price" type="number" required min={1} defaultValue={product?.price} className="input mt-2" />
          </label>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
            Compare at
            <input name="compareAtPrice" type="number" min={1} defaultValue={product?.compareAtPrice} className="input mt-2" />
          </label>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
            Trade price
            <input name="tradePrice" type="number" min={1} defaultValue={product?.tradePrice} className="input mt-2" />
          </label>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="block text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
            Category
            <select name="category" defaultValue={product?.category || "chrome-wraps"} className="input mt-2">
              {categories.map((item) => (
                <option key={item.slug} value={item.slug as ProductCategory}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
            Finish
            <select name="finish" defaultValue={product?.finish || "gloss-solid"} className="input mt-2">
              {FINISHES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
            Stock
            <input name="stock" type="number" required min={0} defaultValue={product?.stock ?? 0} className="input mt-2" />
          </label>
        </div>
        <label className="block text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
          Short line
          <input name="shortDescription" required defaultValue={product?.shortDescription} className="input mt-2" />
        </label>
        <label className="block text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
          Description
          <textarea name="description" required rows={5} defaultValue={product?.description} className="textarea mt-2" />
        </label>
      </div>

      <aside className="lg:col-span-5 space-y-5">
        <div className="border border-[var(--line)] p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">Image</p>
          <div className="mt-3 aspect-[3/2] bg-[var(--bg-soft)] border border-[var(--line)] overflow-hidden">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="h-full w-full object-cover object-[50%_18%]" />
            ) : (
              <div className="h-full grid place-items-center text-xs text-[var(--ink-3)]">No image yet</div>
            )}
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="mt-3 text-xs"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onUpload(file);
            }}
          />
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="published" defaultChecked={product?.published !== false} />
            Published
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" defaultChecked={product?.featured} />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="bestSeller" defaultChecked={product?.bestSeller} />
            Best seller
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="newArrival" defaultChecked={product?.newArrival} />
            New
          </label>
        </div>
        <p className="text-xs text-[var(--ink-3)]">
          Sizes stay the shop standard: full roll, half roll, and sample. Price scales from the full-roll price.
        </p>
        {error && <p className="text-sm text-[var(--bad)]">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={saving || !imageUrl}>
          {saving ? "Saving…" : product ? "Update product" : "Add to catalogue"}
        </button>
      </aside>
    </form>
  );
}
