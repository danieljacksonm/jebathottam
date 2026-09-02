import { headers } from "next/headers";
import { siteKindFromHost, originForKind } from "@/lib/site-url";
import { CANONICAL_URLS } from "@/lib/ecosystem-urls";

/** llms.txt — summary for AI crawlers (emerging convention). Served at /llms.txt on every host. */
export async function GET() {
  const kind = siteKindFromHost(headers().get("host"));
  const origin = originForKind(kind);

  const summaries: Record<string, string> = {
    studio: `# Ebenezer Digital Services
> Custom websites, software, data entry, travel support, and AI for businesses worldwide.
> Main site: ${CANONICAL_URLS.studio}
> Contact: ${CANONICAL_URLS.studio}/contact
> Store: ${CANONICAL_URLS.store}
> SaaS billing: ${CANONICAL_URLS.saas}
> Free tools: ${CANONICAL_URLS.network}
> AI assistant: ${CANONICAL_URLS.ai}`,
    saas: `# Yegova Billing (Ebenezer SaaS)
> Free cloud billing for Indian shops — GST invoices, stock, party ledger, thermal print, reports.
> Marketing: ${CANONICAL_URLS.saas}
> Parent company: ${CANONICAL_URLS.studio}`,
    store: `# Ebenezer Store
> Ready-made digital products — templates, software kits, and tools with instant access.
> ${CANONICAL_URLS.store}`,
    tools: `# Ebenezer Tools
> Compare AI tools, SaaS, and software for business use.
> ${CANONICAL_URLS.tools}`,
    network: `# Ebenezer Digital Network
> Free online tools for developers, creators, and businesses.
> ${CANONICAL_URLS.network}`,
    info: `# Ebenezer Digital Information
> News and journal hub for the Ebenezer ecosystem.
> ${CANONICAL_URLS.info}`,
    journal: `# Ebenezer Journal
> Long-form stories and ideas.
> ${CANONICAL_URLS.journal}`,
    news: `# Ebenezer News
> World news desk with regional coverage.
> ${CANONICAL_URLS.news}`,
    products: `# Ebenezer Products (Hardware catalog)
> Laptop and electronics research and comparisons.
> ${CANONICAL_URLS.products}`,
    ai: `# Ebenezer AI (Eben)
> AI assistant across the Ebenezer ecosystem.
> ${CANONICAL_URLS.ai}`,
    discover: `# Ebenezer Discover
> Intent router — find the right Ebenezer product for your goal.
> ${CANONICAL_URLS.discover}`,
  };

  const body =
    summaries[kind] ||
    `# Ebenezer Digital
> ${origin}
> Ecosystem: ${Object.values(CANONICAL_URLS).join(", ")}`;

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
