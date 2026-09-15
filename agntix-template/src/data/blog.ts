import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type LocalizedBlog = {
  id: string;
  slug: string;
  date: string;
  readMinutes: number;
  image: string;
  destinationSlug: string | null;
  destinationName: string | null;
  continent: string | null;
  tags: string[];
  title: string;
  excerpt: string;
  body: string[];
};

function pickLocale(en: string, ta: string, hi: string, locale: string) {
  if (locale === "ta") return ta || en;
  if (locale === "hi") return hi || en;
  return en;
}

function parseTags(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function parseBody(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function localizeBlogRow(
  row: BlogWithDestination | null,
  locale: string,
): LocalizedBlog | null {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    date: row.date,
    readMinutes: row.readMinutes,
    image: row.image,
    destinationSlug: row.destination?.slug ?? null,
    destinationName: row.destination
      ? pickLocale(
          row.destination.nameEn,
          row.destination.nameTa,
          row.destination.nameHi,
          locale,
        )
      : null,
    continent: row.destination?.continent ?? null,
    tags: parseTags(
      locale === "ta"
        ? row.tagsTa
        : locale === "hi"
          ? row.tagsHi
          : row.tagsEn,
    ),
    title: pickLocale(row.titleEn, row.titleTa, row.titleHi, locale),
    excerpt: pickLocale(row.excerptEn, row.excerptTa, row.excerptHi, locale),
    body: parseBody(
      pickLocale(row.bodyEn, row.bodyTa, row.bodyHi, locale),
    ),
  };
}

const blogInclude = {
  destination: {
    select: {
      slug: true,
      nameEn: true,
      nameTa: true,
      nameHi: true,
      continent: true,
    },
  },
} as const;

type BlogWithDestination = Prisma.BlogPostGetPayload<{
  include: typeof blogInclude;
}>;

export const KODAI_BLOG_IMAGE = "/images/marketing/kodai-banner.jpg";

export async function getLocalizedBlogs(
  locale: string,
  filters?: { destination?: string; continent?: string },
) {
  const rows = await prisma.blogPost.findMany({
    where: {
      ...(filters?.destination
        ? { destination: { slug: filters.destination } }
        : {}),
      ...(filters?.continent
        ? { destination: { continent: filters.continent } }
        : {}),
    },
    include: blogInclude,
    orderBy: [{ date: "desc" }, { titleEn: "asc" }],
  });
  return rows
    .map((row) => localizeBlogRow(row, locale))
    .filter(Boolean) as LocalizedBlog[];
}

export async function getLocalizedBlog(slug: string, locale: string) {
  const row = await prisma.blogPost.findUnique({
    where: { slug },
    include: blogInclude,
  });
  return localizeBlogRow(row, locale);
}

export async function getAllBlogSlugs() {
  const rows = await prisma.blogPost.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

export async function getBlogCount(filters?: {
  destination?: string;
  continent?: string;
}) {
  return prisma.blogPost.count({
    where: {
      ...(filters?.destination
        ? { destination: { slug: filters.destination } }
        : {}),
      ...(filters?.continent
        ? { destination: { continent: filters.continent } }
        : {}),
    },
  });
}

export async function getBlogDestinationOptions(locale: string) {
  const rows = await prisma.destination.findMany({
    orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
    include: {
      _count: { select: { blogs: true } },
    },
  });
  return rows
    .filter((r) => r._count.blogs > 0)
    .map((r) => ({
      slug: r.slug,
      label: pickLocale(r.nameEn, r.nameTa, r.nameHi, locale),
      continent: r.continent,
      count: r._count.blogs,
    }));
}

export async function getBlogContinentOptions() {
  const rows = await prisma.destination.findMany({
    select: { continent: true },
    distinct: ["continent"],
    orderBy: { continent: "asc" },
  });
  const options = [];
  for (const row of rows) {
    const count = await getBlogCount({ continent: row.continent });
    if (count > 0) {
      options.push({ continent: row.continent, count });
    }
  }
  return options;
}
