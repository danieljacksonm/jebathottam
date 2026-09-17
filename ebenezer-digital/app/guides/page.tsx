import type { Metadata } from "next";
import { FactoryHubPage } from "@/components/FactoryHubPage";
import { StudioPageShell } from "@/components/studio/StudioPageShell";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "Digital service guides | Ebenezer Digital",
  description: "100,000+ service guides for web development, SEO, SaaS, automation, and every industry we serve.",
  path: "/guides",
});

type Props = { searchParams: { page?: string } };

export default function StudioGuidesHub({ searchParams }: Props) {
  const page = Number.parseInt(searchParams.page || "1", 10) || 1;
  return (
    <StudioPageShell kicker="Guides" title="Service knowledge base" lead="">
      <FactoryHubPage channel="studio" page={page} />
    </StudioPageShell>
  );
}
