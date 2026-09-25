"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type DestOpt = { id: string; slug: string; nameEn: string };

type PackageRecord = {
  id: string;
  slug: string;
  destinationSlug: string;
  nights: number;
  days: number;
  priceFrom: number;
  pricingMode: string;
  image: string;
  category: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  titleJson: string;
  blurbJson: string;
  bodyJson: string;
  taglineJson: string;
  highlightsJson: string;
  detailsJson: string;
  seoTitleEn: string;
  seoDescriptionEn: string;
};

function parseLoc(raw: string) {
  try {
    return JSON.parse(raw) as { en?: string; ta?: string; hi?: string };
  } catch {
    return {};
  }
}

function parseHighlights(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.en) ? parsed.en.join("\n") : "";
  } catch {
    return "";
  }
}

export function PackageEditor({
  mode,
  destinations,
  initial,
}: {
  mode: "create" | "edit";
  destinations: DestOpt[];
  initial: PackageRecord | null;
}) {
  const router = useRouter();
  const title = parseLoc(initial?.titleJson ?? "{}");
  const blurb = parseLoc(initial?.blurbJson ?? "{}");
  const body = parseLoc(initial?.bodyJson ?? "{}");
  const tagline = parseLoc(initial?.taglineJson ?? "{}");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: initial?.slug ?? "",
    destinationSlug: initial?.destinationSlug ?? destinations[0]?.slug ?? "",
    nights: initial?.nights ?? 2,
    days: initial?.days ?? 3,
    priceFrom: initial?.priceFrom ?? 0,
    pricingMode: initial?.pricingMode ?? "enquiry",
    image: initial?.image ?? "/images/travel/d/kodaikanal.jpg",
    category: initial?.category ?? "escape",
    featured: initial?.featured ?? false,
    published: initial?.published ?? true,
    sortOrder: initial?.sortOrder ?? 0,
    titleEn: title.en ?? "",
    titleTa: title.ta ?? "",
    titleHi: title.hi ?? "",
    taglineEn: tagline.en ?? "",
    blurbEn: blurb.en ?? "",
    blurbTa: blurb.ta ?? "",
    blurbHi: blurb.hi ?? "",
    bodyEn: body.en ?? "",
    bodyTa: body.ta ?? "",
    bodyHi: body.hi ?? "",
    highlightsEn: parseHighlights(initial?.highlightsJson ?? "{}"),
    detailsJson: initial?.detailsJson
      ? JSON.stringify(JSON.parse(initial.detailsJson), null, 2)
      : "",
    seoTitleEn: initial?.seoTitleEn ?? "",
    seoDescriptionEn: initial?.seoDescriptionEn ?? "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setError("");
    let detailsJson: unknown = undefined;
    if (form.detailsJson.trim()) {
      try {
        detailsJson = JSON.parse(form.detailsJson);
      } catch {
        setSaving(false);
        setError("detailsJson must be valid JSON");
        return;
      }
    }
    const payload = {
      ...form,
      nights: Number(form.nights),
      days: Number(form.days),
      priceFrom: Number(form.priceFrom) || 0,
      sortOrder: Number(form.sortOrder) || 0,
      highlightsEn: form.highlightsEn
        .split("\n")
        .map((s: string) => s.trim())
        .filter(Boolean),
      detailsJson,
    };
    const res = await fetch(
      mode === "create" ? "/api/admin/packages" : `/api/admin/packages/${initial!.id}`,
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
      router.replace(`/admin/packages/${data.package.id}`);
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
          {mode === "create" ? "New package" : "Edit package"}
        </h1>
        <Link className="admin-btn secondary" href="/admin/packages">
          Back
        </Link>
      </div>
      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-field">
        <label htmlFor="titleEn">Title (EN)</label>
        <input
          id="titleEn"
          value={form.titleEn}
          onChange={(e) => set("titleEn", e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="slug">Slug / ID</label>
        <input
          id="slug"
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="destinationSlug">Destination</label>
        <select
          id="destinationSlug"
          value={form.destinationSlug}
          onChange={(e) => set("destinationSlug", e.target.value)}
        >
          {destinations.map((d) => (
            <option key={d.id} value={d.slug}>
              {d.nameEn}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-field">
        <label htmlFor="pricingMode">Pricing mode</label>
        <select
          id="pricingMode"
          value={form.pricingMode}
          onChange={(e) => set("pricingMode", e.target.value)}
        >
          <option value="enquiry">Enquiry (request a quote)</option>
          <option value="confirmed">Confirmed published rate</option>
        </select>
      </div>
      <div className="admin-field">
        <label htmlFor="priceFrom">Price from (INR, 0 for enquiry)</label>
        <input
          id="priceFrom"
          type="number"
          value={form.priceFrom}
          onChange={(e) => set("priceFrom", Number(e.target.value))}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="nights">Nights</label>
        <input
          id="nights"
          type="number"
          value={form.nights}
          onChange={(e) => set("nights", Number(e.target.value))}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="days">Days</label>
        <input
          id="days"
          type="number"
          value={form.days}
          onChange={(e) => set("days", Number(e.target.value))}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="image">Image URL</label>
        <input
          id="image"
          value={form.image}
          onChange={(e) => set("image", e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
        >
          {["escape", "family", "honeymoon", "luxury", "adventure", "complete"].map(
            (c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ),
          )}
        </select>
      </div>
      <div className="admin-field">
        <label>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />{" "}
          Featured
        </label>
      </div>
      <div className="admin-field">
        <label>
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
          />{" "}
          Published
        </label>
      </div>
      <div className="admin-field">
        <label htmlFor="taglineEn">Tagline (EN)</label>
        <input
          id="taglineEn"
          value={form.taglineEn}
          onChange={(e) => set("taglineEn", e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="blurbEn">Blurb (EN)</label>
        <textarea
          id="blurbEn"
          value={form.blurbEn}
          onChange={(e) => set("blurbEn", e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="bodyEn">Body (EN)</label>
        <textarea
          id="bodyEn"
          value={form.bodyEn}
          onChange={(e) => set("bodyEn", e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="highlightsEn">Highlights (one per line)</label>
        <textarea
          id="highlightsEn"
          value={form.highlightsEn}
          onChange={(e) => set("highlightsEn", e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="detailsJson">Details JSON (itinerary, FAQs, inclusions)</label>
        <textarea
          id="detailsJson"
          value={form.detailsJson}
          onChange={(e) => set("detailsJson", e.target.value)}
          style={{ minHeight: 220, fontFamily: "monospace", fontSize: 12 }}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="seoTitleEn">SEO title</label>
        <input
          id="seoTitleEn"
          value={form.seoTitleEn}
          onChange={(e) => set("seoTitleEn", e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="seoDescriptionEn">SEO description</label>
        <textarea
          id="seoDescriptionEn"
          value={form.seoDescriptionEn}
          onChange={(e) => set("seoDescriptionEn", e.target.value)}
        />
      </div>
      <div className="admin-actions">
        <button className="admin-btn" type="button" disabled={saving} onClick={save}>
          {saving ? "Saving…" : "Save package"}
        </button>
        {mode === "edit" ? (
          <Link
            className="admin-btn secondary"
            href={`/en/packages/${form.slug}`}
            target="_blank"
          >
            Preview
          </Link>
        ) : null}
      </div>
    </div>
  );
}
