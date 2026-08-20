import type { Metadata } from "next";
import type { ReactNode } from "react";
import { EcosystemNav } from "@/components/EcosystemNav";
import "./catalog.css";

export const metadata: Metadata = {
  title: {
    default: "Ebenezer Products — Compare smarter. Buy better.",
    template: "%s | Ebenezer Products",
  },
  description:
    "Compare laptops, SSDs, RAM, GPUs, monitors and more. See specs, prices and AI-guided recommendations — then buy from trusted merchants.",
  openGraph: {
    title: "Ebenezer Products",
    description: "Compare products, prices and specifications — then let Ebenezer AI help you choose.",
    url: "https://products.ebenezerdigital.com",
    siteName: "Ebenezer Products",
    type: "website",
  },
  alternates: {
    canonical: "https://products.ebenezerdigital.com",
  },
};

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="catalog-root">
      <EcosystemNav variant="light" active="products" />
      {children}
    </div>
  );
}
