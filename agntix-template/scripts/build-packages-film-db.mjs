import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
mkdirSync(join(root, "content/db"), { recursive: true });

const L = (en, ta, hi) => ({ en, ta, hi });
const LL = (en, ta, hi) => ({ en, ta, hi });

const packages = {
  table: "packages",
  version: 1,
  rows: [
    {
      id: "kodai-escape",
      nights: 2,
      days: 3,
      priceFrom: 12999,
      currency: "INR",
      rating: 4.8,
      reviewCount: 126,
      category: "escape",
      featured: true,
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
      highlights: LL(
        ["Lakeside welcome & private transfer", "Coaker’s Walk sunrise", "Boutique hill stay"],
        ["ஏரி வரவேற்பு & தனியார் பயணம்", "கோக்கர்ஸ் வாக் சூரிய உதயம்", "நேர்த்தியான மலை தங்கல்"],
        ["झील किनारे स्वागत और प्राइवेट ट्रांसफर", "कोकर्स वॉक सूर्योदय", "बoutique पहाड़ी ठहराव"],
      ),
      title: L("Kodai Escape", "கொடை எஸ்கேப்", "कोडई एस्केप"),
      blurb: L(
        "A refined 3-day reset among mist, pine, and still lake light.",
        "மூடுபனி, பைன் மற்றும் ஏரி ஒளியில் 3 நாள் அமைதியான பயணம்.",
        "कोहरे, चीड़ और झील की रोशनी में 3 दिन का शांत विश्राम।",
      ),
      body: L(
        "Ideal for a weekend break. Private transfers, a carefully chosen stay, and unhurried lake-and-walk experiences without crowded itineraries.",
        "வார இறுதி ஓய்வுக்கு ஏற்றது. தனியார் பயணம், தேர்ந்தெடுக்கப்பட்ட தங்குமிடம், நெரிசலற்ற அனுபவங்கள்.",
        "वीकेंड ब्रेक के लिए आदर्श। निजी ट्रांसफर, चुनिंदा ठहराव और बिना भीड़ के अनुभव।",
      ),
    },
    {
      id: "kodai-family",
      nights: 3,
      days: 4,
      priceFrom: 18999,
      currency: "INR",
      rating: 4.7,
      reviewCount: 98,
      category: "family",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
      highlights: LL(
        ["Family-friendly lodge", "Bryant Park & lake boating", "Flexible pacing for children"],
        ["குடும்பத்திற்கு ஏற்ற தங்கல்", "பிரையண்ட் பார்க் & ஏரி படகு", "குழந்தைகளுக்கேற்ற நெகிழ்வு"],
        ["परिवार-अनुकूल लॉज", "ब्रायंट पार्क और झील बोटिंग", "बच्चों के लिए लचीली गति"],
      ),
      title: L("Kodai Family", "கொடை குடும்பம்", "कोडई फैमिली"),
      blurb: L(
        "Comfort-first pacing for families who want nature without stress.",
        "மன அழுத்தமில்லாமல் இயற்கையை அனுபவிக்க விரும்பும் குடும்பங்களுக்கு.",
        "परिवारों के लिए आरामदायक गति के साथ प्रकृति का अनुभव।",
      ),
      body: L(
        "Family rooms, soft start mornings, park and lake time, and a host who adjusts the day around children and elders.",
        "குடும்ப அறைகள், மென்மையான காலைகள், பூங்கா மற்றும் ஏரி நேரம்.",
        "पारिवारिक कमरे, आरामदायक सुबहें, पार्क और झील का समय।",
      ),
    },
    {
      id: "kodai-honeymoon",
      nights: 3,
      days: 4,
      priceFrom: 24999,
      currency: "INR",
      rating: 4.9,
      reviewCount: 84,
      category: "honeymoon",
      featured: true,
      image:
        "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93bd?auto=format&fit=crop&w=1600&q=80",
      highlights: LL(
        ["Private stay with valley light", "Couples’ dinner arrangement", "Unhurried viewpoint evenings"],
        ["பள்ளத்தாக்கு ஒளியுடன் தனியார் தங்கல்", "ஜோடிகளுக்கான இரவு உணவு", "அவசரமற்ற காட்சி மாலைகள்"],
        ["घाटी रोशनी वाला निजी ठहराव", "कपल डिनर व्यवस्था", "बिना जल्दबाज़ी व्यूपॉइंट शामें"],
      ),
      title: L("Kodai Honeymoon", "கொடை தேனிலவு", "कोडई हनीमून"),
      blurb: L(
        "Private evenings, valley views, and space to celebrate slowly.",
        "தனியார் மாலைகள், பள்ளத்தாக்கு காட்சிகள், மெதுவாக கொண்டாடும் இடம்.",
        "निजी शामें, घाटी नज़ारे और धीरे मनाने की जगह।",
      ),
      body: L(
        "Designed for couples: premium stay, private dining, and scenic moments curated for romance rather than rush.",
        "ஜோடிகளுக்காக: பிரீமியம் தங்குமிடம், தனியார் உணவு, காதல் தருணங்கள்.",
        "जोड़े के लिए: प्रीमियम ठहराव, निजी डिनर और रोमांटिक पल।",
      ),
    },
    {
      id: "kodai-luxury",
      nights: 4,
      days: 5,
      priceFrom: 42999,
      currency: "INR",
      rating: 5.0,
      reviewCount: 61,
      category: "luxury",
      featured: true,
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
      highlights: LL(
        ["Premium lodge / villa stay", "Private vehicle throughout", "Concierge-style hosting"],
        ["பிரீமியம் தங்கல் / வில்லா", "முழு பயணத்திற்கும் தனியார் வாகனம்", "கான்சியர்ஜ் பாணி வழிகாட்டல்"],
        ["प्रीमियम लॉज / विला", "पूरी यात्रा निजी वाहन", "कॉन्सीयज-स्टाइल होस्टिंग"],
      ),
      title: L("Kodai Luxury", "கொடை லக்ஸரி", "कोडई लक्ज़री"),
      blurb: L(
        "Concierge-level care with premium lodging and private transport.",
        "பிரீமியம் தங்குமிடம் மற்றும் தனியார் வாகனத்துடன் உயர் தர பராமரிப்பு.",
        "प्रीमियम ठहराव और निजी वाहन के साथ उच्च देखभाल।",
      ),
      body: L(
        "Our signature luxury collection — private vehicle, refined stays, and a host who arranges dining and experiences to your preference.",
        "எங்கள் சிறப்பு லக்ஸரி தொகுப்பு — தனியார் வாகனம், நேர்த்தியான தங்குமிடம்.",
        "हमारा सिग्नेचर लक्ज़री संग्रह — निजी वाहन और परिष्कृत ठहराव।",
      ),
    },
    {
      id: "kodai-adventure",
      nights: 3,
      days: 4,
      priceFrom: 21999,
      currency: "INR",
      rating: 4.6,
      reviewCount: 73,
      category: "adventure",
      image:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1600&q=80",
      highlights: LL(
        ["Pillar Rocks & Dolphin’s Nose", "Guided pine forest trek", "Viewpoint circuit"],
        ["பில்லர் ராக்ஸ் & டால்பின் நோஸ்", "வழிகாட்டல் பைன் காடு ட்ரெக்", "காட்சி இட சுற்று"],
        ["पिलर रॉक्स और डॉल्फिन नोज़", "गाइडेड पाइन फ़ॉरेस्ट ट्रेक", "व्यूपॉइंट सर्किट"],
      ),
      title: L("Kodai Adventure", "கொடை அட்வென்ச்சர்", "कोडई एडवेंचर"),
      blurb: L(
        "Trails, viewpoints, and highland energy with guided confidence.",
        "பாதைகள், காட்சிகள் மற்றும் வழிகாட்டலுடன் மலை சாகசம்.",
        "ट्रेल, व्यूपॉइंट और गाइडेड पहाड़ी रोमांच।",
      ),
      body: L(
        "For travellers who want more outdoors: guided walks, iconic viewpoints, and active days balanced with good rest.",
        "வெளிப்புற அனுபவம் விரும்புவோருக்கு: வழிகாட்டல் நடைகள், காட்சி இடங்கள்.",
        "आउटडोर प्रेमियों के लिए: गाइडेड वॉक और प्रसिद्ध व्यूपॉइंट।",
      ),
    },
    {
      id: "kodai-complete",
      nights: 5,
      days: 6,
      priceFrom: 38999,
      currency: "INR",
      rating: 5.0,
      reviewCount: 47,
      category: "complete",
      featured: true,
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
      highlights: LL(
        ["Full Kodaikanal circuit", "Dedicated travel host", "Luxury stay + flexible itinerary"],
        ["முழு கொடைக்கானல் சுற்று", "தனிப்பட்ட பயண வழிகாட்டி", "லக்ஸரி தங்கல் + நெகிழ்வு திட்டம்"],
        ["पूरा कोडाइकनाल सर्किट", "समर्पित ट्रैवल होस्ट", "लक्ज़री ठहराव + लचीला itinerary"],
      ),
      title: L("Kodai Complete", "கொடை கம்ப்ளீட்", "कोडई कम्प्लीट"),
      blurb: L(
        "Our fullest Kodaikanal chapter — the flagship package.",
        "எங்கள் முழுமையான கொடைக்கானல் அத்தியாயம் — முதன்மை பேக்கேஜ்.",
        "हमारा सबसे पूरा कोडाइकनाल अध्याय — फ्लैगशिप पैकेज।",
      ),
      body: L(
        "Five nights covering the best of Kodaikanal with dedicated hosting, luxury stay options, and a flexible day-by-day plan built around you.",
        "ஐந்து இரவுகள் — சிறந்த கொடை அனுபவங்கள், தனிப்பட்ட வழிகாட்டல்.",
        "पाँच रातें — कोडाइकनाल का सर्वश्रेष्ठ, समर्पित होस्टिंग।",
      ),
    },
  ],
};

const film = {
  table: "film",
  version: 1,
  scenes: [
    {
      id: "dolphins-nose",
      tone: "gold",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80",
      place: L("Dolphin’s Nose", "டால்பின் நோஸ்", "डॉल्फिन नोज़"),
      quote: L(
        "The mountains wake before you do.",
        "நீங்கள் எழுவதற்கு முன் மலைகள் எழுகின்றன.",
        "आपके उठने से पहले पहाड़ जाग जाते हैं।",
      ),
      note: L(
        "Sunrise above the ridge",
        "முகட்டின் மேல் சூரிய உதயம்",
        "पहाड़ी पर सूर्योदय",
      ),
    },
    {
      id: "coakers-walk",
      tone: "mist",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=80",
      place: L("Coaker’s Walk", "கோக்கர்ஸ் வாக்", "कोकर्स वॉक"),
      quote: L(
        "Fog holds the path until you are ready.",
        "நீங்கள் தயாராகும் வரை மூடுபனி பாதையைப் பிடிக்கும்.",
        "जब तक आप तैयार न हों, कोहरा रास्ता थामे रहता है।",
      ),
      note: L(
        "Morning steps through mist",
        "மூடுபனி வழியாக காலை அடிகள்",
        "कोहरे में सुबह के कदम",
      ),
    },
    {
      id: "kodai-lake",
      tone: "lake",
      image:
        "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=2400&q=80",
      place: L("Kodai Lake", "கொடை ஏரி", "कोडई झील"),
      quote: L(
        "Water keeps every quiet secret.",
        "நீர் ஒவ்வொரு அமைதியான ரகசியத்தையும் காக்கும்.",
        "पानी हर शांत राज़ संजोए रखता है।",
      ),
      note: L(
        "Walk beside the light",
        "ஒளியருகில் நடையுங்கள்",
        "रोशनी के साथ सैर",
      ),
    },
    {
      id: "pine-forest",
      tone: "forest",
      image:
        "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=80",
      place: L("Pine Forest", "பைன் காடு", "पाइन जंगल"),
      quote: L(
        "Breath turns colder. Thoughts turn softer.",
        "மூச்சு குளிர்கிறது. எண்ணங்கள் மென்மையாகிறது.",
        "साँस ठंडी होती है। विचार नरम हो जाते हैं।",
      ),
      note: L(
        "Light through tall silence",
        "உயர் அமைதி வழியாக ஒளி",
        "ऊँची खामोशी से होती रोशनी",
      ),
    },
    {
      id: "poombarai",
      tone: "mist",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80",
      place: L("Poombarai Village", "பூம்பராய் கிராமம்", "पूमबराई गाँव"),
      quote: L(
        "Clouds pass through homes like visiting kin.",
        "மேகங்கள் உறவினரைப் போல வீடுகள் வழியாகச் செல்கின்றன.",
        "बादल रिश्तेदारों की तरह घरों से होकर गुज़रते हैं।",
      ),
      note: L(
        "Village in the folds",
        "மலை மடிப்புகளில் கிராமம்",
        "पहाड़ की सिलवटों में गाँव",
      ),
    },
    {
      id: "mannavanur",
      tone: "forest",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=80",
      place: L("Mannavanur", "மன்னவனூர்", "मन्नवनूर"),
      quote: L(
        "Meadows run until the sky begins.",
        "புல்வெளிகள் வானம் தொடங்கும் வரை ஓடும்.",
        "मैदान आसमान शुरू होने तक फैले हैं।",
      ),
      note: L("Green open air", "பசுமை திறந்த காற்று", "हरी खुली हवा"),
    },
    {
      id: "berijam",
      tone: "lake",
      image:
        "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93bd?auto=format&fit=crop&w=2400&q=80",
      place: L("Berijam Lake", "பெரியம் ஏரி", "बेरिजाम झील"),
      quote: L("", "", ""),
      note: L(
        "Almost no words. Only atmosphere.",
        "சொற்கள் இல்லை. சூழல் மட்டும்.",
        "शब्द लगभग नहीं। सिर्फ़ माहौल।",
      ),
    },
    {
      id: "silver-cascade",
      tone: "falls",
      image:
        "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=2400&q=80",
      place: L("Silver Cascade Falls", "சில்வர் கேஸ்கேட் அருவி", "सिल्वर कैस्केड जलप्रपात"),
      quote: L(
        "The mountain speaks in water.",
        "மலை நீரில் பேசுகிறது.",
        "पहाड़ पानी की भाषा में बोलता है।",
      ),
      note: L(
        "Mist rising from the fall",
        "அருவியிலிருந்து எழும் மூடுபனி",
        "जलप्रपात से उठता कोहरा",
      ),
    },
    {
      id: "camping",
      tone: "night",
      image:
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=2400&q=80",
      place: L("Night Camping", "இரவு முகாம்", "नाइट कैंपिंग"),
      quote: L(
        "Stars arrive when the wind rests.",
        "காற்று ஓய்ந்தால் நட்சத்திரங்கள் வரும்.",
        "हवा थमते ही सितारे आ जाते हैं।",
      ),
      note: L(
        "Warm fire. Dark luxury.",
        "சூடான நெருப்பு. இருண்ட ஆடம்பரம்.",
        "गर्म अलाव। अँधेरी विलासिता।",
      ),
    },
  ],
  placeRibbon: {
    en: [
      "Kodai Lake",
      "Coaker’s Walk",
      "Pillar Rocks",
      "Dolphin’s Nose",
      "Pine Forest",
      "Guna Caves",
      "Mannavanur",
      "Poombarai",
      "Berijam Lake",
      "Bryant Park",
      "Silver Cascade",
      "Moir Point",
      "Kurinji Andavar",
      "Vattakanal",
      "Upper Lake View",
      "Silent Valley View",
      "Green Valley View",
      "Fairy Falls",
      "Pambar Falls",
    ],
    ta: [
      "கொடை ஏரி",
      "கோக்கர்ஸ் வாக்",
      "பில்லர் ராக்ஸ்",
      "டால்பின் நோஸ்",
      "பைன் காடு",
      "குணா குகைகள்",
      "மன்னவனூர்",
      "பூம்பராய்",
      "பெரியம் ஏரி",
      "பிரையண்ட் பார்க்",
      "சில்வர் கேஸ்கேட்",
      "மொயர் பாயிண்ட்",
      "குறிஞ்சி ஆண்டவர்",
      "வட்டக்கனல்",
      "அப்பர் லேக் வியூ",
      "சைலண்ட் வேலி வியூ",
      "கிரீன் வேலி வியூ",
      "ஃபேரி ஃபால்ஸ்",
      "பாம்பர் ஃபால்ஸ்",
    ],
    hi: [
      "कोडई झील",
      "कोकर्स वॉक",
      "पिलर रॉक्स",
      "डॉल्फिन नोज़",
      "पाइन जंगल",
      "गुना केव्स",
      "मन्नवनूर",
      "पूमबराई",
      "बेरिजाम झील",
      "ब्रायंट पार्क",
      "सिल्वर कैस्केड",
      "मॉयर पॉइंट",
      "कुरिंजी अंडावर",
      "वट्टकनाल",
      "अपर लेक व्यू",
      "साइलेंट वैली व्यू",
      "ग्रीन वैली व्यू",
      "फेयरी फॉल्स",
      "पांबर फॉल्स",
    ],
  },
};

writeFileSync(join(root, "content/db/packages.json"), JSON.stringify(packages, null, 2));
writeFileSync(join(root, "content/db/film.json"), JSON.stringify(film, null, 2));
console.log("wrote packages", packages.rows.length, "film scenes", film.scenes.length);
