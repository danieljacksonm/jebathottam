"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { NewsArticle, NewsNavId } from "../data";

const CACHE_KEY = "eben-news-cache-v5";
const POLL_MS = 90_000;
const PAGE = 120;

type NewsContextValue = {
  articles: NewsArticle[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  refreshNews: () => Promise<number>;
  loadMore: () => Promise<void>;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  activeNav: NewsNavId | "ALL";
  setActiveNav: (v: NewsNavId | "ALL") => void;
  updatedAt: string;
};

const NewsContext = createContext<NewsContextValue | null>(null);

function latestStamp(items: NewsArticle[]) {
  let max = 0;
  for (const item of items) {
    const t = item.publishedAt ? new Date(item.publishedAt).getTime() : 0;
    if (t > max) max = t;
  }
  return max ? new Date(max).toISOString() : "";
}

function stampMs(value?: string) {
  if (!value) return 0;
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export function NewsProvider({
  children,
  initialArticles = [],
  initialUpdatedAt = "",
}: {
  children: ReactNode;
  initialArticles?: NewsArticle[];
  initialUpdatedAt?: string;
}) {
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [loading, setLoading] = useState(initialArticles.length === 0);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NewsNavId | "ALL">("ALL");
  const [updatedAt, setUpdatedAt] = useState<string>(initialUpdatedAt);
  const articlesRef = useRef(initialArticles);
  articlesRef.current = articles;

  const refreshNews = async () => {
    const since = articlesRef.current[0]?.publishedAt || "";
    setRefreshing(true);
    try {
      const url = since
        ? `/api/news?limit=${PAGE}&since=${encodeURIComponent(since)}`
        : `/api/news?limit=${PAGE}`;
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      const items = Array.isArray(data.items) ? (data.items as NewsArticle[]) : [];
      const known = new Set(articlesRef.current.map((a) => a.slug || a.id));
      const fresh = items.filter((a) => !known.has(a.slug || a.id));
      if (fresh.length) {
        setArticles((prev) => [...fresh, ...prev]);
        setUpdatedAt(latestStamp(fresh));
      }
      return fresh.length;
    } catch {
      return 0;
    } finally {
      setRefreshing(false);
    }
  };

  const loadMore = async () => {
    const offset = articlesRef.current.length;
    const res = await fetch(`/api/news?limit=${PAGE}&offset=${offset}`, { cache: "no-store" });
    const data = await res.json();
    const items = Array.isArray(data.items) ? (data.items as NewsArticle[]) : [];
    setHasMore(Boolean(data.hasMore) && items.length > 0);
    if (!items.length) return;
    setArticles((prev) => {
      const known = new Set(prev.map((a) => a.slug || a.id));
      return [...prev, ...items.filter((a) => !known.has(a.slug || a.id))];
    });
  };

  useEffect(() => {
    let alive = true;
    let hasWarmCache = initialArticles.length > 0;

    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { items?: NewsArticle[]; updatedAt?: string };
        if (Array.isArray(parsed.items) && parsed.items.length) {
          const localStamp = stampMs(parsed.updatedAt || latestStamp(parsed.items));
          const ssrStamp = stampMs(initialUpdatedAt || latestStamp(initialArticles));
          if (localStamp >= ssrStamp) {
            hasWarmCache = true;
            setArticles(parsed.items);
            setUpdatedAt(parsed.updatedAt || latestStamp(parsed.items));
            setLoading(false);
          }
        }
      }
    } catch {
      /* ignore */
    }

    const load = (first = false) => {
      if (first && initialArticles.length === 0 && !hasWarmCache) setLoading(true);
      fetch(`/api/news?limit=${PAGE}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          if (!alive) return;
          const items = Array.isArray(data.items) ? data.items : [];
          setHasMore(Boolean(data.hasMore));
          if (items.length) {
            setArticles((prev) => {
              const incoming = latestStamp(items);
              const current = latestStamp(prev);
              if (stampMs(incoming) < stampMs(current) && prev.length) return prev;
              return items;
            });
            setUpdatedAt(latestStamp(items));
            try {
              localStorage.setItem(CACHE_KEY, JSON.stringify({ items, updatedAt: latestStamp(items) }));
            } catch {
              /* ignore */
            }
          } else if (first && initialArticles.length === 0) {
            setArticles([]);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (alive) setLoading(false);
        });
    };

    load(true);
    const timer = window.setInterval(() => void refreshNews(), POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refreshNews();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      alive = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, []);

  const value = useMemo(
    () => ({
      articles,
      loading,
      refreshing,
      hasMore,
      refreshNews,
      loadMore,
      searchOpen,
      setSearchOpen,
      menuOpen,
      setMenuOpen,
      activeNav,
      setActiveNav,
      updatedAt,
    }),
    [articles, loading, refreshing, hasMore, searchOpen, menuOpen, activeNav, updatedAt]
  );

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

export function useNews() {
  const ctx = useContext(NewsContext);
  if (!ctx) throw new Error("useNews must be used inside NewsProvider");
  return ctx;
}
