import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "Search | Ebenezer Digital Information",
  description: "Search news and journal stories across the Ebenezer information hub.",
  path: "/info/search",
  index: false,
});

export default function InfoSearchLayout({ children }: { children: ReactNode }) {
  return children;
}
