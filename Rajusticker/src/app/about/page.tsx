import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "About Raju Stickers",
  description:
    "Raju Stickers is a premium automotive wrap and sticker brand focused on bold finishes, durable PVC film, and clean custom work.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container-x py-8 sm:py-12 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <h1 className="section-title mb-4">About {SITE_NAME}</h1>
      <div className="space-y-4 text-[var(--text-muted)]">
        <p>
          {SITE_NAME} builds premium car wraps and vinyl finishes for people who want their vehicle to look different —
          not louder by accident, but intentional by design.
        </p>
        <p>
          Our catalogue focuses on high-grade PVC wrapping films with air-release adhesive: chrome mirror, metallic gloss,
          matte, carbon fiber, and specialty colour-shift finishes.
        </p>
        <p>
          We keep the experience simple: clear product details, honest shipping guidance, custom text stickers when you need
          them, and an AI-assisted finder that recommends from our real catalogue only.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/shop">Shop Stickers</Button>
        <Button href="/custom-stickers" variant="secondary">
          Create Custom
        </Button>
      </div>
    </div>
  );
}
