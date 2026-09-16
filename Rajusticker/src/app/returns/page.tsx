import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Returns Policy",
  description:
    "Raju Stickers returns policy for unopened wrap rolls, custom stickers, and installed film.",
  path: "/returns",
});

export default function ReturnsPage() {
  return (
    <div className="container-x py-8 sm:py-12 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Returns" }]} />
      <h1 className="section-title mb-4">Returns</h1>
      <div className="space-y-4 text-[var(--text-muted)]">
        <p>
          Unopened full rolls in original packaging may be returned within 7 days of delivery for a refund of the product
          amount (shipping fees are non-refundable unless we shipped the wrong item).
        </p>
        <p>The following are not eligible for return:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Cut, opened, or partially used film</li>
          <li>Installed wraps or stickers</li>
          <li>Custom text stickers</li>
          <li>Sample swatches marked as final sale</li>
        </ul>
        <p>
          Contact support with your order reference and photos of the packaging before sending anything back.
        </p>
      </div>
    </div>
  );
}
