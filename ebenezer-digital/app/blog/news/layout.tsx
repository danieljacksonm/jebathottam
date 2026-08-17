import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NewsChrome } from "./components/NewsChrome";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "E> News | What is happening now",
  description:
    "Ebenezer News — a global digital newsroom. World, India, politics, business, technology, science, sports, and opinion. Fast enough for breaking news. Clear enough to trust.",
  path: "/blog/news",
});

export default function NewsLayout({ children }: { children: ReactNode }) {
  return <NewsChrome>{children}</NewsChrome>;
}
