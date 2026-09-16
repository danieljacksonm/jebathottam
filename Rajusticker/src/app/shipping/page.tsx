import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING, EXPRESS_SHIPPING, formatCurrencyHint } from "@/lib/shipping-copy";

export const metadata = buildMetadata({
  title: "Shipping Information",
  description:
    "Raju Stickers shipping timelines, free shipping threshold, and delivery expectations across India.",
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <div className="container-x py-8 sm:py-12 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shipping" }]} />
      <h1 className="section-title mb-4">Shipping</h1>
      <div className="space-y-4 text-[var(--text-muted)]">
        <p>We ship wrap rolls and custom stickers across India using trusted courier partners.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Standard shipping estimate: 3–7 business days after dispatch.</li>
          <li>Standard shipping rate: ₹{STANDARD_SHIPPING}.</li>
          <li>Express option (when available at checkout): ₹{EXPRESS_SHIPPING}.</li>
          <li>Free standard shipping on orders ₹{FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}+.</li>
        </ul>
        <p>
          Remote pin codes may require additional transit time. Tracking details are shared once the courier picks up the parcel.
        </p>
        <p className="text-sm text-[var(--text-subtle)]">{formatCurrencyHint}</p>
      </div>
    </div>
  );
}
