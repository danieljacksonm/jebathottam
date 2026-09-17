/**
 * Export English i18n master JSON from services catalog + shell strings.
 * Run: npx tsx scripts/export-en-i18n.ts
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { SERVICE_LANDINGS } from "../lib/services-catalog";
import { EN_SHELL } from "../lib/i18n/en-shell";

const OUT = join(process.cwd(), "data", "i18n", "messages");

const en = {
  shell: EN_SHELL,
  sections: {
    services: "Services",
    whatWeDeliver: "What we deliver",
    howWeWork: "How we work",
    technology: "Technology",
    faq: "FAQ",
    relatedLinks: "Related links",
    contactUs: "Contact us",
    allServices: "All services",
    whoItIsFor: "Who it is for",
    serviceNotFound: "Service not found.",
  },
  services: Object.fromEntries(
    SERVICE_LANDINGS.map((s) => [
      s.slug,
      {
        title: s.title,
        forWho: s.forWho,
        value: s.value,
        capabilities: s.capabilities,
        process: s.process,
        faq: s.faq,
      },
    ])
  ),
  journal: {
    "what-is-dns": {
      title: "What is DNS? A complete guide",
      excerpt:
        "How domain names become IP addresses — records, propagation, security, and troubleshooting.",
      body: `## Definition\n\nDNS (Domain Name System) is the internet's phone book. It translates human-readable names like example.com into IP addresses computers use.\n\n## How DNS works\n\n1. You type a domain in the browser.\n2. Your device asks a resolver.\n3. The resolver queries authoritative servers.\n4. An IP address returns and the connection begins.\n\n## Common record types\n\n- **A** — IPv4 address\n- **AAAA** — IPv6 address\n- **CNAME** — alias to another name\n- **MX** — mail routing\n- **TXT** — verification and SPF\n- **NS** — nameserver delegation\n\n## FAQ\n\n### How long does propagation take?\nUsually minutes to 48 hours depending on TTL and caches.\n\n### Is DNS the same as hosting?\nNo. DNS points to servers; hosting serves the files.`,
    },
    "what-is-seo": {
      title: "What is SEO? Search engine optimization explained",
      excerpt: "Crawling, indexing, ranking, technical SEO, content, and Search Console — a practical overview.",
      body: `## Definition\n\nSEO is the practice of making web content easy to find, crawl, index, and rank in search engines.\n\n## How search engines work\n\n1. **Crawl** — bots fetch URLs\n2. **Index** — pages enter the search database\n3. **Rank** — queries match the best results\n\n## Technical SEO checklist\n\n- Valid sitemap.xml\n- Correct canonical URLs\n- hreflang for multilingual sites\n- Fast Core Web Vitals\n- No accidental noindex\n\n## FAQ\n\n### Does SEO guarantee traffic?\nNo. It removes technical barriers and improves relevance.`,
    },
    "what-is-ssl-tls": {
      title: "What is SSL/TLS?",
      excerpt: "HTTPS, certificates, encryption, and why every site needs TLS today.",
      body: `## Definition\n\nSSL/TLS encrypts data between browsers and servers. HTTPS is HTTP secured with TLS.\n\n## Why it matters\n\n- Protects passwords and payments\n- Builds user trust (padlock)\n- Required for modern browser features\n\n## FAQ\n\n### Is Let's Encrypt enough for small sites?\nOften yes for public websites.`,
    },
  },
};

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "en.json"), JSON.stringify(en, null, 2));
console.log(`Wrote ${join(OUT, "en.json")} (${SERVICE_LANDINGS.length} services)`);
