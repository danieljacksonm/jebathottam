"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Star,
} from "lucide-react";
import {
  TOOLS,
  TOOL_CATEGORY_GROUPS,
  getHighlightedTools,
  getAllCategories,
  type Tool,
  type ToolCategory,
} from "./data";
import { resolveToolImage } from "@/lib/affiliate/images";
import { AffiliateMedia } from "@/components/AffiliateMedia";
import { SITE_URL } from "@/lib/site-url";

const EXAMPLES = [
  "Best AI video generator",
  "CRM for a small business",
  "Best coding AI",
  "Email marketing tool",
  "SEO tool for my website",
  "Project management software",
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

function domainFromUrl(url: string): string | undefined {
  try {
    if (!url.startsWith("http")) return undefined;
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function ToolCard({ tool }: { tool: Tool }) {
  const image = resolveToolImage({
    name: tool.name,
    logoImg: tool.logoImg,
    logo: tool.logo,
    domain: tool.domain || domainFromUrl(tool.url),
  });
  const features = tool.features?.length ? tool.features : tool.pros.slice(0, 3);

  return (
    <article className="aff-card flex flex-col">
      <div className="p-5 flex items-start gap-3">
        <AffiliateMedia image={image} size="thumb" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/tools/${tool.id}`} className="font-semibold text-[var(--aff-ink)] hover:text-[var(--aff-brand-dk)]">
              {tool.name}
            </Link>
            {tool.badge ? <span className="aff-badge">{tool.badge}</span> : null}
          </div>
          <p className="mt-0.5 text-sm text-[var(--aff-muted)]">{tool.tagline}</p>
          <div className="mt-2">
            <Stars rating={tool.rating} />
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 flex-1 flex flex-col">
        <p className="text-xs text-[var(--aff-muted)]">
          <span className="font-semibold text-[var(--aff-ink-2)]">Best for:</span> {tool.bestFor}
        </p>
        <p className="mt-2 text-xs text-[var(--aff-muted)]">
          Pricing:{" "}
          {tool.pricing.free
            ? tool.pricing.freeLabel || "Free plan available"
            : tool.pricing.paidLabel || tool.pricing.paid || "Paid"}
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-[var(--aff-ink-2)]">
          {features.map((f) => (
            <li key={f} className="flex gap-2">
              <CheckCircle className="h-3.5 w-3.5 shrink-0 text-teal-600 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-4 flex flex-wrap gap-2">
          <Link href={`/tools/compare?ids=${tool.id}`} className="aff-btn aff-btn-ghost !py-2 !px-3 !text-xs">
            Compare
          </Link>
          <a
            href={tool.url}
            target={tool.url.startsWith("http") ? "_blank" : undefined}
            rel={tool.url.startsWith("http") ? "sponsored noopener noreferrer" : undefined}
            className="aff-btn aff-btn-primary !py-2 !px-3 !text-xs"
          >
            Visit tool <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <p className="aff-disclosure mt-3">Affiliate link where applicable</p>
      </div>
    </article>
  );
}

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "All">("All");
  const [activeGroup, setActiveGroup] = useState<string>("All");
  const [query, setQuery] = useState("");
  const highlighted = getHighlightedTools();
  const categories = getAllCategories();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const groupCats =
      activeGroup === "All"
        ? null
        : TOOL_CATEGORY_GROUPS.find((g) => g.id === activeGroup)?.categories || [];
    return TOOLS.filter((t) => {
      const groupOk = !groupCats || groupCats.includes(t.category);
      const catOk = activeCategory === "All" || t.category === activeCategory;
      if (!groupOk || !catOk) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.bestFor.toLowerCase().includes(q) ||
        t.pros.some((p) => p.toLowerCase().includes(q))
      );
    });
  }, [activeCategory, activeGroup, query]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--aff-line)] bg-white/95 backdrop-blur">
        <div className="aff-page flex h-14 items-center justify-between gap-3">
          <Link href="/tools" className="flex items-center gap-2">
            <span className="font-bold">Ebenezer</span>
            <span className="rounded-md bg-[var(--aff-brand)] px-2 py-0.5 text-[11px] font-bold text-white">Tools</span>
          </Link>
          <div className="flex items-center gap-3 text-sm text-[var(--aff-muted)]">
            <Link href="/tools/compare" className="hover:text-[var(--aff-brand)]">
              Compare
            </Link>
            <Link href={`${SITE_URL}/discover`} className="hover:text-[var(--aff-brand)]">
              Discover
            </Link>
            <Link href="/catalog" className="hover:text-[var(--aff-brand)] hidden sm:inline">
              Hardware
            </Link>
          </div>
        </div>
      </header>

      <section className="aff-hero">
        <div className="aff-page py-14 sm:py-18">
          <p className="aff-badge mb-4">AI · SaaS · Software discovery</p>
          <h1>
            Find the right tool
            <span className="block text-[var(--aff-brand)]">for the job.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--aff-muted)]">
            Discover, compare and choose the best AI tools, SaaS and software for your needs.
          </p>
          <form
            className="aff-search mt-8"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              aria-label="Search tools"
            />
            <button type="submit" className="aff-btn aff-btn-primary shrink-0">
              Search
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button key={ex} type="button" className="aff-chip" onClick={() => setQuery(ex)}>
                {ex}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--aff-line)] bg-white">
        <div className="aff-page py-8">
          <h2 className="text-lg font-bold">Editor top picks</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {highlighted.slice(0, 6).map((t) => (
              <Link
                key={t.id}
                href={`/tools/${t.id}`}
                className="aff-card p-4 flex items-center gap-3 hover:border-teal-300"
              >
                <AffiliateMedia
                  image={resolveToolImage({
                    name: t.name,
                    logoImg: t.logoImg,
                    domain: t.domain || domainFromUrl(t.url),
                  })}
                  size="thumb"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{t.name}</p>
                  <p className="text-xs text-[var(--aff-muted)] truncate">{t.category}</p>
                </div>
                {t.badge ? <span className="aff-badge ml-auto shrink-0">{t.badge}</span> : null}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="sticky top-14 z-30 border-b border-[var(--aff-line)] bg-white/95 backdrop-blur">
        <div className="aff-page space-y-2 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {(["All", ...TOOL_CATEGORY_GROUPS.map((g) => g.id)] as string[]).map((g) => (
              <button
                key={g}
                type="button"
                className={`aff-chip shrink-0 ${activeGroup === g ? "is-active" : ""}`}
                onClick={() => {
                  setActiveGroup(g);
                  setActiveCategory("All");
                }}
              >
                {g === "All" ? "All groups" : TOOL_CATEGORY_GROUPS.find((x) => x.id === g)?.label || g}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {(["All", ...categories] as (ToolCategory | "All")[]).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`aff-chip shrink-0 ${activeCategory === cat ? "is-active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="aff-page py-10">
        <p className="text-sm text-[var(--aff-muted)] mb-5">
          {filtered.length} tool{filtered.length === 1 ? "" : "s"}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-[var(--aff-muted)]">No tools match. Try another keyword.</p>
        ) : null}
      </main>

      <section className="border-t border-[var(--aff-line)] bg-white">
        <div className="aff-page py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Need a recommendation?</h2>
            <p className="text-sm text-[var(--aff-muted)] mt-1">
              Ask Ebenezer AI — grounded answers, no invented tools or prices.
            </p>
          </div>
          <Link href={`${SITE_URL}/ai?mode=tools`} className="aff-btn aff-btn-primary">
            Ask Ebenezer AI <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="aff-page pb-10">
          <p className="aff-disclosure">
            We may earn a commission when you purchase through links on Ebenezer Tools. This does not affect our
            comparisons. Ratings are editorial signals — not fake reviews.
          </p>
        </div>
      </section>
    </>
  );
}
