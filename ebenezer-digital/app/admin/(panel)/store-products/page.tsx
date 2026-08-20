"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit3, Trash2, Eye, EyeOff, X, ExternalLink } from "lucide-react";
import { STORE_CATEGORIES, PRODUCT_TYPE_OPTIONS } from "@/app/products/data";

type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  category: string;
  productType?: string;
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
  isSoftware?: boolean;
  externalUrl?: string;
  externalCta?: string;
  techStack?: string[];
  platforms?: string[];
  fileFormats?: string[];
  version?: string;
  updatePolicy?: string;
  setupRequirements?: string;
  accessMethod?: string;
  supportInfo?: string;
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
  category: "Software & Tools",
  productType: "digital_tool",
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
  isSoftware: false,
  externalUrl: "",
  externalCta: "",
  techStack: "",
  platforms: "",
  fileFormats: "",
  version: "1.0",
  updatePolicy: "",
  setupRequirements: "",
  accessMethod: "download",
  supportInfo: "",
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
      category: p.category || "Software & Tools",
      productType: p.productType || "free_resource",
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
      isSoftware: Boolean(p.isSoftware),
      externalUrl: p.externalUrl || "",
      externalCta: p.externalCta || "",
      techStack: (p.techStack || []).join(", "),
      platforms: (p.platforms || []).join(", "),
      fileFormats: (p.fileFormats || []).join(", "),
      version: p.version || "",
      updatePolicy: p.updatePolicy || "",
      setupRequirements: p.setupRequirements || "",
      accessMethod: p.accessMethod || "download",
      supportInfo: p.supportInfo || "",
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
      productType: form.productType,
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
      isSoftware: form.isSoftware,
      externalUrl: form.externalUrl || undefined,
      externalCta: form.externalCta || undefined,
      techStack: splitList(form.techStack),
      platforms: splitList(form.platforms),
      fileFormats: splitList(form.fileFormats),
      version: form.version || undefined,
      updatePolicy: form.updatePolicy || undefined,
      setupRequirements: form.setupRequirements || undefined,
      accessMethod: form.accessMethod || undefined,
      supportInfo: form.supportInfo || undefined,
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
              <label className="block text-sm text-slate-300">
                Product type
                <select value={form.productType} onChange={(e) => setForm({ ...form, productType: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white">
                  {PRODUCT_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
              <p className="sm:col-span-2 text-xs text-amber-300/90">
                PDF is documentation only. Core paid products should be software, templates, code, Canva/Figma, tools, or bundles.
              </p>
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
              <label className="block text-sm text-slate-300">
                Tech stack
                <input value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="HTML, CSS, JavaScript" />
              </label>
              <label className="block text-sm text-slate-300">
                Platforms
                <input value={form.platforms} onChange={(e) => setForm({ ...form, platforms: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="Web, Windows" />
              </label>
              <label className="block text-sm text-slate-300">
                File formats
                <input value={form.fileFormats} onChange={(e) => setForm({ ...form, fileFormats: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300">
                Version
                <input value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300">
                Access method
                <select value={form.accessMethod} onChange={(e) => setForm({ ...form, accessMethod: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white">
                  <option value="download">download</option>
                  <option value="web_app">web_app</option>
                  <option value="external_link">external_link</option>
                  <option value="docs">docs</option>
                </select>
              </label>
              <label className="block text-sm text-slate-300">
                External / app URL
                <input value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="/saas or /tools/..." />
              </label>
              <label className="block text-sm text-slate-300">
                CTA label
                <input value={form.externalCta} onChange={(e) => setForm({ ...form, externalCta: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300 sm:col-span-2">
                Setup requirements
                <input value={form.setupRequirements} onChange={(e) => setForm({ ...form, setupRequirements: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300 sm:col-span-2">
                Update policy
                <input value={form.updatePolicy} onChange={(e) => setForm({ ...form, updatePolicy: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300 sm:col-span-2">
                Support info
                <input value={form.supportInfo} onChange={(e) => setForm({ ...form, supportInfo: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={form.isSoftware} onChange={(e) => setForm({ ...form, isSoftware: e.target.checked })} />
                Opens as software / web tool (no ZIP buy flow)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
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
