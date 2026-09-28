/**
 * Upsert longform EN bodies for complete guides + new destination cluster articles.
 * Preserves existing bodyTa/bodyHi when already present (translate script can refresh).
 *
 * Usage: node prisma/seed-longform-guides.mjs
 */
import { PrismaClient } from "@prisma/client";
import {
  longformBodies,
  longformMeta,
  newClusterGuides,
} from "./longform-bodies-en.mjs";

const prisma = new PrismaClient();

function paras(...blocks) {
  return JSON.stringify(blocks);
}

function tags(...items) {
  return JSON.stringify(items);
}

function wordCount(blocks) {
  return blocks.join(" ").split(/\s+/).filter(Boolean).length;
}

async function main() {
  const destRows = await prisma.destination.findMany({
    select: { id: true, slug: true },
  });
  const bySlug = new Map(destRows.map((d) => [d.slug, d.id]));

  let expanded = 0;
  for (const [slug, bodyEn] of Object.entries(longformBodies)) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing) {
      console.warn(`Skip expand — missing slug: ${slug}`);
      continue;
    }
    const meta = longformMeta[slug] ?? {};
    const bodyJson = paras(...bodyEn);
    const minutes =
      meta.readMinutes ??
      Math.max(existing.readMinutes, Math.round(wordCount(bodyEn) / 180));

    const update = {
      bodyEn: bodyJson,
      readMinutes: minutes,
      featured: true,
      status: "published",
      seoTitleEn: existing.seoTitleEn || `${existing.titleEn} | Canaan Travel Hub`,
      seoDescriptionEn: existing.seoDescriptionEn || existing.excerptEn,
    };
    if (meta.image) update.image = meta.image;
    if (Array.isArray(meta.tags)) {
      update.tagsEn = tags(...meta.tags);
    }
    // If TA/HI still mirror short EN stubs, refresh them to longform EN until translated
    try {
      const ta = JSON.parse(existing.bodyTa || "[]");
      const hi = JSON.parse(existing.bodyHi || "[]");
      if (!Array.isArray(ta) || ta.length < 20) update.bodyTa = bodyJson;
      if (!Array.isArray(hi) || hi.length < 20) update.bodyHi = bodyJson;
    } catch {
      update.bodyTa = bodyJson;
      update.bodyHi = bodyJson;
    }

    await prisma.blogPost.update({ where: { slug }, data: update });
    expanded += 1;
    console.log(`Expanded ${slug} (~${wordCount(bodyEn)} words, ${minutes} min)`);
  }

  let created = 0;
  for (const g of newClusterGuides) {
    const destinationId = g.destinationSlug
      ? bySlug.get(g.destinationSlug) ?? null
      : null;
    const bodyJson = paras(...g.bodyEn);
    const minutes =
      g.readMinutes ?? Math.max(8, Math.round(wordCount(g.bodyEn) / 180));

    await prisma.blogPost.upsert({
      where: { slug: g.slug },
      create: {
        slug: g.slug,
        destinationId,
        status: "published",
        featured: true,
        publishedAt: new Date(g.date),
        date: g.date,
        readMinutes: minutes,
        image: g.image,
        tagsEn: tags(...g.tags),
        tagsTa: tags(...g.tags),
        tagsHi: tags(...g.tags),
        titleEn: g.title.en,
        titleTa: g.title.ta,
        titleHi: g.title.hi,
        excerptEn: g.excerpt.en,
        excerptTa: g.excerpt.ta,
        excerptHi: g.excerpt.hi,
        bodyEn: bodyJson,
        bodyTa: bodyJson,
        bodyHi: bodyJson,
        seoTitleEn: `${g.title.en} | Canaan Travel Hub`,
        seoTitleTa: `${g.title.ta} | Canaan Travel Hub`,
        seoTitleHi: `${g.title.hi} | Canaan Travel Hub`,
        seoDescriptionEn: g.excerpt.en,
        seoDescriptionTa: g.excerpt.ta,
        seoDescriptionHi: g.excerpt.hi,
        authorEn: "Canaan Travel Hub",
      },
      update: {
        destinationId,
        status: "published",
        featured: true,
        publishedAt: new Date(g.date),
        date: g.date,
        readMinutes: minutes,
        image: g.image,
        tagsEn: tags(...g.tags),
        tagsTa: tags(...g.tags),
        tagsHi: tags(...g.tags),
        titleEn: g.title.en,
        titleTa: g.title.ta,
        titleHi: g.title.hi,
        excerptEn: g.excerpt.en,
        excerptTa: g.excerpt.ta,
        excerptHi: g.excerpt.hi,
        bodyEn: bodyJson,
        // Keep TA/HI if already longer translations exist
        ...(await (async () => {
          const row = await prisma.blogPost.findUnique({
            where: { slug: g.slug },
            select: { bodyTa: true, bodyHi: true },
          });
          if (!row) return { bodyTa: bodyJson, bodyHi: bodyJson };
          try {
            const ta = JSON.parse(row.bodyTa || "[]");
            const hi = JSON.parse(row.bodyHi || "[]");
            return {
              bodyTa: Array.isArray(ta) && ta.length >= 12 ? row.bodyTa : bodyJson,
              bodyHi: Array.isArray(hi) && hi.length >= 12 ? row.bodyHi : bodyJson,
            };
          } catch {
            return { bodyTa: bodyJson, bodyHi: bodyJson };
          }
        })()),
        seoTitleEn: `${g.title.en} | Canaan Travel Hub`,
        seoDescriptionEn: g.excerpt.en,
      },
    });
    created += 1;
    console.log(`Upserted cluster ${g.slug} (~${wordCount(g.bodyEn)} words)`);
  }

  console.log(`Done. Expanded ${expanded} complete guides, upserted ${created} cluster guides.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
