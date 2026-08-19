import type { Metadata } from "next";
import type { ReactNode } from "react";
import { EbenDock } from "@/components/EbenDock";
import { pageMetadata } from "@/lib/site-url";

const base = pageMetadata({
  title: "Ebenezer Journal | Learn Digital Simply + World News",
  description:
    "Simple digital lessons and the Ebenezer Journal — written clearly, plus world news. RSS ready for Google News and Microsoft feeds.",
  path: "/blog",
});

export const metadata: Metadata = {
  ...base,
  other: {
    google: "notranslate",
  },
  openGraph: {
    ...base.openGraph,
    title: "Ebenezer Journal & Learn Desk",
    description: "Simple detailed digital explainers and a world newsroom from Ebenezer Digital.",
  },
  alternates: {
    ...base.alternates,
    types: {
      "application/rss+xml": [{ url: "/api/blog/rss", title: "Ebenezer Journal RSS" }],
    },
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <EbenDock />
    </>
  );
}
