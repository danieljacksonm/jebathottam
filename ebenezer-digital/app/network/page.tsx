import Link from "next/link";
import type { Metadata } from "next";
import { NetworkConstellation } from "@/components/network/NetworkConstellation";
import { NetworkSearch } from "@/components/network/NetworkSearch";
import { ToolCard } from "@/components/network/ToolCard";
import {
  CATEGORY_LABELS,
  getFeaturedTools,
  getLiveTools,
  getToolBySlug,
  getToolsByCategory,
} from "@/lib/network/registry";
import { PUBLIC_CATEGORIES } from "@/lib/network/paths";
import { NETWORK_URL, AI_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Free tools that just work",
  description:
    "Fast, simple and powerful online tools for developers, creators, businesses and everyday digital work.",
  alternates: { canonical: NETWORK_URL },
  openGraph: {
    title: "Free tools that just work | Ebenezer Digital Network",
    description:
      "Fast, simple and powerful online tools for developers, creators, businesses and everyday digital work.",
    url: NETWORK_URL,
  },
};

const POPULAR_SLUGS = [
  "image-compressor",
  "json-formatter",
  "gst-calculator",
  "qr-code-generator",
  "meta-tag-generator",
  "word-counter",
];

const SUGGESTIONS = [
  { label: "Compress an image", q: "compress image" },
  { label: "Convert photo to WebP", q: "webp" },
  { label: "Calculate GST", q: "gst" },
  { label: "Format JSON", q: "format json" },
  { label: "Generate a QR code", q: "qr code" },
  { label: "Create an SEO meta description", q: "meta tag" },
  { label: "Convert units", q: "unit converter" },
  { label: "Clean text", q: "text cleaner" },
];

export default function NetworkHomePage() {
  const popular = POPULAR_SLUGS.map((s) => getToolBySlug(s)).filter(Boolean);
  const featured = getFeaturedTools(6);
  const recent = [...getLiveTools()]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.name.localeCompare(b.name))
    .slice(0, 6);

  return (
    <>
      <section className="nx-hero">
        <div className="nx-page grid gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
          <div>
            <h1>Free tools that just work.</h1>
            <p className="lead">
              Fast, simple and powerful online tools for developers, creators, businesses and everyday
              digital work.
            </p>
            <div className="mt-8">
              <NetworkSearch large />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((ex) => (
                <Link
                  key={ex.label}
                  href={`/network/tools?q=${encodeURIComponent(ex.q)}`}
                  className="nx-chip"
                >
                  {ex.label}
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/network/tools" className="nx-btn nx-btn-primary">
                Explore Tools
              </Link>
              <a href={`${AI_URL}?mode=general`} className="nx-btn nx-btn-ghost">
                Ask AI
              </a>
            </div>
            <div className="nx-trust">
              <span>Free to use</span>
              <span>Runs in your browser</span>
              <span>No account required</span>
              <span>Privacy-conscious</span>
            </div>
          </div>
          <NetworkConstellation />
        </div>
      </section>

      <section className="nx-page py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Popular tools</h2>
            <p className="mt-1 text-sm text-[var(--nx-muted)]">Most useful starting points — open and go.</p>
          </div>
          <Link href="/network/tools" className="text-sm font-semibold text-[var(--nx-brand)] hover:underline">
            View all
          </Link>
        </div>
        <div className="nx-grid-tools mt-6">
          {popular.map((t) => (t ? <ToolCard key={t.id} tool={t} signal="Popular" /> : null))}
        </div>
      </section>

      <section className="border-y border-[var(--nx-line)] bg-[var(--nx-bg-elev)]">
        <div className="nx-page py-12">
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="mt-1 text-sm text-[var(--nx-muted)]">Find the right workspace in one tap.</p>
          <div className="nx-cat-grid mt-6">
            {PUBLIC_CATEGORIES.map((cat) => {
              const count = getToolsByCategory(cat).length;
              return (
                <Link key={cat} href={`/network/tools/c/${cat}`} className="nx-cat-tile">
                  <strong>{CATEGORY_LABELS[cat]}</strong>
                  <span>
                    {count} tool{count === 1 ? "" : "s"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="nx-page py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Most useful</h2>
            <p className="mt-1 text-sm text-[var(--nx-muted)]">Editor-curated picks for everyday work.</p>
            <div className="nx-grid-tools mt-5" style={{ gridTemplateColumns: "1fr" }}>
              {featured.map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Recently updated</h2>
            <p className="mt-1 text-sm text-[var(--nx-muted)]">Fresh polish on tools people rely on.</p>
            <div className="nx-grid-tools mt-5" style={{ gridTemplateColumns: "1fr" }}>
              {recent.map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="nx-page pb-16">
        <div className="nx-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Not sure which tool?</h2>
            <p className="mt-1 text-sm text-[var(--nx-muted)]">
              Describe what you want — we recommend a real tool from this catalog.
            </p>
          </div>
          <Link href="/network/finder" className="nx-btn nx-btn-primary">
            Tool finder →
          </Link>
        </div>
      </section>
    </>
  );
}
