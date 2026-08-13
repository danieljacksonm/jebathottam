import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Ebenezer Journal | Learn Digital Simply + World News",
  description:
    "1000+ simple digital lessons (electricity, Wi‑Fi, AI, internet) written for Class‑5 clarity, plus E> World News. Explore more with Ebenezer AI. RSS ready for Google News and Microsoft feeds.",
  openGraph: {
    title: "Ebenezer Journal & Learn Desk",
    description: "Simple detailed digital explainers and a world newsroom from Ebenezer Digital.",
    type: "website",
  },
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/api/blog/rss", title: "Ebenezer Journal RSS" }],
    },
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}
