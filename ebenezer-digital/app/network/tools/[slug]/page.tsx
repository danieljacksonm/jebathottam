import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ToolWorkspace } from "@/components/network/tools/ToolWorkspace";
import { ToolCard } from "@/components/network/ToolCard";
import { getLiveTools, getRelatedTools, getToolBySlug, categoryLabel } from "@/lib/network/registry";
import { NETWORK_URL, AI_URL, TOOLS_URL } from "@/lib/site-url";
import { ToolViewTracker } from "./ToolViewTracker";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getLiveTools().map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const tool = getToolBySlug(params.slug);
  if (!tool) return { title: "Tool" };
  const url = `${NETWORK_URL}/tools/${tool.slug}`;
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    alternates: { canonical: url },
    openGraph: { title: tool.name, description: tool.seoDescription, url, type: "website" },
  };
}

export default function NetworkToolPage({ params }: Props) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();
  const related = getRelatedTools(tool.slug, 4);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const softLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: "BrowserApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: tool.description,
    url: `${NETWORK_URL}/tools/${tool.slug}`,
  };

  return (
    <div className="nx-page py-8">
      <ToolViewTracker slug={tool.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softLd) }} />

      <p className="text-sm text-[var(--nx-muted)]">
        <Link href="/network" className="hover:text-[var(--nx-brand)]">
          Home
        </Link>
        {" / "}
        <Link href="/network/tools" className="hover:text-[var(--nx-brand)]">
          Tools
        </Link>
        {" / "}
        <Link href={`/network/tools?category=${tool.category}`} className="hover:text-[var(--nx-brand)]">
          {categoryLabel(tool.category)}
        </Link>
        {" / "}
        {tool.name}
      </p>

      <h1 className="mt-3 text-3xl font-bold tracking-tight">{tool.name}</h1>
      <p className="mt-2 max-w-2xl text-lg text-[var(--nx-muted)]">{tool.description}</p>

      <div className="mt-8">
        <ToolWorkspace slug={tool.slug} />
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">How it works</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[var(--nx-ink-2)]">
            {tool.howItWorks.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <h3 className="mt-6 font-semibold">Features</h3>
          <ul className="mt-2 space-y-1 text-sm text-[var(--nx-ink-2)]">
            {tool.features.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold">FAQ</h2>
          <div className="mt-3 space-y-4">
            {tool.faqs.map((f) => (
              <div key={f.q}>
                <p className="font-semibold">{f.q}</p>
                <p className="mt-1 text-sm text-[var(--nx-muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-bold">Related tools</h2>
          <div className="nx-grid-tools mt-4">
            {related.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12 mb-8 nx-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="font-semibold">Need a smarter recommendation?</p>
          <p className="text-sm text-[var(--nx-muted)] mt-1">
            Ask Ebenezer AI, or compare software on our tools directory.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={`${AI_URL}?mode=general`} className="nx-btn nx-btn-primary">
            Ask AI
          </a>
          <a href={TOOLS_URL} className="nx-btn nx-btn-ghost">
            Compare software
          </a>
        </div>
      </section>
    </div>
  );
}
