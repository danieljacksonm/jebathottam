import type { Metadata } from "next";
import { NETWORK_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for Ebenezer Digital Network.",
  alternates: { canonical: `${NETWORK_URL}/terms` },
};

export default function TermsPage() {
  return (
    <div className="nx-page py-10 max-w-2xl space-y-4 text-[var(--nx-ink-2)] leading-relaxed">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--nx-ink)]">Terms</h1>
      <p>Tools are provided free of charge, as-is, without warranty. Always verify critical results independently.</p>
      <p>
        Calculators (including tax and loan helpers) are mathematical aids — not professional advice. Do not paste
        secrets or production credentials into any online tool.
      </p>
      <p>We may update tools, content, and these terms as the platform grows.</p>
    </div>
  );
}
