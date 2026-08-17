import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/site-url";
import "./saas.css";

export const metadata: Metadata = pageMetadata({
  title: "Ebenezer SaaS | Shop billing",
  description:
    "Free cloud-style billing for shops — invoices, quotations, stock, customers, and print. Runs in your browser.",
  path: "/saas",
});

export default function SaasLayout({ children }: { children: ReactNode }) {
  return children;
}
