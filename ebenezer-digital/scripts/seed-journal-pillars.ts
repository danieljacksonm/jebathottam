/**
 * Seed pillar knowledge articles into Prisma JournalPost.
 * Run: DATABASE_URL=... npx tsx scripts/seed-journal-pillars.ts
 */
import { PrismaClient } from "@prisma/client";
import { journalCoverForTopic } from "../lib/journal-images";

const prisma = new PrismaClient();

const PILLARS = [
  {
    slug: "what-is-dns",
    title: "What is DNS? A complete guide",
    category: "Technology",
    excerpt: "How domain names become IP addresses — records, propagation, security, and troubleshooting.",
    content: `## Definition\n\nDNS (Domain Name System) is the internet's phone book. It translates human-readable names like example.com into IP addresses computers use.\n\n## How DNS works\n\n1. You type a domain in the browser.\n2. Your device asks a resolver.\n3. The resolver queries authoritative servers.\n4. An IP address returns and the connection begins.\n\n## Common record types\n\n- **A** — IPv4 address\n- **AAAA** — IPv6 address\n- **CNAME** — alias to another name\n- **MX** — mail routing\n- **TXT** — verification and SPF\n- **NS** — nameserver delegation\n\n## FAQ\n\n### How long does propagation take?\nUsually minutes to 48 hours depending on TTL and caches.\n\n### Is DNS the same as hosting?\nNo. DNS points to servers; hosting serves the files.`,
  },
  {
    slug: "what-is-seo",
    title: "What is SEO? Search engine optimization explained",
    category: "SEO",
    excerpt: "Crawling, indexing, ranking, technical SEO, content, and Search Console — a practical overview.",
    content: `## Definition\n\nSEO is the practice of making web content easy to find, crawl, index, and rank in search engines.\n\n## How search engines work\n\n1. **Crawl** — bots fetch URLs\n2. **Index** — pages enter the search database\n3. **Rank** — queries match the best results\n\n## Technical SEO checklist\n\n- Valid sitemap.xml\n- Correct canonical URLs\n- hreflang for multilingual sites\n- Fast Core Web Vitals\n- No accidental noindex\n\n## FAQ\n\n### Does SEO guarantee traffic?\nNo. It removes technical barriers and improves relevance.`,
  },
  {
    slug: "what-is-ssl-tls",
    title: "What is SSL/TLS?",
    category: "Security",
    excerpt: "HTTPS, certificates, encryption, and why every site needs TLS today.",
    content: `## Definition\n\nSSL/TLS encrypts data between browsers and servers. HTTPS is HTTP secured with TLS.\n\n## Why it matters\n\n- Protects passwords and payments\n- Builds user trust (padlock)\n- Required for modern browser features\n\n## FAQ\n\n### Is Let's Encrypt enough for small sites?\nOften yes for public websites.`,
  },
];

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }
  let n = 0;
  for (const p of PILLARS) {
    const coverImage = journalCoverForTopic(p.category, p.title, n);
    await prisma.journalPost.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        category: p.category,
        tags: ["pillar", "knowledge", p.category.toLowerCase()],
        coverImage,
        seoTitle: p.title,
        seoDescription: p.excerpt,
        publishedAt: new Date(),
        status: "published",
        indexable: true,
      },
      update: {
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        coverImage,
        indexable: true,
      },
    });
    n++;
  }
  console.log(`Upserted ${n} pillar articles`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
