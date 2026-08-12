import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** 58 distinct outdoors / hill / mist / forest / lake photos — no hotels or rooms. */
const PHOTO_IDS = [
  "1506905925346-21bda4d32df4",
  "1464822759023-fed622ff2c3b",
  "1448375240586-882707db888b",
  "1439066615861-d1af74d74000",
  "1500530855697-b586d89ba3ee",
  "1483728642387-6c3bdd6c93bd",
  "1432405972618-c60b0225b8f9",
  "1504280390367-361c6d9f38f4",
  "1441974231531-c6227db76b6e",
  "1470071459604-3b5ec3a7fe05",
  "1519681393784-d120267933ba",
  "1501785888041-af3ef285b470",
  "1472214103451-9374bd1c798e",
  "1469474968028-56623f02e42e",
  "1426604966848-d7adac402bff",
  "1501854140801-50d01698950b",
  "1447752875215-b2761acb3c5d",
  "1511497584788-876760111969",
  "1542273917363-3b1817f69a2d",
  "1418065460487-3e41a6c84dc5",
  "1493246507139-91e8fad9978e",
  "1433086966358-548171c0a037",
  "1502082553048-f009c37129b9",
  "1470252649378-9c5956fe5e1d",
  "1508193638397-1c4234db14d1",
  "1454496522488-7a8e488e8606",
  "1486870591958-9b9d0d1dda99",
  "1494500764479-0c8f2919a3d8",
  "1513836279014-a89f7a76ae86",
  "1518495973542-4542c06a5843",
  "1528183429752-a539f5d5b0c0",
  "1482192505345-5655af888cc4",
  "1551632811-561732d1e306",
  "1519904981063-b0cf448d479e",
  "1465146633011-14f8e0781093",
  "1476041800959-2f6bb411c5e0",
  "1470770841072-f978cf4d019e",
  "1500534623283-312aade485b7",
  "1439853949127-fa647821eba0",
  "1475924156734-496f6cac6ec1",
  "1526772662000-3f88f10405ff",
  "1578662996442-48f60103fc96",
  "1547036967-23d11aacaee0",
  "1532274402911-5a369e4c4db0",
  "1465056836041-7f43ac27dcb5",
  "1490750967868-88aa4486c946",
  "1506744038136-46273834b3fb",
  "1476514525535-07fb3b4ae5f1",
  "1506197603052-3cc9c3a201bd",
  "1469854523086-cc02fe5d8800",
  "1446329813274-b5a1b78c91d5",
  "1470770903676-69b98201ea1a",
  "1500534314209-a25ddb2bd429",
  "1540202404-a2f2901651f0",
  "1682687220742-aba13b6e50ba",
  "1682687220063-4742bd7fd538",
  "1553284965-83fd3e82fa5a",
  "1511593358241-7eea1f3c84e5",
];

function toUrl(id) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;
}

const ids = [...new Set(PHOTO_IDS)];
if (ids.length < 58) {
  console.error(`Need 58 unique IDs, got ${ids.length}`);
  process.exit(1);
}

const urls = ids.slice(0, 58).map(toUrl);
const blogPath = join(__dirname, "..", "src", "data", "blog.ts");
let src = readFileSync(blogPath, "utf8");

src = src.replace(/\n\/\*\* Default Kodai landscape[\s\S]*?\*\/\nexport const KODAI_BLOG_IMAGE =\n {2}"[^"]+";/, "");
src = src.replace(/export const KODAI_BLOG_IMAGE =\n {2}"[^"]+";/, "");

src =
  `/** Default Kodai landscape for listing hero (nature only — not hotels). */\n` +
  `export const KODAI_BLOG_IMAGE =\n  "${urls[0]}";\n\n` +
  src.replace(/^\/\*\* Default Kodai landscape[\s\S]*?\*\/\n/, "");

// Normalize any existing image URLs back to placeholder, then assign
src = src.replace(/image: "https:\/\/images\.unsplash\.com\/[^"]+",/g, "image: KODAI_BLOG_IMAGE,");

let i = 0;
src = src.replace(/image: KODAI_BLOG_IMAGE,/g, () => {
  const u = urls[i];
  i += 1;
  return `image: "${u}",`;
});

if (i !== 58) {
  console.error(`Expected 58 replacements, got ${i}`);
  process.exit(1);
}

writeFileSync(blogPath, src, "utf8");
console.log(`OK: ${i} posts, ${new Set(urls).size} unique nature images`);
