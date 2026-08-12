"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { NewsArticle, NewsNavId } from "../data";

type NewsContextValue = {
  articles: NewsArticle[];
  loading: boolean;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  activeNav: NewsNavId | "ALL";
  setActiveNav: (v: NewsNavId | "ALL") => void;
};

const NewsContext = createContext<NewsContextValue | null>(null);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NewsNavId | "ALL">("ALL");

  useEffect(() => {
    fetch("/api/news?limit=80")
      .then((r) => r.json())
      .then((data) => setArticles(Array.isArray(data.items) ? data.items : []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
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
    }),
    [articles, loading, searchOpen, menuOpen, activeNav]
  );

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

export function useNews() {
  const ctx = useContext(NewsContext);
  if (!ctx) throw new Error("useNews must be used inside NewsProvider");
  return ctx;
}
