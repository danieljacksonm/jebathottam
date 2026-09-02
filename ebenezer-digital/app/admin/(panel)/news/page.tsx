"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Trash2, Edit3, X, Check, Radio } from "lucide-react";

type NewsRow = {
  id: string;
  slug: string;
  title: string;
  dek: string;
  body: string[];
  region: string;
  topic: string;
  location: string;
  sourceLabel: string;
  coverImage: string;
  breaking?: boolean;
  featured?: boolean;
  pinned?: boolean;
  status: "draft" | "published" | "archived";
  publishedAt?: string;
};

const REGIONS = [
  "World",
  "Asia",
  "Europe",
  "Americas",
  "Africa",
  "Middle East",
  "India",
  "Tech",
  "Business",
  "Science",
  "Climate",
  "Sports",
];

const emptyForm = {
  title: "",
  slug: "",
  dek: "",
  body: "",
  region: "World",
  topic: "",
  location: "",
  sourceLabel: "Ebenezer News Desk",
  coverImage: "/images/journal/hero.jpg",
  breaking: false,
  featured: false,
  pinned: false,
  status: "draft" as "draft" | "published" | "archived",
};

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q) ||
        a.topic.toLowerCase().includes(q)
    );
  }, [articles, query]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/news");
      const data = await res.json();
      setArticles(data.articles || []);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setOpen(true);
  }

  function openEdit(a: NewsRow) {
    setEditingId(a.id);
    setForm({
      title: a.title,
      slug: a.slug,
      dek: a.dek,
      body: (a.body || []).join("\n\n"),
      region: a.region,
      topic: a.topic,
      location: a.location,
      sourceLabel: a.sourceLabel,
      coverImage: a.coverImage,
      breaking: Boolean(a.breaking),
      featured: Boolean(a.featured),
      pinned: Boolean(a.pinned),
      status: a.status,
    });
    setError("");
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        id: editingId || undefined,
        body: form.body,
      };
      const res = await fetch("/api/admin/news", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
      setOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this news story?")) return;
    await fetch(`/api/admin/news?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">E&gt; .info</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">World News</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            Publish stories to the .info newsroom. Seeded desk stories stay live; CMS stories can override same slug.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/api/news/rss"
            target="_blank"
            className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
          >
            RSS
          </Link>
          <Link
            href="/api/news/ical"
            target="_blank"
            className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
          >
            iCal
          </Link>
          <Link
            href="/blog/news"
            target="_blank"
            className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
          >
            Open site
          </Link>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950"
          >
            <Plus className="h-4 w-4" /> Publish news
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2">
        <Search className="h-4 w-4 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search CMS news…"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          <Radio className="mx-auto mb-3 h-8 w-8 text-emerald-400" />
          No CMS news yet. Seeded world desk still shows on the public site. Click Publish news to add your own.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((a) => (
                <tr key={a.id} className="bg-slate-950/40">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{a.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{a.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{a.region}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs ${
                        a.status === "published"
                          ? "border-emerald-500/30 text-emerald-400"
                          : "border-amber-500/30 text-amber-400"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(a)}
                        className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(a.id)}
                        className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-red-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-10">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{editingId ? "Edit news" : "Publish news"}</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Title">
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                />
              </Field>
              <Field label="Slug (optional)">
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                  placeholder="auto from title"
                />
              </Field>
              <Field label="Short summary (dek)">
                <textarea
                  value={form.dek}
                  onChange={(e) => setForm((f) => ({ ...f, dek: e.target.value }))}
                  className="min-h-[80px] w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                />
              </Field>
              <Field label="Body (paragraphs separated by blank line)">
                <textarea
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  className="min-h-[160px] w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Region">
                  <select
                    value={form.region}
                    onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Topic">
                  <input
                    value={form.topic}
                    onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                  />
                </Field>
                <Field label="Location">
                  <input
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                  />
                </Field>
                <Field label="Source label">
                  <input
                    value={form.sourceLabel}
                    onChange={(e) => setForm((f) => ({ ...f, sourceLabel: e.target.value }))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                  />
                </Field>
              </div>
              <Field label="Cover image path">
                <input
                  value={form.coverImage}
                  onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                />
              </Field>
              <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.breaking}
                    onChange={(e) => setForm((f) => ({ ...f, breaking: e.target.checked }))}
                  />
                  Breaking
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  />
                  Featured
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.pinned}
                    onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))}
                  />
                  Pinned hero
                </label>
                <label className="inline-flex items-center gap-2">
                  Status
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        status: e.target.value as "draft" | "published" | "archived",
                      }))
                    }
                    className="rounded border border-slate-700 bg-slate-900 px-2 py-1"
                  >
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                    <option value="archived">archived</option>
                  </select>
                </label>
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="button"
                disabled={saving || !form.title.trim()}
                onClick={save}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 disabled:opacity-50"
              >
                <Check className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-slate-400">{label}</span>
      {children}
    </label>
  );
}
