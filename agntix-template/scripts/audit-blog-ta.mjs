import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync("content/db/blogs.json", "utf8"));
const rows = data.rows ?? data;

const issues = [];
for (const row of rows) {
  const taTitle = row.title?.ta ?? "";
  const taExcerpt = row.excerpt?.ta ?? "";
  const taBody = row.body?.ta ?? [];
  const enTitle = row.title?.en ?? "";
  if (!taTitle.trim()) issues.push({ slug: row.slug, field: "title.ta", empty: true });
  else if (taTitle === enTitle) issues.push({ slug: row.slug, field: "title.ta", sameAsEn: true });
  if (!taExcerpt.trim()) issues.push({ slug: row.slug, field: "excerpt.ta", empty: true });
  if (!taBody.length) issues.push({ slug: row.slug, field: "body.ta", empty: true });
  else if (taBody.every((p) => p === row.body?.en?.[0])) {
    issues.push({ slug: row.slug, field: "body.ta", sameAsEn: true });
  }
}

const byField = {};
for (const i of issues) {
  const key = i.field + (i.empty ? ":empty" : i.sameAsEn ? ":sameAsEn" : "");
  byField[key] = (byField[key] ?? 0) + 1;
}

console.log(JSON.stringify({
  totalPosts: rows.length,
  issueCount: issues.length,
  byField,
  sample: issues.slice(0, 8),
}, null, 2));
