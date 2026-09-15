import { prisma } from "@/lib/prisma";

export type DestinationStatus = "published" | "coming_soon" | "enquiry";

export type LocalizedDestination = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  body: string;
  country: string;
  continent: string;
  region: string;
  image: string;
  status: DestinationStatus;
  featured: boolean;
  priceFrom: number | null;
  sortOrder: number;
};

export type LocalizedPlace = {
  slug: string;
  name: string;
  summary: string;
  image: string | null;
};

function pickLocale(en: string, ta: string, hi: string, locale: string) {
  if (locale === "ta") return ta || en;
  if (locale === "hi") return hi || en;
  return en;
}

function localizeDestination(
  row: Awaited<ReturnType<typeof prisma.destination.findFirst>>,
  locale: string,
): LocalizedDestination | null {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: pickLocale(row.nameEn, row.nameTa, row.nameHi, locale),
    tagline: pickLocale(row.taglineEn, row.taglineTa, row.taglineHi, locale),
    body: pickLocale(row.bodyEn, row.bodyTa, row.bodyHi, locale),
    country: row.country,
    continent: row.continent,
    region: row.region,
    image: row.image,
    status: row.status as DestinationStatus,
    featured: row.featured,
    priceFrom: row.priceFrom,
    sortOrder: row.sortOrder,
  };
}

export async function getDestinations(locale: string) {
  const rows = await prisma.destination.findMany({
    orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
  });
  return rows
    .map((row) => localizeDestination(row, locale))
    .filter(Boolean) as LocalizedDestination[];
}

export async function getFeaturedDestinations(locale: string, limit = 6) {
  const rows = await prisma.destination.findMany({
    where: { featured: true },
    orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
    take: limit,
  });
  return rows
    .map((row) => localizeDestination(row, locale))
    .filter(Boolean) as LocalizedDestination[];
}

export async function getDestination(slug: string, locale: string) {
  const row = await prisma.destination.findUnique({ where: { slug } });
  return localizeDestination(row, locale);
}

export async function getDestinationSlugs() {
  const rows = await prisma.destination.findMany({
    select: { slug: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((r) => r.slug);
}

export async function getContinents() {
  const rows = await prisma.destination.findMany({
    select: { continent: true },
    distinct: ["continent"],
    orderBy: { continent: "asc" },
  });
  return rows.map((r) => r.continent);
}

export async function getDestinationsByContinent(
  continent: string,
  locale: string,
) {
  const rows = await prisma.destination.findMany({
    where: { continent },
    orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
  });
  return rows
    .map((row) => localizeDestination(row, locale))
    .filter(Boolean) as LocalizedDestination[];
}

export async function getPlacesForDestination(
  destinationId: string,
  locale: string,
) {
  const rows = await prisma.touristPlace.findMany({
    where: { destinationId },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((row) => ({
    slug: row.slug,
    name: pickLocale(row.nameEn, row.nameTa, row.nameHi, locale),
    summary: pickLocale(row.summaryEn, row.summaryTa, row.summaryHi, locale),
    image: row.image,
  })) satisfies LocalizedPlace[];
}
