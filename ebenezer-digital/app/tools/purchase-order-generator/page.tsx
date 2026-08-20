import type { Metadata } from "next";
import { DocumentGenerator } from "../DocumentGenerator";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "Purchase Order Generator | Ebenezer Store",
  description: "Create and print a purchase order for suppliers in your browser. Free. No install.",
  path: "/tools/purchase-order-generator",
});

export default function PurchaseOrderGeneratorPage() {
  return (
    <DocumentGenerator
      kind="purchase_order"
      title="Purchase Order Generator"
      backHref="/products/purchase-order-generator"
    />
  );
}
