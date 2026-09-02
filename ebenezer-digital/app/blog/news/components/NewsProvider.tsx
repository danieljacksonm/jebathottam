"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { NewsArticle, NewsNavId } from "../data";

const CACHE_KEY = "eben-news-cache-v1";

type NewsContextValue = {
  articles: NewsArticle[];
  loading: boolean;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  activeNav: NewsNavId | "ALL";
  setActiveNav: (v: NewsNavId | "ALL") => void;
  updatedAt: string;
};

const NewsContext = createContext<NewsContextValue | null>(null);

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NewsNavId | "ALL">("ALL");
  const [updatedAt, setUpdatedAt] = useState<string>(initialUpdatedAt);

  useEffect(() => {
    let alive = true;
    let hasWarmCache = false;
    // Quick paint from last successful fetch so first open is not blank.
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { items?: NewsArticle[]; updatedAt?: string };
        if (Array.isArray(parsed.items) && parsed.items.length) {
          hasWarmCache = true;
          setArticles(parsed.items);
          setUpdatedAt(parsed.updatedAt || "");
          setLoading(false);
        }
      }
    } catch {
      // ignore local cache parse errors
    }

    const load = (first = false) => {
      if (first) setLoading(true);
      fetch("/api/news?limit=200")
        .then((r) => r.json())
        .then((data) => {
          if (!alive) return;
          const items = Array.isArray(data.items) ? data.items : [];
          if (items.length) {
            setArticles((prev) => {
              if (prev.length === items.length && prev[0]?.id === items[0]?.id) return prev;
              return items;
            });
            const stamp = new Date().toISOString();
            setUpdatedAt(stamp);
            try {
              localStorage.setItem(CACHE_KEY, JSON.stringify({ items, updatedAt: stamp }));
            } catch {
              // ignore storage full errors
            }
          } else if (first) {
            setArticles([]);
          }
        })
        .catch(() => {
          if (alive && first) setArticles([]);
        })
        .finally(() => {
          if (alive) setLoading(false);
        });
    };

    load(initialArticles.length === 0);
    const timer = window.setInterval(() => load(false), 5 * 60 * 1000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  const value = useMemo(
    () => ({
      articles,
      loading,
      searchOpen,
      setSearchOpen,
      menuOpen,
      setMenuOpen,
      activeNav,
      setActiveNav,
      updatedAt,
    }),
    [articles, loading, searchOpen, menuOpen, activeNav, updatedAt]
  );

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

export function useNews() {
  const ctx = useContext(NewsContext);
  if (!ctx) throw new Error("useNews must be used inside NewsProvider");
  return ctx;
}
