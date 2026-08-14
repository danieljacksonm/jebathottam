import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const blogsPath = join(root, "content/db/blogs.json");
const db = JSON.parse(readFileSync(blogsPath, "utf8"));
const rows = db.rows || db;

function safeText(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function firstTag(tags, key, fallback) {
  return safeText(tags?.[key]?.[0], fallback);
}

function buildEnglishParagraphs(row) {
  const title = safeText(row?.title?.en, "This Kodaikanal guide");
  const tag = firstTag(row?.tags, "en", "Travel");
  return [
    `${title} works best when you split your day into a morning nature block, a relaxed lunch break, and one sunset point. This keeps the trip enjoyable without rushing from one stop to another.`,
    `Best season planning: March to June is pleasant for families, July to September is misty and green, and October to February is cool and romantic. Pack one light rain layer in every season because weather shifts quickly in the hills.`,
    `For local movement, keep one trusted cab for full-day sightseeing instead of booking point-to-point rides every hour. It saves waiting time and gives flexibility when a place is crowded or foggy.`,
    `Budget clarity helps: split spending into stay, transport, food, and entry tickets. For ${tag.toLowerCase()} focused travel, reserve 10-15% buffer for unplanned tea stops, local snacks, and short add-on experiences.`,
    `Food and comfort tip: start early, keep warm water, and choose simple meals before long drives. Travelers with kids or elders should prefer shorter loops with rest breaks every 90 minutes.`,
    `Practical checklist before you leave the hotel: rain layer, walking shoes, offline map, power bank, and cash for small vendors. These basics remove most on-trip stress and make sightseeing smoother.`,
    `If you want a premium version of this route, combine scenic spots with private transfers and pre-booked timings. That way you see Kodaikanal in depth, not just as a fast photo tour.`,
  ];
}

function buildTamilParagraphs(row) {
  const title = safeText(row?.title?.ta, "இந்த கொடைக்கானல் வழிகாட்டி");
  const tag = firstTag(row?.tags, "ta", "பயணம்");
  return [
    `${title} நல்ல அனுபவமாக இருக்க, நாளை மூன்று பகுதியாக திட்டமிடுங்கள்: காலை இயற்கை இடங்கள், மதியம் ஓய்வு, மாலை ஒரு சூரிய அஸ்தமனப் புள்ளி. அவசரம் இல்லாமல் சென்றால் தான் பயணம் சுகமாக இருக்கும்.`,
    `சீசன் திட்டம் முக்கியம்: மார்ச்-ஜூன் குடும்பங்களுக்கு இனிமையான காலநிலை, ஜூலை-செப்டம்பர் பசுமை மற்றும் பனி, அக்டோபர்-பிப்ரவரி குளிர்ந்த மற்றும் ரொமான்டிக் சூழல். மலை வானிலை வேகமாக மாறும்; லேசான மழைக்கோட்டை எப்போதும் எடுத்துச் செல்லுங்கள்.`,
    `உள்ளூர் சுற்றுலாவுக்கு ஒவ்வொரு இடத்திற்கும் தனி கார் எடுப்பதற்குப் பதில் முழு நாள் நம்பகமான காப் வைத்துக் கொள்ளுங்கள். கூட்டம் அல்லது பனிமூட்டம் இருந்தால் திட்டத்தை உடனே மாற்ற இது உதவும்.`,
    `செலவு தெளிவாக வைத்துக் கொள்ளுங்கள்: தங்கும் இடம், போக்குவரத்து, உணவு, நுழைவு கட்டணம் என்று பிரித்து திட்டமிடுங்கள். ${tag} மையமாக இருக்கும் பயணத்துக்கு கூடுதலாக 10-15% பாதுகாப்பு பட்ஜெட் வைத்தால் சிறிய அனுபவங்களையும் சுலபமாக சேர்க்கலாம்.`,
    `உணவு மற்றும் உடல் நல ஆலோசனை: நீளமான பயணத்திற்கு முன் லேசான உணவு சாப்பிடுங்கள், வெந்நீர் வைத்துக் கொள்ளுங்கள், காலை சீக்கிரம் தொடங்குங்கள். குழந்தைகள் அல்லது மூத்தவர்கள் இருந்தால் 90 நிமிடத்திற்கு ஒரு ஓய்வு இடைவேளை வையுங்கள்.`,
    `ஹோட்டலில் இருந்து கிளம்புவதற்கு முன் சிறிய சரிபார்ப்பு பட்டியல்: மழைக்கோட்டை, நல்ல காலணி, ஆஃப்லைன் மேப், பவர் பாங்க், சிறிய விற்பனையாளர்களுக்கான பணம். இந்த அடிப்படை பொருட்கள் பயண அழுத்தத்தை குறைக்கும்.`,
    `இதை மேலும் தரமான அனுபவமாக்க, முன்பதிவு செய்யப்பட்ட நேரங்கள் மற்றும் தனியார் போக்குவரத்துடன் பாதையை அமைத்துக்கொள்ளுங்கள். அப்போது கொடைக்கானலை ஆழமாக அனுபவிக்க முடியும்.`,
  ];
}

function buildHindiParagraphs(row) {
  const title = safeText(row?.title?.hi, "यह कोडाइकनाल गाइड");
  const tag = firstTag(row?.tags, "hi", "यात्रा");
  return [
    `${title} का सबसे अच्छा तरीका है दिन को तीन हिस्सों में बांटना: सुबह प्राकृतिक जगहें, दोपहर में आराम, और शाम को एक सनसेट पॉइंट. बिना भागदौड़ के ट्रिप ज्यादा यादगार बनती है.`,
    `सीजन प्लान करें: मार्च से जून परिवारों के लिए अच्छा रहता है, जुलाई से सितंबर हरियाली और धुंध देता है, और अक्टूबर से फरवरी ठंडा व रोमांटिक माहौल देता है. पहाड़ी मौसम जल्दी बदलता है, इसलिए हल्का रेन-जैकेट साथ रखें.`,
    `लोकल घूमने के लिए हर घंटे अलग बुकिंग करने से बेहतर है कि एक भरोसेमंद कैब पूरे दिन के लिए रखें. इससे भीड़ या फॉग होने पर आप योजना तुरंत बदल सकते हैं.`,
    `बजट को चार भागों में रखें: होटल, ट्रांसपोर्ट, खाना, और टिकट/एंट्री. ${tag} आधारित यात्रा में 10-15% अतिरिक्त राशि रखें ताकि छोटे अनुभव, स्नैक्स, और अचानक रुकने के खर्च आसानी से संभलें.`,
    `खाने और आराम का नियम: लंबी ड्राइव से पहले हल्का भोजन लें, गर्म पानी रखें, और दिन जल्दी शुरू करें. बच्चों या बुजुर्गों के साथ हर 90 मिनट में छोटा ब्रेक बेहतर रहता है.`,
    `होटल से निकलने से पहले चेकलिस्ट रखें: रेन लेयर, अच्छी वॉकिंग शूज, ऑफलाइन मैप, पावर बैंक, और छोटे दुकानदारों के लिए कैश. ये छोटे कदम यात्रा को बहुत आसान बनाते हैं.`,
    `अगर आप प्रीमियम अनुभव चाहते हैं, तो इसी रूट को प्राइवेट ट्रांसफर और प्री-बुक टाइमिंग के साथ चलाएं. इससे कोडाइकनाल सिर्फ फोटो-पॉइंट नहीं, एक पूरी कहानी जैसा अनुभव देगा.`,
  ];
}

let updated = 0;
for (const row of rows) {
  const en = row?.body?.en || [];
  const ta = row?.body?.ta || [];
  const hi = row?.body?.hi || [];

  if (en.length >= 8 && ta.length >= 8 && hi.length >= 8) continue;

  row.body = row.body || {};
  row.body.en = [...en, ...buildEnglishParagraphs(row)];
  row.body.ta = [...ta, ...buildTamilParagraphs(row)];
  row.body.hi = [...hi, ...buildHindiParagraphs(row)];
  updated += 1;
}

if (db.rows) {
  db.rows = rows;
}

writeFileSync(blogsPath, `${JSON.stringify(db, null, 2)}\n`, "utf8");
console.log(`Enhanced ${updated} blogs with detailed content.`);
