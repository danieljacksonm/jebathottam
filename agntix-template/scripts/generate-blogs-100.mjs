import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const blogsPath = join(root, "content/db/blogs.json");
const db = JSON.parse(readFileSync(blogsPath, "utf8"));

const TAG = {
  Guides: { en: "Guides", ta: "வழிகாட்டிகள்", hi: "गाइड" },
  Places: { en: "Places", ta: "இடங்கள்", hi: "जगहें" },
  Tips: { en: "Tips", ta: "குறிப்புகள்", hi: "टिप्स" },
  Nature: { en: "Nature", ta: "இயற்கை", hi: "प्रकृति" },
  Food: { en: "Food", ta: "உணவு", hi: "खाना" },
  Family: { en: "Family", ta: "குடும்பம்", hi: "परिवार" },
  Couples: { en: "Couples", ta: "ஜோடிகள்", hi: "कपल" },
  Seasons: { en: "Seasons", ta: "பருவங்கள்", hi: "मौसम" },
  Travel: { en: "Travel", ta: "பயணம்", hi: "यात्रा" },
  Itinerary: { en: "Itinerary", ta: "திட்டம்", hi: "यात्राक्रम" },
  Photography: { en: "Photography", ta: "புகைப்படம்", hi: "फोटोग्राफी" },
  Shopping: { en: "Shopping", ta: "வாங்குதல்", hi: "खरीदारी" },
  Stays: { en: "Stays", ta: "தங்கல்", hi: "ठहराव" },
  Experiences: { en: "Experiences", ta: "அனுபவங்கள்", hi: "अनुभव" },
  Culture: { en: "Culture", ta: "கலாச்சாரம்", hi: "संस्कृति" },
  Adventure: { en: "Adventure", ta: "சாகசம்", hi: "रोमांच" },
  Safety: { en: "Safety", ta: "பாதுகாப்பு", hi: "सुरक्षा" },
  Budget: { en: "Budget", ta: "பட்ஜெட்", hi: "बजट" },
};

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
  "1532274402911-5a369e4c4db0",
  "1465056836041-7f43ac27dcb5",
  "1506744038136-46273834b3fb",
  "1476514525535-07fb3b4ae5f1",
  "1506197603052-3cc9c3a201bd",
  "1469854523086-cc02fe5d8800",
  "1446329813274-b5a1b78c91d5",
  "1470770903676-69b98201ea1a",
  "1553284965-83fd3e82fa5a",
  "1511593358241-7eea1f3c84e5",
  "1542273917363-3b1817f69a2d",
  "1418065460487-3e41a6c84dc5",
  "1493246507139-91e8fad9978e",
  "1433086966358-548171c0a037",
];

function img(i) {
  const id = PHOTO_IDS[i % PHOTO_IDS.length];
  // unique-ish crop params so URLs differ even if photo repeats
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80&sig=${i}`;
}

function tags(...keys) {
  return {
    en: keys.map((k) => TAG[k].en),
    ta: keys.map((k) => TAG[k].ta),
    hi: keys.map((k) => TAG[k].hi),
  };
}

function dateFrom(i) {
  const start = new Date("2026-07-02");
  start.setDate(start.getDate() + i);
  return start.toISOString().slice(0, 10);
}

/** New posts: [slug, tags[], readMin, title{en,ta,hi}, excerpt{en,ta,hi}, bodyEn[], bodyTa[], bodyHi[]] */
const NEW = [
  ["vattakanal-quiet-walks", ["Places", "Nature"], 5,
    ["Vattakanal: quiet walks beyond the crowd", "வட்டக்கனல்: கூட்டத்திற்கு அப்பால் அமைதியான நடை", "वट्टकनाल: भीड़ से परे शांत सैर"],
    ["Cool paths, soft light, and a calmer Kodai pace.", "குளிர் பாதைகள், மென்மையான ஒளி, அமைதியான கொடை வேகம்.", "ठंडे रास्ते, कोमल रोशनी, शांत कोडई रफ्तार।"],
    ["Vattakanal sits a short drive from town and feels quieter than the market lanes.", "A gentle walk here suits couples and solo travellers who want air more than attractions.", "Ask Canaan to place this on a softer day in your package."],
    ["வட்டக்கனல் நகரிலிருந்து சிறிய தூரம் — சந்தை சத்தத்தை விட அமைதி அதிகம்.", "காட்சிகளை விட காற்றை விரும்பும் ஜோடிகள் மற்றும் தனி பயணிகளுக்கு ஏற்ற நடை.", "உங்கள் பேக்கேஜில் மென்மையான ஒரு நாளாக இதைச் சேர்க்க கானானிடம் கேளுங்கள்."],
    ["वट्टकनाल शहर से थोड़ी दूर है और बाज़ार की भीड़ से शांत लगता है।", "यहाँ की हल्की सैर कपल और सोलो यात्रियों के लिए अच्छी है जो जगहों से ज़्यादा हवा चाहते हैं।", "कनान से कहें कि इसे आपके पैकेज के एक नरम दिन में रखें।"]],

  ["fairy-falls-guide", ["Places", "Nature"], 4,
    ["Fairy Falls without the rush", "அவசரமின்றி ஃபேரி ஃபால்ஸ்", "बिना हड़बड़ी फेयरी फॉल्स"],
    ["How to visit gently and what to expect on the path.", "மெதுவாக எப்படி செல்வது, பாதையில் என்ன எதிர்பார்க்கலாம்.", "धीरे कैसे जाएँ और रास्ते पर क्या उम्मीद करें।"],
    ["Fairy Falls is a short nature pause rather than a full-day trek.", "Wear grip shoes after rain and keep children close near wet rock.", "Pair it with one nearby viewpoint instead of stacking many stops."],
    ["ஃபேரி ஃபால்ஸ் முழு நாள் ட்ரெக் அல்ல — சிறிய இயற்கை இடைவேளை.", "மழைக்குப் பின் பிடிப்புள்ள காலணி அணியுங்கள்; ஈரப் பாறையில் குழந்தைகளை அருகில் வையுங்கள்.", "பல இடங்களை அடுக்காமல் அருகிலுள்ள ஒரு காட்சியுடன் இணைக்கவும்."],
    ["फेयरी फॉल्स पूरे दिन का ट्रेक नहीं — छोटी नेचर ब्रेक है।", "बारिश के बाद ग्रिप वाले जूते पहनें और गीली चट्टान के पास बच्चों को पास रखें।", "कई स्टॉप ठूंसने के बजाय पास के एक व्यूपॉइंट के साथ जोड़ें।"]],

  ["pambar-falls-visit", ["Places", "Nature"], 4,
    ["Pambar Falls: a short Kodai pause", "பாம்பர் அருவி: சிறிய கொடை இடைவேளை", "पांबर फॉल्स: छोटा कोडई ठहराव"],
    ["Timing, caution, and keeping the visit unhurried.", "நேரம், எச்சரிக்கை, அவசரமற்ற பார்வை.", "समय, सावधानी और बिना जल्दबाज़ी का दौरा।"],
    ["Pambar Falls works best as a brief stop with daylight to spare.", "Avoid slippery edges and respect local guidance around the stream.", "Canaan day plans keep waterfall stops short and safe."],
    ["பாம்பர் அருவி பகல் வெளிச்சத்துடன் சிறிய நிறுத்தமாக சிறந்தது.", "வழுக்கும் விளிம்புகளைத் தவிர்த்து உள்ளூர் வழிகாட்டலை மதிக்கவும்.", "கானான் திட்டங்களில் அருவி நிறுத்தங்கள் குறுகியதாகவும் பாதுகாப்பாகவும் இருக்கும்."],
    ["पांबर फॉल्स दिन की रोशनी के साथ छोटे पड़ाव के रूप में सबसे अच्छा है।", "फिसलन भरे किनारों से बचें और धारा के पास स्थानीय सलाह मानें।", "कनान डे प्लान में वॉटरफॉल स्टॉप छोटे और सुरक्षित रखे जाते हैं।"]],

  ["moir-point-sunset", ["Places", "Photography"], 4,
    ["Moir Point for soft evening light", "மென்மையான மாலை ஒளிக்கு மொயர் பாயிண்ட்", "मुलायम शाम की रोशनी के लिए मॉयर पॉइंट"],
    ["Why this lookout feels cinematic at dusk.", "மாலை நேரத்தில் இந்த காட்சி ஏன் சினிமா போல் இருக்கும்.", "शाम को यह व्यूपॉइंट सिनेमा जैसा क्यों लगता है।"],
    ["Moir Point is known for wide valley views when the light turns gold.", "Arrive before peak sunset crowds if you want space for photos.", "Carry a light jacket — evening wind rises quickly on the ridge."],
    ["ஒளி பொன்னாகும்போது அகலமான பள்ளத்தாக்கு காட்சிக்கு மொயர் பாயிண்ட் அறியப்படுகிறது.", "புகைப்படத்திற்கு இடம் வேண்டுமானால் உச்ச கூட்டத்திற்கு முன் வாருங்கள்.", "இலகு ஜாக்கெட் எடுங்கள் — முகட்டில் மாலைக் காற்று விரைவில் உயரும்."],
    ["जब रोशनी सुनहरी हो, मॉयर पॉइंट चौड़े घाटी नज़ारों के लिए जाना जाता है।", "फ़ोटो के लिए जगह चाहिए तो पीक सूर्यास्त भीड़ से पहले पहुँचें।", "हल्की जैकेट रखें — चोटी पर शाम की हवा जल्दी तेज़ हो जाती है।"]],

  ["silent-valley-view", ["Places", "Nature"], 3,
    ["Silent Valley View: space and sky", "சைலண்ட் வேலி வியூ: வெளி மற்றும் வானம்", "साइलेंट वैली व्यू: खुला आसमान"],
    ["A quieter lookout for open air moments.", "திறந்த காற்று தருணங்களுக்கு அமைதியான காட்சி.", "खुली हवा के पलों के लिए शांत व्यूपॉइंट।"],
    ["Silent Valley View suits travellers who want a pause without a long trek.", "The mood changes with mist — wait a few minutes if the valley is hidden.", "Keep noise low; the name fits when the air is still."],
    ["நீண்ட ட்ரெக் இல்லாமல் இடைவேளை வேண்டுவோருக்கு சைலண்ட் வேலி வியூ ஏற்றது.", "மூடுபனியால் மனநிலை மாறும் — பள்ளத்தாக்கு மறைந்திருந்தால் சில நிமிடம் காத்திருங்கள்.", "சத்தம் குறைவாக வையுங்கள்; காற்று அமைதியாக இருக்கும்போது பெயர் பொருந்தும்."],
    ["बिना लंबे ट्रेक के ब्रेक चाहने वालों के लिए साइलेंट वैली व्यू अच्छा है।", "कोहरे से मूड बदलता है — घाटी छिपी हो तो कुछ मिनट रुकें।", "शोर कम रखें; जब हवा शांत हो, नाम सही लगता है।"]],

  ["kurinji-andavar-stop", ["Culture", "Places"], 4,
    ["Kurinji Andavar: a quiet prayer stop", "குறிஞ்சி ஆண்டவர்: அமைதியான பிரார்த்தனை நிறுத்தம்", "कुरिंजी अंडावर: शांत प्रार्थना पड़ाव"],
    ["A gentle cultural pause between scenic drives.", "காட்சி பயணங்களுக்கு இடையே மென்மையான கலாச்சார இடைவேளை.", "नज़ारे वाली ड्राइव के बीच कोमल सांस्कृतिक ठहराव।"],
    ["This temple stop adds calm between viewpoints on longer Kodai days.", "Dress modestly and keep voices soft inside the premises.", "It works well on family packages when elders want a peaceful pause."],
    ["நீண்ட கொடை நாட்களில் காட்சிகளுக்கு இடையே இந்த கோயில் நிறுத்தம் அமைதி தரும்.", "எளிமையான ஆடை அணிந்து வளாகத்தில் குரல் மென்மையாக வையுங்கள்.", "பெரியவர்களுக்கு அமைதியான இடைவேளை வேண்டும் குடும்ப பேக்கேஜ்களில் சிறப்பாகப் பொருந்தும்."],
    ["लंबे कोडई दिनों में व्यूपॉइंट के बीच यह मंदिर पड़ाव शांति देता है।", "विनम्र कपड़े पहनें और परिसर में आवाज़ धीमी रखें।", "पारिवारिक पैकेज में बुज़ुर्गों के लिए शांत ठहराव के रूप में अच्छा है।"]],

  ["bryant-park-flowers", ["Places", "Family"], 3,
    ["Bryant Park flowers and lake edge calm", "பிரையண்ட் பார்க் மலர்கள் மற்றும் ஏரி அமைதி", "ब्रायंट पार्क फूल और झील किनारे की शांति"],
    ["A soft morning for families and first-timers.", "குடும்பங்கள் மற்றும் முதல் முறை வருவோருக்கு மென்மையான காலை.", "परिवारों और पहली बार आने वालों के लिए नरम सुबह।"],
    ["Bryant Park is easy walking with colour and lake proximity.", "Go early for quieter paths and fresher flower beds.", "Combine with a short lake boat ride for a complete gentle morning."],
    ["பிரையண்ட் பார்க் எளிதான நடை, நிறம், ஏரி அருகாமை தரும்.", "அமைதியான பாதைகளுக்கும் புதிய மலர் படுக்கைகளுக்கும் காலையில் செல்லுங்கள்.", "முழுமையான மென்மையான காலைக்கு குறுகிய ஏரி படகுடன் இணைக்கவும்."],
    ["ब्रायंट पार्क आसान सैर, रंग और झील के पास का अहसास देता है।", "शांत रास्तों और ताज़े फूलों के लिए सुबह जाएँ।", "पूरी नरम सुबह के लिए छोटी झील बोटिंग जोड़ें।"]],

  ["kodai-market-street-food", ["Food", "Tips"], 4,
    ["Market street snacks in Kodaikanal", "கொடைக்கானல் சந்தை தெரு சிற்றுண்டி", "कोडाइकनाल बाज़ार स्ट्रीट स्नैक्स"],
    ["Warm bites after misty walks — what to try carefully.", "மூடுபனி நடைக்குப் பின் சூடான சிற்றுண்டி — கவனமாக என்ன முயலலாம்.", "कोहरे वाली सैर के बाद गरम स्नैक्स — सावधानी से क्या आज़माएँ।"],
    ["After a cool walk, simple hot snacks near the market feel right.", "Choose busy clean counters and keep spice levels mild for children.", "Balance snack stops with a proper meal so the day stays comfortable."],
    ["குளிர் நடைக்குப் பின் சந்தை அருகே எளிய சூடான சிற்றுண்டி பொருத்தம்.", "சுத்தமான பிஸியான கவுண்டர்களைத் தேர்வு செய்து குழந்தைகளுக்கு லேசான காரம் வையுங்கள்.", "நாள் வசதியாக இருக்க சிற்றுண்டியை முறையான உணவுடன் சமன் செய்யுங்கள்."],
    ["ठंडी सैर के बाद बाज़ार के पास साधारण गरम स्नैक्स सही लगते हैं।", "साफ़ व्यस्त काउंटर चुनें और बच्चों के लिए मिर्च हल्की रखें।", "दिन आरामदायक रहे, इसके लिए स्नैक्स को सही भोजन के साथ बैलेंस करें।"]],

  ["homemade-cheese-kodai", ["Food", "Shopping"], 3,
    ["Homemade cheese and what travellers buy", "வீட்டில் தயாரித்த சீஸ் மற்றும் பயணிகள் வாங்குவது", "होममेड चीज़ और यात्री क्या खरीदते हैं"],
    ["Fresh local tastes to take home carefully.", "வீட்டிற்கு எடுத்துச் செல்ல புதிய உள்ளூர் சுவைகள்.", "घर ले जाने के लिए ताज़े लोकल स्वाद।"],
    ["Kodai shops often stock homemade cheese among other hill favourites.", "Buy sealed packs and keep them cool on the descent to the plains.", "Ask your host which counters are known for freshness."],
    ["கொடை கடைகளில் வீட்டில் தயாரித்த சீஸ் உள்ளிட்ட மலை விருப்பங்கள் இருக்கும்.", "சீல் செய்யப்பட்ட பொட்டலங்கள் வாங்கி சமவெளிக்கு இறங்கும்போது குளிர்ச்சியாக வையுங்கள்.", "புத்துணர்ச்சிக்கு அறியப்பட்ட கவுண்டர்களை உங்கள் ஹோஸ்டிடம் கேளுங்கள்."],
    ["कोडई दुकानों में होममेड चीज़ सहित पहाड़ी पसंद की चीज़ें मिलती हैं।", "सील पैक खरीदें और मैदान उतरते समय ठंडा रखें।", "ताज़गी के लिए जाने-माने काउंटर अपने होस्ट से पूछें।"]],

  ["woolens-shopping-kodai", ["Shopping", "Tips"], 3,
    ["Buying woollens in Kodaikanal wisely", "கொடையில் கம்பளிப் பொருட்கள் வாங்கும் விவேகம்", "कोडई में ऊनी कपड़े समझदारी से खरीदें"],
    ["Warm layers that travel well and fair prices.", "நன்றாகப் பயணிக்கும் சூடான அடுக்குகள், நியாய விலை.", "अच्छे से यात्रा करने वाले गर्म लेयर और सही कीमत।"],
    ["Woollens are a classic Kodai buy for plains travellers feeling the chill.", "Check stitching and size before paying, and avoid impulse bulk buys.", "One good jacket beats three thin souvenirs."],
    ["சமவெளி பயணிகளுக்கு குளிருக்கான கிளாசிக் கொடை வாங்குதல் கம்பளி.", "பணம் செலுத்தும் முன் தையல் மற்றும் அளவைப் பாருங்கள்; அவசர மொத்த வாங்குதலைத் தவிர்க்கவும்.", "மூன்று மெல்லிய நினைவுப் பொருட்களை விட ஒரு நல்ல ஜாக்கெட் சிறந்தது."],
    ["मैदानी यात्रियों के लिए ठंड में ऊनी कपड़े क्लासिक कोडई खरीद हैं।", "पैसे देने से पहले सिलाई और साइज़ जाँचें; जल्दबाज़ी बल्क खरीद से बचें।", "तीन पतले सौvenirs से एक अच्छी जैकेट बेहतर है।"]],

  ["kodai-cafe-mornings", ["Food", "Culture"], 4,
    ["Cafe mornings in the mist", "மூடுபனியில் காஃபே காலைகள்", "कोहरे में कैफ़े की सुबहें"],
    ["Slow coffee, soft light, and unhurried starts.", "மெதுவான காபி, மென்மையான ஒளி, அவசரமற்ற தொடக்கம்.", "धीमी कॉफ़ी, कोमल रोशनी, बिना जल्दबाज़ी की शुरुआत।"],
    ["Kodai mornings feel better with a warm cup before the first viewpoint.", "Choose a quiet cafe away from the loudest strip when you can.", "Canaan honeymoon and luxury plans leave space for this ritual."],
    ["முதல் காட்சிக்கு முன் சூடான கப்புடன் கொடை காலைகள் சிறப்பாக இருக்கும்.", "முடிந்தால் அதிக சத்தமான வீதிக்கு அப்பால் அமைதியான காஃபே தேர்வு செய்யுங்கள்.", "கானான் தேனிலவு மற்றும் லக்ஸரி திட்டங்கள் இந்த சடங்குக்கு இடம் விடுகின்றன."],
    ["पहले व्यूपॉइंट से पहले गरम कप के साथ कोडई सुबहें बेहतर लगती हैं।", "संभव हो तो सबसे शोरगुल वाली पट्टी से दूर शांत कैफ़े चुनें।", "कनान हनीमून और लक्ज़री प्लान में इस रिवायत के लिए जगह रखी जाती है।"]],

  ["best-photo-hours-kodai", ["Photography", "Tips"], 5,
    ["Best photo hours in Kodaikanal", "கொடையில் சிறந்த புகைப்பட நேரங்கள்", "कोडाइकनाल में बेस्ट फोटो आवर्स"],
    ["Golden light, mist texture, and when to wait.", "பொன் ஒளி, மூடுபனி அமைப்பு, எப்போது காத்திருக்க வேண்டும்.", "सुनहरी रोशनी, कोहरे की बनावट, कब इंतज़ार करें।"],
    ["Early morning and late afternoon give Kodai its softest light.", "Mist can hide a view — waiting ten minutes often changes the frame.", "Protect lenses from drizzle and avoid cliff edges for selfies."],
    ["காலை மற்றும் பிற்பகல் கொடைக்கு மென்மையான ஒளியைத் தரும்.", "மூடுபனி காட்சியை மறைக்கலாம் — பத்து நிமிடம் காத்திருப்பது பிரேமை மாற்றும்.", "லென்ஸை தூறலில் இருந்து பாதுகாத்து செல்ஃபிக்கு பாறை விளிம்பைத் தவிர்க்கவும்."],
    ["सुबह और देर दोपहर कोडई को सबसे कोमल रोशनी देती हैं।", "कोहरा नज़ारा छुपा सकता है — दस मिनट रुकना फ्रेम बदल देता है।", "लेंस को बूंदाबांदी से बचाएँ और सेल्फी के लिए चट्टानी किनारे से दूर रहें।"]],

  ["drone-rules-hills", ["Photography", "Safety"], 4,
    ["Drone sense in the hills", "மலைகளில் ட்ரோன் விவேகம", "पहाड़ियों में ड्रोन समझदारी"],
    ["Rules, respect, and when not to fly.", "விதிகள், மரியாதை, எப்போது பறக்கக் கூடாது.", "नियम, सम्मान, कब न उड़ाएँ।"],
    ["Hill stations have restrictions and privacy concerns around drones.", "Check current rules before packing a drone and never fly near crowds or cliffs recklessly.", "Often the best Kodai photos need no drone — just patience and soft light."],
    ["மலைப் பகுதிகளில் ட்ரோனுக்கு கட்டுப்பாடுகளும் தனியுரிமை கவலைகளும் உண்டு.", "ட்ரோன் எடுப்பதற்கு முன் தற்போதைய விதிகளைப் பார்த்து கூட்டம் அல்லது பாறை அருகே அஜாக்கிரதையாகப் பறக்க வேண்டாம்.", "சிறந்த கொடை புகைப்படங்களுக்கு ட்ரோன் தேவையில்லை — பொறுமையும் மென்மையான ஒளியும் போதும்."],
    ["हिल स्टेशनों में ड्रोन पर पाबंदियाँ और प्राइवेसी चिंताएँ होती हैं।", "ड्रोन पैक करने से पहले वर्तमान नियम जाँचें; भीड़ या चट्टान के पास लापरवाही से न उड़ाएँ।", "अक्सर बेस्ट कोडई फ़ोटो के लिए ड्रोन नहीं — धैर्य और नरम रोशनी काफी है।"]],

  ["kodai-night-sky", ["Experiences", "Nature"], 4,
    ["Night sky moments near Kodai", "கொடை அருகில் இரவு வான தருணங்கள்", "कोडई के पास रात के आसमान के पल"],
    ["Stars, cool air, and staying warm safely.", "நட்சத்திரங்கள், குளிர் காற்று, பாதுகாப்பாக சூடாக இருப்பது.", "सितारे, ठंडी हवा, सुरक्षित गर्माहट।"],
    ["Clear winter nights can reveal a bright highland sky.", "Dress in layers and avoid remote edges after dark without a trusted plan.", "Organised camping add-ons make night sky time safer and calmer."],
    ["தெளிவான குளிர்கால இரவுகள் பிரகாசமான மலை வானத்தைக் காட்டலாம்.", "அடுக்கு ஆடை அணிந்து, நம்பகமான திட்டம் இல்லாமல் இருட்டிற்குப் பின் தொலை விளிம்புகளைத் தவிர்க்கவும்.", "ஒழுங்கமைக்கப்பட்ட கேம்பிங் சேர்ப்புகள் இரவு வான நேரத்தை பாதுகாப்பாகவும் அமைதியாகவும் ஆக்கும்."],
    ["साफ़ सर्द रातें चमकदार पहाड़ी आसमान दिखा सकती हैं।", "परतें पहनें और भरोसेमंद प्लान के बिना अँधेरे के बाद दूर किनारों से बचें।", "संगठित कैंपिंग ऐड-ऑन रात के आसमान को सुरक्षित और शांत बनाते हैं।"]],

  ["kodai-rain-jacket-guide", ["Tips", "Packing"], 3,
    ["Why a rain jacket matters in Kodai", "கொடையில் மழை ஜாக்கெட் ஏன் முக்கியம்", "कोडई में रेन जैकेट क्यों ज़रूरी है"],
    ["Sudden showers, mist, and staying dry on walks.", "திடீர் மழை, மூடுபனி, நடைகளில் உலர்ந்திருப்பது.", "अचानक बौछार, कोहरा, सैर पर सूखा रहना।"],
    ["Kodai weather can shift within an hour — a compact rain jacket earns its space.", "Umbrellas struggle in ridge wind; a jacket keeps hands free for photos and children.", "Pack one for every adult on family trips."],
    ["கொடை வானிலை ஒரு மணி நேரத்தில் மாறலாம் — சிறிய மழை ஜாக்கெட் இடத்திற்கு மதிப்புள்ளது.", "முகட்டுக் காற்றில் குடை சிரமம்; ஜாக்கெட் புகைப்படம் மற்றும் குழந்தைகளுக்கு கைகளை விடுவிக்கும்.", "குடும்பப் பயணத்தில் ஒவ்வொரு வயது வந்தவருக்கும் ஒன்று எடுங்கள்."],
    ["कोडई मौसम एक घंटे में बदल सकता है — कॉम्पैक्ट रेन जैकेट जगह के लायक है।", "चोटी की हवा में छतरी मुश्किल; जैकेट हाथ फ़ोटो और बच्चों के लिए खाली रखती है।", "पारिवारिक ट्रिप में हर वयस्क के लिए एक पैक करें।"]],

  ["motion-sickness-hill-roads", ["Travel", "Tips"], 4,
    ["Hill road comfort tips", "மலை சாலை வசதி குறிப்புகள்", "पहाड़ी सड़क आराम टिप्स"],
    ["Hairpins, snacks, and calmer arrivals.", "வளைவுகள், சிற்றுண்டி, அமைதியான வருகை.", "मोड़, स्नैक्स, शांत आगमन।"],
    ["The climb to Kodai has many curves — light snacks and breaks help sensitive travellers.", "Sit where you can see the road ahead and keep phones down if you feel queasy.", "Private transfers with trusted drivers make the journey softer."],
    ["கொடை ஏற்றத்தில் பல வளைவுகள் — உணர்திறன் பயணிகளுக்கு இலகு சிற்றுண்டியும் இடைவேளையும் உதவும்.", "முன் சாலை தெரியும் இடத்தில் அமர்ந்து குமட்டல் இருந்தால் போனைக் குறைவாகப் பாருங்கள்.", "நம்பகமான ஓட்டுநர்களுடன் தனியார் பயணம் பயணத்தை மென்மையாக்கும்."],
    ["कोडई चढ़ाई में कई मोड़ हैं — संवेदनशील यात्रियों को हल्के स्नैक्स और ब्रेक मदद करते हैं।", "आगे सड़क दिखे वहाँ बैठें और मिचली हो तो फ़ोन कम देखें।", "भरोसेमंद ड्राइवरों के साथ प्राइवेट ट्रांसफर सफ़र नरम बनाता है।"]],

  ["kodai-with-pets", ["Family", "Tips"], 4,
    ["Travelling to Kodai with pets", "செல்லப்பிராணிகளுடன் கொடை பயணம்", "पालतू जानवरों के साथ कोडई यात्रा"],
    ["Stay rules, weather, and calm pacing.", "தங்கல் விதிகள், வானிலை, அமைதியான வேகம்.", "ठहराव नियम, मौसम, शांत रफ्तार।"],
    ["Not every stay allows pets — confirm before you book.", "Hills are cool; pack a pet jacket for winter mornings and keep walks short at first.", "Canaan can help filter pet-friendly options when you enquire."],
    ["எல்லா தங்கலும் செல்லப்பிராணிகளை அனுமதிக்காது — முன்பதிவுக்கு முன் உறுதிப்படுத்துங்கள்.", "மலைகள் குளிர்; குளிர்கால காலைக்கு பெட் ஜாக்கெட் எடுத்து முதலில் குறுகிய நடை வையுங்கள்.", "விசாரணையில் செல்லப்பிராணி நட்பு விருப்பங்களை வடிகட்ட கானான் உதவும்."],
    ["हर ठहराव पालतू अनुमति नहीं देता — बुक करने से पहले पुष्टि करें।", "पहाड़ ठंडे हैं; सर्द सुबह के लिए पेट जैकेट रखें और पहले छोटी सैर करें।", "पूछताछ पर कनान पेट-फ्रेंडली विकल्प छांटने में मदद कर सकता है।"]],

  ["senior-friendly-kodai", ["Family", "Tips"], 5,
    ["Senior-friendly Kodaikanal days", "மூத்தவர்களுக்கு ஏற்ற கொடை நாட்கள்", "वरिष्ठों के अनुकूल कोडई दिन"],
    ["Fewer steps, warmer layers, easy viewpoints.", "குறைந்த படிகள், சூடான அடுக்குகள், எளிய காட்சிகள்.", "कम सीढ़ियाँ, गर्म लेयर, आसान व्यूपॉइंट।"],
    ["Choose lake circuits and vehicle-access viewpoints over steep treks.", "Plan rest after the hill climb day and keep evenings early.", "Private transfers and ground-floor stays make a real difference."],
    ["செங்குத்தான ட்ரெக்குக்கு பதிலாக ஏரி சுற்று மற்றும் வாகன அணுகல் காட்சிகளைத் தேர்வு செய்யுங்கள்.", "மலை ஏற்ற நாளுக்குப் பின் ஓய்வு திட்டமிட்டு மாலைகளை முன்கூட்டியே வையுங்கள்.", "தனியார் பயணம் மற்றும் தரை தள தங்கல் உண்மையான வித்தியாசம் உருவாக்கும்."],
    ["खड़ी ट्रेक की जगह झील सर्किट और वाहन-पहुँच व्यूपॉइंट चुनें।", "पहाड़ी चढ़ाई वाले दिन के बाद आराम रखें और शामें जल्दी करें।", "प्राइवेट ट्रांसफर और ग्राउंड-फ़्लोर ठहराव असली फ़र्क लाते हैं।"]],

  ["kodai-diwali-travel", ["Seasons", "Travel"], 4,
    ["Visiting Kodai around festival weeks", "பண்டிகை வாரங்களில் கொடை பயணம்", "त्योहार हफ़्तों में कोडई यात्रा"],
    ["Crowds, bookings, and calmer alternatives.", "கூட்டம், முன்பதிவு, அமைதியான மாற்றுகள்.", "भीड़, बुकिंग, शांत विकल्प।"],
    ["Festival weeks fill stays quickly — book early or choose quieter outskirts.", "Expect busier lake roads in the evenings.", "Ask Canaan for dates that balance mood and availability."],
    ["பண்டிகை வாரங்களில் தங்கல் விரைவில் நிறையும் — முன்கூட்டியே முன்பதிவு அல்லது அமைதியான புறநகரைத் தேர்வு செய்யுங்கள்.", "மாலையில் ஏரி சாலைகள் பிஸியாக இருக்கும்.", "உணர்வு மற்றும் கிடைக்கும் தன்மையை சமன் செய்யும் தேதிகளை கானானிடம் கேளுங்கள்."],
    ["त्योहार हफ़्तों में ठहराव जल्दी भर जाते हैं — जल्दी बुक करें या शांत बाहरी इलाका चुनें।", "शाम को झील सड़कें व्यस्त होंगी।", "मूड और उपलब्धता संतुलित करने वाली तारीखें कनान से पूछें।"]],

  ["kodai-new-year-tips", ["Seasons", "Tips"], 4,
    ["New Year in the hills: calm over chaos", "மலையில் புத்தாண்டு: குழப்பத்தை விட அமைதி", "पहाड़ियों में नया साल: शोर से ज़्यादा शांति"],
    ["How to celebrate softly in Kodaikanal.", "கொடையில் மென்மையாக எப்படி கொண்டாடுவது.", "कोडई में धीरे कैसे मनाएँ।"],
    ["New Year crowds gather in popular spots — private stays feel better for couples.", "Book transfers early and keep plans flexible around weather.", "A quiet dinner and mist morning often beat noisy celebrations."],
    ["புத்தாண்டு கூட்டம் பிரபல இடங்களில் கூடும் — ஜோடிகளுக்கு தனியார் தங்கல் சிறந்தது.", "பயணத்தை முன்கூட்டியே முன்பதிவு செய்து வானிலைக்கேற்ப திட்டத்தை நெகிழ வையுங்கள்.", "அமைதியான இரவு உணவும் மூடுபனி காலையும் சத்தமான கொண்டாட்டத்தை விட சிறந்தவை."],
    ["नए साल की भीड़ लोकप्रिय जगहों पर जुटती है — कपल के लिए निजी ठहराव बेहतर।", "ट्रांसफर जल्दी बुक करें और मौसम के हिसाब से प्लान लचीला रखें।", "शांत डिनर और कोहरे वाली सुबह अक्सर शोर भरे जश्न से बेहतर होती है।"]],

  ["kodai-workation-week", ["Stays", "Tips"], 5,
    ["A workation week in Kodaikanal", "கொடையில் ஒரு வாரம் ஒர்கேஷன்", "कोडई में एक वर्केशन हफ़्ता"],
    ["Wifi reality, quiet stays, and balanced days.", "வைஃபை உண்மை, அமைதியான தங்கல், சமநிலை நாட்கள்.", "वाई‑फ़ाई हक़ीक़त, शांत ठहराव, संतुलित दिन।"],
    ["Some stays offer workable internet; confirm speed before you plan calls.", "Work mornings, walk afternoons — Kodai rewards that rhythm.", "Choose a stay slightly away from night market noise."],
    ["சில தங்கல்களில் வேலைக்கு ஏற்ற இணையம் உண்டு; அழைப்புக்கு முன் வேகத்தை உறுதிப்படுத்துங்கள்.", "காலை வேலை, பிற்பகல் நடை — கொடை அந்த தாளத்திற்கு பலன் தரும்.", "இரவு சந்தை சத்தத்திற்கு சற்று தூரத்தில் தங்குங்கள்."],
    ["कुछ ठहरावों में काम लायक इंटरनेट होता है; कॉल से पहले स्पीड पुष्टि करें।", "सुबह काम, दोपहर सैर — कोडई इसी लय को इनाम देता है।", "रात बाज़ार शोर से थोड़ी दूर ठहरें।"]],

  ["kodai-anniversary-ideas", ["Couples", "Experiences"], 4,
    ["Anniversary ideas in Kodaikanal", "கொடையில் ஆண்டுவிழா யோசனைகள்", "कोडई में एनिवर्सरी आइडिया"],
    ["Private dinners, mist walks, and slow mornings.", "தனியார் இரவு உணவு, மூடுபனி நடை, மெதுவான காலைகள்.", "निजी डिनर, कोहरे वाली सैर, धीमी सुबहें।"],
    ["Keep the day short: one special meal, one gentle viewpoint, lots of white space.", "A private transfer and valley-view stay set the mood without rushing.", "Kodai Honeymoon pacing works beautifully for anniversaries too."],
    ["நாளைக் குறுகியதாக வையுங்கள்: ஒரு சிறப்பு உணவு, ஒரு மென்மையான காட்சி, அதிக வெள்ளை இடம்.", "தனியார் பயணம் மற்றும் பள்ளத்தாக்கு காட்சி தங்கல் அவசரமின்றி மனநிலையை அமைக்கும்.", "தேனிலவு வேகம் ஆண்டுவிழாவிற்கும் அழகாகப் பொருந்தும்."],
    ["दिन छोटा रखें: एक ख़ास भोजन, एक नरम व्यूपॉइंट, बहुत खुली जगह।", "प्राइवेट ट्रांसफर और घाटी-दृश्य ठहराव बिना जल्दबाज़ी मूड सेट करते हैं।", "हनीमून की रफ्तार एनिवर्सरी के लिए भी खूबसूरती से काम करती है।"]],

  ["kodai-proposal-spots", ["Couples", "Places"], 4,
    ["Quiet proposal-friendly moments in Kodai", "கொடையில் அமைதியான சமர்ப்பண தருணங்கள்", "कोडई में शांत प्रपोज़ल पल"],
    ["Soft light, privacy, and how to keep it simple.", "மென்மையான ஒளி, தனியுரிமை, எளிமையாக வைப்பது எப்படி.", "कोमल रोशनी, निजता, सरल कैसे रखें।"],
    ["Choose a quieter lookout at off-peak hours rather than the busiest railing.", "Tell your driver the plan so timing and privacy are protected.", "Canaan can help arrange a soft private evening around your moment."],
    ["பிஸியான தண்டவாளத்தை விட அமைதியான காட்சியை அல்லாத நேரத்தில் தேர்வு செய்யுங்கள்.", "நேரமும் தனியுரிமையும் காக்க உங்கள் திட்டத்தை ஓட்டுநரிடம் சொல்லுங்கள்.", "உங்கள் தருணத்தைச் சுற்றி மென்மையான தனியார் மாலையை ஏற்பாடு செய்ய கானான் உதவும்."],
    ["सबसे व्यस्त रेलिंग की जगह ऑफ-पीक पर शांत व्यूपॉइंट चुनें।", "समय और निजता बचाने के लिए ड्राइवर को प्लान बताएँ।", "कनान आपके पल के आसपास नरम निजी शाम व्यवस्थित करने में मदद कर सकता है।"]],

  ["kodai-friend-group-budget", ["Budget", "Group"], 5,
    ["Friend group trip to Kodai on a budget", "பட்ஜெட்டில் நண்பர் குழு கொடை பயணம்", "बजट में दोस्तों की कोडई ट्रिप"],
    ["Shared rooms, smart food, and one private transfer.", "பகிர்ந்த அறைகள், புத்திசாலி உணவு, ஒரு தனியார் பயணம்.", "शेयर रूम, स्मार्ट खाना, एक प्राइवेट ट्रांसफर।"],
    ["Split a larger stay and share one vehicle to cut costs without losing comfort.", "Cook or eat simple local meals for two dinners.", "Keep the itinerary to three strong places so nobody burns out."],
    ["பெரிய தங்கலைப் பகிர்ந்து ஒரு வாகனம் பகிர்வது வசதியை இழக்காமல் செலவைக் குறைக்கும்.", "இரண்டு இரவு உணவுக்கு சமைக்கவும் அல்லது எளிய உள்ளூர் உணவு சாப்பிடவும்.", "யாரும் சோரவிடாதபடி திட்டத்தை மூன்று வலுவான இடங்களுக்குள் வையுங்கள்."],
    ["बड़ा ठहराव और एक वाहन साझा करने से आराम गवाए बिना खर्च कटता है।", "दो डिनर के लिए पकाएँ या साधारण लोकल खाना खाएँ।", "itinerary तीन मज़बूत जगहों तक रखें ताकि कोई थक न जाए।"]],

  ["kodai-solo-woman-tips", ["Solo", "Safety"], 5,
    ["Solo woman travel tips for Kodaikanal", "தனியாகப் பெண்கள் கொடை பயணக் குறிப்புகள்", "सोलो महिला कोडई ट्रैवल टिप्स"],
    ["Daylight plans, trusted taxis, and calm stays.", "பகல் திட்டங்கள், நம்பக டாக்சி, அமைதியான தங்கல்.", "दिन की योजना, भरोसेमंद टैक्सी, शांत ठहराव।"],
    ["Keep cliff and forest edges for daylight with company when possible.", "Share stay details with family and use known drivers for outer points.", "Choose stays with good reviews for safety and evening access."],
    ["முடிந்தால் பாறை மற்றும் காடு விளிம்புகளை பகல் மற்றும் உடன் இருப்போருடன் வையுங்கள்.", "தங்கல் விவரங்களைக் குடும்பத்திடம் பகிர்ந்து வெளி இடங்களுக்கு அறியப்பட்ட ஓட்டுநர்களைப் பயன்படுத்துங்கள்.", "பாதுகாப்பு மற்றும் மாலை அணுகலுக்கு நல்ல மதிப்புரை உள்ள தங்கலைத் தேர்வு செய்யுங்கள்."],
    ["संभव हो तो चट्टान और जंगल किनारे दिन में और साथ के साथ रखें।", "ठहराव विवरण परिवार से साझा करें और बाहरी जगहों के लिए जाने-माने ड्राइवर लें।", "सुरक्षा और शाम पहुँच के लिए अच्छी समीक्षा वाले ठहराव चुनें।"]],

  ["kodai-school-trip-notes", ["Family", "Guides"], 5,
    ["School or college group notes for Kodai", "பள்ளி/கல்லூரி குழு கொடை குறிப்புகள்", "स्कूल/कॉलेज ग्रुप कोडई नोट्स"],
    ["Permissions, pacing, and responsible viewpoints.", "அனுமதிகள், வேகம், பொறுப்பான காட்சிகள்.", "अनुमति, रफ्तार, ज़िम्मेदार व्यूपॉइंट।"],
    ["Groups need clear headcounts, meal timing, and fewer cliff-edge stops.", "Assign buddies and keep a buffer for fog delays.", "Canaan can coordinate multi-room stays and shared transfers for groups."],
    ["குழுக்களுக்கு தெளிவான எண்ணிக்கை, உணவு நேரம், குறைந்த பாறை விளிம்பு நிறுத்தங்கள் தேவை.", "ஜோடி நண்பர்களை நியமித்து மூடுபனி தாமதத்திற்கு இடம் வையுங்கள்.", "குழுக்களுக்கு பல அறை தங்கல் மற்றும் பகிர்ந்த பயணத்தை கானான் ஒருங்கிணைக்கும்."],
    ["ग्रुप को साफ़ हेडकाउंट, भोजन समय और कम चट्टानी किनारे स्टॉप चाहिए।", "बडी लगाएँ और कोहरे देरी के लिए बफ़र रखें।", "कनान ग्रुप के लिए मल्टी-रूम ठहराव और शेयर ट्रांसफर समन्वय कर सकता है।"]],

  ["kodai-monsoon-packing-list", ["Seasons", "Packing"], 4,
    ["Monsoon packing list for Kodaikanal", "கொடை மழைக்கால பேக்கிங் பட்டியல்", "कोडई मानसून पैकिंग लिस्ट"],
    ["Waterproof shoes, layers, and bag covers.", "நீர்ப்புகா காலணி, அடுக்குகள், பை கவர்கள்.", "वाटरप्रूफ जूते, लेयर, बैग कवर।"],
    ["Pack waterproof shoes, a rain jacket, quick-dry layers, and zip bags for electronics.", "A small towel and extra socks save damp afternoons.", "Skip white shoes if you plan forest paths after rain."],
    ["நீர்ப்புகா காலணி, மழை ஜாக்கெட், விரைவில் உலரும் அடுக்குகள், எலக்ட்ரானிக்ஸுக்கு ஜிப் பைகள் எடுங்கள்.", "சிறிய துண்டும் கூடுதல் காலுறைகளும் ஈரப் பிற்பகல்களைக் காப்பாற்றும்.", "மழைக்குப் பின் காடு பாதை திட்டமிட்டால் வெள்ளை காலணியைத் தவிர்க்கவும்."],
    ["वाटरप्रूफ जूते, रेन जैकेट, जल्दी सूखने वाले लेयर और इलेक्ट्रॉनिक्स के लिए ज़िप बैग रखें।", "छोटा तौलिया और अतिरिक्त मोजे गीली दोपहर बचाते हैं।", "बारिश के बाद जंगल रास्ते हों तो सफ़ेद जूते छोड़ दें।"]],

  ["kodai-winter-layering", ["Seasons", "Packing"], 3,
    ["Winter layering for Kodai evenings", "கொடை மாலைகளுக்கு குளிர்கால அடுக்கு ஆடை", "कोडई शामों के लिए विंटर लेयरिंग"],
    ["Warm core, light extras, sleep comfort.", "சூடான மையம், இலகு கூடுதல், தூக்க வசதி.", "गर्म कोर, हल्के अतिरिक्त, नींद आराम।"],
    ["Think layers: base, warm mid, wind shell — easier than one heavy coat.", "Evenings by the lake can feel colder than midday town streets.", "Ask your stay about blankets and heating before winter arrivals."],
    ["அடுக்குகளாகச் சிந்தியுங்கள்: அடிப்படை, சூடான நடு, காற்று கவர் — ஒரு கனமான கோட்டை விட எளிது.", "ஏரி அருகே மாலைகள் நண்பகல் நகரத் தெருக்களை விட குளிராக இருக்கலாம்.", "குளிர்கால வருகைக்கு முன் போர்வை மற்றும் வெப்பம் பற்றி தங்கலில் கேளுங்கள்."],
    ["परतों में सोचें: बेस, गर्म मिड, विंड शेल — एक भारी कोट से आसान।", "झील किनारे शामें दोपहर की सड़कों से ठंडी लग सकती हैं।", "सर्द आगमन से पहले ठहराव से कंबल और हीटिंग पूछें।"]],

  ["kodai-summer-hydration", ["Seasons", "Tips"], 3,
    ["Summer hydration and sun sense in Kodai", "கொடை கோடை நீரேற்றம் மற்றும் சூரிய விவேகம்", "कोडई गर्मी में हाइड्रेशन और धूप समझ"],
    ["Cool evenings still need water and sunscreen.", "குளிர் மாலைகளிலும் தண்ணீரும் சன்ஸ்கிரீனும் தேவை.", "ठंडी शामों में भी पानी और सनस्क्रीन ज़रूरी।"],
    ["Days can be bright even when evenings are cool — carry water and sunscreen.", "Hats help on open viewpoints with little shade.", "Children tire faster on climbs; plan snack and water stops."],
    ["மாலை குளிராக இருந்தாலும் பகல் பிரகாசமாக இருக்கலாம் — தண்ணீர் மற்றும் சன்ஸ்கிரீன் எடுங்கள்.", "நிழல் குறைந்த திறந்த காட்சிகளில் தொப்பி உதவும்.", "ஏற்றங்களில் குழந்தைகள் விரைவில் சோருவார்கள்; சிற்றுண்டி மற்றும் நீர் நிறுத்தங்கள் திட்டமிடுங்கள்."],
    ["शाम ठंडी होने पर भी दिन चमकदार हो सकता है — पानी और सनस्क्रीन रखें।", "कम छाँव वाले खुले व्यूपॉइंट पर टोपी मदद करती है।", "चढ़ाई पर बच्चे जल्दी थकते हैं; स्नैक और पानी के स्टॉप प्लान करें।"]],

  ["kodai-fog-driving", ["Safety", "Travel"], 5,
    ["Driving and riding in Kodai fog", "கொடை மூடுபனியில் வாகனம் ஓட்டுதல்", "कोडई कोहरे में ड्राइविंग"],
    ["Visibility, patience, and trusting local drivers.", "தெரிவுநிலை, பொறுமை, உள்ளூர் ஓட்டுநர்கள் மீது நம்பிக்கை.", "दृश्यता, धैर्य, लोकल ड्राइवरों पर भरोसा।"],
    ["Fog can drop visibility fast on hill roads — slow down and use lights wisely.", "Avoid overtaking on blind curves.", "For visitors, hiring a trusted local driver is often the safest choice."],
    ["மலைச் சாலைகளில் மூடுபனி தெரிவுநிலையை விரைவில் குறைக்கும் — மெதுவாக்கி விளக்குகளை விவேகமாகப் பயன்படுத்துங்கள்.", "கண்ணுக்குத் தெரியாத வளைவுகளில் முந்திச் செல்ல வேண்டாம்.", "பார்வையாளர்களுக்கு நம்பகமான உள்ளூர் ஓட்டுநர் பெரும்பாலும் பாதுகாப்பான தேர்வு."],
    ["पहाड़ी सड़कों पर कोहरा दृश्यता तेज़ी से घटा सकता है — धीमे चलें और लाइट समझदारी से लगाएँ।", "अंधे मोड़ों पर ओवरटेक् न करें।", "यात्रियों के लिए भरोसेमंद लोकल ड्राइवर अक्सर सबसे सुरक्षित विकल्प है।"]],

  ["kodai-network-reality", ["Tips", "Travel"], 3,
    ["Mobile network reality in the hills", "மலைகளில் மொபைல் நெட்வொர்க் உண்மை", "पहाड़ियों में मोबाइल नेटवर्क हक़ीक़त"],
    ["Where signals drop and how to plan calls.", "சிக்னல் எங்கே குறையும், அழைப்புகளை எப்படி திட்டமிடுவது.", "सिग्नल कहाँ गिरता है, कॉल कैसे प्लान करें।"],
    ["Network can be patchy on outer roads and in thick mist zones.", "Download offline maps and tell family your stay address before you climb.", "Do important calls from town or your stay wifi when possible."],
    ["வெளிச் சாலைகளிலும் அடர் மூடுபனி மண்டலங்களிலும் நெட்வொர்க் குறையலாம்.", "ஆஃப்லைன் வரைபடம் பதிவிறக்கி ஏற்றத்திற்கு முன் தங்கல் முகவரியைக் குடும்பத்திடம் சொல்லுங்கள்.", "முக்கிய அழைப்புகளை முடிந்தால் நகரில் அல்லது தங்கல் வைஃபையில் செய்யுங்கள்."],
    ["बाहरी सड़कों और घने कोहरे क्षेत्रों में नेटवर्क कमज़ोर हो सकता है।", "ऑफ़लाइन मैप डाउनलोड करें और चढ़ाई से पहले ठहराव पता परिवार को बताएँ।", "ज़रूरी कॉल शहर या ठहराव वाई‑फ़ाई से करें जब संभव हो।"]],

  ["kodai-atm-cash-tips", ["Tips", "Budget"], 3,
    ["Cash and ATM tips in Kodaikanal", "கொடையில் பணம் மற்றும் ஏடிஎம் குறிப்புகள்", "कोडई में कैश और एटीएम टिप्स"],
    ["Carry some cash for small shops and parking.", "சிறிய கடைகள் மற்றும் பார்க்கிங்கிற்கு சில பணம் எடுங்கள்.", "छोटी दुकानों और पार्किंग के लिए कुछ नकद रखें।"],
    ["Cards work in many places, but small shops and some parking spots prefer cash.", "Withdraw in town rather than assuming ATMs everywhere on outer roads.", "Keep a small float for tips and snacks."],
    ["பல இடங்களில் கார்டு வேலை செய்யும், ஆனால் சிறிய கடைகளும் சில பார்க்கிங்கும் பணம் விரும்பும்.", "வெளிச் சாலைகளில் எங்கும் ஏடிஎம் என்று நினைக்காமல் நகரில் எடுங்கள்.", "டிப்ஸ் மற்றும் சிற்றுண்டிக்கு சிறிய தொகை வையுங்கள்."],
    ["कई जगह कार्ड चलते हैं, पर छोटी दुकानें और कुछ पार्किंग नकद पसंद करती हैं।", "बाहरी सड़कों पर हर जगह एटीएम मानकर न चलें — शहर में निकालें।", "टिप और स्नैक्स के लिए छोटी रकम रखें।"]],

  ["kodai-power-cuts-prep", ["Tips", "Stays"], 3,
    ["Power cuts and stay prep in the hills", "மலைகளில் மின்வெட்டு மற்றும் தங்கல் தயாரிப்பு", "पहाड़ियों में बिजली कट और ठहराव तैयारी"],
    ["Power banks, warm layers, and calm evenings.", "பவர் பேங்குகள், சூடான அடுக்குகள், அமைதியான மாலைகள்.", "पावर बैंक, गर्म लेयर, शांत शामें।"],
    ["Occasional outages happen in hill weather — pack a charged power bank.", "Ask about backup lighting when you choose a stay.", "Candlelit calm can be charming if you are prepared."],
    ["மலை வானிலையில் எப்போதாவது மின்வெட்டு உண்டு — சார்ஜ் செய்யப்பட்ட பவர் பேங்க் எடுங்கள்.", "தங்கல் தேர்வில் காப்பு விளக்கு பற்றி கேளுங்கள்.", "தயாராக இருந்தால் மெழுகுவர்த்தி அமைதி கவர்ச்சியாக இருக்கும்."],
    ["पहाड़ी मौसम में कभी-कभी बिजली जाती है — चार्ज्ड पावर बैंक रखें।", "ठहराव चुनते समय बैकअप लाइटिंग पूछें।", "तैयार हों तो मोमबत्ती वाली शांति सुंदर लग सकती है।"]],

  ["kodai-lake-evening-walk", ["Places", "Walks"], 3,
    ["Lake evening walk etiquette", "ஏரி மாலை நடை மரியாதை", "झील शाम सैर शिष्टाचार"],
    ["Share the path, keep noise low, enjoy the light.", "பாதையைப் பகிருங்கள், சத்தம் குறைவு, ஒளியை அனுபவிக்கவும்.", "रास्ता साझा करें, शोर कम, रोशनी का आनंद लें।"],
    ["The lake road is shared by walkers, cycles, and cars — stay aware.", "Keep music low and litter zero.", "This simple walk is often a favourite Kodai memory."],
    ["ஏரி சாலையை நடப்பவர்கள், சைக்கிள், கார்கள் பகிர்கின்றன — விழிப்புடன் இருங்கள்.", "இசையைக் குறைவாகவும் குப்பை பூஜ்ஜியமாகவும் வையுங்கள்.", "இந்த எளிய நடை அடிக்கடி பிடித்த கொடை நினைவாகும்."],
    ["झील सड़क पैदल, साइकिल और कार साझा करती हैं — सावधान रहें।", "संगीत धीमा और कचरा शून्य रखें।", "यह साधारण सैर अक्सर पसंदीदा कोडई याद बनती है।"]],

  ["kodai-boat-with-kids", ["Family", "Lake"], 3,
    ["Boating with kids on Kodai Lake", "குழந்தைகளுடன் கொடை ஏரி படகு", "बच्चों के साथ कोडई झील बोटिंग"],
    ["Short rides, life jackets, calm hours.", "குறுகிய சவாரி, லைஃப் ஜாக்கெட், அமைதியான நேரம்.", "छोटी सवारी, लाइफ़ जैकेट, शांत समय।"],
    ["Choose shorter boat rides for young children and confirm safety gear.", "Morning slots are often cooler and less crowded.", "Follow with snacks so the memory stays happy."],
    ["சிறு குழந்தைகளுக்குக் குறுகிய படகு சவாரி தேர்ந்து பாதுகாப்பு உபகரணம் உறுதிப்படுத்துங்கள்.", "காலை ஸ்லாட்டுகள் பெரும்பாலும் குளிர்ச்சியாகவும் குறைந்த கூட்டத்துடனும் இருக்கும்.", "நினைவு மகிழ்ச்சியாக இருக்க சிற்றுண்டி தொடரட்டும்."],
    ["छोटे बच्चों के लिए छोटी बोट सवारी चुनें और सेफ़्टी गियर पुष्टि करें।", "सुबह स्लॉट अक्सर ठंडे और कम भीड़ वाले होते हैं।", "याद खुश रहे, इसके लिए स्नैक्स साथ रखें।"]],

  ["kodai-horse-ride-kids", ["Family", "Experiences"], 3,
    ["Horse rides with children: keep it kind", "குழந்தைகளுடன் குதிரை சவாரி: கனிவாக", "बच्चों के साथ घुड़सवारी: दयालु रखें"],
    ["Short loops, fair price, animal care.", "குறுகிய சுற்று, நியாய விலை, விலங்கு பராமரிப்பு.", "छोटे लूप, सही कीमत, जानवर की देखभाल।"],
    ["Agree price and duration before the ride and choose calm animals for kids.", "Keep rides short and avoid forcing photos.", "Kind treatment of animals is part of a good Kodai memory."],
    ["சவாரிக்கு முன் விலை மற்றும் கால அளவு ஒப்புக்கொண்டு குழந்தைகளுக்கு அமைதியான விலங்குகளைத் தேர்வு செய்யுங்கள்.", "சவாரியைக் குறுகியதாக வைத்து புகைப்படத்தை கட்டாயப்படுத்த வேண்டாம்.", "விலங்குகளிடம் கனிவு நல்ல கொடை நினைவின் பகுதி."],
    ["सवारी से पहले कीमत और अवधि तय करें और बच्चों के लिए शांत जानवर चुनें।", "सवारी छोटी रखें और फ़ोटो के लिए ज़बरदस्ती न करें।", "जानवरों के प्रति दया अच्छी कोडई याद का हिस्सा है।"]],

  ["kodai-cycling-safety", ["Experiences", "Safety"], 4,
    ["Cycling safety on Kodai roads", "கொடை சாலைகளில் சைக்கிள் பாதுகாப்பு", "कोडई सड़कों पर साइक्लिंग सुरक्षा"],
    ["Visibility, mist, and when to walk instead.", "தெரிவுநிலை, மூடுபனி, எப்போது நடப்பது.", "दृश्यता, कोहरा, कब पैदल चलें।"],
    ["Wear visible colours and keep to the side on shared roads.", "Skip cycling when fog is thick or light is fading.", "Gentle town loops are safer than steep cliff roads for beginners."],
    ["தெளிவான நிறங்கள் அணிந்து பகிர்ந்த சாலைகளில் ஓரமாக இருங்கள்.", "மூடுபனி அடர்ந்தாலோ ஒளி மங்கினாலோ சைக்கிளைத் தவிர்க்கவும்.", "தொடக்கநிலையாளர்களுக்கு செங்குத்து பாறை சாலைகளை விட மென்மையான நகரச் சுற்றுகள் பாதுகாப்பானவை."],
    ["दिखने वाले रंग पहनें और साझा सड़कों पर किनारे रहें।", "घना कोहरा या कम रोशनी हो तो साइक्लिंग छोड़ दें।", "शुरुआती लोगों के लिए खड़ी चट्टानी सड़कों से नरम शहर लूप सुरक्षित हैं।"]],

  ["kodai-trekking-shoes", ["Adventure", "Tips"], 3,
    ["Trekking shoes that work in Kodai", "கொடையில் வேலை செய்யும் ட்ரெக் காலணி", "कोडई में काम आने वाले ट्रेकिंग जूते"],
    ["Grip, ankle support, and rain readiness.", "பிடிப்பு, கணுக்கால் ஆதரவு, மழை தயார்நிலை.", "ग्रिप, टखने सपोर्ट, बारिश तैयारी।"],
    ["Choose shoes with real grip for pine needles and wet rock.", "Break them in before the trip to avoid blisters on viewpoint days.", "Fashion sneakers are a common regret on Dolphin’s Nose paths."],
    ["பைன் ஊசி இலைகள் மற்றும் ஈரப் பாறைக்கு உண்மையான பிடிப்புள்ள காலணி தேர்வு செய்யுங்கள்.", "காட்சி நாட்களில் கொப்புளம் தவிர்க்க பயணத்திற்கு முன் அணியுங்கள்.", "டால்பின் நோஸ் பாதைகளில் ஃபேஷன் ஸ்னீக்கர்கள் பொதுவான வருத்தம்."],
    ["पाइन सुइयों और गीली चट्टान के लिए असली ग्रिप वाले जूते चुनें।", "व्यूपॉइंट दिनों में छाले से बचने के लिए ट्रिप से पहले तोड़ें।", "डॉल्फिन नोज़ रास्तों पर फ़ैशन स्नीकर्स अक्सर पछतावा बनते हैं।"]],

  ["kodai-first-aid-kit", ["Safety", "Tips"], 3,
    ["A small first-aid kit for the hills", "மலைகளுக்குச் சிறிய முதலுதவிப் பெட்டி", "पहाड़ियों के लिए छोटी फ़र्स्ट-एड किट"],
    ["Basics that save a day for families.", "குடும்பங்களுக்கு ஒரு நாளைக் காப்பாற்றும் அடிப்படைகள்.", "परिवारों के लिए दिन बचाने वाली बुनियादी चीज़ें।"],
    ["Pack plasters, antiseptic, ORS, basic medicines you already use, and child doses if needed.", "Include sunscreen and lip balm for windy ridges.", "Know the nearest pharmacy to your stay on arrival day."],
    ["பிளாஸ்டர், கிருமிநாசினி, ORS, நீங்கள் ஏற்கனவே பயன்படுத்தும் அடிப்படை மருந்துகள், தேவையானால் குழந்தை அளவு எடுங்கள்.", "காற்று முகட்டுக்கு சன்ஸ்கிரீன் மற்றும் லிப் பாம் சேர்க்கவும்.", "வருகை நாளில் தங்கலுக்கு அருகிலுள்ள மருந்தகத்தை அறியுங்கள்."],
    ["प्लास्टर, एंटीसेप्टिक, ORS, आपके इस्तेमाल की बुनियादी दवाएँ, ज़रूरत हो तो बच्चों की खुराक रखें।", "हवादार चोटियों के लिए सनस्क्रीन और लिप बाम जोड़ें।", "आगमन दिन ठहराव के पास की फ़ार्मेसी जान लें।"]],

  ["kodai-altitude-feel", ["Tips", "Guides"], 4,
    ["How the altitude feels in Kodaikanal", "கொடையில் உயரம் எப்படி உணரப்படும்", "कोडई में ऊँचाई कैसी लगती है"],
    ["Cooler air, slower climbs, gentle first day.", "குளிர் காற்று, மெதுவான ஏற்றங்கள், மென்மையான முதல் நாள்.", "ठंडी हवा, धीमी चढ़ाई, नरम पहला दिन।"],
    ["At around 2000m, the air feels cooler and walks can tire you faster than the plains.", "Keep day one lighter after the road climb.", "Hydrate and pace stairs for elders and children."],
    ["சுமார் 2000மீ உயரத்தில் காற்று குளிர்ச்சியாக இருக்கும்; சமவெளியை விட நடை விரைவில் சோரச் செய்யும்.", "சாலை ஏற்றத்திற்குப் பின் முதல் நாளை இலகுவாக வையுங்கள்.", "பெரியவர்கள் மற்றும் குழந்தைகளுக்கு நீரேற்றம் செய்து படிகளை மெதுவாக்குங்கள்."],
    ["लगभग 2000मी पर हवा ठंडी लगती है; मैदान से सैर जल्दी थका सकती है।", "सड़क चढ़ाई के बाद पहला दिन हल्का रखें।", "बुज़ुर्गों और बच्चों के लिए हाइड्रेट रहें और सीढ़ियाँ धीमी करें।"]],

  ["kodai-local-guides", ["Guides", "Tips"], 4,
    ["When a local guide helps in Kodai", "கொடையில் உள்ளூர் வழிகாட்டி எப்போது உதவும்", "कोडई में लोकल गाइड कब मदद करता है"],
    ["Treks, forest rules, and hidden calm.", "ட்ரெக்குகள், வன விதிகள், மறைந்த அமைதி.", "ट्रेक, वन नियम, छिपी शांति।"],
    ["Guides help on treks, permit areas, and when mist hides the path.", "They also know which viewpoints are crowded at which hour.", "Canaan packages include trusted local hosting where it matters."],
    ["ட்ரெக், அனுமதி பகுதிகள், மூடுபனி பாதையை மறைக்கும்போது வழிகாட்டிகள் உதவுவார்கள்.", "எந்த நேரத்தில் எந்த காட்சி கூட்டமாக இருக்கும் என்பதையும் அவர்கள் அறிவார்கள்.", "கானான் பேக்கேஜ்களில் தேவையான இடங்களில் நம்பக உள்ளூர் வழிகாட்டல் உண்டு."],
    ["ट्रेक, परमिट क्षेत्र और जब कोहरा रास्ता छुपाए, गाइड मदद करते हैं।", "वे यह भी जानते हैं किस घंटे कौन सा व्यूपॉइंट भीड़ भरा है।", "कनान पैकेज में जहाँ ज़रूरी हो भरोसेमंद लोकल होस्टिंग शामिल है।"]],

  ["kodai-picnic-spots", ["Family", "Nature"], 4,
    ["Picnic-friendly spots near Kodai", "கொடை அருகில் பிக்னிக் இடங்கள்", "कोडई के पास पिकनिक स्पॉट"],
    ["Open greens, shade, and clean-up rules.", "திறந்த பசுமை, நிழல், சுத்தம் விதிகள்.", "खुली हरियाली, छाँव, सफ़ाई नियम।"],
    ["Open meadows and quieter lake edges work well for short picnics.", "Carry bags for trash and leave no food waste behind.", "Avoid cliff edges for picnic setups with children."],
    ["திறந்த புல்வெளிகளும் அமைதியான ஏரி விளிம்புகளும் குறுகிய பிக்னிக்குக்கு ஏற்றவை.", "குப்பைப் பைகள் எடுத்து உணவுக் கழிவை விட்டுச் செல்ல வேண்டாம்.", "குழந்தைகளுடன் பாறை விளிம்பில் பிக்னிக் அமைப்பைத் தவிர்க்கவும்."],
    ["खुले मैदान और शांत झील किनारे छोटी पिकनिक के लिए अच्छे हैं।", "कचरे के थैले रखें और खाने का कचरा न छोड़ें।", "बच्चों के साथ चट्टानी किनारे पर पिकनिक न लगाएँ।"]],

  ["kodai-birding-morning", ["Nature", "Experiences"], 4,
    ["Gentle birding mornings in Kodai", "கொடையில் மென்மையான பறவை பார்க்கும் காலைகள்", "कोडई में नरम बर्डिंग सुबहें"],
    ["Quiet paths, binoculars, and soft steps.", "அமைதியான பாதைகள், தொலைநோக்கி, மென்மையான அடிகள்.", "शांत रास्ते, दूरबीन, नरम कदम।"],
    ["Early hours on quiet forest edges can reward patient listeners.", "Keep voices low and stay on known paths.", "A guide adds safety and better spotting for beginners."],
    ["அமைதியான காடு விளிம்புகளில் காலை நேரம் பொறுமையான கேட்போருக்கு பலன் தரும்.", "குரலைக் குறைவாக வைத்து அறியப்பட்ட பாதைகளில் இருங்கள்.", "தொடக்கநிலையாளர்களுக்கு வழிகாட்டி பாதுகாப்பும் சிறந்த பார்வையும் தரும்."],
    ["शांत जंगल किनारों पर सुबह धैर्यवान सुनने वालों को इनाम दे सकती है।", "आवाज़ धीमी रखें और जाने-माने रास्तों पर रहें।", "शुरुआती लोगों के लिए गाइड सुरक्षा और बेहतर स्पॉटिंग देता है।"]],

  ["kodai-mushroom-season-note", ["Nature", "Seasons"], 3,
    ["Monsoon greens and forest floor notes", "மழைப் பசுமை மற்றும் காடு தரை குறிப்புகள்", "मानसून हरियाली और जंगल ज़मीन नोट्स"],
    ["Look, don’t pick — respect the forest.", "பாருங்கள், பறிக்காதீர்கள் — காட்டை மதிக்கவும்.", "देखें, न तोड़ें — जंगल का सम्मान करें।"],
    ["Monsoon brings lush forest floors — admire without disturbing plants or fungi.", "Stay on paths to protect the undergrowth and yourself from slips.", "Nature photography works better than collecting."],
    ["மழை காடு தரையைச் செழிப்பாக்கும் — தாவரங்களையோ பூஞ்சைகளையோ தொந்தரவு செய்யாமல் பாருங்கள்.", "அடியில் வளர்ச்சியையும் உங்கள் வழுக்கலையும் காக்க பாதைகளில் இருங்கள்.", "சேகரிப்பை விட இயற்கை புகைப்படம் சிறந்தது."],
    ["मानसून जंगल ज़मीन हरी-भरी करता है — पौधों या कवक को छेड़े बिना देखें।", "अंडरग्रोथ और फिसलन से बचाव के लिए रास्तों पर रहें।", "इकट्ठा करने से नेचर फ़ोटोग्राफ़ी बेहतर है।"]],

  ["kodai-chocolate-trail", ["Food", "Shopping"], 4,
    ["A simple homemade chocolate trail", "எளிய வீட்டு சாக்லேட் பாதை", "सरल होममेड चॉकलेट ट्रेल"],
    ["Taste a few, buy what travels well.", "சிலவற்றைச் சுவைத்து, பயணிக்கும்தை வாங்கவும்.", "कुछ चखें, जो यात्रा सहे वही खरीदें।"],
    ["Try small samples before buying boxes for gifts.", "Soft centres melt on the plains — choose firmer options for long travel.", "One quality shop is better than five rushed counters."],
    ["பரிசுப் பெட்டிக்கு முன் சிறிய மாதிரிகளைச் சுவையுங்கள்.", "மென்மையான மையங்கள் சமவெளியில் உருகும் — நீண்ட பயணத்திற்கு உறுதியானவை தேர்வு செய்யுங்கள்.", "ஐந்து அவசர கவுண்டர்களை விட ஒரு தரமான கடை சிறந்தது."],
    ["तोहफ़े के डिब्बे से पहले छोटे सैंपल चखें।", "नरम सेंटर मैदान में पिघलते हैं — लंबी यात्रा के लिए सख़्त विकल्प चुनें।", "पाँच जल्दबाज़ी काउंटर से एक क्वालिटी दुकान बेहतर है।"]],

  ["kodai-spice-shopping", ["Shopping", "Food"], 3,
    ["Spices and oils: buy with sense", "மசாலா மற்றும் எண்ணெய்: விவேகமாக வாங்க", "मसाले और तेल: समझदारी से खरीदें"],
    ["Sealed packs, fair weight, useful gifts.", "சீல் பொட்டலங்கள், நியாய எடை, பயனுள்ள பரிசுகள்.", "सील पैक, सही वज़न, काम के तोहफे।"],
    ["Prefer sealed spice and oil packs from trusted counters.", "Buy only what you will cook with at home.", "Eucalyptus oil remains a popular takeaway — check seals."],
    ["நம்பக கவுண்டர்களில் சீல் செய்யப்பட்ட மசாலா மற்றும் எண்ணெய் பொட்டலங்களை விரும்புங்கள்.", "வீட்டில் சமைக்கும் அளவுக்கு மட்டும் வாங்கவும்.", "யூகலிப்டஸ் எண்ணெய் பிரபல எடுத்துச் செல்வது — சீலைப் பாருங்கள்."],
    ["भरोसेमंद काउंटर से सील मसाला और तेल पैक लें।", "घर पर पकाने जितना ही खरीदें।", "यूकेलिप्टस तेल लोकप्रिय टेकअवे है — सील जाँचें।"]],

  ["kodai-souvenir-mistakes", ["Shopping", "Tips"], 3,
    ["Souvenir mistakes to avoid in Kodai", "கொடையில் தவிர்க்க வேண்டிய நினைவுப் பொருள் தவறுகள்", "कोडई में बचने वाली सौvenir गलतियाँ"],
    ["Buy less, choose better, leave space in the bag.", "குறைவாக வாங்கி சிறப்பாகத் தேர்ந்தெடுத்து பையில் இடம் விடுங்கள்.", "कम खरीदें, बेहतर चुनें, बैग में जगह छोड़ें।"],
    ["Impulse buys fill bags and disappoint later — set a budget first.", "Skip fragile items if you have a long descent and multiple stops.", "Chocolates and sealed oils travel better than glass clutter."],
    ["அவசர வாங்குதல் பையை நிரப்பி பின்னர் ஏமாற்றும் — முதலில் பட்ஜெட் வையுங்கள்.", "நீண்ட இறக்கம் மற்றும் பல நிறுத்தங்கள் இருந்தால் உடையக்கூடியவை தவிர்க்கவும்.", "கண்ணாடி குப்பைகளை விட சாக்லேட்டும் சீல் எண்ணெயும் சிறப்பாகப் பயணிக்கும்."],
    ["जल्दबाज़ी खरीद बैग भरती है और बाद में निराश करती है — पहले बजट तय करें।", "लंबी उतरन और कई स्टॉप हों तो नाज़ुक चीज़ें छोड़ दें।", "कांच के झंझट से चॉकलेट और सील तेल बेहतर यात्रा करते हैं।"]],

  ["kodai-stay-near-lake", ["Stays", "Guides"], 4,
    ["Pros of staying near the lake", "ஏரி அருகில் தங்குவதன் நன்மைகள்", "झील के पास ठहरने के फ़ायदे"],
    ["Walkability, evenings, and market access.", "நடை வசதி, மாலைகள், சந்தை அணுகல்.", "पैदल सुविधा, शामें, बाज़ार पहुँच।"],
    ["Lake-side stays make evening walks and cafes easy without a car each time.", "Expect more activity and sound than quiet outskirts.", "Good for short trips where you want everything close."],
    ["ஏரி அருகில் தங்குவது ஒவ்வொரு முறையும் வாகனம் இல்லாமல் மாலை நடை மற்றும் காஃபேக்களை எளிதாக்கும்.", "அமைதியான புறநகரை விட அதிக செயல்பாடும் சத்தமும் எதிர்பார்க்கலாம்.", "எல்லாம் அருகில் வேண்டும் குறுகிய பயணங்களுக்கு நல்லது."],
    ["झील किनारे ठहराव हर बार गाड़ी के बिना शाम सैर और कैफ़े आसान बनाते हैं।", "शांत बाहरी इलाके से ज़्यादा गतिविधि और आवाज़ की उम्मीद करें।", "छोटी ट्रिप जहाँ सब पास चाहिए, उनके लिए अच्छा।"]],

  ["kodai-stay-outskirts", ["Stays", "Tips"], 4,
    ["Why outskirts stays feel more like Kodai", "புறநகர் தங்கல் ஏன் அதிக கொடை போல் இருக்கும்", "बाहरी ठहराव कोडई जैसा क्यों लगता है"],
    ["Quiet nights, valley air, slower mornings.", "அமைதியான இரவுகள், பள்ளத்தாக்கு காற்று, மெதுவான காலைகள்.", "शांत रातें, घाटी हवा, धीमी सुबहें।"],
    ["Outskirts stays trade walkability for silence and often better views.", "You will need a vehicle plan for town and viewpoints.", "Ideal for honeymoon and luxury travellers seeking privacy."],
    ["புறநகர் தங்கல் நடை வசதியை அமைதிக்கும் பெரும்பாலும் சிறந்த காட்சிக்கும் மாற்றும்.", "நகரம் மற்றும் காட்சிகளுக்கு வாகனத் திட்டம் தேவை.", "தனியுரிமை தேடும் தேனிலவு மற்றும் லக்ஸரி பயணிகளுக்கு ஏற்றது."],
    ["बाहरी ठहराव पैदल सुविधा के बदले सन्नाटा और अक्सर बेहतर नज़ारा देते हैं।", "शहर और व्यूपॉइंट के लिए वाहन प्लान चाहिए।", "निजता चाहने वाले हनीमून और लक्ज़री यात्रियों के लिए आदर्श।"]],

  ["kodai-hot-water-check", ["Stays", "Tips"], 2,
    ["Ask about hot water before you book", "முன்பதிவுக்கு முன் சூடான நீர் பற்றி கேளுங்கள்", "बुक करने से पहले गर्म पानी पूछें"],
    ["A small detail that changes winter mornings.", "குளிர்கால காலைகளை மாற்றும் சிறிய விவரம்.", "सर्द सुबह बदल देने वाली छोटी बात।"],
    ["Confirm hot water timing and heating type for winter and monsoon trips.", "Families with children feel this detail most.", "Canaan checks these practical stay points when curating packages."],
    ["குளிர் மற்றும் மழைப் பயணங்களுக்கு சூடான நீர் நேரம் மற்றும் வெப்ப வகையை உறுதிப்படுத்துங்கள்.", "குழந்தைகளுடன் குடும்பங்கள் இந்த விவரத்தை அதிகம் உணரும்.", "பேக்கேஜ் தேர்வில் கானான் இந்த நடைமுறை தங்கல் புள்ளிகளைச் சரிபார்க்கும்."],
    ["सर्द और मानसून ट्रिप के लिए गर्म पानी समय और हीटिंग प्रकार पुष्टि करें।", "बच्चों वाले परिवार यह विवरण सबसे ज़्यादा महसूस करते हैं।", "पैकेज चुनते समय कनान ये प्रैक्टिकल ठहराव पॉइंट जाँचता है।"]],

  ["kodai-early-checkout-plan", ["Travel", "Tips"], 3,
    ["Early checkout and soft descent plans", "முன்கூட்டிய சரிபார்ப்பு மற்றும் மென்மையான இறக்கம்", "जल्दी चेकआउट और नरम उतरन"],
    ["Leave buffer for fog and hairpin patience.", "மூடுபனி மற்றும் வளைவு பொறுமைக்கு இடம் விடுங்கள்.", "कोहरे और मोड़ों के धैर्य के लिए बफ़र छोड़ें।"],
    ["Build extra time into descent mornings in case fog slows the road.", "Eat a proper breakfast before long curves.", "Private transfers help you leave without rushing the last Kodai hour."],
    ["மூடுபனி சாலையை மெதுவாக்கினால் இறங்கும் காலைகளில் கூடுதல் நேரம் வையுங்கள்.", "நீண்ட வளைவுகளுக்கு முன் முறையான காலை உணவு சாப்பிடுங்கள்.", "தனியார் பயணம் கடைசி கொடை மணி நேரத்தை அவசரப்படுத்தாமல் புறப்பட உதவும்."],
    ["कोहरा सड़क धीमी करे तो उतरन सुबह में अतिरिक्त समय रखें।", "लंबे मोड़ों से पहले सही नाश्ता करें।", "प्राइवेट ट्रांसफर आख़िरी कोडई घंटे को हड़बड़ी के बिना छोड़ने में मदद करता है।"]],

  ["kodai-weekend-vs-weekday", ["Guides", "Tips"], 4,
    ["Weekend vs weekday Kodai: what changes", "வார இறுதி vs வாரநாள் கொடை: என்ன மாறும்", "वीकेंड बनाम वीकडे कोडई: क्या बदलता है"],
    ["Crowds, prices, and quieter paths.", "கூட்டம், விலை, அமைதியான பாதைகள்.", "भीड़, कीमतें, शांत रास्ते।"],
    ["Weekends bring more lake traffic and fuller cafes.", "Weekdays often feel softer for photography and walks.", "If you must visit on a weekend, start viewpoints early."],
    ["வார இறுதியில் ஏரி போக்குவரத்தும் நிறைந்த காஃபேக்களும் அதிகம்.", "புகைப்படம் மற்றும் நடைக்கு வாரநாட்கள் பெரும்பாலும் மென்மையாக இருக்கும்.", "வார இறுதியில் செல்ல வேண்டுமானால் காட்சிகளைக் காலையில் தொடங்குங்கள்."],
    ["वीकेंड पर झील ट्रैफ़िक और भरे कैफ़े ज़्यादा होते हैं।", "फ़ोटोग्राफ़ी और सैर के लिए वीकडे अक्सर नरम लगते हैं।", "अगर वीकेंड ही जाना है तो व्यूपॉइंट जल्दी शुरू करें।"]],

  ["kodai-one-week-slow", ["Itinerary", "Luxury"], 7,
    ["One slow week in Kodaikanal", "கொடையில் ஒரு மெதுவான வாரம்", "कोडई में एक धीमा हफ़्ता"],
    ["Repeat favourite places at different hours.", "பிடித்த இடங்களை வெவ்வேறு நேரத்தில் மீண்டும் காணுங்கள்.", "पसंदीदा जगहें अलग घंटों में दोबारा देखें।"],
    ["A week lets you see the lake at dawn and dusk without rushing Berijam.", "Leave two half-days completely open for mist and mood.", "Canaan longer packages are built for this deep stay feeling."],
    ["ஒரு வாரம் பெரியத்தை அவசரப்படுத்தாமல் ஏரியை விடியலும் அஸ்தமனமும் காண உதவும்.", "மூடுபனி மற்றும் மனநிலைக்கு இரண்டு அரை நாட்களை முழுவதுமாகத் திறந்து வையுங்கள்.", "கானானின் நீண்ட பேக்கேஜ்கள் இந்த ஆழத் தங்கல் உணர்விற்கே."],
    ["एक हफ़्ता बेरिजाम हड़बड़ी के बिना झील को सुबह-शाम देखने देता है।", "कोहरे और मूड के लिए दो आधे दिन पूरी तरह खुले छोड़ें।", "कनान के लंबे पैकेज इसी गहरे ठहराव अहसास के लिए बने हैं।"]],

  ["kodai-micro-trip-36-hours", ["Itinerary", "Guides"], 5,
    ["A 36-hour Kodai micro trip", "36 மணி நேர கொடை மைக்ரோ பயணம்", "36 घंटे की कोडई माइक्रो ट्रिप"],
    ["Arrive, breathe, one circuit, soft exit.", "வருகை, மூச்சு, ஒரு சுற்று, மென்மையான வெளியேற்றம்.", "आगमन, साँस, एक सर्किट, नरम निकास।"],
    ["Hour 1–12: settle and lake walk. Hour 12–24: one viewpoint + pine. Hour 24–36: soft morning and descent.", "Do not add Berijam into 36 hours unless you skip rest.", "Kodai Escape is designed around this short reset."],
    ["1–12 மணி: தங்கி ஏரி நடை. 12–24: ஒரு காட்சி + பைன். 24–36: மென்மையான காலை மற்றும் இறக்கம்.", "ஓய்வைத் தவிர்க்காவிட்டால் 36 மணியில் பெரியத்தைச் சேர்க்க வேண்டாம்.", "Kodai Escape இந்தக் குறுகிய மீட்டெடுப்பைச் சுற்றி வடிவமைக்கப்பட்டது."],
    ["1–12 घंटे: बसना और झील सैर। 12–24: एक व्यूपॉइंट + पाइन। 24–36: नरम सुबह और उतरन।", "आराम छोड़ें तभी 36 घंटे में बेरिजाम जोड़ें।", "Kodai Escape इसी छोटे रीसेट के आसपास बना है।"]],

  ["canaan-enquire-what-to-share", ["Guides", "Canaan"], 4,
    ["What to share when you enquire with Canaan", "கானானிடம் விசாரிக்கும்போது என்ன பகிர வேண்டும்", "कनान से पूछताछ में क्या बताएँ"],
    ["Dates, travellers, pace, and must-see wishes.", "தேதிகள், பயணிகள், வேகம், காண வேண்டியவை.", "तारीखें, यात्री, रफ्तार, ज़रूरी इच्छाएँ।"],
    ["Share travel dates, number of travellers, ages if children or elders, and preferred pace.", "Mention must-see places and must-avoid (steep treks, crowds).", "We reply with a clear package fit and next steps."],
    ["பயணத் தேதிகள், பயணிகள் எண்ணிக்கை, குழந்தை/பெரியவர் வயது, விருப்ப வேகம் பகிருங்கள்.", "காண வேண்டிய இடங்களையும் தவிர்க்க வேண்டியவையும் (செங்குத்து ட்ரெக், கூட்டம்) சொல்லுங்கள்.", "தெளிவான பேக்கேஜ் பொருத்தம் மற்றும் அடுத்த அடிகளுடன் பதிலளிப்போம்."],
    ["यात्रा तारीखें, यात्रियों की संख्या, बच्चों/बुज़ुर्गों की उम्र, पसंदीदा रफ्तार बताएँ।", "ज़रूरी जगहें और बचने योग्य (खड़ी ट्रेक, भीड़) लिखें।", "हम स्पष्ट पैकेज फ़िट और अगले कदम के साथ जवाब देते हैं।"]],
];

// Fix tags that reference missing TAG keys
const TAG_FIX = {
  Group: { en: "Group", ta: "குழு", hi: "ग्रुप" },
  Solo: { en: "Solo", ta: "தனியாக", hi: "सोलो" },
  Packing: { en: "Packing", ta: "பேக்கிங்", hi: "पैकिंग" },
  Walks: { en: "Walks", ta: "நடைகள்", hi: "सैर" },
  Lake: { en: "Lake", ta: "ஏரி", hi: "झील" },
  Canaan: { en: "Canaan", ta: "கானான்", hi: "कनान" },
  Luxury: { en: "Luxury", ta: "ஆடம்பரம்", hi: "लक्ज़री" },
};
Object.assign(TAG, TAG_FIX);

const existing = new Set(db.rows.map((r) => r.slug));
const startIndex = db.rows.length;
let added = 0;

for (let i = 0; i < NEW.length; i++) {
  const [slug, tagKeys, mins, title, excerpt, bodyEn, bodyTa, bodyHi] = NEW[i];
  if (existing.has(slug)) continue;
  if (bodyEn.length !== bodyTa.length || bodyEn.length !== bodyHi.length) {
    throw new Error(`Body length mismatch for ${slug}`);
  }
  db.rows.push({
    id: slug,
    slug,
    date: dateFrom(i),
    readMinutes: mins,
    image: img(startIndex + i),
    tags: tags(...tagKeys),
    title: { en: title[0], ta: title[1], hi: title[2] },
    excerpt: { en: excerpt[0], ta: excerpt[1], hi: excerpt[2] },
    body: { en: bodyEn, ta: bodyTa, hi: bodyHi },
  });
  existing.add(slug);
  added++;
}

db.version = 2;
writeFileSync(blogsPath, JSON.stringify(db, null, 2));
console.log(`Added ${added} posts. Total now: ${db.rows.length}`);
