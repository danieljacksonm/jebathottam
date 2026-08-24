import type { Metadata } from "next";
import { NETWORK_URL, SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Ebenezer Digital Network.",
  alternates: { canonical: `${NETWORK_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="nx-page py-10 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <p className="mt-4 text-[var(--nx-ink-2)]">
        For network / tools feedback, reach the Ebenezer Digital team through the main site contact page.
      </p>
      <a href={`${SITE_URL}/contact`} className="nx-btn nx-btn-primary mt-6 inline-flex">
        Contact Ebenezer Digital
      </a>
    </div>
  );
}
