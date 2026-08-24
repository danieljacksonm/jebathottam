import Link from "next/link";
import type { Metadata } from "next";
import { ToolCard } from "@/components/network/ToolCard";
import { getToolsByCategory } from "@/lib/network/registry";
import { NETWORK_URL, AI_URL, JOURNAL_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Developer Hub",
  description: "Developer tools, utilities, and guides from Ebenezer Digital Network.",
  alternates: { canonical: `${NETWORK_URL}/developers` },
};

export default function DevelopersPage() {
  const tools = getToolsByCategory("developer");
  return (
    <div className="nx-page py-10">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--nx-brand)]">Developer Hub</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Tools built for builders</h1>
      <p className="mt-3 max-w-2xl text-[var(--nx-muted)]">
        Formatters, encoders, validators and generators that run privately in your browser.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/network/guides" className="nx-btn nx-btn-ghost">
          Guides
        </Link>
        <a href={`${AI_URL}?mode=general`} className="nx-btn nx-btn-ghost">
          Ask AI
        </a>
        <a href={JOURNAL_URL} className="nx-btn nx-btn-ghost">
          Journal articles
        </a>
      </div>
      <div className="nx-grid-tools mt-10">
        {tools.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </div>
    </div>
  );
}
