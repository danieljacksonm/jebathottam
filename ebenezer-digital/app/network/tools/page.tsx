import Link from "next/link";
import type { Metadata } from "next";
import { ToolCard } from "@/components/network/ToolCard";
import { NetworkSearch } from "@/components/network/NetworkSearch";
import {
  CATEGORY_LABELS,
  getLiveTools,
  getToolsByCategory,
} from "@/lib/network/registry";
import { searchNetworkTools } from "@/lib/network/search";
import type { NetworkToolCategory } from "@/lib/network/types";
import { NETWORK_URL } from "@/lib/site-url";

type Props = { searchParams: { q?: string; category?: string } };

export const metadata: Metadata = {
  title: "Free online tools",
  description: "Browse free developer, SEO, image, calculator and AI helper tools.",
  alternates: { canonical: `${NETWORK_URL}/tools` },
};

export default function NetworkToolsIndexPage({ searchParams }: Props) {
  const q = (searchParams.q || "").trim();
  const category = searchParams.category as NetworkToolCategory | undefined;
  let tools = q ? searchNetworkTools(q, 100) : getLiveTools();
  if (category && CATEGORY_LABELS[category]) {
    tools = tools.filter((t) => t.category === category);
  }

  return (
    <div className="nx-page py-10">
      <h1 className="text-3xl font-bold tracking-tight">Tools</h1>
      <p className="mt-2 text-[var(--nx-muted)]">Every tool listed here works in your browser.</p>
      <div className="mt-6">
        <NetworkSearch initialQuery={q} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/network/tools" className={`nx-chip ${!category ? "is-active" : ""}`}>
          All
        </Link>
        {(Object.keys(CATEGORY_LABELS) as NetworkToolCategory[]).map((c) => (
          <Link
            key={c}
            href={`/network/tools?category=${c}`}
            className={`nx-chip ${category === c ? "is-active" : ""}`}
          >
            {CATEGORY_LABELS[c]} ({getToolsByCategory(c).length})
          </Link>
        ))}
      </div>
      <p className="mt-6 text-sm text-[var(--nx-muted)]">{tools.length} tools</p>
      <div className="nx-grid-tools mt-4">
        {tools.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </div>
      {tools.length === 0 ? (
        <p className="py-16 text-center text-[var(--nx-muted)]">No tools match. Try another search.</p>
      ) : null}
    </div>
  );
}
