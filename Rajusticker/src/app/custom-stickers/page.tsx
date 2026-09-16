import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import CustomStickersPageClient from "@/components/custom/CustomStickerBuilder";

export const metadata: Metadata = buildMetadata({
  title: "Custom Car Stickers",
  description:
    "Create custom car stickers with your text, colour, and size. Simple preview and fast checkout from Raju Stickers.",
  path: "/custom-stickers",
  image: "/products/iridescent-matte.jpg",
});

export default function CustomStickersPage() {
  return <CustomStickersPageClient />;
}
