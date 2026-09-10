import { readFileSync, writeFileSync } from "node:fs";

const scenes = [
  "/images/kodai/dolphins-nose.webp",
  "/images/kodai/coakers-walk.webp",
  "/images/kodai/pillar-rocks.webp",
  "/images/kodai/kodai-lake.webp",
  "/images/kodai/pine-forest.webp",
  "/images/kodai/poombarai.webp",
  "/images/kodai/mannavanur.webp",
  "/images/kodai/berijam.webp",
  "/images/kodai/silver-cascade.webp",
  "/images/kodai/camping.webp",
  "/images/kodai/bryant.webp",
];

const packageMap = {
  "kodai-escape": "/images/kodai/pine-forest.webp",
  "kodai-family": "/images/kodai/kodai-lake.webp",
  "kodai-honeymoon": "/images/kodai/coakers-walk.webp",
  "kodai-luxury": "/images/kodai/bryant.webp",
  "kodai-adventure": "/images/kodai/camping.webp",
  "kodai-complete": "/images/kodai/mannavanur.webp",
};

function localForKey(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % scenes.length;
  }
  return scenes[hash];
}

const blogs = JSON.parse(readFileSync("content/db/blogs.json", "utf8"));
let blogMigrated = 0;
for (const row of blogs.rows) {
  if (row.image.startsWith("http")) {
    row.image = localForKey(row.slug);
    blogMigrated++;
  }
}
writeFileSync("content/db/blogs.json", `${JSON.stringify(blogs, null, 2)}\n`, "utf8");

const packages = JSON.parse(readFileSync("content/db/packages.json", "utf8"));
let pkgMigrated = 0;
for (const row of packages.rows) {
  const mapped = packageMap[row.id];
  if (mapped && row.image.startsWith("http")) {
    row.image = mapped;
    pkgMigrated++;
  }
}
writeFileSync("content/db/packages.json", `${JSON.stringify(packages, null, 2)}\n`, "utf8");

console.log(JSON.stringify({ blogMigrated, pkgMigrated }, null, 2));
