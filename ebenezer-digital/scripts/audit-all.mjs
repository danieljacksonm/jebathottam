/**
 * Run site + network smoke audits (server must be running).
 * Usage: npm run build && npm run start &  npm run audit:all [baseUrl]
 */
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const BASE = process.argv[2] || "http://127.0.0.1:3000";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function run(script: string) {
  const r = spawnSync(process.execPath, [join(ROOT, "scripts", script), BASE], {
    stdio: "inherit",
    cwd: ROOT,
  });
  return r.status === 0;
}

console.log(`\n=== Ebenezer audit:all @ ${BASE} ===\n`);
const siteOk = run("audit-site.mjs");
const networkOk = run("audit-network-routes.mjs");
console.log("\n=== DONE ===");
console.log(`Site:    ${siteOk ? "OK" : "FAIL"}`);
console.log(`Network: ${networkOk ? "OK" : "FAIL"}`);
if (!siteOk || !networkOk) process.exitCode = 1;
