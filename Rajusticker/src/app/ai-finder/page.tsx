import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { AIStickerFinder } from "@/components/ai/AIStickerFinder";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "AI Sticker Finder",
  description:
    "Find the right Raju Stickers wrap for your style — racing, JDM, chrome, matte, carbon, and more.",
  path: "/ai-finder",
});

export default function AIFinderPage() {
  return (
    <div className="container-x py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "AI Finder" }]} />
      <AIStickerFinder compact />
    </div>
  );
}
