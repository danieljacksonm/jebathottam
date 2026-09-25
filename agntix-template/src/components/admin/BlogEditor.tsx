"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type DestinationOption = { id: string; slug: string; nameEn: string };

type BlogRecord = {
  id: string;
  slug: string;
  status: string;
  featured?: boolean;
  date: string;
  readMinutes: number;
  image: string;
  titleEn: string;
  titleTa: string;
  titleHi: string;
  excerptEn: string;
  excerptTa: string;
  excerptHi: string;
  bodyEn: string;
  bodyTa: string;
  bodyHi: string;
  tagsEn: string;
  tagsTa: string;
  tagsHi: string;
  seoTitleEn: string;
  seoTitleTa: string;
  seoTitleHi: string;
  seoDescriptionEn: string;
  seoDescriptionTa: string;
  seoDescriptionHi: string;
  ogImage: string | null;
  canonicalUrl: string | null;
  authorEn: string;
  authorTa: string;
  authorHi: string;
  destinationId: string | null;
};

function parseJsonArray(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function BlogEditor({
  mode,
  destinations,
  initial,
}: {
  mode: "create" | "edit";
  destinations: DestinationOption[];
  initial: BlogRecord | null;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [date, setDate] = useState(
    initial?.date ?? new Date().toISOString().slice(0, 10),
  );
  const [readMinutes, setReadMinutes] = useState(initial?.readMinutes ?? 10);
  const [image, setImage] = useState(
    initial?.image ?? "/images/travel/d/darjeeling.jpg",
  );
  const [destinationId, setDestinationId] = useState(
    initial?.destinationId ?? "",
  );
  const [titleEn, setTitleEn] = useState(initial?.titleEn ?? "");
  const [titleTa, setTitleTa] = useState(initial?.titleTa ?? "");
  const [titleHi, setTitleHi] = useState(initial?.titleHi ?? "");
  const [excerptEn, setExcerptEn] = useState(initial?.excerptEn ?? "");
  const [excerptTa, setExcerptTa] = useState(initial?.excerptTa ?? "");
  const [excerptHi, setExcerptHi] = useState(initial?.excerptHi ?? "");
  const [bodyEn, setBodyEn] = useState(
    parseJsonArray(initial?.bodyEn ?? "[]").join("\n\n"),
  );
  const [bodyTa, setBodyTa] = useState(
    parseJsonArray(initial?.bodyTa ?? "[]").join("\n\n"),
  );
  const [bodyHi, setBodyHi] = useState(
    parseJsonArray(initial?.bodyHi ?? "[]").join("\n\n"),
  );
  const [tagsEn, setTagsEn] = useState(
    parseJsonArray(initial?.tagsEn ?? "[]").join(", "),
  );
  const [seoTitleEn, setSeoTitleEn] = useState(initial?.seoTitleEn ?? "");
  const [seoDescriptionEn, setSeoDescriptionEn] = useState(
    initial?.seoDescriptionEn ?? "",
  );
  const [ogImage, setOgImage] = useState(initial?.ogImage ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(
    initial?.canonicalUrl ?? "",
  );
  const [authorEn, setAuthorEn] = useState(
    initial?.authorEn ?? "Canaan Travel Hub",
  );

  const previewHref = useMemo(() => {
    if (!slug) return "/en/blog";
    return `/en/blog/${slug}`;
  }, [slug]);

  async function save(nextStatus?: string) {
    setSaving(true);
    setError("");
    const payload = {
      slug,
      status: nextStatus ?? status,
      featured,
      date,
      readMinutes: Number(readMinutes) || 8,
      image,
      destinationId: destinationId || null,
      titleEn,
      titleTa: titleTa || titleEn,
      titleHi: titleHi || titleEn,
      excerptEn,
      excerptTa: excerptTa || excerptEn,
      excerptHi: excerptHi || excerptEn,
      bodyEn: bodyEn.split(/\n\n+/).map((s) => s.trim()).filter(Boolean),
      bodyTa: (bodyTa || bodyEn)
        .split(/\n\n+/)
        .map((s) => s.trim())
        .filter(Boolean),
      bodyHi: (bodyHi || bodyEn)
        .split(/\n\n+/)
        .map((s) => s.trim())
        .filter(Boolean),
      tagsEn: tagsEn
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      tagsTa: tagsEn
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      tagsHi: tagsEn
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      seoTitleEn,
      seoDescriptionEn,
      ogImage: ogImage || null,
      canonicalUrl: canonicalUrl || null,
      authorEn,
    };

    const res = await fetch(
      mode === "create" ? "/api/admin/blogs" : `/api/admin/blogs/${initial!.id}`,
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
      router.replace(`/admin/blogs/${data.post.id}`);
    } else {
      router.refresh();
    }
  }

  async function remove() {
    if (!initial || !confirm("Delete this article permanently?")) return;
    const res = await fetch(`/api/admin/blogs/${initial.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setError("Delete failed");
      return;
    }
    router.replace("/admin/blogs");
  }

  return (
    <div className="admin-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            {mode === "create" ? "New article" : "Edit article"}
          </h1>
          <p className="admin-muted" style={{ margin: "0.35rem 0 0" }}>
            Paragraphs are split by blank lines. Drafts stay off the public site.
          </p>
        </div>
        <Link className="admin-btn secondary" href="/admin/blogs">
          Back to list
        </Link>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-field">
        <label htmlFor="titleEn">Title (EN)</label>
        <input
          id="titleEn"
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          required
        />
      </div>
      <div className="admin-field">
        <label htmlFor="slug">Slug</label>
        <input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="complete-kodaikanal-travel-guide"
          required
        />
      </div>
      <div className="admin-field">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div className="admin-field">
        <label>
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />{" "}
          Featured editorial guide (homepage strip)
        </label>
      </div>
      <div className="admin-field">
        <label htmlFor="destinationId">Related destination</label>
        <select
          id="destinationId"
          value={destinationId}
          onChange={(e) => setDestinationId(e.target.value)}
        >
          <option value="">None</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nameEn} ({d.slug})
            </option>
          ))}
        </select>
      </div>
      <div className="admin-field">
        <label htmlFor="image">Featured image URL</label>
        <input
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="date">Publish date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="readMinutes">Reading minutes</label>
        <input
          id="readMinutes"
          type="number"
          min={1}
          value={readMinutes}
          onChange={(e) => setReadMinutes(Number(e.target.value))}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="authorEn">Author</label>
        <input
          id="authorEn"
          value={authorEn}
          onChange={(e) => setAuthorEn(e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="excerptEn">Excerpt (EN)</label>
        <textarea
          id="excerptEn"
          value={excerptEn}
          onChange={(e) => setExcerptEn(e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="bodyEn">Body paragraphs (EN)</label>
        <textarea
          id="bodyEn"
          value={bodyEn}
          onChange={(e) => setBodyEn(e.target.value)}
          style={{ minHeight: 220 }}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="tagsEn">Tags (comma separated)</label>
        <input
          id="tagsEn"
          value={tagsEn}
          onChange={(e) => setTagsEn(e.target.value)}
        />
      </div>

      <h2 style={{ marginTop: "1.5rem" }}>Translations</h2>
      <div className="admin-field">
        <label htmlFor="titleTa">Title (TA)</label>
        <input
          id="titleTa"
          value={titleTa}
          onChange={(e) => setTitleTa(e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="titleHi">Title (HI)</label>
        <input
          id="titleHi"
          value={titleHi}
          onChange={(e) => setTitleHi(e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="excerptTa">Excerpt (TA)</label>
        <textarea
          id="excerptTa"
          value={excerptTa}
          onChange={(e) => setExcerptTa(e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="excerptHi">Excerpt (HI)</label>
        <textarea
          id="excerptHi"
          value={excerptHi}
          onChange={(e) => setExcerptHi(e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="bodyTa">Body (TA)</label>
        <textarea
          id="bodyTa"
          value={bodyTa}
          onChange={(e) => setBodyTa(e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="bodyHi">Body (HI)</label>
        <textarea
          id="bodyHi"
          value={bodyHi}
          onChange={(e) => setBodyHi(e.target.value)}
        />
      </div>

      <h2 style={{ marginTop: "1.5rem" }}>SEO</h2>
      <div className="admin-field">
        <label htmlFor="seoTitleEn">SEO title</label>
        <input
          id="seoTitleEn"
          value={seoTitleEn}
          onChange={(e) => setSeoTitleEn(e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="seoDescriptionEn">SEO description</label>
        <textarea
          id="seoDescriptionEn"
          value={seoDescriptionEn}
          onChange={(e) => setSeoDescriptionEn(e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="ogImage">OG image URL</label>
        <input
          id="ogImage"
          value={ogImage}
          onChange={(e) => setOgImage(e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="canonicalUrl">Canonical URL</label>
        <input
          id="canonicalUrl"
          value={canonicalUrl}
          onChange={(e) => setCanonicalUrl(e.target.value)}
        />
      </div>

      <div className="admin-actions">
        <button
          className="admin-btn"
          type="button"
          disabled={saving}
          onClick={() => save("published")}
        >
          {saving ? "Saving…" : "Save & publish"}
        </button>
        <button
          className="admin-btn secondary"
          type="button"
          disabled={saving}
          onClick={() => save("draft")}
        >
          Save draft
        </button>
        <Link className="admin-btn secondary" href={previewHref} target="_blank">
          Preview
        </Link>
        {mode === "edit" ? (
          <button className="admin-btn danger" type="button" onClick={remove}>
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
}
