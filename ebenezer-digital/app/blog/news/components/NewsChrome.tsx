"use client";

import { LayoutGroup } from "framer-motion";
import { NewsProvider } from "./NewsProvider";
import { NewsCursor } from "./NewsCursor";
import { NewsProgress } from "./NewsProgress";
import { NewsTicker } from "./NewsTicker";
import { NewsNav } from "./NewsNav";
import { NewsSearch } from "./NewsSearch";
import { NewsMobileBar } from "./NewsMobileBar";
import "../news.css";

export function NewsChrome({ children }: { children: React.ReactNode }) {
  return (
    <NewsProvider>
      <LayoutGroup>
        <div className="news-root relative min-h-screen pb-16 md:pb-0">
          <div className="news-grain" />
          <NewsProgress />
          <NewsCursor />
          <NewsTicker />
          <NewsNav />
          <NewsSearch />
          {children}
          <NewsMobileBar />
        </div>
      </LayoutGroup>
    </NewsProvider>
  );
}
