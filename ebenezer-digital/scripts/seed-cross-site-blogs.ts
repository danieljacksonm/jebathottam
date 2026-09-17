/**
 * Seed cross-property journal articles (store, tools, network, SaaS, services).
 * Run: DATABASE_URL=... npx tsx scripts/seed-cross-site-blogs.ts
 */
import { PrismaClient } from "@prisma/client";
import { CROSS_SITE_BLOGS } from "../lib/cross-site-blogs";
import { journalCoverForTopic } from "../lib/journal-images";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }
  let n = 0;
  for (const p of CROSS_SITE_BLOGS) {
    const coverImage = journalCoverForTopic(p.category, p.title, n);
    await prisma.journalPost.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        category: p.category,
        tags: p.tags,
        author: "Ebenezer Editorial",
        status: "published",
        publishedAt: new Date(),
        coverImage,
        seoTitle: `${p.title} | Ebenezer Journal`,
        seoDescription: p.excerpt,
        indexable: true,
      },
      update: {
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        category: p.category,
        tags: p.tags,
        coverImage,
        seoTitle: `${p.title} | Ebenezer Journal`,
        seoDescription: p.excerpt,
        status: "published",
        indexable: true,
      },
    });
    n += 1;
    console.log(`  ✓ ${p.slug}`);
  }
  console.log(`\nSeeded ${n} cross-site blog posts.\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
