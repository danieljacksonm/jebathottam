import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS } from "../../data";
import { pageMetadata } from "@/lib/site-url";
import { SiteLegalLinks } from "@/components/SiteLegalLinks";
import { EDITORIAL_COMPARISONS, getEditorialComparison } from "../comparisons";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return EDITORIAL_COMPARISONS.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const c = getEditorialComparison(params.slug);
  if (!c) return {};
  return pageMetadata({
    title: `${c.title} | Ebenezer Tools`,
    description: c.excerpt,
    path: `/tools/compare/${c.slug}`,
  });
}

export default function EditorialComparisonPage({ params }: Props) {
  const comparison = getEditorialComparison(params.slug);
  if (!comparison) notFound();

  const tools = comparison.toolIds
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter(Boolean) as typeof TOOLS;

  if (tools.length < 2) notFound();

  const rows: { label: string; get: (t: (typeof TOOLS)[number]) => string }[] = [
    { label: "Category", get: (t) => t.category },
    {
      label: "Free plan",
      get: (t) => (t.pricing.free ? t.pricing.freeLabel || "Yes" : "No free plan"),
    },
    {
      label: "Paid pricing",
      get: (t) => t.pricing.paidLabel || t.pricing.paid || "Check official site",
    },
    { label: "Best for", get: (t) => t.bestFor },
    { label: "Strengths", get: (t) => t.pros.slice(0, 3).join("; ") },
    { label: "Weaknesses", get: (t) => t.cons.slice(0, 3).join("; ") },
    {
      label: "Editorial rating",
      get: (t) => `${t.rating}/5 (${t.ratingKind || "editorial"})`,
    },
    {
      label: "Pricing verified",
      get: (t) => t.pricingVerifiedAt || t.lastUpdated || "See tool page",
    },
  ];

  const alternatives = comparison.alternatives
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter(Boolean) as typeof TOOLS;

  return (
    <div className="aff-page py-8">
      <p className="text-sm text-[var(--aff-muted)]">
        <Link href="/tools" className="hover:text-[var(--aff-brand)]">
          Tools
        </Link>{" "}
        /{" "}
        <Link href="/tools/compare" className="hover:text-[var(--aff-brand)]">
          Compare
        </Link>
      </p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight">{comparison.title}</h1>
      <p className="mt-3 max-w-2xl text-[var(--aff-muted)]">{comparison.excerpt}</p>
      <p className="mt-2 text-xs text-[var(--aff-muted)]">Editorial review · Last reviewed {comparison.lastReviewed}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="aff-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--aff-muted)]">Best overall</p>
          <p className="mt-1 text-sm text-[var(--aff-ink)]">{comparison.bestOverall}</p>
        </div>
        <div className="aff-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--aff-muted)]">Best for beginners</p>
          <p className="mt-1 text-sm text-[var(--aff-ink)]">{comparison.bestForBeginners}</p>
        </div>
        <div className="aff-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--aff-muted)]">Best for businesses</p>
          <p className="mt-1 text-sm text-[var(--aff-ink)]">{comparison.bestForBusinesses}</p>
        </div>
        <div className="aff-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--aff-muted)]">Best value</p>
          <p className="mt-1 text-sm text-[var(--aff-ink)]">{comparison.bestValue}</p>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold">Feature comparison</h2>
      <ul className="mt-4 space-y-3">
        {comparison.featureNotes.map((f) => (
          <li key={f.feature} className="aff-card p-4">
            <p className="font-semibold text-[var(--aff-ink)]">{f.feature}</p>
            <p className="mt-1 text-sm text-[var(--aff-muted)]">{f.notes}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 overflow-x-auto aff-card">
        <table className="aff-table min-w-[640px]">
          <thead>
            <tr>
              <th>Spec</th>
              {tools.map((t) => (
                <th key={t.id}>
                  <Link
                    href={`/tools/${t.id}`}
                    className="!normal-case !tracking-normal text-sm font-semibold text-[var(--aff-ink)] hover:text-[var(--aff-brand)]"
                  >
                    {t.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th className="!normal-case !tracking-normal w-36">{row.label}</th>
                {tools.map((t) => (
                  <td key={t.id} className="text-sm text-[var(--aff-ink-2)]">
                    {row.get(t)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">Recommendation</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--aff-ink-2)]">{comparison.recommendation}</p>

      {alternatives.length > 0 ? (
        <>
          <h2 className="mt-10 text-xl font-bold">Alternatives</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {alternatives.map((t) => (
              <li key={t.id}>
                <Link href={`/tools/${t.id}`} className="aff-chip">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <div className="mt-8">
        <Link
          href={`/tools/compare?ids=${comparison.toolIds.join(",")}`}
          className="aff-btn aff-btn-ghost"
        >
          Open live side-by-side table →
        </Link>
      </div>

      <p className="aff-disclosure mt-8">
        Affiliate disclosure: we may earn a commission. Editorial picks are ours; verify pricing on official sites.
        See{" "}
        <Link href="/tools/methodology" className="underline">
          methodology
        </Link>
        .
      </p>

      <SiteLegalLinks className="mt-10 text-xs text-[var(--aff-muted)]" linkClassName="hover:text-[var(--aff-text)]" />
    </div>
  );
}
