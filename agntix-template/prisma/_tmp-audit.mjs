import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const featured = await p.destination.findMany({
  where: { featured: true },
  orderBy: { sortOrder: "asc" },
  select: {
    slug: true,
    nameEn: true,
    priceFrom: true,
    image: true,
    status: true,
  },
});
const darj = await p.destination.findUnique({
  where: { slug: "darjeeling" },
  select: {
    slug: true,
    nameEn: true,
    featured: true,
    status: true,
    priceFrom: true,
    image: true,
    _count: { select: { places: true, blogs: true } },
  },
});
const placeSample = await p.touristPlace.findMany({
  where: { destination: { slug: "darjeeling" } },
  take: 8,
  select: { slug: true, nameEn: true, image: true },
});
console.log(JSON.stringify({ featured, darj, placeSample }, null, 2));
await p.$disconnect();
