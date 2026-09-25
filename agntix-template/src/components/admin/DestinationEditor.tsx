"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type DestinationRecord = {
  id: string;
  slug: string;
  nameEn: string;
  nameTa: string;
  nameHi: string;
  country: string;
  continent: string;
  region: string;
  taglineEn: string;
  taglineTa: string;
  taglineHi: string;
  bodyEn: string;
  bodyTa: string;
  bodyHi: string;
  image: string;
  status: string;
  featured: boolean;
  priceFrom: number | null;
  sortOrder: number;
};

export function DestinationEditor({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial: DestinationRecord | null;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: initial?.slug ?? "",
    nameEn: initial?.nameEn ?? "",
    nameTa: initial?.nameTa ?? "",
    nameHi: initial?.nameHi ?? "",
    country: initial?.country ?? "India",
    continent: initial?.continent ?? "Asia",
    region: initial?.region ?? "",
    taglineEn: initial?.taglineEn ?? "",
    taglineTa: initial?.taglineTa ?? "",
    taglineHi: initial?.taglineHi ?? "",
    bodyEn: initial?.bodyEn ?? "",
    bodyTa: initial?.bodyTa ?? "",
    bodyHi: initial?.bodyHi ?? "",
    image: initial?.image ?? "/images/travel/d/kodaikanal.jpg",
    status: initial?.status ?? "enquiry",
    featured: initial?.featured ?? false,
    priceFrom: initial?.priceFrom ?? "",
    sortOrder: initial?.sortOrder ?? 0,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      priceFrom: form.priceFrom === "" ? null : Number(form.priceFrom),
      sortOrder: Number(form.sortOrder) || 0,
    };
    const res = await fetch(
      mode === "create"
        ? "/api/admin/destinations"
        : `/api/admin/destinations/${initial!.id}`,
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed");
      return;
    }
    const data = await res.json();
    if (mode === "create") {
      router.replace(`/admin/destinations/${data.destination.id}`);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="admin-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ margin: 0 }}>
          {mode === "create" ? "New destination" : "Edit destination"}
        </h1>
        <Link className="admin-btn secondary" href="/admin/destinations">
          Back
        </Link>
      </div>
      {error ? <p className="admin-error">{error}</p> : null}
      {(
        [
          ["nameEn", "Name (EN)"],
          ["slug", "Slug"],
          ["nameTa", "Name (TA)"],
          ["nameHi", "Name (HI)"],
          ["country", "Country"],
          ["continent", "Continent"],
          ["region", "Region"],
          ["image", "Image URL"],
          ["taglineEn", "Tagline (EN)"],
        ] as const
      ).map(([key, label]) => (
        <div className="admin-field" key={key}>
          <label htmlFor={key}>{label}</label>
          <input
            id={key}
            value={String(form[key])}
            onChange={(e) => set(key, e.target.value)}
          />
        </div>
      ))}
      <div className="admin-field">
        <label htmlFor="bodyEn">Overview (EN)</label>
        <textarea
          id="bodyEn"
          value={form.bodyEn}
          onChange={(e) => set("bodyEn", e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="bodyTa">Overview (TA)</label>
        <textarea
          id="bodyTa"
          value={form.bodyTa}
          onChange={(e) => set("bodyTa", e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="bodyHi">Overview (HI)</label>
        <textarea
          id="bodyHi"
          value={form.bodyHi}
          onChange={(e) => set("bodyHi", e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={form.status}
          onChange={(e) => set("status", e.target.value)}
        >
          <option value="enquiry">Enquiry</option>
          <option value="published">Published</option>
          <option value="coming_soon">Coming soon</option>
        </select>
      </div>
      <div className="admin-field">
        <label htmlFor="featured">
          <input
            id="featured"
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />{" "}
          Featured on homepage
        </label>
      </div>
      <div className="admin-field">
        <label htmlFor="priceFrom">Indicative price from (optional)</label>
        <input
          id="priceFrom"
          value={form.priceFrom}
          onChange={(e) => set("priceFrom", e.target.value)}
        />
      </div>
      <div className="admin-actions">
        <button className="admin-btn" type="button" disabled={saving} onClick={save}>
          {saving ? "Saving…" : "Save destination"}
        </button>
      </div>
    </div>
  );
}
