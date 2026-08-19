import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NewsChrome } from "./components/NewsChrome";
import { JOURNAL_URL, pageMetadata } from "@/lib/site-url";

const base = pageMetadata({
  title: "E> News | What is happening now",
  description:
    "Ebenezer News — a global digital newsroom. World, India, politics, business, technology, science, sports, and opinion. Fast enough for breaking news. Clear enough to trust.",
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

export default function NewsLayout({ children }: { children: ReactNode }) {
  const newsOrg = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Ebenezer World News",
    url: `${JOURNAL_URL}/blog/news`,
    logo: `${JOURNAL_URL}/og-news.png`,
    sameAs: [JOURNAL_URL],
    publishingPrinciples: `${JOURNAL_URL}/blog/newsroom/editorial-policy`,
    correctionsPolicy: `${JOURNAL_URL}/blog/newsroom/editorial-policy`,
    ethicsPolicy: `${JOURNAL_URL}/blog/newsroom/editorial-policy`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "newsroom",
      url: `${JOURNAL_URL}/blog/newsroom/contact`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsOrg) }} />
      <NewsChrome>{children}</NewsChrome>
    </>
  );
}
