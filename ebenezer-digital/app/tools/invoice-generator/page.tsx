import type { Metadata } from "next";
import { DocumentGenerator } from "../DocumentGenerator";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "Invoice Generator | Ebenezer Store",
  description: "Create, preview, and print a GST-ready invoice in your browser. Free. No install.",
  path: "/tools/invoice-generator",
});

export default function InvoiceGeneratorPage() {
  return <DocumentGenerator kind="invoice" title="Invoice Generator" backHref="/products/invoice-generator" />;
}
