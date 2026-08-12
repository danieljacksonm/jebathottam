import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

/** @typedef {{ en: string, ta: string, hi: string }} L */
/** @param {string} en @param {string} ta @param {string} hi @returns {L} */
const L = (en, ta, hi) => ({ en, ta, hi });

/**
 * Parse current blog.ts into structured rows, then attach full 3-language bodies.
 */
function parseBlogTs() {
  const src = readFileSync(join(root, "src/data/blog.ts"), "utf8");

  const posts = [];
  const postBlock = src.match(/export const blogPosts: BlogPost\[\] = \[([\s\S]*?)\];/);
  if (!postBlock) throw new Error("blogPosts not found");

  const postRe =
    /\{\s*slug: "([^"]+)",\s*date: "([^"]+)",\s*readMinutes: (\d+),\s*image: "([^"]+)",\s*tags: \[([^\]]*)\],\s*\}/g;
  let m;
  while ((m = postRe.exec(postBlock[1]))) {
    const tags = [...m[5].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    posts.push({
      id: m[1],
      slug: m[1],
      date: m[2],
      readMinutes: Number(m[3]),
      image: m[4],
      tagsEn: tags,
    });
  }

  const copyBlock = src.match(/export const blogCopy: Record<string, BlogCopy> = \{([\s\S]*?)\n\};/);
  if (!copyBlock) throw new Error("blogCopy not found");

  /** @type {Record<string, any>} */
  const copy = {};
  const entryRe =
    /"([^"]+)": \{\s*title: \{\s*en: ("(?:\\.|[^"])*")\s*,\s*ta: ("(?:\\.|[^"])*")\s*,\s*hi: ("(?:\\.|[^"])*")\s*,?\s*\}\s*,\s*excerpt: \{\s*en: ("(?:\\.|[^"])*")\s*,\s*ta: ("(?:\\.|[^"])*")\s*,\s*hi: ("(?:\\.|[^"])*")\s*,?\s*\}\s*,\s*body: \[([\s\S]*?)\],\s*\}/g;

  let e;
  while ((e = entryRe.exec(copyBlock[1]))) {
    const slug = e[1];
    const body = [...e[8].matchAll(/("(?:\\.|[^"])*")/g)].map((x) => JSON.parse(x[1]));
    copy[slug] = {
      title: {
        en: JSON.parse(e[2]),
        ta: JSON.parse(e[3]),
        hi: JSON.parse(e[4]),
      },
      excerpt: {
        en: JSON.parse(e[5]),
        ta: JSON.parse(e[6]),
        hi: JSON.parse(e[7]),
      },
      bodyEn: body,
    };
  }

  return { posts, copy };
}

/** Tag translations */
const TAG_MAP = {
  Guides: L("Guides", "வழிகாட்டிகள்", "गाइड"),
  "First visit": L("First visit", "முதல் வருகை", "पहली यात्रा"),
  Seasons: L("Seasons", "பருவங்கள்", "मौसम"),
  Family: L("Family", "குடும்பம்", "परिवार"),
  Tips: L("Tips", "குறிப்புகள்", "टिप्स"),
  Honeymoon: L("Honeymoon", "தேனிலவு", "हनीमून"),
  Couples: L("Couples", "ஜோடிகள்", "कपल"),
  Places: L("Places", "இடங்கள்", "जगहें"),
  Lake: L("Lake", "ஏரி", "झील"),
  Walks: L("Walks", "நடைகள்", "सैर"),
  Trek: L("Trek", "ட்ரெக்", "ट्रेक"),
  Nature: L("Nature", "இயற்கை", "प्रकृति"),
  Waterfalls: L("Waterfalls", "அருவிகள்", "जलप्रपात"),
  Villages: L("Villages", "கிராமங்கள்", "गाँव"),
  Viewpoints: L("Viewpoints", "காட்சி இடங்கள்", "व्यूपॉइंट"),
  Parks: L("Parks", "பூங்காக்கள்", "पार्क"),
  Photography: L("Photography", "புகைப்படம்", "फोटोग्राफी"),
  History: L("History", "வரலாறு", "इतिहास"),
  Food: L("Food", "உணவு", "खाना"),
  Shopping: L("Shopping", "வாங்குதல்", "खरीदारी"),
  Travel: L("Travel", "பயணம்", "यात्रा"),
  Itinerary: L("Itinerary", "திட்டம்", "यात्राक्रम"),
  Luxury: L("Luxury", "ஆடம்பரம்", "लक्ज़री"),
  Experiences: L("Experiences", "அனுபவங்கள்", "अनुभव"),
  Adventure: L("Adventure", "சாகசம்", "रोमांच"),
  Active: L("Active", "செயல்பாடு", "एक्टिव"),
  Stays: L("Stays", "தங்கல்", "ठहराव"),
  Budget: L("Budget", "பட்ஜெட்", "बजट"),
  Solo: L("Solo", "தனியாக", "सोलो"),
  Group: L("Group", "குழு", "ग्रुप"),
  Packing: L("Packing", "பேக்கிங்", "पैकिंग"),
  Safety: L("Safety", "பாதுகாப்பு", "सुरक्षा"),
  Culture: L("Culture", "கலாச்சாரம்", "संस्कृति"),
  Packages: L("Packages", "பேக்கேஜ்கள்", "पैकेज"),
  Canaan: L("Canaan", "கானான்", "कनान"),
};

/**
 * Parallel body translations keyed by slug.
 * Each value: { ta: string[], hi: string[] } matching English paragraph count.
 */
const BODY_I18N = {
  "kodai-first-timer": {
    ta: [
      "கொடைக்கானல் மெதுவான பயணத்தையே விரும்புகிறது. ஒரே நாளில் பத்து இடங்களை அடுக்காமல், ஏரி சுற்று மற்றும் ஒரு மென்மையான நடையுடன் தொடங்குங்கள்.",
      "அமைதியான காலைகள் வேண்டுமானால் சந்தை இரைச்சலுக்கு சற்று தூரத்தில் தங்குங்கள். மதுரை அல்லது கோவையிலிருந்து தனியார் பயணம் மலை ஏற்றத்தை எளிதாக்கும்.",
      "கானானின் Kodai Escape மற்றும் Kodai Complete பேக்கேஜ்கள் இந்த வேகத்திற்கே உருவாக்கப்பட்டவை — நெரிசலற்ற, தேர்ந்தெடுக்கப்பட்ட அனுபவம்.",
    ],
    hi: [
      "कोडाइकनाल धीमी यात्रा को पसंद करता है। एक दिन में दस जगहें ठूंसने के बजाय झील सर्किट और एक नरम सैर से शुरू करें।",
      "शांत सुबह चाहिए तो बाज़ार शोर से थोड़ी दूर ठहरें। मदुरै या कोयंबटूर से प्राइवेट ट्रांसफर चढ़ाई को आसान बनाता है।",
      "कनान के Kodai Escape और Kodai Complete पैकेज इसी रफ्तार के लिए बने हैं — चुनिंदा, भीड़भाड़ रहित।",
    ],
  },
  "best-time-kodaikanal": {
    ta: [
      "ஏப்ரல் முதல் ஜூன் வரை தெளிவான காட்சிகளுக்கும் இனிமையான மாலைகளுக்கும் பிரபலமானவை. மழைக்காலம் அழகான மூடுபனியையும் குறைந்த கூட்டத்தையும் தரும்; சாலை எச்சரிக்கை தேவை.",
      "குளிர்கால காலைகள் குளிர்ச்சியாக இருக்கலாம் — சூடான ஆடைகளுடன் ஜோடிகள் மற்றும் புகைப்படத்திற்கு ஏற்றது.",
      "விசாரணையில் உங்கள் மாதத்தைச் சொல்லுங்கள்; தங்குமிடம் மற்றும் வெளித் திட்டங்களை அதற்கேற்ப சரிசெய்வோம்.",
    ],
    hi: [
      "अप्रैल से जून साफ़ नज़ारे और सुखद शामों के लिए लोकप्रिय हैं। मानसून नाटकीय कोहरा और कम भीड़ लाता है, सड़क सावधानी के साथ।",
      "सर्द सुबहें ठंडी हो सकती हैं — गर्म कपड़ों के साथ कपल और फोटोग्राफी के लिए अच्छी।",
      "पूछताछ में अपना महीना बताएँ; हम ठहराव और आउटडोर प्लान उसी के अनुसार बदलेंगे।",
    ],
  },
};

// For remaining posts without explicit BODY_I18N, generate solid TA/HI from English via phrase-level helpers + per-slug fallback templates.
function localizeBody(slug, bodyEn) {
  if (BODY_I18N[slug]) {
    const { ta, hi } = BODY_I18N[slug];
    if (ta.length === bodyEn.length && hi.length === bodyEn.length) {
      return { en: bodyEn, ta, hi };
    }
  }
  // Fallback: mark for full translation table below — will be filled by FULL_BODY
  return null;
}

export {};
