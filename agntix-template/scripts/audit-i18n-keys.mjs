import { readFileSync } from "node:fs";

function flatten(obj, prefix = "") {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      keys.push(...flatten(v, path));
    } else {
      keys.push({ path, value: v });
    }
  }
  return keys;
}

function get(obj, path) {
  return path.split(".").reduce((o, k) => o?.[k], obj);
}

const en = JSON.parse(readFileSync("messages/en.json", "utf8"));
const ta = JSON.parse(readFileSync("messages/ta.json", "utf8"));
const hi = JSON.parse(readFileSync("messages/hi.json", "utf8"));
const enKeys = flatten(en);

const missingTa = enKeys.filter(({ path }) => get(ta, path) === undefined).map((x) => x.path);
const missingHi = enKeys.filter(({ path }) => get(hi, path) === undefined).map((x) => x.path);
const emptyTa = enKeys.filter(({ path }) => {
  const v = get(ta, path);
  return v === "" || v === null;
}).map((x) => x.path);
const emptyHi = enKeys.filter(({ path }) => {
  const v = get(hi, path);
  return v === "" || v === null;
}).map((x) => x.path);

console.log(JSON.stringify({
  enKeyCount: enKeys.length,
  missingTa,
  missingHi,
  emptyTa,
  emptyHi,
}, null, 2));
