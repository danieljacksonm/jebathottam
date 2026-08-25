import type { Metadata } from "next";
import type { ReactNode } from "react";
import { EbenDock } from "@/components/EbenDock";
import { EcosystemNav } from "@/components/EcosystemNav";
import { pageMetadata } from "@/lib/site-url";

const base = pageMetadata({
  title: "Ebenezer Journal | Stories, ideas and knowledge",
  description:
    "Stories, explanations and guides for the digital world — written clearly for everyone.",
  path: "/blog",
});

export const metadata: Metadata = {
  ...base,
  other: {
    google: "notranslate",
  },
  openGraph: {
    ...base.openGraph,
    title: "Ebenezer Journal",
    description: "Stories, ideas and knowledge for a changing world.",
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
      <EcosystemNav variant="light" active="info" />
      {children}
      <EbenDock />
    </>
  );
}
