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
import { PUBLIC_CATEGORIES } from "@/lib/network/paths";
import type { NetworkToolCategory } from "@/lib/network/types";
import { NETWORK_URL } from "@/lib/site-url";

type Props = { searchParams: { q?: string; category?: string } };

export const metadata: Metadata = {
  title: "Free Online Tools — Developer, SEO, Image, Calculators & AI",
  description:
    "Browse free browser-based tools for developers, SEO, images, text, business math and AI helpers. No account required.",
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
      <p className="mt-2 text-[var(--nx-muted)]">
        Every tool listed here actually works — mostly in your browser, with no login.
      </p>
      <div className="mt-6">
        <NetworkSearch initialQuery={q} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/network/tools" className={`nx-chip ${!category ? "is-active" : ""}`}>
          All
        </Link>
        {PUBLIC_CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/network/tools/c/${c}`}
            className={`nx-chip ${category === c ? "is-active" : ""}`}
          >
            {CATEGORY_LABELS[c]} ({getToolsByCategory(c).length})
          </Link>
        ))}
      </div>
      <p className="mt-6 text-sm text-[var(--nx-muted)]">
        {tools.length} tool{tools.length === 1 ? "" : "s"}
        {q ? ` for “${q}”` : ""}
      </p>
      <div className="nx-grid-tools mt-4">
        {tools.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </div>
      {tools.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-semibold">We couldn&apos;t find that tool yet.</p>
          <p className="mt-2 text-[var(--nx-muted)]">Try searching:</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["Image", "SEO", "Developer", "Calculator", "AI"].map((label) => (
              <Link
                key={label}
                href={`/network/tools?q=${encodeURIComponent(label.toLowerCase())}`}
                className="nx-chip"
              >
                {label}
              </Link>
            ))}
          </div>
          <Link href="/network/tools" className="nx-btn nx-btn-primary mt-8 inline-flex">
            Browse all tools
          </Link>
        </div>
      ) : null}
    </div>
  );
}
