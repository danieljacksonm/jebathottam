import type { Metadata } from "next";
import { NETWORK_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "About",
  description: "About Ebenezer Digital Network — free tools and developer resources.",
  alternates: { canonical: `${NETWORK_URL}/about` },
};

export default function AboutPage() {
  return (
    <div className="nx-page py-10 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">About Ebenezer Digital Network</h1>
      <p className="mt-4 text-[var(--nx-ink-2)] leading-relaxed">
        Ebenezer Digital Network is the free-value technology platform in the Ebenezer Digital ecosystem. We publish
        useful browser tools, developer utilities, and practical guides so people can get work done quickly.
      </p>
      <p className="mt-4 text-[var(--nx-ink-2)] leading-relaxed">
        This site is not an ecommerce store and not an affiliate directory. When we point to other Ebenezer properties
        (services, store, software comparison, hardware research, or AI), we do it contextually.
      </p>
    </div>
  );
}
