import { SITE_NAV } from "@/lib/site-nav";

/** Cross-ecosystem links for content pages — use sparingly, one hop per destination type. */
export function ecosystemLinksForTopic(topic: string): { label: string; href: string }[] {
  const t = topic.toLowerCase();
  const links: { label: string; href: string }[] = [];

  if (/seo|search|google|sitemap|canonical/.test(t)) {
    links.push({ label: "SEO services", href: "/services/seo-services" });
    links.push({ label: "JSON Formatter tool", href: `${SITE_NAV.network}/tools/json-formatter` });
  }
  if (/bill|invoice|gst|shop|retail|pos/.test(t)) {
    links.push({ label: "Yegova Billing SaaS", href: SITE_NAV.saas });
    links.push({ label: "Invoice templates", href: `${SITE_NAV.store}/invoice-receipt-templates` });
  }
  if (/web|website|next|react|laravel/.test(t)) {
    links.push({ label: "Web development", href: "/services/web-development" });
    links.push({ label: "Website templates", href: SITE_NAV.store });
  }
  if (/ai|chatgpt|llm|automation/.test(t)) {
    links.push({ label: "AI solutions", href: "/services/ai-solutions" });
    links.push({ label: "Eben AI", href: SITE_NAV.ai });
  }

  links.push({ label: "Ebenezer Journal", href: SITE_NAV.journal });
  return links.slice(0, 5);
}
