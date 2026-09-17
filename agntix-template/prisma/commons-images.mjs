/**
 * Real place photographs from Wikimedia Commons (same files a browser search returns).
 * High-resolution JPEG/WebP thumbs, one file never reused.
 */

const UA =
  "CanaanTravelHub/1.0 (https://canaantravelhub.com; managingdirector@canaantravelhub.com)";

const used = new Set();

function strip(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(text) {
  return String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !["the", "and", "for", "near", "from"].includes(w));
}

const TRAVEL =
  /beach|island|atoll|lagoon|resort|aerial|sunset|sunrise|mosque|harbour|harbor|capital|overwater|coast|skyline|palace|temple|fort|mountain|lake|desert|market|landscape|villa|harbour|bay|cliff|cathedral|bridge|garden|park|waterfall|monument/i;
const NOT_HERO =
  /holothuria|gymnothorax|acanthaster|chromosome|microscop|larva|skeleton|stamp|coin|specimen|dissection|underwater macro|fish|shark|eel|crab|coral close/i;

function scoreHit(title, placeName, destName) {
  const hay = title.toLowerCase();
  let score = 0;
  for (const word of tokens(placeName)) {
    if (hay.includes(word)) score += 3;
  }
  for (const word of tokens(destName)) {
    if (hay.includes(word)) score += 1;
  }
  if (TRAVEL.test(title)) score += 8;
  if (NOT_HERO.test(title)) score -= 8;
  return score;
}

function pickUrl(info) {
  const mime = info.mime || "";
  if (!mime.startsWith("image/")) return null;
  if (mime.includes("svg") || mime.includes("gif")) return null;
  const width = info.thumbwidth || info.width || 0;
  if (width && width < 1000) return null;
  const raw = info.thumburl || info.url;
  const url = raw ? raw.split("?")[0] : "";
  if (!url.startsWith("https://")) return null;
  if (used.has(url)) return null;
  return url;
}

function toPhoto(page, info, placeName, destName) {
  const title = page.title || "";
  if (/icon|logo|flag of|coat of arms|map of|locator|diagram|qr.?code|pictogram|seal of/i.test(title)) {
    return null;
  }
  const url = pickUrl(info);
  if (!url) return null;
  const artist = strip(info.extmetadata?.Artist?.value) || "Wikimedia Commons";
  const license = strip(info.extmetadata?.LicenseShortName?.value) || "CC";
  return {
    url,
    credit: `${artist} / ${license}`,
    page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`,
    title,
    score: scoreHit(title, placeName, destName),
  };
}

async function searchOnce(query, offset) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "50",
    gsroffset: String(offset),
    prop: "imageinfo",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: "1600",
    origin: "*",
  });
  const res = await fetch(
    `https://commons.wikimedia.org/w/api.php?${params}`,
    { headers: { "User-Agent": UA, Accept: "application/json" } },
  );
  if (!res.ok) throw new Error(`Commons ${res.status} for ${query}`);
  const data = await res.json();
  return Object.values(data.query?.pages ?? {});
}

export async function photosForPlace(placeName, destName, country, needed) {
  const queries = [
    `"${placeName}" ${destName}`,
    `${placeName} ${country} travel`,
    `${destName} ${country} landmark`,
  ];
  const found = [];
  const seenTitles = new Set();

  for (const query of queries) {
    if (found.length >= needed) break;
    for (const offset of [0, 50]) {
      if (found.length >= needed) break;
      let pages = [];
      try {
        pages = await searchOnce(query, offset);
      } catch {
        await new Promise((r) => setTimeout(r, 800));
        continue;
      }
      const ranked = pages
        .map((page) => toPhoto(page, page.imageinfo?.[0] ?? {}, placeName, destName))
        .filter(Boolean)
        .sort((a, b) => b.score - a.score);
      for (const photo of ranked) {
        if (seenTitles.has(photo.title) || used.has(photo.url)) continue;
        if (photo.score === 0 && found.length > 0 && query !== queries[0]) continue;
        seenTitles.add(photo.title);
        used.add(photo.url);
        found.push(photo);
        if (found.length >= needed) break;
      }
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  return found;
}

export function markUsed(url) {
  if (url) used.add(url);
}
