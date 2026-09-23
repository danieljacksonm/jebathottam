/**
 * Download remote tourism photos to public/images/travel/ and update SQLite paths.
 * Run after apply-place-images.mjs.
 *
 *   node prisma/download-travel-images.mjs
 *   node prisma/download-travel-images.mjs --backfill-blogs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images", "travel");
const prisma = new PrismaClient();
const backfillBlogs = process.argv.includes("--backfill-blogs");

const urlCache = new Map();

function extFromUrl(url) {
  const clean = url.split("?")[0];
  const match = clean.match(/\.(jpe?g|png|webp)$/i);
  return match ? match[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
}

function isLocalImage(src) {
  return Boolean(src && src.startsWith("/images/"));
}

function isWeakImage(src) {
  return (
    !src ||
    src.includes("/images/kodai/") ||
    src.includes("loremflickr") ||
    src.includes("unsplash.com")
  );
}

function isRemoteImage(src) {
  return Boolean(src?.startsWith("http"));
}

async function downloadTo(localPath, url) {
  if (fs.existsSync(localPath)) return localPath;
  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "CanaanTravelHub/1.0 (https://canaantravelhub.com; managingdirector@canaantravelhub.com)",
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(localPath, buf);
  return localPath;
}

async function localPathFor(url, relPath) {
  if (!url?.startsWith("http")) return url;
  if (urlCache.has(url)) return urlCache.get(url);
  const ext = extFromUrl(url);
  const disk = path.join(OUT_DIR, `${relPath}.${ext}`);
  const web = `/images/travel/${relPath}.${ext}`;
  try {
    await downloadTo(disk, url);
    urlCache.set(url, web);
    return web;
  } catch (err) {
    console.warn(`Skip ${relPath}: ${err.message}`);
    return url;
  }
}

function pickBlogImage(blog) {
  if (isLocalImage(blog.place?.image) && !isWeakImage(blog.place.image)) {
    return blog.place.image;
  }
  if (isLocalImage(blog.destination?.image) && !isWeakImage(blog.destination.image)) {
    return blog.destination.image;
  }
  return null;
}

const stats = {
  destinations: 0,
  places: 0,
  blogsFromPlace: 0,
  blogsDownloaded: 0,
  backfilled: 0,
  skipped: 0,
};

const destinations = await prisma.destination.findMany({
  select: { id: true, slug: true, image: true },
});
for (const dest of destinations) {
  if (!dest.image?.startsWith("http")) continue;
  const local = await localPathFor(dest.image, `d/${dest.slug}`);
  if (local !== dest.image) {
    await prisma.destination.update({
      where: { id: dest.id },
      data: { image: local },
    });
    stats.destinations++;
  }
}

const places = await prisma.touristPlace.findMany({
  select: {
    id: true,
    slug: true,
    image: true,
    destination: { select: { slug: true } },
  },
});
for (const place of places) {
  if (!isRemoteImage(place.image)) continue;
  if (place.image.includes("loremflickr")) {
    const dest = destinations.find((d) => d.slug === place.destination.slug);
    if (dest?.image && isLocalImage(dest.image)) {
      await prisma.touristPlace.update({
        where: { id: place.id },
        data: { image: dest.image },
      });
      stats.places++;
      continue;
    }
    stats.skipped++;
    continue;
  }
  const local = await localPathFor(
    place.image,
    `p/${place.destination.slug}/${place.slug}`,
  );
  if (local !== place.image) {
    await prisma.touristPlace.update({
      where: { id: place.id },
      data: { image: local },
    });
    stats.places++;
  }
  if (stats.places % 25 === 0 && stats.places > 0) {
    process.stdout.write(`\rPlaces localised: ${stats.places}`);
  }
}

const fromPlace = await prisma.$executeRaw`
  UPDATE BlogPost
  SET image = (
    SELECT tp.image FROM TouristPlace tp
    WHERE tp.id = BlogPost.placeId
      AND tp.image LIKE '/images/%'
      AND tp.image NOT LIKE '%kodai%'
  )
  WHERE image LIKE 'http%'
    AND placeId IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM TouristPlace tp
      WHERE tp.id = BlogPost.placeId
        AND tp.image LIKE '/images/%'
        AND tp.image NOT LIKE '%kodai%'
    )
`;
const fromDest = await prisma.$executeRaw`
  UPDATE BlogPost
  SET image = (
    SELECT d.image FROM Destination d
    WHERE d.id = BlogPost.destinationId
      AND d.image LIKE '/images/%'
  )
  WHERE image LIKE 'http%'
    AND destinationId IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM Destination d
      WHERE d.id = BlogPost.destinationId
        AND d.image LIKE '/images/%'
    )
`;
console.log("Bulk blog backfill rows:", { fromPlace, fromDest });

const blogs = await prisma.blogPost.findMany({
  select: {
    id: true,
    slug: true,
    image: true,
    place: { select: { image: true } },
    destination: { select: { image: true } },
  },
});
let blogProcessed = 0;
for (const blog of blogs) {
  let next = blog.image;

  if (isRemoteImage(blog.image)) {
    const fromPlace = pickBlogImage(blog);
    if (fromPlace) {
      next = fromPlace;
      stats.blogsFromPlace++;
    } else if (blog.image.includes("loremflickr")) {
      stats.skipped++;
      continue;
    } else {
      next = await localPathFor(blog.image, `b/${blog.slug}`);
      if (next !== blog.image) stats.blogsDownloaded++;
    }
  } else if (backfillBlogs && isWeakImage(blog.image)) {
    next = pickBlogImage(blog) || blog.image;
    if (next && next !== blog.image) stats.backfilled++;
    else {
      stats.skipped++;
      continue;
    }
  } else {
    continue;
  }

  if (next && next !== blog.image) {
    await prisma.blogPost.update({
      where: { id: blog.id },
      data: { image: next },
    });
  }
  blogProcessed++;
  if (blogProcessed % 500 === 0) {
    process.stdout.write(
      `\rBlogs ${blogProcessed}: ${stats.blogsFromPlace} from place, ${stats.blogsDownloaded} downloaded`,
    );
  }
}

console.log("\n", stats);
await prisma.$disconnect();
