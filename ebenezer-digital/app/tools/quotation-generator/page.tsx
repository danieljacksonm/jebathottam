import type { Metadata } from "next";
import { DocumentGenerator } from "../DocumentGenerator";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "Quotation Generator | Ebenezer Store",
  description: "Create a client quotation in your browser and print or save as PDF. Free.",
  path: "/tools/quotation-generator",
});

export default function QuotationGeneratorPage() {
  return <DocumentGenerator kind="quotation" title="Quotation Generator" backHref="/products/quotation-generator" />;
}
