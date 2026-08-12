"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit3, Trash2, Eye, EyeOff, X, ExternalLink } from "lucide-react";
import { STORE_CATEGORIES } from "@/app/products/data";

type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  category: string;
  price: number;
  compareAt?: number;
  badge?: string;
  image: string;
  gallery: string[];
  features: string[];
  includes: string[];
  compatibility: string[];
  license: string[];
  status: "draft" | "published";
  isFree?: boolean;
  isBundle?: boolean;
  downloadFile?: string;
  fileName?: string;
  fileSize?: string;
};

const emptyForm = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  story: "",
  category: "Templates",
  price: 0,
  compareAt: "",
  badge: "",
  image: "",
  gallery: "",
  features: "",
  includes: "",
  compatibility: "",
  license: "Personal, Commercial",
  status: "draft" as "draft" | "published",
  downloadFile: "",
  fileName: "",
  fileSize: "",
  isBundle: false,
};

function splitList(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function StoreProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, query]);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/store-products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      slug: p.slug,
      tagline: p.tagline || "",
      description: p.description || "",
      story: p.story || "",
      category: p.category || "Templates",
      price: p.price || 0,
      compareAt: p.compareAt != null ? String(p.compareAt) : "",
      badge: p.badge || "",
      image: p.image || "",
      gallery: (p.gallery || []).join(", "),
      features: (p.features || []).join("\n"),
      includes: (p.includes || []).join("\n"),
      compatibility: (p.compatibility || []).join(", "),
      license: (p.license || []).join(", "),
      status: p.status,
      downloadFile: p.downloadFile || "",
      fileName: p.fileName || "",
      fileSize: p.fileSize || "",
      isBundle: Boolean(p.isBundle),
    });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug,
      tagline: form.tagline,
      description: form.description,
      story: form.story,
      category: form.category,
      price: Number(form.price) || 0,
      compareAt: form.compareAt ? Number(form.compareAt) : undefined,
      badge: form.badge || undefined,
      image: form.image,
      gallery: splitList(form.gallery),
      features: splitList(form.features),
      includes: splitList(form.includes),
      compatibility: splitList(form.compatibility),
      license: splitList(form.license),
      status: form.status,
      downloadFile: form.downloadFile || undefined,
      fileName: form.fileName || undefined,
      fileSize: form.fileSize || undefined,
      isFree: Number(form.price) === 0,
      isBundle: form.isBundle,
    };

    if (editing) {
      await fetch("/api/admin/store-products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing.id, ...payload }),
      });
    } else {
      await fetch("/api/admin/store-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setModalOpen(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/store-products?id=${id}`, { method: "DELETE" });
    await load();
  };

  const toggle = async (p: Product) => {
    const status = p.status === "published" ? "draft" : "published";
    await fetch("/api/admin/store-products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, status }),
    });
    await load();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Store Products</h1>
          <p className="mt-1 text-sm text-slate-400">Manage Ebenezer Store digital products</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-slate-950"
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
        <Search className="h-4 w-4 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-slate-800 text-slate-200">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{p.name}</p>
                    <p className="text-xs text-slate-500">/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">₹{p.price}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs ${
                        p.status === "published"
                          ? "border-emerald-500/30 text-emerald-400"
                          : "border-amber-500/30 text-amber-400"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                        title="View"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button type="button" onClick={() => toggle(p)} className="rounded p-1.5 text-slate-400 hover:bg-slate-800">
                        {p.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button type="button" onClick={() => openEdit(p)} className="rounded p-1.5 text-slate-400 hover:bg-slate-800">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => remove(p.id)} className="rounded p-1.5 text-red-400 hover:bg-red-500/10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="p-6 text-slate-400">No products found.</p>}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-10">
          <form onSubmit={save} className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{editing ? "Edit product" : "New product"}</h2>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-300 sm:col-span-2">
                Name
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300">
                Slug
                <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300">
                Category
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white">
                  {STORE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-slate-300 sm:col-span-2">
                Tagline
                <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300 sm:col-span-2">
                Description
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300 sm:col-span-2">
                Story
                <textarea rows={2} value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300">
                Price (INR)
                <input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300">
                Compare at
                <input value={form.compareAt} onChange={(e) => setForm({ ...form, compareAt: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300">
                Badge
                <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white">
                  <option value="">None</option>
                  <option value="BEST SELLER">BEST SELLER</option>
                  <option value="NEW">NEW</option>
                  <option value="FREE">FREE</option>
                  <option value="BUNDLE">BUNDLE</option>
                </select>
              </label>
              <label className="block text-sm text-slate-300">
                Status
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white">
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
              </label>
              <label className="block text-sm text-slate-300 sm:col-span-2">
                Cover image URL
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="/images/..." />
              </label>
              <label className="block text-sm text-slate-300 sm:col-span-2">
                Gallery (comma separated)
                <input value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300 sm:col-span-2">
                Features (one per line)
                <textarea rows={3} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300 sm:col-span-2">
                Includes (one per line)
                <textarea rows={3} value={form.includes} onChange={(e) => setForm({ ...form, includes: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300">
                Compatibility
                <input value={form.compatibility} onChange={(e) => setForm({ ...form, compatibility: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300">
                License options
                <input value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300">
                Download file path
                <input value={form.downloadFile} onChange={(e) => setForm({ ...form, downloadFile: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="/downloads/file.zip" />
              </label>
              <label className="block text-sm text-slate-300">
                File name / size
                <div className="mt-1 flex gap-2">
                  <input value={form.fileName} onChange={(e) => setForm({ ...form, fileName: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="file.zip" />
                  <input value={form.fileSize} onChange={(e) => setForm({ ...form, fileSize: e.target.value })} className="w-28 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="12 MB" />
                </div>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300 sm:col-span-2">
                <input type="checkbox" checked={form.isBundle} onChange={(e) => setForm({ ...form, isBundle: e.target.checked })} />
                This is a bundle
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300">
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950">
                Save product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
