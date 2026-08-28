import type { Metadata } from "next";
import { NETWORK_URL } from "@/lib/site-url";
import ToolFinderClient from "./ToolFinderClient";

export const metadata: Metadata = {
  title: "Tool Finder — Describe What You Need",
  description: "Describe a task in plain language and get a matching free tool from Ebenezer Digital Network.",
  alternates: { canonical: `${NETWORK_URL}/finder` },
};

export default function ToolFinderPage() {
  return <ToolFinderClient />;
}
