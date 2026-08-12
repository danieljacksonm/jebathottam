/**
 * Rebuild store download ZIP packs from public/downloads/packs/*
 * Run: node scripts/build-store-zips.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "public", "downloads");
const packs = path.join(root, "packs");

const names = [
  "creator-landing-kit",
  "shop-pos-starter-pack",
  "travel-enquiry-pack",
  "digital-business-playbook",
  "brand-kit-essentials",
  "free-enquiry-form-kit",
  "creator-bundle",
];

for (const name of names) {
  const src = path.join(packs, name);
  const zip = path.join(root, `${name}.zip`);
  if (!fs.existsSync(src)) {
    console.error("Missing pack folder:", src);
    process.exit(1);
  }
  if (fs.existsSync(zip)) fs.unlinkSync(zip);

  // Prefer PowerShell Compress-Archive on Windows for zero deps
  if (process.platform === "win32") {
    execFileSync(
      "powershell.exe",
      [
        "-NoProfile",
        "-Command",
        `Compress-Archive -Path '${src}\\*' -DestinationPath '${zip}' -Force`,
      ],
      { stdio: "inherit" }
    );
  } else {
    execFileSync("zip", ["-r", zip, "."], { cwd: src, stdio: "inherit" });
  }
  console.log("built", path.basename(zip));
}

console.log("done");
