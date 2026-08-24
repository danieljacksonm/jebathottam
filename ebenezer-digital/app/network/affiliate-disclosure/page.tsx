import type { Metadata } from "next";
import { NETWORK_URL, TOOLS_URL, PRODUCTS_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Affiliate disclosure",
  description: "Affiliate disclosure for Ebenezer Digital Network.",
  alternates: { canonical: `${NETWORK_URL}/affiliate-disclosure` },
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="nx-page py-10 max-w-2xl space-y-4 text-[var(--nx-ink-2)] leading-relaxed">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--nx-ink)]">Affiliate disclosure</h1>
      <p>
        Ebenezer Digital Network itself focuses on free tools. Some contextual links may lead to other Ebenezer
        properties that participate in affiliate programs, such as{" "}
        <a className="text-[var(--nx-brand)] underline" href={TOOLS_URL}>
          tools.ebenezerdigital.com
        </a>{" "}
        or{" "}
        <a className="text-[var(--nx-brand)] underline" href={PRODUCTS_URL}>
          products.ebenezerdigital.com
        </a>
        .
      </p>
      <p>
        If you purchase through those links, we may earn a commission at no extra cost to you. Recommendations on this
        network prioritize usefulness first.
      </p>
    </div>
  );
}
