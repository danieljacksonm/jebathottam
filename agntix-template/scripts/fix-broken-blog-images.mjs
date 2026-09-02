import { readFileSync, writeFileSync } from "node:fs";

const replacements = {
  "photo-1483728642387-6c3bdd6c93bd": "/images/kodai/coakers-walk.webp",
  "photo-1433086966358-548171c0a037": "/images/kodai/berijam.webp",
  "photo-1470252649378-9c5956fe5e1d": "/images/kodai/hero.webp",
  "photo-1508193638397-1c4234db14d1": "/images/kodai/silver-cascade.webp",
  "photo-1528183429752-a539f5d5b0c0": "/images/kodai/kodai-lake.webp",
  "photo-1476041800959-2f6bb411c5e0": "/images/kodai/dolphins-nose.webp",
  "photo-1532274402911-5a369e4c4db0": "/images/kodai/bryant.webp",
  "photo-1446329813274-b5a1b78c91d5": "/images/kodai/poombarai.webp",
  "photo-1470770903676-69b98201ea1a": "/images/kodai/silver-cascade.webp",
  "photo-1540202404-a2f2901651f0": "/images/kodai/pine-forest.webp",
};

const path = "content/db/blogs.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const fixed = [];

for (const row of data.rows) {
  for (const [brokenId, localPath] of Object.entries(replacements)) {
    if (row.image.includes(brokenId)) {
      fixed.push({ slug: row.slug, from: row.image, to: localPath });
      row.image = localPath;
      break;
    }
  }
}

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ fixedCount: fixed.length, fixed }, null, 2));
