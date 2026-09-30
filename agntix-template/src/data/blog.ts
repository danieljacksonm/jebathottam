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
  seoTitle: string;
  seoDescription: string;
  ogImage: string | null;
  canonicalUrl: string | null;
  author: string;
  /** Locales whose article body is not a copy of English. English is always included. */
  availableLocales: Array<"en" | "ta" | "hi">;
};

function hasOwnCopy(en?: string | null, other?: string | null) {
  if (en == null || other == null) return false;
  const left = en.trim();
  const right = other.trim();
  return right.length > 2 && right !== "[]" && right !== left;
}

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
    image.includes("loremflickr") ||
    image.includes("unsplash.com") ||
    image.includes("picsum.photos") ||
    image.includes("placehold")
  );
}

function resolveBlogImage(row: BlogCardRow) {
  if (!isWeakBlogImage(row.image)) return row.image;
  if (row.place?.image && !isWeakBlogImage(row.place.image)) return row.place.image;
  if (row.destination?.image && !isWeakBlogImage(row.destination.image)) {
    return row.destination.image;
  }
  return "/images/travel/d/darjeeling.jpg";
}

function localizeBlogRow(row: BlogCardRow | null, locale: string): LocalizedBlog | null {
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
      pickLocale(row.bodyEn ?? "[]", row.bodyTa ?? "[]", row.bodyHi ?? "[]", locale),
    ),
    seoTitle: pickLocale(
      row.seoTitleEn,
      row.seoTitleTa,
      row.seoTitleHi,
      locale,
    ),
    seoDescription: pickLocale(
      row.seoDescriptionEn,
      row.seoDescriptionTa,
      row.seoDescriptionHi,
      locale,
    ),
    ogImage: row.ogImage,
    canonicalUrl: row.canonicalUrl,
    author: pickLocale(row.authorEn, row.authorTa, row.authorHi, locale),
    availableLocales: [
      "en",
      ...(hasOwnCopy(row.bodyEn, row.bodyTa) ? (["ta"] as const) : []),
      ...(hasOwnCopy(row.bodyEn, row.bodyHi) ? (["hi"] as const) : []),
    ],
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

type BlogCardRow = Pick<
  BlogWithDestination,
  | "id"
  | "slug"
  | "date"
  | "readMinutes"
  | "image"
  | "tagsEn"
  | "tagsTa"
  | "tagsHi"
  | "titleEn"
  | "titleTa"
  | "titleHi"
  | "excerptEn"
  | "excerptTa"
  | "excerptHi"
  | "seoTitleEn"
  | "seoTitleTa"
  | "seoTitleHi"
  | "seoDescriptionEn"
  | "seoDescriptionTa"
  | "seoDescriptionHi"
  | "ogImage"
  | "canonicalUrl"
  | "authorEn"
  | "authorTa"
  | "authorHi"
  | "destination"
  | "place"
> & {
  bodyEn?: string;
  bodyTa?: string;
  bodyHi?: string;
};

function publishedWhere(filters?: {
  destination?: string;
  continent?: string;
  place?: string;
}): Prisma.BlogPostWhereInput {
  return {
    status: "published",
    ...(filters?.destination
      ? { destination: { slug: filters.destination } }
      : {}),
    ...(filters?.continent
      ? { destination: { continent: filters.continent } }
      : {}),
    ...(filters?.place ? { place: { slug: filters.place } } : {}),
  };
}

export const KODAI_BLOG_IMAGE = "/images/travel/d/kodaikanal.jpg";

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
    featured?: boolean;
  },
) {
  const rows = await prisma.blogPost.findMany({
    where: {
      ...publishedWhere(filters),
      ...(typeof filters?.featured === "boolean"
        ? { featured: filters.featured }
        : {}),
    },
    select: {
      id: true,
      slug: true,
      date: true,
      readMinutes: true,
      image: true,
      tagsEn: true,
      tagsTa: true,
      tagsHi: true,
      titleEn: true,
      titleTa: true,
      titleHi: true,
      excerptEn: true,
      excerptTa: true,
      excerptHi: true,
      seoTitleEn: true,
      seoTitleTa: true,
      seoTitleHi: true,
      seoDescriptionEn: true,
      seoDescriptionTa: true,
      seoDescriptionHi: true,
      ogImage: true,
      canonicalUrl: true,
      authorEn: true,
      authorTa: true,
      authorHi: true,
      ...blogInclude,
    },
    orderBy: [{ featured: "desc" }, { date: "desc" }, { titleEn: "asc" }],
    ...(typeof filters?.take === "number" ? { take: filters.take } : { take: 24 }),
    ...(typeof filters?.skip === "number" ? { skip: filters.skip } : {}),
  });
  return rows
    .map((row) => localizeBlogRow(row, locale))
    .filter(Boolean) as LocalizedBlog[];
}

export async function getLocalizedBlog(slug: string, locale: string) {
  const row = await prisma.blogPost.findFirst({
    where: { slug, status: "published" },
    include: blogInclude,
  });
  return localizeBlogRow(row, locale);
}

export type SitemapBlog = {
  slug: string;
  date: string;
  ta: boolean;
  hi: boolean;
};

/** Every published article, with flags for bodies that are not English copies. */
export async function getSitemapBlogs(): Promise<SitemapBlog[]> {
  const rows = await prisma.$queryRaw<
    Array<{ slug: string; date: string; ta: number | bigint; hi: number | bigint }>
  >`
    SELECT slug, date,
      CASE
        WHEN bodyTa IS NOT NULL AND length(trim(bodyTa)) > 2 AND bodyTa != '[]' AND bodyTa != bodyEn THEN 1
        ELSE 0
      END AS ta,
      CASE
        WHEN bodyHi IS NOT NULL AND length(trim(bodyHi)) > 2 AND bodyHi != '[]' AND bodyHi != bodyEn THEN 1
        ELSE 0
      END AS hi
    FROM BlogPost
    WHERE status = 'published'
  `;
  return rows.map((row) => ({
    slug: row.slug,
    date: row.date,
    ta: Number(row.ta) === 1,
    hi: Number(row.hi) === 1,
  }));
}

/** Prebuild a capped set for SSG; remaining posts render on demand. */
export async function getAllBlogSlugs(limit = 300) {
  const rows = await prisma.blogPost.findMany({
    where: { status: "published" },
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
    where: publishedWhere(filters),
  });
}

const filterCache = new Map<string, { at: number; value: unknown }>();

function remember<T>(key: string, load: () => Promise<T>) {
  const hit = filterCache.get(key);
  if (hit && Date.now() - hit.at < 5 * 60 * 1000) return Promise.resolve(hit.value as T);
  return load().then((value) => {
    filterCache.set(key, { at: Date.now(), value });
    return value;
  });
}

export async function getBlogDestinationOptions(locale: string) {
  return remember(`destinations:${locale}`, () => loadBlogDestinationOptions(locale));
}

async function loadBlogDestinationOptions(locale: string) {
  const rows = await prisma.destination.findMany({
    orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
    include: {
      _count: { select: { blogs: { where: { status: "published" } } } },
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
  return remember("continents", loadBlogContinentOptions);
}

async function loadBlogContinentOptions() {
  const rows = await prisma.blogPost.groupBy({
    by: ["destinationId"],
    _count: { _all: true },
    where: { destinationId: { not: null }, status: "published" },
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
