import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = buildMetadata({
  title: "Cart",
  description: "Your Raju Stickers cart.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return <CartPageClient />;
}
