/**
 * Upsert a curated set of substantial travel guides (featured editorial library).
 * Does NOT invent prices, hotels, or fake testimonials.
 *
 * Usage: node prisma/seed-editorial-guides.mjs
 */
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function paras(...blocks) {
  return JSON.stringify(blocks);
}

function tags(...items) {
  return JSON.stringify(items);
}

function L(en, ta, hi) {
  return { en, ta, hi };
}

const guides = [
  {
    slug: "complete-kodaikanal-travel-guide",
    destinationSlug: "kodaikanal",
    image: "/images/travel/d/kodaikanal.jpg",
    readMinutes: 14,
    date: "2026-03-01",
    tags: ["Kodaikanal", "Hill station", "Guide"],
    title: L(
      "Complete Kodaikanal Travel Guide",
      "முழுமையான கொடைக்கானல் பயண வழிகாட்டி",
      "संपूर्ण कोडाइकनाल यात्रा गाइड",
    ),
    excerpt: L(
      "How to plan a Kodaikanal trip: when to go, how to reach, what to see, and how Canaan structures packages without inventing unverified hotel rates.",
      "கொடைக்கானல் பயணத் திட்டம்: எப்போது செல்வது, எப்படி செல்வது, என்ன பார்ப்பது.",
      "कोडाइकनाल यात्रा योजना: कब जाएँ, कैसे पहुँचें, क्या देखें।",
    ),
    bodyEn: [
      "Kodaikanal is a South Indian hill station known for mist, pine forests, and a star-shaped lake. This guide is written for travellers who want practical planning notes — not inflated word count or invented prices.",
      "Quick facts: Kodaikanal sits in Tamil Nadu’s Western Ghats. Peak season is typically cooler months and long weekends. Shoulder weeks can feel quieter. Exact weather and road conditions change — check forecasts before you travel.",
      "How to reach: Most travellers arrive via Madurai or Coimbatore, then continue by road to Kodaikanal. Kodai Road railhead is another common pattern. Canaan can help coordinate transfers after you share dates and passenger count.",
      "Best time to visit: Cooler months suit lake walks and viewpoints. Monsoon weeks can be beautiful but misty and wet — pack layers and non-slip shoes. Festival weekends fill stays quickly.",
      "Places worth planning around: Kodaikanal Lake, Coaker’s Walk, Pillar Rocks, pine forest stretches, and valley viewpoints. Exact stop order depends on your stay location and daylight.",
      "Suggested pacing: Day 1 arrival and lake orientation. Day 2 classic valley viewpoints at a family-friendly pace. Day 3 pines and quieter ridges. Longer stays allow slower mornings.",
      "Budget considerations: Stay category, vehicle type, and season drive cost more than any generic “average trip” number. Canaan publishes a verified 1N/2D package with clear per-person tiers; longer trips are enquiry-quoted after checking availability.",
      "Transport tips: Private vehicles are common for sightseeing. Share whether you prefer a compact car or a larger MUV for family groups. Night driving on hill roads needs caution.",
      "Accommodation approach: Prefer stays that make early viewpoint starts practical. We confirm properties only after checking your dates — we do not invent hotel names as fixed inventory.",
      "Food: Local vegetarian meals and café stops are easy to fold into a day plan. Tell Canaan about dietary needs when you enquire.",
      "Common mistakes: Overpacking stops into one day, arriving without warm layers, and expecting every viewpoint to be clear in heavy mist.",
      "FAQs: Is one night enough? For a first taste, yes — our published 1N/2D package is built for that. Want a longer family stay? Ask for the enquiry scenic itinerary.",
      "Related next steps: Browse Kodaikanal packages, or enquire with dates for a custom plan. Canaan replies with a clear next step — not pressure booking.",
    ],
  },
  {
    slug: "best-time-to-visit-kodaikanal",
    destinationSlug: "kodaikanal",
    image: "/images/kodai/real/sea-of-clouds.jpg",
    readMinutes: 8,
    date: "2026-03-02",
    tags: ["Kodaikanal", "Best time"],
    title: L(
      "Best Time to Visit Kodaikanal",
      "கொடைக்கானல் செல்ல சிறந்த நேரம்",
      "कोडाइकनाल जाने का सबसे अच्छा समय",
    ),
    excerpt: L(
      "Season-by-season notes for mist, crowds, and packing — without fake climate guarantees.",
      "மூடுபனி, கூட்டம் மற்றும் பேக்கிங் குறிப்புகள்.",
      "धुंध, भीड़ और पैकिंग नोट्स।",
    ),
    bodyEn: [
      "There is no single perfect week for every traveller. Cooler months favour clear-ish viewpoints and comfortable evening walks. Holiday weekends bring more visitors to the lake and Coaker’s Walk.",
      "Summer school holidays can feel busier. If you want quieter trails, aim for mid-week stays when possible.",
      "Monsoon brings lush greens and dramatic cloud seas — also slippery paths. Pack rain protection and allow flexible sightseeing.",
      "Winter evenings can be cold relative to the plains. Carry a warm layer even if daytime feels mild.",
      "How Canaan helps: share your preferred month and we will suggest package pacing or an enquiry itinerary that matches season realities.",
    ],
  },
  {
    slug: "kodaikanal-2-day-itinerary",
    destinationSlug: "kodaikanal",
    image: "/images/travel/p/kodaikanal/kodai-lake.jpg",
    readMinutes: 9,
    date: "2026-03-03",
    tags: ["Kodaikanal", "Itinerary"],
    title: L(
      "Kodaikanal 2-Day Itinerary",
      "கொடைக்கானல் 2 நாள் திட்டம்",
      "कोडाइकनाल 2-दिन की यात्रा योजना",
    ),
    excerpt: L(
      "A realistic 1 night / 2 days shape that matches Canaan’s published Kodai package pacing.",
      "வெளியிட்ட கொடை பேக்கேஜ் வேகத்துடன் ஒத்திருக்கும் திட்டம்.",
      "प्रकाशित कोडाई पैकेज गति से मेल खाती योजना।",
    ),
    bodyEn: [
      "Day 1: Arrive, check in, and keep the evening gentle — lake-side orientation works well after a road climb.",
      "Day 2: Valley tour stops at a sustainable pace, then departure as planned. Do not force every viewpoint if mist is heavy.",
      "Meals: Breakfast and dinner are included on Canaan’s published 1N/2D tiers; confirm your tier when you enquire.",
      "Customise: Families with young children may prefer fewer stops and longer café breaks — tell us when you message.",
    ],
  },
  {
    slug: "complete-darjeeling-travel-guide",
    destinationSlug: "darjeeling",
    image: "/images/travel/d/darjeeling.jpg",
    readMinutes: 15,
    date: "2026-03-04",
    tags: ["Darjeeling", "Himalaya", "Guide"],
    title: L(
      "Complete Darjeeling Travel Guide",
      "முழுமையான டார்ஜீலிங் பயண வழிகாட்டி",
      "संपूर्ण दार्जिलिंग यात्रा गाइड",
    ),
    excerpt: L(
      "NJP arrivals, tea country pacing, Tiger Hill weather caveats, and how Canaan’s published 3N/4D tours differ from enquiry tea experiences.",
      "NJP வருகை, தேயிலை நாடு, டைகர் ஹில் குறிப்புகள்.",
      "NJP आगमन, चाय देश, टाइगर हिल नोट्स।",
    ),
    bodyEn: [
      "Darjeeling combines Himalayan viewpoints, tea estates, and a historic hill town. Plan around weather — Kanchenjunga views are never guaranteed.",
      "How to reach: Most packages use New Jalpaiguri (NJP) or Bagdogra as gateways, then a mountain transfer into Darjeeling. Share your train/flight arrival when you enquire.",
      "Best time: Clearer winter mornings can favour Tiger Hill, but cold is real. Shoulder seasons balance comfort and crowds differently.",
      "Core experiences: Tiger Hill sunrise attempt, Mall Road, Batasia Loop / Toy Train segments when seats exist, tea estate visits, Peace Pagoda, and Mirik as a return-route option on some itineraries.",
      "Published vs enquiry: Canaan publishes fixed-start 3N/4D programmes with Mimbusty or Tabakoshi night bases and transparent starting prices. Tea-emphasised stays can be quoted separately after dates are known.",
      "Transport: Dedicated Sumo / Bolero / Innova class vehicles are common — availability depends on season. We confirm the vehicle class in your quote.",
      "Common mistakes: Expecting Toy Train seats without IRCTC confirmation, packing only light clothing in winter, and treating sunrise viewpoints as guaranteed photo opportunities.",
      "Next step: Compare the published Darjeeling packages, or enquire for a tea-country paced plan.",
    ],
  },
  {
    slug: "darjeeling-toy-train-guide",
    destinationSlug: "darjeeling",
    image: "/images/travel/p/darjeeling/batasia-loop.jpg",
    readMinutes: 10,
    date: "2026-03-05",
    tags: ["Darjeeling", "Toy Train"],
    title: L(
      "Darjeeling Toy Train Guide",
      "டார்ஜீலிங் டாய் ட்ரெய்ன் வழிகாட்டி",
      "दार्जिलिंग टॉय ट्रेन गाइड",
    ),
    excerpt: L(
      "What the Himalayan Railway experience involves — and why Canaan never invents confirmed berths.",
      "இமய ரயில் அனுபவம் — உறுதியற்ற இருக்கைகளை கண்டுபிடிக்க மாட்டோம்.",
      "हिमालय रेल अनुभव — काल्पनिक सीटें नहीं।",
    ),
    bodyEn: [
      "The Darjeeling Himalayan Railway is a heritage experience, not a casual hop-on hop-off guarantee.",
      "Seat availability depends on IRCTC / railway inventory. Canaan can attempt to include a Toy Train segment only when seats can be secured for your dates.",
      "If seats are unavailable, many itineraries still include Batasia Loop viewpoints and related photo stops without fabricating a train ride.",
      "Ask early if the Toy Train is a must-have for your group — we will answer honestly based on availability, not marketing slogans.",
    ],
  },
  {
    slug: "goa-travel-guide",
    destinationSlug: "goa",
    image: "/images/travel/d/goa.jpg",
    readMinutes: 12,
    date: "2026-03-06",
    tags: ["Goa", "Beach", "Guide"],
    title: L(
      "Goa Travel Guide for First-Time Visitors",
      "முதல் முறை கோவா பயணிகளுக்கான வழிகாட்டி",
      "पहली बार गोवा आने वालों के लिए गाइड",
    ),
    excerpt: L(
      "North vs South pacing, beach days, and enquiry-based stay planning without fake hotel lists.",
      "வடக்கு/தெற்கு வேகம் மற்றும் கடற்கரை நாட்கள்.",
      "उत्तर/दक्षिण गति और बीच दिन।",
    ),
    bodyEn: [
      "Goa is not one beach. North belts tend to feel busier; South stretches often feel quieter — preferences vary by traveller.",
      "How to reach: Fly into Goa airports or arrive by train, then transfer to your stay belt. Canaan can coordinate after you share dates.",
      "Best time: Peak winter months are popular. Monsoon is greener and wetter — some water activities pause.",
      "Plan shape: Arrival evening, beach day, optional fort/heritage half-day, leisure day, departure. Exact beaches are chosen with you.",
      "Pricing: Canaan’s Goa package is enquiry-based. We quote stays and transfers only after checking live options — no invented catalogue rates.",
    ],
  },
  {
    slug: "best-time-to-visit-goa",
    destinationSlug: "goa",
    image: "/images/travel/p/goa/calangute.jpg",
    readMinutes: 7,
    date: "2026-03-07",
    tags: ["Goa", "Best time"],
    title: L(
      "Best Time to Visit Goa",
      "கோவா செல்ல சிறந்த நேரம்",
      "गोवा जाने का सबसे अच्छा समय",
    ),
    excerpt: L(
      "Peak, shoulder, and monsoon notes for beach travel planning.",
      "கடற்கரை பயணத்திற்கான பருவ குறிப்புகள்.",
      "बीच यात्रा के लिए मौसम नोट्स।",
    ),
    bodyEn: [
      "Cooler dry months are the classic beach window. Holiday weeks fill resorts and raise demand.",
      "Shoulder weeks can balance weather and crowds for some travellers.",
      "Monsoon is atmospheric but wet — confirm which outdoor plans remain practical.",
      "Share your month with Canaan and we will shape an enquiry quote around real availability.",
    ],
  },
  {
    slug: "delhi-travel-guide",
    destinationSlug: "delhi",
    image: "/images/travel/p/delhi/india-gate.jpg",
    readMinutes: 13,
    date: "2026-03-08",
    tags: ["Delhi", "Heritage", "Guide"],
    title: L(
      "Delhi Travel Guide",
      "டெல்லி பயண வழிகாட்டி",
      "दिल्ली यात्रा गाइड",
    ),
    excerpt: L(
      "Old Delhi energy, New Delhi icons, and realistic day pacing for first-time visitors.",
      "பழைய/புதிய டெல்லி மற்றும் நாள் வேகம்.",
      "पुरानी/नई दिल्ली और दिन की गति।",
    ),
    bodyEn: [
      "Delhi rewards travellers who accept that one day cannot cover every monument. Prioritise by interest: Mughal heritage, markets, or modern landmarks.",
      "How to reach: Major airport and railway hubs make Delhi a natural start for North India circuits.",
      "Heat, traffic, and Friday prayer timings around some sites affect pacing — build buffers.",
      "Pairing with Agra: Canaan offers an enquiry Delhi–Agra outline. Jaipur needs more time than a squeezed same-day add-on.",
      "Food and water: Choose reputable stops; share dietary needs when you enquire.",
    ],
  },
  {
    slug: "delhi-to-agra-travel-planning",
    destinationSlug: "delhi",
    image: "/images/travel/d/agra-taj-mahal.jpg",
    readMinutes: 10,
    date: "2026-03-09",
    tags: ["Delhi", "Agra", "Taj Mahal"],
    title: L(
      "Delhi to Agra Travel Planning",
      "டெல்லியிலிருந்து ஆக்ரா பயணத் திட்டம்",
      "दिल्ली से आगरा यात्रा योजना",
    ),
    excerpt: L(
      "Train vs road, Taj timing, and why early starts matter — without inventing ticket prices.",
      "ரயில் vs சாலை மற்றும் தாஜ் நேரம்.",
      "ट्रेन बनाम सड़क और ताज टाइमिंग।",
    ),
    bodyEn: [
      "An Agra day often starts early to catch favourable Taj entry windows. Exact ticket rules and fees change — confirm near travel dates.",
      "Transport: Train and private car are both common. Canaan confirms the mode after your enquiry, not before.",
      "Overnight Agra vs day return: Overnight can ease early Taj timing; day return can suit short trips. We help you choose based on energy and dates.",
      "Do not expect a Golden Triangle squeeze into four days without lengthening the itinerary honestly.",
    ],
  },
  {
    slug: "madurai-travel-guide",
    destinationSlug: "madurai",
    image: "/images/travel/p/madurai/meenakshi-temple.jpg",
    readMinutes: 12,
    date: "2026-03-10",
    tags: ["Madurai", "Temple", "Guide"],
    title: L(
      "Madurai Travel Guide",
      "மதுரை பயண வழிகாட்டி",
      "मदुरै यात्रा गाइड",
    ),
    excerpt: L(
      "Meenakshi Temple etiquette, heritage pacing, and optional Rameswaram extensions.",
      "மீனாட்சி கோயில் பழக்கங்கள் மற்றும் நீட்டிப்புகள்.",
      "मीनाक्षी मंदिर शिष्टाचार और विस्तार।",
    ),
    bodyEn: [
      "Madurai is centred culturally on the Meenakshi Amman Temple. Dress modestly and follow temple entry rules; photography rules can vary by zone.",
      "How to reach: Madurai has airport and railway connectivity. Many travellers combine Madurai with Rameswaram or Kanyakumari — distances need realistic time.",
      "Food: Madurai’s vegetarian traditions are a highlight for many visitors.",
      "Canaan’s Madurai package is enquiry-based. We confirm stays near practical temple access after checking dates.",
    ],
  },
  {
    slug: "meenakshi-temple-visit-guide",
    destinationSlug: "madurai",
    image: "/images/travel/p/madurai/meenakshi-temple.jpg",
    readMinutes: 9,
    date: "2026-03-11",
    tags: ["Madurai", "Meenakshi"],
    title: L(
      "Meenakshi Temple Visit Guide",
      "மீனாட்சி கோயில் பார்வை வழிகாட்டி",
      "मीनाक्षी मंदिर दर्शन गाइड",
    ),
    excerpt: L(
      "Practical visit notes: timing, dress, and respectful pacing.",
      "நேரம், உடை, மரியாதையான வேகம்.",
      "समय, पोशाक, सम्मानजनक गति।",
    ),
    bodyEn: [
      "Arrive with time buffers. Temple complexes are large; rushing reduces the experience.",
      "Dress code: Covered shoulders and legs are typically expected. Carry a light scarf or shawl if unsure.",
      "Special darshan options, if any, involve official fees — Canaan does not invent queue prices.",
      "Pair your temple morning with a paced heritage afternoon rather than stacking unrelated attractions.",
    ],
  },
  {
    slug: "bali-travel-guide-first-timers",
    destinationSlug: "bali",
    image: "/images/travel/p/bali/tegallalang.jpg",
    readMinutes: 14,
    date: "2026-03-12",
    tags: ["Bali", "International", "Guide"],
    title: L(
      "Bali Travel Guide for First-Time Visitors",
      "முதல் முறை பாலி பயணிகளுக்கான வழிகாட்டி",
      "पहली बार बाली आने वालों के लिए गाइड",
    ),
    excerpt: L(
      "Ubud culture + coastal balance, visa/flight honesty, and enquiry-only pricing.",
      "உபுட் + கடற்கரை சமநிலை மற்றும் விசா/விமான நேர்மை.",
      "उबुद + बीच संतुलन और वीज़ा/उड़ान ईमानदारी।",
    ),
    bodyEn: [
      "Bali rewards a split between cultural interiors (often Ubud-side) and coastal recovery days. Exact bases depend on your pace and budget.",
      "International planning requires verified flight and visa information. Canaan assists on request and only quotes after checking live options — never invented fares.",
      "Suggested shape: Arrive and settle, culture day, coastal transfer, leisure, departure.",
      "Temple etiquette and dress standards matter at sacred sites. Pack respectful clothing.",
      "Enquire with travel months and couple/family context so we can build a credible quote.",
    ],
  },
  {
    slug: "family-travel-planning-guide",
    destinationSlug: null,
    image: "/images/travel/p/kodaikanal/pine-forest.jpg",
    readMinutes: 11,
    date: "2026-03-13",
    tags: ["Family", "Planning"],
    title: L(
      "Family Travel Planning Guide",
      "குடும்ப பயணத் திட்ட வழிகாட்டி",
      "पारिवारिक यात्रा योजना गाइड",
    ),
    excerpt: L(
      "How to pace destinations, rooms, and transfers for mixed-age groups.",
      "வயது கலந்த குழுக்களுக்கு வேகம் மற்றும் அறைகள்.",
      "मिश्रित आयु समूहों के लिए गति और कमरे।",
    ),
    bodyEn: [
      "Family trips succeed when the schedule protects rest. Build shorter sightseeing blocks and earlier dinners.",
      "Rooming: Clarify whether you need interconnecting rooms, extra beds, or two rooms — availability varies.",
      "Hill destinations like Kodaikanal and Ooty often suit families when vehicles and pacing are sized correctly.",
      "Beach destinations need sun care and quieter stretch options for younger children.",
      "Canaan can shape family packages as enquiry quotes or point you to published Kodai tiers built for 2/4/6 guests.",
    ],
  },
  {
    slug: "honeymoon-planning-guide",
    destinationSlug: null,
    image: "/images/travel/p/bali/seminyak.jpg",
    readMinutes: 10,
    date: "2026-03-14",
    tags: ["Honeymoon", "Couples"],
    title: L(
      "Honeymoon Planning Guide",
      "தேனிலவு திட்ட வழிகாட்டி",
      "हनीमून योजना गाइड",
    ),
    excerpt: L(
      "Choosing pace over packing — hills, beaches, or international couples trips.",
      "மலை, கடற்கரை அல்லது சர்வதேச ஜோடி பயணங்கள்.",
      "पहाड़, बीच या अंतरराष्ट्रीय कपल यात्राएँ।",
    ),
    bodyEn: [
      "Honeymoons work best when evenings are protected. Avoid stacking every attraction into daylight hours.",
      "Domestic hills and beaches can feel intimate without long international logistics.",
      "International options like Bali need visa/flight lead time — start early and expect enquiry-based quotes.",
      "Tell Canaan your travel month, budget band (without inventing numbers yourself if unsure), and whether you want quiet or lively evenings.",
    ],
  },
  {
    slug: "train-ticket-travel-planning-guide",
    destinationSlug: null,
    image: "/images/travel/p/darjeeling/batasia-loop.jpg",
    readMinutes: 9,
    date: "2026-03-15",
    tags: ["Trains", "Services"],
    title: L(
      "Train Ticket Travel Planning Guide",
      "ரயில் டிக்கெட் பயணத் திட்ட வழிகாட்டி",
      "ट्रेन टिकट यात्रा योजना गाइड",
    ),
    excerpt: L(
      "How Canaan assists with train planning — without inventing confirmed seats.",
      "ரயில் திட்ட உதவி — போலி இருக்கைகள் இல்லை.",
      "ट्रेन योजना सहायता — नकली सीटें नहीं।",
    ),
    bodyEn: [
      "Train travel in India depends on real IRCTC inventory. Waitlists and tatkal windows are realities, not marketing footnotes.",
      "Share origin, destination, date window, and preferred class. Canaan helps with planning and booking assistance where supported.",
      "Combine trains with packages carefully — hill transfers after NJP arrivals need buffer time.",
      "Start with the Train Tickets service page, then enquire with dates.",
    ],
  },
  {
    slug: "visa-assistance-guide",
    destinationSlug: null,
    image: "/images/travel/d/dubai.jpg",
    readMinutes: 9,
    date: "2026-03-16",
    tags: ["Visa", "Services"],
    title: L(
      "Visa Assistance Guide",
      "விசா உதவி வழிகாட்டி",
      "वीज़ा सहायता गाइड",
    ),
    excerpt: L(
      "What visa support can and cannot promise — official rules change.",
      "விசா ஆதரவு என்ன செய்யும் / செய்யாது.",
      "वीज़ा सहायता क्या कर सकती है / नहीं।",
    ),
    bodyEn: [
      "Visa requirements depend on nationality, destination, and current embassy rules. Canaan provides assistance and document guidance — final decisions rest with authorities.",
      "Never transfer fees to unofficial accounts. Official fee amounts should come from verified sources near your application date.",
      "Start early for international trips such as Bali. Parallel-track flights and stays only after visa feasibility is clear.",
      "Use the Visa service page to begin an enquiry.",
    ],
  },
  {
    slug: "corporate-travel-management-guide",
    destinationSlug: null,
    image: "/images/travel/d/tokyo.jpg",
    readMinutes: 10,
    date: "2026-03-17",
    tags: ["Corporate", "Business"],
    title: L(
      "Corporate Travel Management Guide",
      "கார்ப்பரேட் பயண மேலாண்மை வழிகாட்டி",
      "कॉर्पोरेट यात्रा प्रबंधन गाइड",
    ),
    excerpt: L(
      "Centralised enquiries for employee travel, group movement, and itinerary support — without fake client stats.",
      "பணியாளர் பயணம் மற்றும் குழு இயக்கம்.",
      "कर्मचारी यात्रा और समूह मूवमेंट।",
    ),
    bodyEn: [
      "Corporate travel works best with a single coordination point: dates, passenger list, preferred cabin/hotel band, and invoice needs.",
      "Canaan supports flights, hotels, and itinerary assistance through enquiry — not invented SLA dashboards or fake award badges.",
      "Group movements need earlier lead time than solo trips. Share constraints honestly so quotes stay realistic.",
      "Begin on the Corporate Travel page with your travel window and headcount.",
    ],
  },
  {
    slug: "how-to-build-a-travel-budget",
    destinationSlug: null,
    image: "/images/travel/d/maldives.jpg",
    readMinutes: 11,
    date: "2026-03-18",
    tags: ["Budget", "Planning"],
    title: L(
      "How to Build a Travel Budget",
      "பயண பட்ஜெட் உருவாக்குவது எப்படி",
      "यात्रा बजट कैसे बनाएँ",
    ),
    excerpt: L(
      "A practical framework: transport, stay, food, activities, buffers — without fake average costs.",
      "போக்குவரத்து, தங்கல், உணவு, இடையகங்கள்.",
      "परिवहन, ठहराव, भोजन, बफ़र।",
    ),
    bodyEn: [
      "Separate fixed costs (flights/trains you must take) from flexible costs (stay category, activities).",
      "Add a buffer for meals, local transport, and weather delays — especially on hill and monsoon trips.",
      "Published package prices (where Canaan shows them) already bundle specific inclusions; compare those carefully against DIY plans.",
      "Enquiry packages exist precisely because honest pricing needs your dates. Ask for a quote instead of trusting random internet averages.",
      "Share a budget band with Canaan if you have one — we will propose feasible options rather than upselling fiction.",
    ],
  },
];

async function main() {
  const destRows = await prisma.destination.findMany({
    select: { id: true, slug: true },
  });
  const bySlug = new Map(destRows.map((d) => [d.slug, d.id]));

  let n = 0;
  for (const g of guides) {
    const destinationId = g.destinationSlug
      ? bySlug.get(g.destinationSlug) ?? null
      : null;
    const titleTa = g.title.ta;
    const titleHi = g.title.hi;
    const excerptTa = g.excerpt.ta;
    const excerptHi = g.excerpt.hi;
    // Tamil/Hindi body: use English paragraphs as fallback when full translation not authored yet
    const bodyJson = paras(...g.bodyEn);
    await prisma.blogPost.upsert({
      where: { slug: g.slug },
      create: {
        slug: g.slug,
        destinationId,
        status: "published",
        featured: true,
        publishedAt: new Date(g.date),
        date: g.date,
        readMinutes: g.readMinutes,
        image: g.image,
        tagsEn: tags(...g.tags),
        tagsTa: tags(...g.tags),
        tagsHi: tags(...g.tags),
        titleEn: g.title.en,
        titleTa,
        titleHi,
        excerptEn: g.excerpt.en,
        excerptTa,
        excerptHi,
        bodyEn: bodyJson,
        bodyTa: bodyJson,
        bodyHi: bodyJson,
        seoTitleEn: `${g.title.en} | Canaan Travel Hub`,
        seoDescriptionEn: g.excerpt.en,
        authorEn: "Canaan Travel Hub",
      },
      update: {
        destinationId,
        status: "published",
        featured: true,
        publishedAt: new Date(g.date),
        date: g.date,
        readMinutes: g.readMinutes,
        image: g.image,
        tagsEn: tags(...g.tags),
        tagsTa: tags(...g.tags),
        tagsHi: tags(...g.tags),
        titleEn: g.title.en,
        titleTa,
        titleHi,
        excerptEn: g.excerpt.en,
        excerptTa,
        excerptHi,
        bodyEn: bodyJson,
        bodyTa: bodyJson,
        bodyHi: bodyJson,
        seoTitleEn: `${g.title.en} | Canaan Travel Hub`,
        seoDescriptionEn: g.excerpt.en,
      },
    });
    n += 1;
  }
  console.log(`Upserted ${n} featured editorial guides`);

  const translate = path.join(__dirname, "translate-editorial-guides.mjs");
  const result = spawnSync(process.execPath, [translate], { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error("translate-editorial-guides.mjs failed");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
