import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: `Terms of service for shopping with ${SITE_NAME}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="container-x py-8 sm:py-12 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms" }]} />
      <h1 className="section-title mb-4">Terms of Service</h1>
      <div className="space-y-4 text-[var(--text-muted)] text-sm leading-relaxed">
        <p>
          By placing an order with {SITE_NAME}, you confirm that product details, sizing, and install responsibility are
          understood. Colour appearance can vary by screen calibration and lighting.
        </p>
        <p>
          Prices are validated server-side at checkout. We reserve the right to cancel orders with pricing errors or stock
          issues and will notify you promptly.
        </p>
        <p>
          Professional installation is recommended for full vehicle chrome and complex colour-change wraps. {SITE_NAME} is not
          liable for damage caused by improper DIY application or removal.
        </p>
      </div>
    </div>
  );
}
