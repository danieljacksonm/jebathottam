import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle, ExternalLink, XCircle } from "lucide-react";
import { TOOLS } from "../data";
import { resolveToolImage, freshnessLabel } from "@/lib/affiliate/images";
import { AffiliateMedia } from "@/components/AffiliateMedia";
import { pageMetadata, SITE_URL } from "@/lib/site-url";

type Props = { params: { id: string } };

export function generateMetadata({ params }: Props): Metadata {
  const tool = TOOLS.find((t) => t.id === params.id);
  if (!tool) return { title: "Tool | Ebenezer Tools", robots: { index: false, follow: false } };
  const title = `${tool.name} — Review, Pricing & Alternatives`;
  const description = `${tool.tagline} Honest review with pros, cons, pricing notes and alternatives for ${tool.bestFor}.`;
  return pageMetadata({
    title,
    description,
    path: `/tools/${params.id}`,
  });
}

export default function ToolDetailPage({ params }: Props) {
  const tool = TOOLS.find((t) => t.id === params.id);
  if (!tool) notFound();

  const image = resolveToolImage({
    name: tool.name,
    logoImg: tool.logoImg,
    domain: tool.domain,
  });
  const alternatives = TOOLS.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 4);
  const features = tool.features?.length ? tool.features : tool.pros.slice(0, 5);

  return (
    <div className="aff-page py-8">
      <p className="text-sm text-[var(--aff-muted)]">
        <Link href="/tools" className="hover:text-[var(--aff-brand)]">
          Tools
        </Link>{" "}
        / {tool.category} / {tool.name}
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[200px_1fr]">
        <div className="aff-card p-6 flex items-center justify-center">
          <AffiliateMedia image={image} showSource />
        </div>
        <div>
          {tool.badge ? <span className="aff-badge">{tool.badge}</span> : null}
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{tool.name}</h1>
          <p className="mt-2 text-lg text-[var(--aff-muted)]">{tool.tagline}</p>
          <p className="mt-3 text-sm text-[var(--aff-ink-2)]">
            <span className="font-semibold">Category:</span> {tool.category}
          </p>
          <p className="mt-1 text-sm text-[var(--aff-ink-2)]">
            <span className="font-semibold">Best for:</span> {tool.bestFor}
          </p>
          <p className="mt-1 text-sm text-[var(--aff-ink-2)]">
            <span className="font-semibold">Pricing:</span>{" "}
            {tool.pricing.free
              ? tool.pricing.freeLabel || "Free plan available"
              : "No free plan"}
            {tool.pricing.paid ? ` · Paid from ${tool.pricing.paid}` : ""}
          </p>
          <p className="aff-fresh mt-2">{freshnessLabel(tool.lastUpdated || "2026-08-18T10:00:00.000Z")}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={tool.url}
              target={tool.url.startsWith("http") ? "_blank" : undefined}
              rel={tool.url.startsWith("http") ? "sponsored noopener noreferrer" : undefined}
              className="aff-btn aff-btn-primary"
            >
              Visit official website <ExternalLink className="h-4 w-4" />
            </a>
            <Link href={`/tools/compare?ids=${tool.id},${alternatives[0]?.id || ""}`} className="aff-btn aff-btn-ghost">
              Compare alternatives
            </Link>
            <Link href={`${SITE_URL}/ai?mode=tools&prompt=${encodeURIComponent(`Is ${tool.name} right for me?`)}`} className="aff-btn aff-btn-ghost">
              Ask AI
            </Link>
          </div>
          <p className="aff-disclosure mt-3">Affiliate link where applicable.</p>
        </div>
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">Overview</h2>
          <p className="mt-3 text-[var(--aff-ink-2)] leading-relaxed">{tool.description}</p>
          <h3 className="mt-6 font-semibold">Why consider it?</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {features.map((f) => (
              <li key={f} className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">Pros</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {tool.pros.map((p) => (
                <li key={p} className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold">Cons</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {tool.cons.map((c) => (
                <li key={c} className="flex gap-2">
                  <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold">Who should use it</h2>
            <p className="mt-2 text-sm text-[var(--aff-ink-2)]">{tool.bestFor}</p>
            <h3 className="mt-4 font-semibold">Who should avoid it</h3>
            <p className="mt-1 text-sm text-[var(--aff-muted)]">
              {tool.whoShouldAvoid || tool.cons[0] || "Information unavailable"}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 aff-card p-5 bg-[var(--aff-brand-soft)] border-teal-200">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--aff-brand-dk)]">Ebenezer recommendation</p>
        <p className="mt-2 text-[var(--aff-ink-2)]">
          {tool.name} fits {tool.bestFor.toLowerCase()}. Weigh the free/paid terms above and compare at least one
          alternative before you commit.
        </p>
      </section>

      {alternatives.length > 0 ? (
        <section className="mt-12 pb-10">
          <h2 className="text-xl font-bold">Alternatives</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {alternatives.map((a) => (
              <Link key={a.id} href={`/tools/${a.id}`} className="aff-card p-4 hover:border-teal-300">
                <p className="font-semibold">{a.name}</p>
                <p className="text-sm text-[var(--aff-muted)] mt-1">{a.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
