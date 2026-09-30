import fs from "fs";

const src = fs.readFileSync("app/blog/news/data.ts", "utf8");
const start = src.indexOf("const WORLD_NEWS_SEED");
const end = src.indexOf("export const WORLD_NEWS");
const block = src.slice(start, end);
const stories = [];
const re = /slug:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?dek:\s*"([^"]+)"[\s\S]*?body:\s*\[([\s\S]*?)\][\s\S]*?region:\s*"([^"]+)"[\s\S]*?topic:\s*"([^"]+)"/g;
let m;
while ((m = re.exec(block))) {
  const body = [...m[4].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  stories.push({ slug: m[1], title: m[2], dek: m[3], body, region: m[5], topic: m[6] });
}
fs.writeFileSync("data/i18n/news-articles.en.json", JSON.stringify(stories, null, 2));
console.log("stories", stories.length);
