import Link from "next/link";
import { pageMetadata } from "@/lib/site-url";
import { ToolsHeader } from "../ToolsHeader";

export const metadata = pageMetadata({
  title: "How we review tools | Ebenezer Tools",
  description:
    "Transparent methodology for Ebenezer Tools: editorial assessment, verified documentation, and pricing freshness — not fabricated user review counts.",
  path: "/tools/methodology",
});

const CRITERIA = [
  { title: "Features", body: "What the product actually offers for the stated use case." },
  { title: "Ease of use", body: "How quickly a typical small-business or creator user can get value." },
  { title: "Value", body: "Whether free/paid tiers make sense relative to alternatives." },
  { title: "Integrations", body: "Documented connections that matter for real workflows." },
  { title: "Support & docs", body: "Quality of official documentation and support channels." },
  { title: "Privacy / security", body: "Only claims we can verify from official materials." },
];

export default function ToolsMethodologyPage() {
  return (
    <>
      <ToolsHeader />
      <main className="aff-page py-10">
        <p className="text-sm text-[var(--aff-muted)]">
          <Link href="/tools" className="hover:text-[var(--aff-brand)]">
            Tools
          </Link>{" "}
          / Methodology
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">How we review tools</h1>
        <p className="mt-4 max-w-2xl text-[var(--aff-muted)] leading-relaxed">
          Ebenezer Tools pages are editorial software discovery pages. Scores are{" "}
          <strong className="text-[var(--aff-ink)]">editorial assessments</strong>, not fabricated
          star averages from imaginary users. Pricing is labeled with a verification date when known.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Assessment labels</h2>
          <ul className="mt-4 space-y-3 text-sm text-[var(--aff-ink-2)]">
            <li>
              <strong>Editorial assessment</strong> — researched from public docs, product sites, and
              team experience.
            </li>
            <li>
              <strong>Verified</strong> — details checked against official documentation on a dated
              pass.
            </li>
            <li>
              <strong>Tested</strong> — we have used the product hands-on (stated only when true).
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Criteria</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {CRITERIA.map((c) => (
              <article key={c.title} className="aff-card p-5">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-[var(--aff-muted)]">{c.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 max-w-2xl text-sm text-[var(--aff-muted)] leading-relaxed">
          <h2 className="text-xl font-semibold text-[var(--aff-ink)]">Affiliate disclosure</h2>
          <p className="mt-3">
            Some outbound links may be affiliate links. That never changes our editorial labels. See
            the full{" "}
            <Link href="/affiliate-disclosure" className="underline hover:text-[var(--aff-brand)]">
              affiliate disclosure
            </Link>
            .
          </p>
        </section>
      </main>
    </>
  );
}
