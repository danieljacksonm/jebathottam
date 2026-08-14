import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const blogsPath = join(root, "content/db/blogs.json");
const db = JSON.parse(readFileSync(blogsPath, "utf8"));
const rows = db.rows || db;

const seasons = {
  en: ["March-June", "July-September", "October-February"],
  ta: ["மார்ச்-ஜூன்", "ஜூலை-செப்டம்பர்", "அக்டோபர்-பிப்ரவரி"],
  hi: ["मार्च-जून", "जुलाई-सितंबर", "अक्टूबर-फरवरी"],
};

const pace = {
  en: ["slow and scenic", "balanced and family-friendly", "photo-focused and relaxed"],
  ta: ["மெதுவான மற்றும் காட்சியழகான", "குடும்பத்திற்கு சமநிலை உடைய", "புகைப்படத்திற்கு ஏற்ற அமைதியான"],
  hi: ["धीमा और दर्शनीय", "परिवार के लिए संतुलित", "फोटो-केंद्रित और आरामदायक"],
};

function pick(list, seed) {
  return list[Math.abs(seed) % list.length];
}

function hash(text) {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) | 0;
  return h;
}

function firstTag(tags, locale, fallback) {
  const t = tags?.[locale]?.[0];
  return typeof t === "string" && t.trim() ? t.trim() : fallback;
}

function ensureBase(body, fallback) {
  if (Array.isArray(body) && body.length >= 3) return body.slice(0, 3);
  return [fallback, fallback, fallback];
}

function detailedEn(row, seed) {
  const title = row.title?.en || "Kodaikanal travel guide";
  const tag = firstTag(row.tags, "en", "Travel");
  const v1 = pick(pace.en, seed + 1);
  const s1 = pick(seasons.en, seed + 2);
  const s2 = pick(seasons.en, seed + 3);
  return [
    `${title}: plan your day in two loops (morning and evening) and keep midday for food and rest. This ${v1} style helps you enjoy more places without fatigue.`,
    `${title}: if your trip is in ${s1}, start viewpoints early before traffic builds; if in ${s2}, keep backup indoor stops because hill weather can shift fast.`,
    `${title}: for transport, one full-day cab is usually better than many short rides. It gives flexibility when mist, crowds, or road blocks affect timing.`,
    `${title}: budget smartly under stay, travel, food, and entry fees. For ${tag.toLowerCase()} travelers, keeping a 10-15% flexible amount makes the trip stress-free.`,
    `${title}: food planning matters. Choose simple hot meals before long drives, carry water, and keep tea/coffee breaks between two sightseeing points.`,
    `${title}: family comfort checklist - layered clothing, good walking shoes, power bank, offline map, and cash for small local shops.`,
    `${title}: to make this route premium, pre-book timing slots and use private transfers so your experience feels complete, calm, and high quality.`,
  ];
}

function detailedTa(row, seed) {
  const title = row.title?.ta || "கொடைக்கானல் பயண வழிகாட்டி";
  const tag = firstTag(row.tags, "ta", "பயணம்");
  const v1 = pick(pace.ta, seed + 1);
  const s1 = pick(seasons.ta, seed + 2);
  const s2 = pick(seasons.ta, seed + 3);
  return [
    `${title}: நாளை காலை மற்றும் மாலை இரண்டு சுற்றாகப் பிரித்து, மதியத்தை ஓய்வுக்கு விடுங்கள். இந்த ${v1} திட்டம் சோர்வை குறைத்து அனுபவத்தை உயர்த்தும்.`,
    `${title}: ${s1} காலத்தில் பயணம் என்றால் பார்வை இடங்களை சீக்கிரம் தொடங்குங்கள்; ${s2} காலத்தில் வானிலை மாறுபாட்டுக்கு மாற்று திட்டம் வைத்திருங்கள்.`,
    `${title}: உள்ளூர் போக்குவரத்துக்கு முழு நாள் ஒரே காப் வைத்துக் கொள்வது பல சிறிய புக்கிங்க்களை விட நல்லது. பனி அல்லது கூட்டம் வந்தால் திட்டம் உடனே மாற்றலாம்.`,
    `${title}: பட்ஜெட்டை தங்கும் இடம், போக்குவரத்து, உணவு, நுழைவு கட்டணம் என்று பிரியுங்கள். ${tag} வகை பயணத்திற்கு 10-15% கூடுதல் தொகை வைத்தால் சிரமம் குறையும்.`,
    `${title}: உணவு திட்டம் முக்கியம். நீளமான பயணத்திற்கு முன் சூடான மற்றும் எளிய உணவை தேர்வு செய்யுங்கள்; தண்ணீர் மற்றும் சிறிய இடைவேளை அவசியம்.`,
    `${title}: குடும்ப பயண சரிபார்ப்பு - அடுக்கு உடை, நல்ல காலணி, பவர் பாங்க், ஆஃப்லைன் மேப், சிறிய கடைகளுக்கு பணம்.`,
    `${title}: பிரீமியம் அனுபவம் வேண்டுமெனில் முன்பதிவு நேரம் மற்றும் தனியார் டிரான்ஸ்பரை சேர்த்து பயணத்தை அமைதியாக முடிக்கலாம்.`,
  ];
}

function detailedHi(row, seed) {
  const title = row.title?.hi || "कोडाइकनाल यात्रा गाइड";
  const tag = firstTag(row.tags, "hi", "यात्रा");
  const v1 = pick(pace.hi, seed + 1);
  const s1 = pick(seasons.hi, seed + 2);
  const s2 = pick(seasons.hi, seed + 3);
  return [
    `${title}: दिन को सुबह और शाम के दो हिस्सों में रखें, और दोपहर आराम के लिए छोड़ें. यह ${v1} तरीका थकान कम करता है और अनुभव बेहतर बनाता है.`,
    `${title}: अगर यात्रा ${s1} में है तो व्यूपॉइंट जल्दी शुरू करें; अगर ${s2} में है तो मौसम बदलाव के लिए बैकअप प्लान रखें.`,
    `${title}: लोकल ट्रैवल के लिए पूरे दिन की एक कैब, कई छोटी बुकिंग से बेहतर रहती है. धुंध या भीड़ होने पर समय तुरंत बदला जा सकता है.`,
    `${title}: बजट को होटल, ट्रांसपोर्ट, खाना और टिकट में बांटें. ${tag} प्रकार की यात्रा में 10-15% अतिरिक्त राशि रखने से यात्रा आसान रहती है.`,
    `${title}: खाने की योजना जरूरी है. लंबी ड्राइव से पहले हल्का गर्म खाना लें, पानी रखें, और बीच में छोटे ब्रेक जोड़ें.`,
    `${title}: परिवार चेकलिस्ट - लेयर्ड कपड़े, अच्छी शूज, पावर बैंक, ऑफलाइन मैप, और छोटे दुकानदारों के लिए कैश.`,
    `${title}: प्रीमियम अनुभव के लिए पहले से टाइम स्लॉट और प्राइवेट ट्रांसफर रखें, ताकि यात्रा शांत और पूरी महसूस हो.`,
  ];
}

for (const row of rows) {
  const seed = hash(row.slug || row.id || "");
  row.body = row.body || {};
  row.body.en = [...ensureBase(row.body.en, "Kodaikanal is best explored at a calm pace."), ...detailedEn(row, seed)];
  row.body.ta = [...ensureBase(row.body.ta, "கொடைக்கானலை மெதுவாக அனுபவிப்பது சிறந்தது."), ...detailedTa(row, seed)];
  row.body.hi = [...ensureBase(row.body.hi, "कोडाइकनाल को आराम से घूमना सबसे अच्छा है."), ...detailedHi(row, seed)];
}

if (db.rows) db.rows = rows;
writeFileSync(blogsPath, `${JSON.stringify(db, null, 2)}\n`, "utf8");
console.log(`Refined uniqueness for ${rows.length} blogs.`);
