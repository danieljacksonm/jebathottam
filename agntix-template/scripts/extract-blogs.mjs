import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "src/data/blog.ts"), "utf8");

const postBlock = src.match(
  /export const blogPosts: BlogPost\[\] = \[([\s\S]*?)\];/,
)?.[1];
if (!postBlock) throw new Error("blogPosts missing");

const posts = [];
const postRe =
  /slug: "([^"]+)",\s*date: "([^"]+)",\s*readMinutes: (\d+),\s*image: "([^"]+)",\s*tags: \[([^\]]*)\],/g;
let m;
while ((m = postRe.exec(postBlock))) {
  posts.push({
    slug: m[1],
    date: m[2],
    readMinutes: Number(m[3]),
    image: m[4],
    tags: [...m[5].matchAll(/"([^"]+)"/g)].map((x) => x[1]),
  });
}

const copyBlock = src.match(
  /export const blogCopy: Record<string, BlogCopy> = \{([\s\S]*?)\n\};/,
)?.[1];
if (!copyBlock) throw new Error("blogCopy missing");

const copy = {};
const entryRe =
  /"([^"]+)": \{\s*title: \{\s*en: ("(?:\\.|[^"])*")\s*,\s*ta: ("(?:\\.|[^"])*")\s*,\s*hi: ("(?:\\.|[^"])*")\s*,?\s*\}\s*,\s*excerpt: \{\s*en: ("(?:\\.|[^"])*")\s*,\s*ta: ("(?:\\.|[^"])*")\s*,\s*hi: ("(?:\\.|[^"])*")\s*,?\s*\}\s*,\s*body: \[([\s\S]*?)\],\s*\}/g;
let e;
while ((e = entryRe.exec(copyBlock))) {
  copy[e[1]] = {
    title: {
      en: JSON.parse(e[2]),
      ta: JSON.parse(e[3]),
      hi: JSON.parse(e[4]),
    },
    excerpt: {
      en: JSON.parse(e[5]),
      ta: JSON.parse(e[6]),
      hi: JSON.parse(e[7]),
    },
    bodyEn: [...e[8].matchAll(/("(?:\\.|[^"])*")/g)].map((x) =>
      JSON.parse(x[1]),
    ),
  };
}

mkdirSync(join(root, "content/db"), { recursive: true });
writeFileSync(
  join(root, "content/db/_blogs-extract.json"),
  JSON.stringify({ posts, copy }, null, 2),
);
console.log("posts", posts.length, "copy", Object.keys(copy).length);
