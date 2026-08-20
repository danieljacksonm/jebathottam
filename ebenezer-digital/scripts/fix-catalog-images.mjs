/**
 * One-shot: strip Unsplash product images from data/catalog.json
 * and replace with brand-logo Clearbit URLs (authorized interim assets).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "data", "catalog.json");
const dataPath = path.join(root, "app", "catalog", "data.ts");

const brands = {
  Acer: { image: "https://logo.clearbit.com/acer.com?size=256", domain: "acer.com" },
  Lenovo: { image: "https://logo.clearbit.com/lenovo.com?size=256", domain: "lenovo.com" },
  HP: { image: "https://logo.clearbit.com/hp.com?size=256", domain: "hp.com" },
  Apple: { image: "https://logo.clearbit.com/apple.com?size=256", domain: "apple.com" },
  WD: { image: "https://logo.clearbit.com/westerndigital.com?size=256", domain: "westerndigital.com" },
  Corsair: { image: "https://logo.clearbit.com/corsair.com?size=256", domain: "corsair.com" },
  LG: { image: "https://logo.clearbit.com/lg.com?size=256", domain: "lg.com" },
  NVIDIA: { image: "https://logo.clearbit.com/nvidia.com?size=256", domain: "nvidia.com" },
};

const store = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
let n = 0;
for (const prod of store.products || []) {
  if (prod.image && /unsplash\.com/i.test(prod.image)) {
    const b = brands[prod.brand];
    if (b) {
      prod.image = b.image;
      prod.imageSourceType = "brand_logo";
      prod.imageSourceLabel =
        "Brand logo (Clearbit) - exact model photo pending affiliate feed";
      prod.brandDomain = b.domain;
    } else {
      prod.image = "";
      prod.imageSourceType = "branded_placeholder";
      prod.imageSourceLabel = "Branded placeholder — awaiting affiliate/merchant image";
    }
    n++;
  }
}
fs.writeFileSync(catalogPath, JSON.stringify(store, null, 2));
console.log("catalog.json products updated:", n);

// Fix mojibake in seed data.ts (UTF-8 misread as Latin-1)
let data = fs.readFileSync(dataPath, "utf8");
const before = data;
data = data
  .replace(/â‚¹/g, "₹")
  .replace(/Ã—/g, "×")
  .replace(/â€”/g, "—")
  .replace(/â€“/g, "–")
  .replace(/â€œ/g, '"')
  .replace(/â€/g, '"')
  .replace(/â€˜/g, "'")
  .replace(/â€™/g, "'");
if (data !== before) {
  fs.writeFileSync(dataPath, data, "utf8");
  console.log("catalog data.ts encoding fixed");
} else {
  console.log("catalog data.ts already clean or patterns unmatched");
}
