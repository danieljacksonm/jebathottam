import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync("content/db/blogs.json", "utf8"));
const rows = data.rows ?? data;
const urls = [...new Set(rows.map((r) => r.image))];

const results = [];
const concurrency = 8;
let i = 0;

async function check(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return { url, status: res.status, ok: res.ok };
  } catch (e) {
    return { url, status: 0, ok: false, error: String(e) };
  }
}

async function worker() {
  while (i < urls.length) {
    const idx = i++;
    results[idx] = await check(urls[idx]);
  }
}

await Promise.all(Array.from({ length: concurrency }, worker));
const bad = results.filter((r) => !r.ok);
console.log(JSON.stringify({
  total: urls.length,
  ok: results.filter((r) => r.ok).length,
  bad,
}, null, 2));
