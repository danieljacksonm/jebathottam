"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type MediaItem = { src: string; name: string };

export default function AdminMediaPage() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      void fetch(`/api/admin/media?q=${encodeURIComponent(q)}&limit=160`)
        .then((r) => r.json())
        .then((data) => {
          setItems(data.images || []);
          setTotal(data.total || 0);
        });
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  async function copy(src: string) {
    await navigator.clipboard.writeText(src);
    setCopied(src);
  }

  return (
    <div className="admin-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Media library</h1>
          <p className="admin-muted">
            Browse local travel images ({total} matches). Copy paths into
            destinations, packages, or blogs.
          </p>
        </div>
        <Link className="admin-btn secondary" href="/admin">
          Dashboard
        </Link>
      </div>
      <div className="admin-field">
        <label htmlFor="q">Filter</label>
        <input
          id="q"
          value={q}
          placeholder="goa, darjeeling, meenakshi…"
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {items.map((item) => (
          <button
            key={item.src}
            type="button"
            onClick={() => copy(item.src)}
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              background: "#0b1220",
              borderRadius: 10,
              padding: 0,
              overflow: "hidden",
              cursor: "pointer",
              textAlign: "left",
              color: "#e2e8f0",
            }}
            title={item.src}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.name}
              style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }}
            />
            <div style={{ padding: "0.4rem 0.5rem", fontSize: 11 }}>
              {copied === item.src ? "Copied!" : item.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
