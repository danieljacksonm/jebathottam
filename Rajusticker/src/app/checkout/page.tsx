import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = buildMetadata({
  title: "Checkout",
  description: "Secure checkout for Raju Stickers premium car wraps and custom vinyl.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}
