import { readFileSync } from "node:fs";

const m = readFileSync("src/data/blog.ts", "utf8");
const imgs = [...m.matchAll(/image: "(https:[^"]+)"/g)].map((x) => x[1]);
const ids = imgs.map((u) => u.match(/photo-([a-zA-Z0-9-]+)/)?.[1] ?? u);
console.log("images", imgs.length);
console.log("unique urls", new Set(imgs).size);
console.log("unique photo ids", new Set(ids).size);
const bad = imgs.filter((u) =>
  /1566073771259|1582719478250|1520250497591|hotel|resort/i.test(u),
);
console.log("hotel-like matches", bad.length);
console.log("sample", imgs.slice(0, 4));
