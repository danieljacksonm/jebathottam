import type { Metadata } from "next";
import type { ReactNode } from "react";
import { EcosystemNav } from "@/components/EcosystemNav";
import "../affiliate/premium.css";

export const metadata: Metadata = {
  title: {
    default: "Ebenezer Tools — Find the right tool for the job",
    template: "%s | Ebenezer Tools",
  },
  description:
    "Discover, compare and choose the best AI tools, SaaS and software for your needs — with honest pros, cons and pricing notes.",
  openGraph: {
    title: "Ebenezer Tools",
    description: "Premium AI & SaaS discovery and comparison.",
    url: "https://tools.ebenezerdigital.com",
    siteName: "Ebenezer Tools",
    type: "website",
  },
  alternates: {
    canonical: "https://tools.ebenezerdigital.com",
  },
};

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="aff-root">
      <EcosystemNav variant="light" active="tools" />
      {children}
    </div>
  );
}
