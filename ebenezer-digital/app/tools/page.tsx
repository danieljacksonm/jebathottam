"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ExternalLink,
  Search,
  Star,
  Tag,
  XCircle,
  Zap,
} from "lucide-react";
import {
  TOOLS,
  TOOL_CATEGORIES,
  getHighlightedTools,
  type Tool,
  type ToolCategory,
} from "./data";

/* ── Star rating ─────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );
}

/* ── Badge ───────────────────────────────────────────── */
const BADGE_STYLES: Record<string, string> = {
  "Best Value":       "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Most Popular":     "bg-blue-50 text-blue-700 border border-blue-200",
  "Editor's Pick":    "bg-violet-50 text-violet-700 border border-violet-200",
  "Free Forever":     "bg-green-50 text-green-700 border border-green-200",
  "Best for India":   "bg-orange-50 text-orange-700 border border-orange-200",
};

function Badge({ label }: { label: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${BADGE_STYLES[label] ?? "bg-gray-100 text-gray-600"}`}>
      {label}
    </span>
  );
}

/* ── Tool card ───────────────────────────────────────── */
function ToolCard({ tool }: { tool: Tool }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-2xl border bg-white transition-shadow hover:shadow-md ${
      tool.highlighted ? "border-emerald-200 shadow-sm" : "border-gray-200"
    }`}>
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Logo placeholder */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl border border-gray-100">
            {tool.logo}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-gray-900">{tool.name}</h3>
              {tool.badge && <Badge label={tool.badge} />}
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{tool.tagline}</p>
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            <Stars rating={tool.rating} />
          </div>
        </div>

        {/* Pricing row */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {tool.pricing.free ? (
            <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
              <Zap className="h-3.5 w-3.5" />
              {tool.pricing.freeLabel ?? "Free plan available"}
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
              No free plan
            </span>
          )}
          {tool.pricing.paid && (
            <span className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{tool.pricing.paid}</span>
              {tool.pricing.paidLabel && ` — ${tool.pricing.paidLabel}`}
            </span>
          )}
        </div>

        {/* Best for */}
        <p className="mt-3 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">Best for:</span>{" "}
          {tool.bestFor}
        </p>

        {/* Toggle */}
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-4 flex w-full items-center justify-between text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <span>See pros, cons & details</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4">
          <p className="mb-4 text-sm text-gray-600">{tool.description}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Pros</p>
              <ul className="space-y-1.5">
                {tool.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Cons</p>
              <ul className="space-y-1.5">
                {tool.cons.map((con) => (
                  <li key={con} className="flex items-start gap-2 text-sm text-gray-700">
                    <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <a
            href={tool.url}
            target={tool.url.startsWith("http") ? "_blank" : undefined}
            rel={tool.url.startsWith("http") ? "noopener noreferrer" : undefined}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 shadow-sm hover:shadow-md"
          >
            {tool.name === "Ebenezer SaaS" ? "Try free" : "Visit website"}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}

/* ── Category section ────────────────────────────────── */
function CategorySection({ category }: { category: ToolCategory }) {
  const tools = TOOLS.filter((t) => t.category === category);
  if (!tools.length) return null;
  return (
    <section id={category.toLowerCase().replace(/[^a-z]+/g, "-")} className="scroll-mt-20">
      <h2 className="mb-5 text-xl font-bold text-gray-900">{category}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}

/* ── Main page ───────────────────────────────────────── */
export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "All">("All");
  const [query, setQuery] = useState("");

  const filteredTools = TOOLS.filter((t) => {
    const matchesCat = activeCategory === "All" || t.category === activeCategory;
    const q = query.trim().toLowerCase();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.bestFor.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const highlighted = getHighlightedTools();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Nav ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">Ebenezer</span>
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">Tools</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/products" className="text-gray-500 hover:text-emerald-600 transition-colors hidden sm:block">
              Store
            </Link>
            <Link href="/saas" className="text-gray-500 hover:text-emerald-600 transition-colors hidden sm:block">
              Free billing
            </Link>
            <Link
              href="/products"
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              Free kits →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Tag className="h-3 w-3" />
              Honest tool comparisons — no paid rankings
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
              Best tools for<br />
              <span className="text-emerald-600">small businesses.</span>
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              We compare billing, WhatsApp, social media, design, payments, and more —
              so you pick the right tool without wasting money on the wrong one.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-500" /> Real pros and cons
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-500" /> Actual pricing shown
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-500" /> Free options highlighted
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Top picks ────────────────────────────────── */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="mb-6 text-lg font-bold text-gray-900">
            Our top picks — one from each category
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {highlighted.map((tool) => (
              <a
                key={tool.id}
                href={`#${tool.category.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                <span className="text-xl">{tool.logo}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-gray-900">{tool.name}</p>
                  <p className="text-xs text-gray-500 truncate">{tool.category}</p>
                </div>
                {tool.badge && <Badge label={tool.badge} />}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filter + search ───────────────────────────── */}
      <div className="sticky top-14 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tools…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-400 focus:bg-white"
              />
            </div>
            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              {(["All", ...TOOL_CATEGORIES] as (ToolCategory | "All")[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-emerald-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tool grid ────────────────────────────────── */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {query || activeCategory !== "All" ? (
          /* Filtered flat grid */
          <div>
            <p className="mb-5 text-sm text-gray-500">
              {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
              {filteredTools.length === 0 && (
                <p className="col-span-2 py-12 text-center text-gray-400">
                  No tools match your search. Try a different keyword.
                </p>
              )}
            </div>
          </div>
        ) : (
          /* All categories */
          <div className="space-y-14">
            {TOOL_CATEGORIES.map((cat) => (
              <CategorySection key={cat} category={cat} />
            ))}
          </div>
        )}
      </main>

      {/* ── Ebenezer Store CTA ───────────────────────── */}
      <section className="border-t border-gray-200 bg-emerald-600">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">
                From Ebenezer Digital
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                Free kits to go with your tools
              </h2>
              <p className="mt-2 text-emerald-100">
                WhatsApp templates, invoice formats, social media captions, and more —
                all free, instant download.
              </p>
            </div>
            <Link
              href="/products"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50 shadow-sm"
            >
              Browse free kits <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">Ebenezer Tools</span>
              <span>by</span>
              <Link href="/" className="font-medium text-emerald-600 hover:underline">
                ebenezerdigital.com
              </Link>
            </div>
            <p className="text-xs text-gray-400">
              Some links may be affiliate links. We only recommend tools we would use ourselves.
              Rankings are based on our honest assessment — not paid placement.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
