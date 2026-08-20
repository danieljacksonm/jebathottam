import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(root, "app", "catalog", "data.ts");
let s = fs.readFileSync(dataPath, "utf8");
if (s.includes("mpn:")) {
  console.log("seed already has mpn");
  process.exit(0);
}
const next = s.replace(/model: "([^"]+)",\n    categoryId:/g, (_m, model) => {
  return `model: "${model}",\n    mpn: "${model}",\n    sku: undefined as unknown as string,\n    categoryId:`;
});
// Better: inject mpn only, sku via id is harder in TS seed — use model as mpn only
const cleaned = s.replace(/model: "([^"]+)",\n    categoryId:/g, (_m, model) => {
  return `model: "${model}",\n    mpn: "${model}",\n    categoryId:`;
});
fs.writeFileSync(dataPath, cleaned);
console.log("Injected mpn from model into seed products");
