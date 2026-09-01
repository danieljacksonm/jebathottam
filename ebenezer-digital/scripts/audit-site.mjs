/**
 * Site-wide route smoke test.
 * Usage: node scripts/audit-site.mjs [baseUrl]
 * Run after: npm run build && npm run start
 */
const BASE = (process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");

const ROUTES = [
  "/",
  "/contact",
  "/services",
  "/work",
  "/privacy",
  "/terms",
  "/sitemap",
  "/insights",
  "/saas",
  "/ai",
  "/discover",
  "/info",
  "/info/about",
  "/info/search",
  "/info/contact",
  "/blog",
  "/blog/news",
  "/products",
  "/tools",
  "/catalog",
  "/network",
  "/network/tools",
  "/network/tools/json-formatter",
  "/site-legal/privacy",
  "/site-sitemap",
  "/this-route-should-404-audit",
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
    const expectRedirect = ["/ai", "/saas", "/discover"].includes(path);
    const ok = expect404
      ? res.status === 404 || /couldn.?t find|not found|404/i.test(text)
      : expectRedirect
        ? res.status >= 300 && res.status < 400
        : res.status === 200 && text.length > 200 && !/Application error|Unhandled/i.test(text);
    return { path, status: res.status, title: title.slice(0, 72), ok, bytes: text.length };
  } catch (e) {
    return { path, status: 0, title: "", ok: false, error: String(e.message || e), bytes: 0 };
  }
}

async function main() {
  console.log(`Site audit — ${ROUTES.length} routes @ ${BASE}\n`);
  const results = [];
  for (const r of ROUTES) {
    const row = await check(r);
    results.push(row);
    console.log(`[${row.ok ? "OK" : "FAIL"}] ${row.status} ${row.path} — ${row.title || row.error || ""}`);
  }
  const working = results.filter((r) => r.ok).length;
  console.log("\n========== SUMMARY ==========");
  console.log(`TOTAL:   ${results.length}`);
  console.log(`WORKING: ${working}`);
  console.log(`BROKEN:  ${results.length - working}`);
  if (working < results.length) process.exitCode = 1;
}

main();
