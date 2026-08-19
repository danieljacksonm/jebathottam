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
function ToolLogo({ tool }: { tool: Tool }) {
  const domain = (() => {
    try { return new URL(tool.url.startsWith("http") ? tool.url : "https://ebenezerdigital.com").hostname.replace("www.", ""); }
    catch { return ""; }
  })();
  const src = tool.logoImg || (domain ? `https://logo.clearbit.com/${domain}?size=96` : "");
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-100 overflow-hidden p-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={tool.name} width={40} height={40} className="h-10 w-10 object-contain" onError={() => setFailed(true)} />
      </div>
    );
  }
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl border border-gray-100">
      {tool.logo}
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-2xl border bg-white transition-shadow hover:shadow-md ${
      tool.highlighted ? "border-emerald-200 shadow-sm" : "border-gray-200"
    }`}>
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <ToolLogo tool={tool} />
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
                <ToolLogo tool={tool} />
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

      {/* ── How you earn — affiliate guide ───────────── */}
      <section className="border-t border-gray-200 bg-gray-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
              For Ebenezer Digital team
            </span>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              How you earn from this page
            </h2>
            <p className="mt-2 text-gray-400 max-w-2xl">
              Apply to these affiliate programmes, get your tracking links, and replace the plain URLs in{" "}
              <code className="rounded bg-gray-800 px-1.5 py-0.5 text-emerald-400 text-xs">app/tools/data.ts</code>{" "}
              with your affiliate links. Every click that converts earns you commission automatically.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Razorpay Partner",
                tag: "APPLY NOW — Instant",
                commission: "0.1% per transaction + ₹500 per referral",
                cookie: "Recurring",
                url: "https://razorpay.com/partners/",
                highlight: true,
                note: "Best for India. No approval wait. Just sign up and get your link from the dashboard.",
              },
              {
                name: "Zoho Affiliate",
                tag: "APPLY NOW — 5 days approval",
                commission: "15–20% of revenue for 12 months",
                cookie: "90-day cookie",
                url: "https://www.zoho.com/affiliate/signup.html",
                highlight: true,
                note: "One of the best affiliate programmes for business tools. Apply first — easiest approval.",
              },
              {
                name: "Brevo (Email)",
                tag: "APPLY NOW — Open",
                commission: "€5 per free signup + €100 per paid",
                cookie: "Open programme",
                url: "https://www.brevo.com/partners/affiliates/",
                highlight: true,
                note: "Email marketing tool. Easy to promote alongside the WhatsApp kit.",
              },
              {
                name: "Canva Canvassador",
                tag: "Apply — 1-2 weeks",
                commission: "Commission on Canva Pro via Impact",
                cookie: "30-day cookie",
                url: "https://public.canva.site/canvassadors",
                highlight: false,
                note: "Apply now so approval is ready. Most popular design tool — easy to convert.",
              },
              {
                name: "Framer Affiliate",
                tag: "Apply — Open",
                commission: "Commission on paid plans",
                cookie: "Open programme",
                url: "https://www.framer.com/affiliates/",
                highlight: false,
                note: "Good fit with the landing page kit audience.",
              },
              {
                name: "Notion Affiliate",
                tag: "Monitor — Currently paused",
                commission: "$50 per signup + 20% year-1 revenue",
                cookie: "180-day cookie",
                url: "https://www.notion.com/affiliates",
                highlight: false,
                note: "Programme is paused mid-2026. Check back monthly — very high commission when open.",
              },
            ].map((prog) => (
              <div
                key={prog.name}
                className={`rounded-xl border p-5 ${
                  prog.highlight
                    ? "border-emerald-600 bg-emerald-950"
                    : "border-gray-700 bg-gray-800"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-white">{prog.name}</p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    prog.highlight ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300"
                  }`}>
                    {prog.tag}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-emerald-400">{prog.commission}</p>
                <p className="text-xs text-gray-500">{prog.cookie}</p>
                <p className="mt-2 text-xs text-gray-400">{prog.note}</p>
                <a
                  href={prog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    prog.highlight
                      ? "bg-emerald-600 text-white hover:bg-emerald-500"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  Open signup page <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-gray-600">
            After you get approved and receive your tracking links, open{" "}
            <code className="text-emerald-500">app/tools/data.ts</code> and replace each tool&apos;s{" "}
            <code className="text-emerald-500">url</code> field with your affiliate link. Every visitor who clicks and buys earns you commission — automatically, with no extra work.
          </p>
        </div>
      </section>

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
