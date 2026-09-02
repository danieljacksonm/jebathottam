import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const data = JSON.parse(readFileSync("content/db/blogs.json", "utf8"));
const rows = data.rows ?? data;

const byHost = new Map();
const localPaths = [];
const broken = [];

for (const row of rows) {
  const { slug, image } = row;
  if (!image) {
    broken.push({ slug, reason: "empty image" });
    continue;
  }
  if (image.startsWith("/")) {
    localPaths.push({ slug, image });
    const disk = `public${image}`;
    if (!existsSync(disk)) broken.push({ slug, image, reason: "missing local file" });
  } else if (image.startsWith("http")) {
    let host;
    try {
      host = new URL(image).hostname;
    } catch {
      broken.push({ slug, image, reason: "invalid URL" });
      continue;
    }
    byHost.set(host, (byHost.get(host) ?? 0) + 1);
  } else {
    broken.push({ slug, image, reason: "unknown path format" });
  }
}

const uniqueImages = new Set(rows.map((r) => r.image));
console.log(JSON.stringify({
  totalPosts: rows.length,
  uniqueImages: uniqueImages.size,
  hosts: Object.fromEntries(byHost),
  localCount: localPaths.length,
  broken,
}, null, 2));
