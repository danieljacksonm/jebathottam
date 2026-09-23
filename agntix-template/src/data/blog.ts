import type { Prisma } from "@prisma/client";
import { getDestinationHeroImage, getTravelHubHeroImage } from "@/data/destinations";
import { prisma } from "@/lib/prisma";

export type LocalizedBlog = {
  id: string;
  slug: string;
  date: string;
  readMinutes: number;
  image: string;
  destinationSlug: string | null;
  destinationName: string | null;
  placeSlug: string | null;
  placeName: string | null;
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

function isWeakBlogImage(image: string | null | undefined) {
  if (!image) return true;
  return (
    image.includes("/images/kodai/") ||
    image.includes("loremflickr") ||
    image.includes("unsplash.com")
  );
}

function resolveBlogImage(row: BlogWithDestination) {
  if (!isWeakBlogImage(row.image)) return row.image;
  if (row.place?.image && !isWeakBlogImage(row.place.image)) return row.place.image;
  if (row.destination?.image && !isWeakBlogImage(row.destination.image)) {
    return row.destination.image;
  }
  return "/images/travel/d/darjeeling.jpg";
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
    image: resolveBlogImage(row),
    destinationSlug: row.destination?.slug ?? null,
    destinationName: row.destination
      ? pickLocale(
          row.destination.nameEn,
          row.destination.nameTa,
          row.destination.nameHi,
          locale,
        )
      : null,
    placeSlug: row.place?.slug ?? null,
    placeName: row.place
      ? pickLocale(row.place.nameEn, row.place.nameTa, row.place.nameHi, locale)
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
      image: true,
    },
  },
  place: {
    select: {
      slug: true,
      nameEn: true,
      nameTa: true,
      nameHi: true,
      image: true,
    },
  },
} as const;

type BlogWithDestination = Prisma.BlogPostGetPayload<{
  include: typeof blogInclude;
}>;

export const KODAI_BLOG_IMAGE = "/images/marketing/kodai-banner.jpg";

export async function getBlogHeroImage(filters?: {
  destination?: string;
  continent?: string;
}) {
  if (filters?.destination) {
    return getDestinationHeroImage(filters.destination);
  }
  if (filters?.continent) {
    const row = await prisma.destination.findFirst({
      where: { continent: filters.continent },
      orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
      select: { image: true },
    });
    if (row?.image) return row.image;
  }
  return getTravelHubHeroImage();
}

export async function getLocalizedBlogs(
  locale: string,
  filters?: {
    destination?: string;
    continent?: string;
    place?: string;
    take?: number;
    skip?: number;
  },
) {
  const rows = await prisma.blogPost.findMany({
    where: {
      ...(filters?.destination
        ? { destination: { slug: filters.destination } }
        : {}),
      ...(filters?.continent
        ? { destination: { continent: filters.continent } }
        : {}),
      ...(filters?.place ? { place: { slug: filters.place } } : {}),
    },
    include: blogInclude,
    orderBy: [{ date: "desc" }, { titleEn: "asc" }],
    ...(typeof filters?.take === "number" ? { take: filters.take } : {}),
    ...(typeof filters?.skip === "number" ? { skip: filters.skip } : {}),
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

/** Prebuild a capped set for SSG; remaining posts render on demand. */
export async function getAllBlogSlugs(limit = 300) {
  const rows = await prisma.blogPost.findMany({
    select: { slug: true },
    orderBy: [{ date: "desc" }],
    take: limit,
  });
  return rows.map((r) => r.slug);
}

export async function getBlogCount(filters?: {
  destination?: string;
  continent?: string;
  place?: string;
}) {
  return prisma.blogPost.count({
    where: {
      ...(filters?.destination
        ? { destination: { slug: filters.destination } }
        : {}),
      ...(filters?.continent
        ? { destination: { continent: filters.continent } }
        : {}),
      ...(filters?.place ? { place: { slug: filters.place } } : {}),
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
  const rows = await prisma.blogPost.groupBy({
    by: ["destinationId"],
    _count: { _all: true },
    where: { destinationId: { not: null } },
  });
  if (rows.length === 0) return [];

  const destIds = rows.map((r) => r.destinationId!).filter(Boolean);
  const destinations = await prisma.destination.findMany({
    where: { id: { in: destIds } },
    select: { id: true, continent: true },
  });
  const destContinent = new Map(destinations.map((d) => [d.id, d.continent]));
  const totals = new Map<string, number>();

  for (const row of rows) {
    if (!row.destinationId) continue;
    const continent = destContinent.get(row.destinationId);
    if (!continent) continue;
    totals.set(continent, (totals.get(continent) ?? 0) + row._count._all);
  }

  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([continent, count]) => ({ continent, count }));
}
