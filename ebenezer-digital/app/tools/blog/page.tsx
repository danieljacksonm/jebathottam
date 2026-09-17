import type { Metadata } from "next";
import { ToolsHeader } from "../ToolsHeader";
import { FactoryHubPage } from "@/components/FactoryHubPage";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "Tool guides library | Ebenezer Tools",
  description: "100,000+ indexed guides explaining affiliate tools, SaaS, pricing, and alternatives for every audience.",
  path: "/tools/blog",
});

type Props = { searchParams: { page?: string } };

export default function ToolsBlogHub({ searchParams }: Props) {
  const page = Number.parseInt(searchParams.page || "1", 10) || 1;
  return (
    <>
      <ToolsHeader />
      <FactoryHubPage channel="tools" page={page} />
    </>
  );
}
