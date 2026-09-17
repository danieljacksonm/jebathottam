import type { Metadata } from "next";
import { FactoryHubPage } from "@/components/FactoryHubPage";
import { EcosystemNav } from "@/components/EcosystemNav";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "Hardware guides | Ebenezer Discover",
  description: "100,000+ hardware buying guides — laptops, GPUs, monitors, networking, and components explained.",
  path: "/discover/blog",
});

type Props = { searchParams: { page?: string } };

export default function DiscoverBlogHub({ searchParams }: Props) {
  const page = Number.parseInt(searchParams.page || "1", 10) || 1;
  return (
    <div className="discover-root min-h-screen">
      <EcosystemNav active="discover" />
      <FactoryHubPage channel="discover" page={page} />
    </div>
  );
}
