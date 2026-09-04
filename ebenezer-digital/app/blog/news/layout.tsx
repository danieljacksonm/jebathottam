import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NewsChrome } from "./components/NewsChrome";
import { JOURNAL_URL, NEWS_URL, pageMetadata } from "@/lib/site-url";
import { listPublicNews } from "@/lib/news-service";

export const revalidate = 300;

const base = pageMetadata({
  title: "Ebenezer News | What is happening now",
  description:
    "Ebenezer News — technology, AI and digital world news. Fast enough for breaking news. Clear enough to trust.",
  path: "/blog/news",
});

export const metadata: Metadata = {
  ...base,
  other: {
    google: "notranslate",
  },
  alternates: {
    ...base.alternates,
    types: {
      "application/rss+xml": [{ url: "/api/news/rss", title: "Ebenezer World News RSS" }],
      "application/xml": [{ url: "/api/news/sitemap", title: "Ebenezer World News Sitemap" }],
    },
  },
};

export default async function NewsLayout({ children }: { children: ReactNode }) {
  let initialArticles: Awaited<ReturnType<typeof listPublicNews>> = [];
  try {
    initialArticles = await listPublicNews();
  } catch {
    /* wire can fail — client will retry */
  }
  const initialUpdatedAt = new Date().toISOString();

  const newsOrg = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Ebenezer News",
    url: NEWS_URL,
    logo: `${NEWS_URL}/og-news.png`,
    sameAs: [JOURNAL_URL, NEWS_URL],
    publishingPrinciples: `${NEWS_URL}/newsroom/editorial-policy`,
    correctionsPolicy: `${NEWS_URL}/newsroom/editorial-policy`,
    ethicsPolicy: `${NEWS_URL}/newsroom/editorial-policy`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "newsroom",
      url: `${NEWS_URL}/newsroom/contact`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsOrg) }} />
      <NewsChrome
        initialArticles={initialArticles.slice(0, 200)}
        initialUpdatedAt={initialUpdatedAt}
      >
        {children}
      </NewsChrome>
    </>
  );
}
