import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NewsChrome } from "./components/NewsChrome";

export const metadata: Metadata = {
  title: "E> News | What is happening now",
  description:
    "Ebenezer News — a global digital newsroom on .info. World, India, politics, business, technology, science, sports, and opinion. Fast enough for breaking news. Clear enough to trust.",
  openGraph: {
    title: "E> News",
    description: "What is happening. What matters. What to read.",
    type: "website",
  },
};

export default function NewsLayout({ children }: { children: ReactNode }) {
  return <NewsChrome>{children}</NewsChrome>;
}
