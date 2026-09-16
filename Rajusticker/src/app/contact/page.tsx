import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ContactClient } from "@/components/contact/ContactClient";

export const metadata: Metadata = buildMetadata({
  title: "Contact Raju Stickers",
  description: "Contact Raju Stickers for product questions, order help, and custom sticker requests.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactClient />;
}
