import type { Metadata } from "next";
import "./discover.css";
import DiscoverClient from "./DiscoverClient";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "What are you looking for? | Ebenezer Digital",
  description:
    "Tell Ebenezer what you need. We’ll point you to the right place — Services, Store, Tools, Hardware, Guides, or AI — and you choose.",
  path: "/discover",
});

type Props = { searchParams: { q?: string } };

export default function DiscoverPage({ searchParams }: Props) {
  return <DiscoverClient initialQuery={searchParams.q || ""} />;
}
