/**
 * Seed Journal digital topics into Prisma when DATABASE_URL is set.
 * Run on VPS: DATABASE_URL=mysql://... npx tsx scripts/seed-journal-topics.ts
 */
import { PrismaClient } from "@prisma/client";

const TOPICS = [
  ["how to choose a domain", "Websites", "A domain is the name customers type."],
  ["what is seo", "SEO", "SEO is how search engines find a useful page."],
  ["google business profile", "Local", "A Business Profile is the card Google shows beside search."],
  ["https and ssl", "Security", "HTTPS keeps a form private in transit."],
  ["what is a website", "Websites", "A website is a set of pages people can open without an app."],
  ["whatsapp business", "Messaging", "WhatsApp Business keeps customer chats in one inbox."],
  ["how to write a meta description", "SEO", "A description is the short line under a search result."],
  ["what is hosting", "Websites", "Hosting is the computer that stores your site."],
  ["email for a business", "Email", "A branded email looks like you, not a free inbox."],
  ["what is a cms", "Websites", "A CMS lets you edit pages without rewriting code."],
  ["pos and online shop", "Shop", "One stock file beats two systems that disagree."],
  ["invoice basics", "Shop", "An invoice is the bill you send after work is agreed."],
  ["ai tools for small business", "AI", "AI can draft, sort, and remind — you still decide."],
  ["what is cloud storage", "Cloud", "Cloud storage keeps files on a vendor computer you can open anywhere."],
  ["backups", "Cloud", "A backup is a second copy you can restore."],
  ["password hygiene", "Security", "One password per site, plus a manager."],
  ["what is dns", "Websites", "DNS turns a name into the server address."],
  ["mobile first pages", "Websites", "Most visitors open the site on a phone."],
  ["core web vitals", "SEO", "Speed and layout stability affect whether people stay."],
  ["canonical urls", "SEO", "One preferred URL keeps search from splitting credit."],
];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function article(title: string, category: string, seed: string) {
  const sections = [
    seed,
    `Start with the job to be done. If the page does not help someone finish that job, it will not rank or convert.`,
    `Name the tool, the cost, and who it is for. Avoid invented statistics.`,
    `Link to a related guide on this Journal instead of sending the reader away.`,
    `Review the page every quarter. Search language changes; the explanation should stay accurate.`,
  ];
  return sections.map((p, i) => `## ${i === 0 ? "What this means" : "Step " + i}\n\n${p}`).join("\n\n");
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }
  const prisma = new PrismaClient();
  let n = 0;
  const angles = ["explained", "for small business", "checklist", "common mistakes", "vs doing nothing", "in India", "this week"];
  for (const [base, category, seed] of TOPICS) {
    for (const angle of angles) {
      const title = `${base} ${angle}`.replace(/\b\w/g, (c) => c.toUpperCase());
      const slug = slugify(`${base}-${angle}`).slice(0, 80);
      const content = article(title, category, seed);
      await prisma.journalPost.upsert({
        where: { slug },
        create: {
          slug,
          title,
          excerpt: seed,
          content,
          category,
          tags: [category.toLowerCase(), "digital"],
          seoTitle: `${title} | Ebenezer Journal`,
          seoDescription: seed.slice(0, 155),
          publishedAt: new Date(),
          status: "published",
          indexable: true,
        },
        update: { title, excerpt: seed, content, category },
      });
      n += 1;
    }
  }
  console.log(`Upserted ${n} journal posts`);
  await prisma.$disconnect();
}

void main();
