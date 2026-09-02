import Link from "next/link";
import type { Metadata } from "next";
import { AI_URL, pageMetadata } from "@/lib/site-url";
import { SiteLegalLinks } from "@/components/SiteLegalLinks";
import { TOOLS_GUIDES } from "./data";

export const metadata: Metadata = pageMetadata({
  title: "Buying guides — Ebenezer Tools",
  description: "Practical guides to choose AI tools, CRM, SEO and SaaS — then compare on Ebenezer Tools.",
  path: "/tools/guides",
});

export default function ToolsGuidesPage() {
  return (
    <div className="aff-page py-10">
      <p className="text-sm text-[var(--aff-muted)]">
        <Link href="/tools" className="hover:text-[var(--aff-brand)]">
          Tools
        </Link>{" "}
        / Guides
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Buying guides</h1>
      <p className="mt-2 max-w-2xl text-[var(--aff-muted)]">
        Genuine comparison value — not rewritten merchant blurbs. Each guide links into live comparison pages.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {TOOLS_GUIDES.map((g) => (
          <Link key={g.slug} href={`/tools/guides/${g.slug}`} className="aff-card p-5 hover:border-teal-300">
            <h2 className="font-semibold text-lg">{g.title}</h2>
            <p className="mt-2 text-sm text-[var(--aff-muted)]">{g.excerpt}</p>
            <p className="mt-3 text-sm font-semibold text-[var(--aff-brand-dk)]">Read guide →</p>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-sm text-[var(--aff-muted)]">
        Prefer a conversation?{" "}
        <Link href={`${AI_URL}?mode=tools`} className="text-[var(--aff-brand-dk)] font-semibold hover:underline">
          Ask Ebenezer AI
        </Link>
        .
      </p>
      <SiteLegalLinks className="mt-8 text-xs text-[var(--aff-muted)]" linkClassName="hover:text-[var(--aff-text)]" />
    </div>
  );
}
