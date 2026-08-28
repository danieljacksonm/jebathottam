/**
 * Network route audit — checks key pages render with expected status + title markers.
 * Usage: node scripts/audit-network-routes.mjs [baseUrl]
 * Default baseUrl: http://127.0.0.1:3000
 */
const BASE = (process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");

const ROUTES = [
  "/network",
  "/network/tools",
  "/network/tools/c/developer",
  "/network/tools/c/seo",
  "/network/tools/c/image",
  "/network/tools/c/text",
  "/network/tools/c/calculators",
  "/network/tools/c/business",
  "/network/tools/c/ai",
  "/network/tools/json-formatter",
  "/network/tools/image-compressor",
  "/network/tools/gst-calculator",
  "/network/tools/qr-code-generator",
  "/network/developers",
  "/network/resources",
  "/network/guides",
  "/network/guides/what-is-json",
  "/network/finder",
  "/network/about",
  "/network/contact",
  "/network/privacy",
  "/network/terms",
  "/network/affiliate-disclosure",
  "/network/this-page-should-404-xyz",
];

async function check(path) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { Accept: "text/html" },
    });
    const text = await res.text();
    const title = (text.match(/<title[^>]*>([^<]*)<\/title>/i) || [, ""])[1].trim();
    const expect404 = path.includes("should-404");
    const ok = expect404
      ? res.status === 404 || /doesn.?t exist|not found/i.test(text)
      : res.status === 200 && text.length > 200 && !/Application error|Unhandled/i.test(text);
    return {
      path,
      status: res.status,
      title: title.slice(0, 80),
      ok,
      bytes: text.length,
    };
  } catch (e) {
    return { path, status: 0, title: "", ok: false, error: String(e.message || e), bytes: 0 };
  }
}

async function main() {
  console.log(`Auditing ${ROUTES.length} routes against ${BASE}\n`);
  const results = [];
  for (const r of ROUTES) {
    const row = await check(r);
    results.push(row);
    const mark = row.ok ? "OK" : "BROKEN";
    console.log(`[${mark}] ${row.status} ${row.path} — ${row.title || row.error || ""}`);
  }
  const working = results.filter((r) => r.ok).length;
  const broken = results.length - working;
  console.log("\n========== SUMMARY ==========");
  console.log(`TOTAL:   ${results.length}`);
  console.log(`WORKING: ${working}`);
  console.log(`BROKEN:  ${broken}`);
  if (broken > 0) process.exitCode = 1;
}

main();
