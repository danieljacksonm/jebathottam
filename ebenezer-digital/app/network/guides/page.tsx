import Link from "next/link";
import type { Metadata } from "next";
import { NETWORK_GUIDES } from "@/lib/network/guides";
import { NETWORK_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Guides",
  description: "Practical guides for images, SEO, JSON, performance and developer tools.",
  alternates: { canonical: `${NETWORK_URL}/guides` },
};

export default function GuidesIndexPage() {
  return (
    <div className="nx-page py-10">
      <h1 className="text-3xl font-bold tracking-tight">Guides</h1>
      <p className="mt-2 text-[var(--nx-muted)] max-w-2xl">
        Short, useful explainers — each tied to working tools on this network.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {NETWORK_GUIDES.map((g) => (
          <Link key={g.slug} href={`/network/guides/${g.slug}`} className="nx-card p-5 block no-underline text-inherit">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--nx-brand)]">{g.category}</p>
            <h2 className="mt-2 text-lg font-semibold">{g.title}</h2>
            <p className="mt-2 text-sm text-[var(--nx-muted)]">{g.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
