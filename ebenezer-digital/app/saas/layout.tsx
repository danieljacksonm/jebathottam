import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./saas.css";

export const metadata: Metadata = {
  title: "Ebenezer SaaS | Shop billing",
  description:
    "Free cloud-style billing for shops — invoices, quotations, stock, customers, and print. Runs in your browser.",
};

export default function SaasLayout({ children }: { children: ReactNode }) {
  return children;
}
