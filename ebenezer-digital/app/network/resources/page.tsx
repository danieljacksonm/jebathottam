import Link from "next/link";
import type { Metadata } from "next";
import { NETWORK_URL, JOURNAL_URL, TOOLS_URL, AI_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Resources",
  description: "Curated AI, development, SEO and productivity resources.",
  alternates: { canonical: `${NETWORK_URL}/resources` },
};

const RESOURCES = [
  {
    category: "AI",
    items: [
      { title: "Ask Ebenezer AI", href: AI_URL, external: true, note: "Companion assistant for explanations and planning." },
      { title: "AI Prompt Generator", href: "/network/tools/ai-prompt-generator", note: "Structure clearer prompts." },
      { title: "Compare AI coding tools", href: `${TOOLS_URL}/compare?ids=github-copilot,cursor`, external: true, note: "Affiliate discovery directory." },
    ],
  },
  {
    category: "Development",
    items: [
      { title: "Developer Hub", href: "/network/developers", note: "All developer utilities." },
      { title: "JSON Formatter", href: "/network/tools/json-formatter", note: "Everyday API debugging." },
      { title: "JWT Decoder", href: "/network/tools/jwt-decoder", note: "Inspect tokens locally." },
    ],
  },
  {
    category: "SEO",
    items: [
      { title: "Meta Tag Generator", href: "/network/tools/meta-tag-generator", note: "Titles, descriptions, OG basics." },
      { title: "Robots.txt Generator", href: "/network/tools/robots-txt-generator", note: "Crawl rules + sitemap line." },
      { title: "SEO guides", href: "/network/guides", note: "Practical how-tos." },
    ],
  },
  {
    category: "Business",
    items: [
      { title: "GST Calculator", href: "/network/tools/gst-calculator", note: "India GST math helper." },
      { title: "QR Code Generator", href: "/network/tools/qr-code-generator", note: "Links and text to PNG." },
      { title: "Ebenezer Journal", href: JOURNAL_URL, external: true, note: "Longer educational articles." },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="nx-page py-10">
      <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
      <p className="mt-2 max-w-2xl text-[var(--nx-muted)]">
        Useful starting points — not affiliate spam. External links are labeled by purpose.
      </p>
      <div className="mt-10 space-y-10">
        {RESOURCES.map((block) => (
          <section key={block.category}>
            <h2 className="text-xl font-bold">{block.category}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {block.items.map((item) =>
                item.external ? (
                  <a key={item.title} href={item.href} className="nx-card p-4 block no-underline text-inherit">
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-[var(--nx-muted)]">{item.note}</p>
                  </a>
                ) : (
                  <Link key={item.title} href={item.href} className="nx-card p-4 block no-underline text-inherit">
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-[var(--nx-muted)]">{item.note}</p>
                  </Link>
                )
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
