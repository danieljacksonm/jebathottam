import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_NAME} — how we handle order, contact, and analytics data.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="container-x py-8 sm:py-12 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <h1 className="section-title mb-4">Privacy Policy</h1>
      <div className="space-y-4 text-[var(--text-muted)] text-sm leading-relaxed">
        <p>
          {SITE_NAME} collects only the information needed to process enquiries and orders: name, phone, email, and shipping
          address. Payment card details are handled by the payment provider when connected — we do not store full card numbers
          on our servers.
        </p>
        <p>
          Analytics identifiers (if configured) help us understand product views, search, and checkout events. You can block
          tracking via browser controls.
        </p>
        <p>
          We do not sell personal data. Contact support to request access or deletion of order-related personal information we
          store.
        </p>
      </div>
    </div>
  );
}
