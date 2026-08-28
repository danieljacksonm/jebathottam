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
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url,
      type: "website",
      siteName: "Ebenezer Digital Network",
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seoTitle,
      description: tool.seoDescription,
    },
  };
}

export default function NetworkToolPage({ params }: Props) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();
  const related = getRelatedTools(tool.slug, 4);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: NETWORK_URL },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${NETWORK_URL}/tools` },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryLabel(tool.category),
        item: `${NETWORK_URL}/tools/${tool.category === "calculators" ? "calculators" : tool.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: tool.name,
        item: `${NETWORK_URL}/tools/${tool.slug}`,
      },
    ],
  };

  const faqLd =
    tool.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: tool.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      ) : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softLd) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-[var(--nx-muted)]">
        <Link href="/network" className="hover:text-[var(--nx-brand)]">
          Home
        </Link>
        {" / "}
        <Link href="/network/tools" className="hover:text-[var(--nx-brand)]">
          Tools
        </Link>
        {" / "}
        <Link href={`/network/tools/c/${tool.category}`} className="hover:text-[var(--nx-brand)]">
          {categoryLabel(tool.category)}
        </Link>
        {" / "}
        <span className="text-[var(--nx-ink)]">{tool.name}</span>
      </nav>

      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-[2rem]">{tool.name}</h1>
      <p className="mt-2 max-w-2xl text-base text-[var(--nx-muted)] sm:text-lg">{tool.description}</p>

      <div className="mt-6">
        <ToolWorkspace slug={tool.slug} />
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="nx-prose">
          <h2>How to use it</h2>
          <ol>
            {tool.howItWorks.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <h3>Features</h3>
          <ul>
            {tool.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        {tool.faqs.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold">Common questions</h2>
            <div className="mt-3 space-y-4">
              {tool.faqs.map((f) => (
                <div key={f.q}>
                  <p className="font-semibold">{f.q}</p>
                  <p className="mt-1 text-sm text-[var(--nx-muted)]">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-bold">Related tools</h2>
          <p className="mt-1 text-sm text-[var(--nx-muted)]">Useful next steps for the same kind of work.</p>
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
