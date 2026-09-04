import Link from "next/link";
import type { Metadata } from "next";
import { TOOLS } from "../data";
import { pageMetadata } from "@/lib/site-url";
import { EDITORIAL_COMPARISONS } from "./comparisons";

export const metadata: Metadata = pageMetadata({
  title: "Compare tools | Ebenezer Tools",
  description: "Editorial comparisons and live side-by-side tables from our software catalog.",
  path: "/tools/compare",
});

type Props = { searchParams: { ids?: string } };

export default function ToolsComparePage({ searchParams }: Props) {
  const ids = (searchParams.ids || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  let tools = ids.map((id) => TOOLS.find((t) => t.id === id)).filter(Boolean) as typeof TOOLS;

  if (tools.length < 2) {
    tools = TOOLS.filter((t) => ["chatgpt", "claude", "gemini"].includes(t.id));
    if (tools.length < 2) {
      tools = TOOLS.filter((t) => t.category === "Billing & Invoicing" || t.category === "Accounting").slice(0, 3);
    }
  }

  const rows: { label: string; get: (t: (typeof TOOLS)[number]) => string }[] = [
    { label: "Category", get: (t) => t.category },
    {
      label: "Free plan",
      get: (t) => (t.pricing.free ? t.pricing.freeLabel || "Yes" : "No free plan"),
    },
    {
      label: "Paid pricing",
      get: (t) => t.pricing.paidLabel || t.pricing.paid || "Information unavailable",
    },
    {
      label: "Key features",
      get: (t) => (t.features?.length ? t.features.slice(0, 3).join("; ") : t.pros.slice(0, 3).join("; ")),
    },
    {
      label: "Platforms",
      get: (t) => (t.platforms?.length ? t.platforms.join(", ") : "Information unavailable"),
    },
    {
      label: "Integrations",
      get: (t) => (t.integrations?.length ? t.integrations.join(", ") : "Information unavailable"),
    },
    { label: "Best for", get: (t) => t.bestFor },
    { label: "Strengths", get: (t) => t.pros.slice(0, 3).join("; ") },
    { label: "Weaknesses", get: (t) => t.cons.slice(0, 3).join("; ") },
    { label: "Editorial rating", get: (t) => `${t.rating}/5` },
  ];

  return (
    <div className="aff-page py-8">
      <h1 className="text-3xl font-bold">Compare tools</h1>
      <p className="mt-2 text-[var(--aff-muted)] max-w-2xl">
        Editorial write-ups plus live side-by-side facts from our catalog. We do not invent pricing or features.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Editorial comparisons</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {EDITORIAL_COMPARISONS.map((c) => (
          <Link key={c.slug} href={`/tools/compare/${c.slug}`} className="aff-card block p-4 hover:border-[var(--aff-brand)]">
            <p className="font-semibold text-[var(--aff-ink)]">{c.title}</p>
            <p className="mt-1 text-sm text-[var(--aff-muted)] line-clamp-2">{c.excerpt}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-semibold">Quick tables</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/tools/compare?ids=chatgpt,claude,gemini" className="aff-chip">
          ChatGPT vs Claude vs Gemini
        </Link>
        <Link href="/tools/compare?ids=github-copilot,cursor" className="aff-chip">
          Copilot vs Cursor
        </Link>
        <Link href="/tools/compare?ids=ebenezer-saas,zoho-invoice,wave" className="aff-chip">
          Billing trio
        </Link>
        <Link href="/tools/compare?ids=canva,adobe-express,looka" className="aff-chip">
          Design tools
        </Link>
        <Link href="/tools/compare?ids=mailchimp,brevo" className="aff-chip">
          Email marketing
        </Link>
        <Link href="/tools/compare?ids=hubspot,zoho-crm" className="aff-chip">
          CRM
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto aff-card">
        <table className="aff-table min-w-[720px]">
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
            <tr>
              <th className="!normal-case !tracking-normal">Action</th>
              {tools.map((t) => (
                <td key={t.id}>
                  <a
                    href={t.url}
                    className="font-semibold text-[var(--aff-brand-dk)] hover:underline"
                    rel={t.url.startsWith("http") ? "sponsored noopener noreferrer" : undefined}
                    target={t.url.startsWith("http") ? "_blank" : undefined}
                  >
                    Visit →
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="aff-disclosure mt-6">
        We may earn a commission through affiliate links. Comparisons use listed catalog data only. When pricing says
        “Check official site”, verify before you buy.
      </p>
    </div>
  );
}
