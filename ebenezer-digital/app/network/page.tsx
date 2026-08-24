import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NetworkConstellation } from "@/components/network/NetworkConstellation";
import { NetworkSearch } from "@/components/network/NetworkSearch";
import { ToolCard } from "@/components/network/ToolCard";
import {
  CATEGORY_LABELS,
  getFeaturedTools,
  getLiveTools,
  getToolsByCategory,
} from "@/lib/network/registry";
import type { NetworkToolCategory } from "@/lib/network/types";
import { AI_URL } from "@/lib/site-url";

const HOME_CATEGORIES: NetworkToolCategory[] = [
  "developer",
  "seo",
  "ai",
  "image",
  "text",
  "business",
  "calculators",
];

export default function NetworkHomePage() {
  const featured = getFeaturedTools(9);
  const popular = getLiveTools().slice(0, 6);

  return (
    <>
      <section className="nx-hero">
        <div className="nx-page grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--nx-brand)]">
              Free tools · Developer resources · AI helpers
            </p>
            <h1>Free tools for the digital world.</h1>
            <p className="lead">
              Powerful online tools for developers, creators, businesses and everyday digital work.
            </p>
            <div className="mt-8">
              <NetworkSearch large />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Compress an image...", "Format JSON...", "Calculate GST...", "Create a QR code..."].map((ex) => (
                <Link key={ex} href={`/network/tools?q=${encodeURIComponent(ex.replace("...", ""))}`} className="nx-chip">
                  {ex}
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
          </div>
          <NetworkConstellation />
        </div>
      </section>

      <section className="nx-page py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Popular tools</h2>
            <p className="mt-1 text-sm text-[var(--nx-muted)]">Open instantly — no account required.</p>
          </div>
          <Link href="/network/tools" className="text-sm font-semibold text-[var(--nx-brand)] hover:underline">
            View all
          </Link>
        </div>
        <div className="nx-grid-tools mt-6">
          {popular.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--nx-line)] bg-[var(--nx-bg-elev)]">
        <div className="nx-page py-14">
          <h2 className="text-2xl font-bold tracking-tight">Editor picks</h2>
          <div className="nx-grid-tools mt-6">
            {featured.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </div>
      </section>

      <section className="nx-page py-14 space-y-12">
        {HOME_CATEGORIES.map((cat) => {
          const tools = getToolsByCategory(cat).slice(0, 3);
          if (!tools.length) return null;
          return (
            <div key={cat}>
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-xl font-bold">{CATEGORY_LABELS[cat]} tools</h2>
                <Link
                  href={`/network/tools?category=${cat}`}
                  className="text-sm font-semibold text-[var(--nx-brand)] hover:underline"
                >
                  See category
                </Link>
              </div>
              <div className="nx-grid-tools mt-4">
                {tools.map((t) => (
                  <ToolCard key={t.id} tool={t} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="nx-page pb-16">
        <div className="nx-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Not sure which tool?</h2>
            <p className="mt-1 text-sm text-[var(--nx-muted)]">
              Describe what you want to accomplish — we recommend a real tool from this catalog.
            </p>
          </div>
          <Link href="/network/finder" className="nx-btn nx-btn-primary">
            Tool finder <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
