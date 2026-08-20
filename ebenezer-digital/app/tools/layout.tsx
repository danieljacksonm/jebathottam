import type { Metadata } from "next";
import type { ReactNode } from "react";
import { EcosystemNav } from "@/components/EcosystemNav";

export const metadata: Metadata = {
  title: {
    default: "Ebenezer Tools — Best Tools for Small Businesses",
    template: "%s | Ebenezer Tools",
  },
  description:
    "Honest comparisons of the best tools for small businesses — billing, WhatsApp, social media, design, payments, and more. Find the right tool with real pros, cons, and pricing.",
  openGraph: {
    title: "Ebenezer Tools — Best Business Tools Compared",
    description:
      "Compare the best tools for small businesses. Real pros, cons, and pricing — no paid rankings.",
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
    <>
      <EcosystemNav variant="light" active="tools" />
      {children}
    </>
  );
}
