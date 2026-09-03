import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/site-url";
import "./saas.css";

export const metadata: Metadata = pageMetadata({
  title: "Yegova Billing | Free Cloud Billing for Traders & Shops",
  description:
    "Yegova is a free cloud billing app for Indian traders — GST invoices, stock management, party ledger, thermal print, and reports. No credit card needed.",
  path: "/saas",
});

export default function SaasLayout({ children }: { children: ReactNode }) {
  return children;
}
