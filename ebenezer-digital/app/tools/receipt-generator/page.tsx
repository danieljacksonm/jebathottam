import type { Metadata } from "next";
import { DocumentGenerator } from "../DocumentGenerator";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "Receipt Generator | Ebenezer Store",
  description: "Create and print a payment receipt in your browser. Free. No install.",
  path: "/tools/receipt-generator",
});

export default function ReceiptGeneratorPage() {
  return <DocumentGenerator kind="receipt" title="Receipt Generator" backHref="/products/receipt-generator" />;
}
