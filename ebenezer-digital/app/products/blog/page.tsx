import type { Metadata } from "next";
import { FactoryHubPage } from "@/components/FactoryHubPage";
import { StoreNav } from "../components/StoreNav";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "Product guides | Ebenezer Store",
  description: "100,000+ guides for digital products, templates, SaaS kits, and shop tools on Ebenezer Store.",
  path: "/products/blog",
});

type Props = { searchParams: { page?: string } };

export default function StoreBlogHub({ searchParams }: Props) {
  const page = Number.parseInt(searchParams.page || "1", 10) || 1;
  return (
    <div className="store-root min-h-screen">
      <StoreNav />
      <FactoryHubPage channel="store" page={page} />
    </div>
  );
}
