import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../affiliate/premium.css";
import "./catalog.css";

export const metadata: Metadata = {
  title: {
    default: "Ebenezer Products — Find the right product. Buy with confidence.",
    template: "%s | Ebenezer Products",
  },
  description:
    "Compare laptops, SSDs, RAM, GPUs, monitors and more. Specs, merchants and recommendations — then buy from trusted retailers.",
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
  return <div className="aff-root catalog-root">{children}</div>;
}
