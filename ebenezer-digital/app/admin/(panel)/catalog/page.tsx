"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Trash2, RefreshCw } from "lucide-react";
import { CATALOG_CATEGORIES } from "@/app/catalog/data";

type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categoryId: string;
  status: string;
  shortDescription: string;
  image: string;
};

type Offer = {
  id: string;
  productId: string;
  merchantId: string;
  price: number;
  currency: string;
  availability: string;
  url: string;
};

type Merchant = { id: string; name: string; website: string; status: string };

export default function AdminCatalogPage() {
  const [tab, setTab] = useState<"products" | "offers" | "merchants" | "import" | "analytics">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    brand: "",
    categoryId: "laptops",
    shortDescription: "",
    image: "",
    ram_gb: "16",
    storage_gb: "512",
  });

  const [offerForm, setOfferForm] = useState({
    productId: "",
    merchantId: "amazon-in",
    price: "",
    url: "",
    availability: "in_stock",
  });

  const [importJson, setImportJson] = useState("[]");

  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    if (!needle) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.slug.toLowerCase().includes(needle) ||
        p.brand.toLowerCase().includes(needle)
    );
  }, [products, q]);

  async function load() {
    setLoading(true);
    try {
      const [p, o, m, meta] = await Promise.all([
        fetch("/api/admin/catalog/products").then((r) => r.json()),
        fetch("/api/admin/catalog/offers").then((r) => r.json()),
        fetch("/api/admin/catalog/merchants").then((r) => r.json()),
        fetch("/api/admin/catalog/meta").then((r) => r.json()),
      ]);
      setProducts(p.products || []);
      setOffers(o.offers || []);
      setMerchants(m.merchants || []);
      setAnalytics(meta.analytics || p.summary || null);
    } catch (e) {
      console.error(e);
      setMsg("Failed to load catalog admin data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createProduct() {
    const slug =
      form.slug ||
      form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const res = await fetch("/api/admin/catalog/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        slug,
        brand: form.brand,
        categoryId: form.categoryId,
        shortDescription: form.shortDescription,
        description: form.shortDescription,
        image: form.image || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
        specs: {
          ram_gb: Number(form.ram_gb) || undefined,
          storage_gb: Number(form.storage_gb) || undefined,
        },
        pros: [],
        cons: [],
        bestFor: [],
        notIdealFor: [],
        status: "active",
      }),
    });
    if (res.ok) {
      setMsg("Product created");
      setForm({ name: "", slug: "", brand: "", categoryId: "laptops", shortDescription: "", image: "", ram_gb: "16", storage_gb: "512" });
      load();
    } else {
      const err = await res.json();
      setMsg(err.error || "Create failed");
    }
  }

  async function archiveProduct(id: string) {
    await fetch("/api/admin/catalog/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "archived" }),
    });
    load();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete product and its offers?")) return;
    await fetch(`/api/admin/catalog/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    load();
  }

  async function createOffer() {
    const res = await fetch("/api/admin/catalog/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...offerForm,
        price: Number(offerForm.price),
      }),
    });
    if (res.ok) {
      setMsg("Offer created");
      load();
    } else {
      const err = await res.json();
      setMsg(err.error || "Offer failed");
    }
  }

  async function runImport() {
    try {
      const rows = JSON.parse(importJson);
      const res = await fetch("/api/admin/catalog/meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "import", rows }),
      });
      const data = await res.json();
      setMsg(`Imported ${data.imported || 0} products, ${data.offers || 0} offers`);
      load();
    } catch {
      setMsg("Invalid JSON");
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Ebenezer Products (Physical)</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage catalog, offers, merchants — separate from digital Store Products.
          </p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {msg ? <p className="mb-4 text-sm text-emerald-400">{msg}</p> : null}

      <div className="flex flex-wrap gap-2 mb-6">
        {(["products", "offers", "merchants", "import", "analytics"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-3 py-1.5 text-sm capitalize ${
              tab === t ? "bg-brand-500/20 text-brand-300 border border-brand-500/30" : "bg-slate-800 text-slate-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? <p className="text-slate-400">Loading…</p> : null}

      {tab === "products" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <h2 className="font-semibold text-white flex items-center gap-2"><Plus className="w-4 h-4" /> Add product</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="Slug (optional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              <input className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              <select className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                {CATALOG_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white sm:col-span-2" placeholder="Short description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
              <input className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              <div className="flex gap-2">
                <input className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white w-full" placeholder="RAM GB" value={form.ram_gb} onChange={(e) => setForm({ ...form, ram_gb: e.target.value })} />
                <input className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white w-full" placeholder="Storage GB" value={form.storage_gb} onChange={(e) => setForm({ ...form, storage_gb: e.target.value })} />
              </div>
            </div>
            <button type="button" onClick={createProduct} className="rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold px-4 py-2">Save product</button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white" placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          <div className="space-y-2">
            {filtered.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3">
                <div>
                  <p className="text-white font-medium">{p.name} <span className="text-xs text-slate-500">({p.status})</span></p>
                  <p className="text-xs text-slate-400">{p.brand} · {p.categoryId} · {p.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/catalog/p/${p.slug}`} className="text-xs text-brand-300 hover:underline" target="_blank">View</Link>
                  <button type="button" onClick={() => archiveProduct(p.id)} className="text-xs text-amber-300">Archive</button>
                  <button type="button" onClick={() => deleteProduct(p.id)} className="text-xs text-red-400 inline-flex items-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "offers" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <h2 className="font-semibold text-white">Add offer</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <select className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={offerForm.productId} onChange={(e) => setOfferForm({ ...offerForm, productId: e.target.value })}>
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={offerForm.merchantId} onChange={(e) => setOfferForm({ ...offerForm, merchantId: e.target.value })}>
                {merchants.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <input className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="Price INR" value={offerForm.price} onChange={(e) => setOfferForm({ ...offerForm, price: e.target.value })} />
              <input className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="Product / affiliate URL" value={offerForm.url} onChange={(e) => setOfferForm({ ...offerForm, url: e.target.value })} />
            </div>
            <button type="button" onClick={createOffer} className="rounded-lg bg-brand-600 text-white text-sm font-semibold px-4 py-2">Save offer</button>
          </div>
          <div className="space-y-2">
            {offers.map((o) => (
              <div key={o.id} className="rounded-lg border border-slate-800 px-4 py-3 text-sm text-slate-300">
                {o.productId} · {o.merchantId} · ₹{o.price} · {o.availability}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "merchants" && (
        <div className="space-y-2">
          {merchants.map((m) => (
            <div key={m.id} className="rounded-lg border border-slate-800 px-4 py-3">
              <p className="text-white font-medium">{m.name}</p>
              <p className="text-xs text-slate-400">{m.id} · {m.website} · {m.status}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "import" && (
        <div className="space-y-3">
          <p className="text-sm text-slate-400">Paste JSON array of approved feed rows (name, brand, category, price, url, …). No scraping.</p>
          <textarea className="w-full h-64 bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono" value={importJson} onChange={(e) => setImportJson(e.target.value)} />
          <button type="button" onClick={runImport} className="rounded-lg bg-brand-600 text-white text-sm font-semibold px-4 py-2">Import JSON</button>
        </div>
      )}

      {tab === "analytics" && analytics && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(analytics).map(([k, v]) => (
            <div key={k} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{k}</p>
              <p className="mt-2 text-white text-sm break-all">{typeof v === "object" ? JSON.stringify(v) : String(v)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
