"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SITE_NAV, newsArticleHref } from "@/lib/site-nav";

type Hit = {
  kind: "NEWS" | "JOURNAL";
  title: string;
  summary: string;
  href: string;
};

function InfoSearchInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";

  const [q, setQ] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [searched, setSearched] = useState(Boolean(initialQ.trim()));

  const runQuery = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setHits([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const [newsRes, blogRes] = await Promise.all([
        fetch(`/api/news?q=${encodeURIComponent(trimmed)}&limit=12`).then((r) => r.json()),
        fetch(`/api/blog/list?q=${encodeURIComponent(trimmed)}&limit=12`).then((r) => r.json()),
      ]);

      const articles = Array.isArray(newsRes)
        ? newsRes
        : newsRes.items || newsRes.articles || newsRes.results || [];
      const mappedNews: Hit[] = (
        articles as { title: string; dek?: string; slug: string; region?: string }[]
      )
        .slice(0, 12)
        .filter((a) => a?.slug && a?.title)
        .map((a) => ({
          kind: "NEWS" as const,
          title: a.title,
          summary: a.dek || "",
          href: newsArticleHref(a.slug, a.region || "World"),
        }));

      const posts = Array.isArray(blogRes?.posts) ? blogRes.posts : [];
      const mappedJournal: Hit[] = posts.slice(0, 12).map((p: { title: string; excerpt?: string; slug: string }) => ({
        kind: "JOURNAL" as const,
        title: p.title,
        summary: p.excerpt || "",
        href: `${SITE_NAV.journal}/blog/${p.slug}`,
      }));

      setHits([...mappedNews, ...mappedJournal]);
    } catch {
      setHits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setQ(initialQ);
    if (initialQ.trim()) runQuery(initialQ);
  }, [initialQ, runQuery]);

  function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = q.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    const qs = params.toString();
    router.replace(qs ? `/info/search?${qs}` : "/info/search", { scroll: false });
    runQuery(trimmed);
  }

  const empty = useMemo(() => searched && !loading && hits.length === 0, [searched, loading, hits]);

  return (
    <section className="info-section" style={{ paddingTop: "4rem" }}>
      <p className="info-kicker">Search</p>
      <h1 className="info-h2">What are you looking for?</h1>
      <p className="info-lead">Search News and Journal in one place. Share this page — your query stays in the URL.</p>
      <form className="info-form" onSubmit={onSubmit}>
        <label>
          Search
          <input
            type="search"
            name="q"
            placeholder="What are you looking for?"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
        </label>
        <button className="info-btn info-btn-solid" type="submit" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      <div className="info-search-results" aria-live="polite">
        {hits.map((h) => (
          <a key={`${h.kind}-${h.href}`} className="info-search-item" href={h.href}>
            <span className="info-badge">{h.kind}</span>
            <strong>{h.title}</strong>
            {h.summary ? <span style={{ color: "var(--info-muted)" }}>{h.summary}</span> : null}
          </a>
        ))}
        {empty && (
          <p style={{ color: "var(--info-muted)" }}>
            No stories matched. Try different words, or browse{" "}
            <a href={SITE_NAV.news} style={{ color: "var(--info-accent)" }}>
              News
            </a>{" "}
            and{" "}
            <a href={SITE_NAV.journal} style={{ color: "var(--info-accent)" }}>
              Journal
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}

export default function InfoSearchPage() {
  return (
    <Suspense fallback={<section className="info-section" style={{ paddingTop: "4rem" }} />}>
      <InfoSearchInner />
    </Suspense>
  );
}
