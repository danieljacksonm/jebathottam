export type PackageId =
  | "kodai-escape"
  | "kodai-family"
  | "kodai-honeymoon"
  | "kodai-luxury"
  | "kodai-adventure"
  | "kodai-complete";

export type TravelPackage = {
  id: PackageId;
  nights: number;
  days: number;
  priceFrom: number;
  currency: "INR";
  rating: number;
  reviewCount: number;
  image: string;
  category: "escape" | "family" | "honeymoon" | "luxury" | "adventure" | "complete";
  featured?: boolean;
  highlights: string[];
};

export const packages: TravelPackage[] = [
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
    highlights: [
      "Lakeside welcome & private transfer",
      "Coaker’s Walk sunrise",
      "Boutique hill stay",
    ],
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
    highlights: [
      "Family-friendly lodge",
      "Bryant Park & lake boating",
      "Flexible pacing for children",
    ],
  },
  {
    id: "kodai-honeymoon",
    nights: 4,
    days: 5,
    priceFrom: 26999,
    currency: "INR",
    rating: 4.9,
    reviewCount: 84,
    category: "honeymoon",
    image:
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93bd?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Private candlelight dinner",
      "Valley-view premium stay",
      "Couple photoshoot session",
    ],
  },
  {
    id: "kodai-luxury",
    nights: 4,
    days: 5,
    priceFrom: 34999,
    currency: "INR",
    rating: 4.9,
    reviewCount: 61,
    category: "luxury",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Premium lodge with host",
      "Private vehicle throughout",
      "Curated dining & spa add-ons",
    ],
  },
  {
    id: "kodai-adventure",
    nights: 3,
    days: 4,
    priceFrom: 16999,
    currency: "INR",
    rating: 4.6,
    reviewCount: 73,
    category: "adventure",
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Pillar Rocks & Dolphin’s Nose",
      "Guided pine forest trek",
      "Viewpoint circuit",
    ],
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
    highlights: [
      "Full Kodaikanal circuit",
      "Dedicated travel host",
      "Luxury stay + flexible itinerary",
    ],
  },
];

export const packageCopy: Record<
  PackageId,
  {
    title: Record<"en" | "ta" | "hi", string>;
    blurb: Record<"en" | "ta" | "hi", string>;
    body: Record<"en" | "ta" | "hi", string>;
  }
> = {
  "kodai-escape": {
    title: {
      en: "Kodai Escape",
      ta: "கொடை எஸ்கேப்",
      hi: "कोडई एस्केप",
    },
    blurb: {
      en: "A refined 3-day reset among mist, pine, and still lake light.",
      ta: "மூடுபனி, பைன் மற்றும் ஏரி ஒளியில் 3 நாள் அமைதியான பயணம்.",
      hi: "कोहरे, चीड़ और झील की रोशनी में 3 दिन का शांत विश्राम।",
    },
    body: {
      en: "Ideal for a weekend break. Private transfers, a carefully chosen stay, and unhurried lake-and-walk experiences without crowded itineraries.",
      ta: "வார இறுதி ஓய்வுக்கு ஏற்றது. தனியார் பயணம், தேர்ந்தெடுக்கப்பட்ட தங்குமிடம், நெரிசலற்ற அனுபவங்கள்.",
      hi: "वीकेंड ब्रेक के लिए आदर्श। निजी ट्रांसफर, चुनिंदा ठहराव और बिना भीड़ के अनुभव।",
    },
  },
  "kodai-family": {
    title: {
      en: "Kodai Family",
      ta: "கொடை குடும்பம்",
      hi: "कोडई फैमिली",
    },
    blurb: {
      en: "Comfort-first pacing for families who want nature without stress.",
      ta: "மன அழுத்தமில்லாமல் இயற்கையை அனுபவிக்க விரும்பும் குடும்பங்களுக்கு.",
      hi: "परिवारों के लिए आरामदायक गति के साथ प्रकृति का अनुभव।",
    },
    body: {
      en: "Family rooms, soft start mornings, park and lake time, and a host who adjusts the day around children and elders.",
      ta: "குடும்ப அறைகள், மென்மையான காலைகள், பூங்கா மற்றும் ஏரி நேரம்.",
      hi: "पारिवारिक कमरे, आरामदायक सुबहें, पार्क और झील का समय।",
    },
  },
  "kodai-honeymoon": {
    title: {
      en: "Kodai Honeymoon",
      ta: "கொடை தேனிலவு",
      hi: "कोडई हनीमून",
    },
    blurb: {
      en: "Private evenings, valley views, and space to celebrate slowly.",
      ta: "தனியார் மாலைகள், பள்ளத்தாக்கு காட்சிகள், மெதுவாக கொண்டாடும் இடம்.",
      hi: "निजी शामें, घाटी नज़ारे और धीरे मनाने की जगह।",
    },
    body: {
      en: "Designed for couples: premium stay, private dining, and scenic moments curated for romance rather than rush.",
      ta: "ஜோடிகளுக்காக: பிரீமியம் தங்குமிடம், தனியார் உணவு, காதல் தருணங்கள்.",
      hi: "जोड़े के लिए: प्रीमियम ठहराव, निजी डिनर और रोमांटिक पल।",
    },
  },
  "kodai-luxury": {
    title: {
      en: "Kodai Luxury",
      ta: "கொடை லக்ஸரி",
      hi: "कोडई लक्ज़री",
    },
    blurb: {
      en: "Concierge-level care with premium lodging and private transport.",
      ta: "பிரீமியம் தங்குமிடம் மற்றும் தனியார் வாகனத்துடன் உயர் தர பராமரிப்பு.",
      hi: "प्रीमियम ठहराव और निजी वाहन के साथ उच्च देखभाल।",
    },
    body: {
      en: "Our signature luxury collection — private vehicle, refined stays, and a host who arranges dining and experiences to your preference.",
      ta: "எங்கள் சிறப்பு லக்ஸரி தொகுப்பு — தனியார் வாகனம், நேர்த்தியான தங்குமிடம்.",
      hi: "हमारा सिग्नेचर लक्ज़री संग्रह — निजी वाहन और परिष्कृत ठहराव।",
    },
  },
  "kodai-adventure": {
    title: {
      en: "Kodai Adventure",
      ta: "கொடை அட்வென்ச்சர்",
      hi: "कोडई एडवेंचर",
    },
    blurb: {
      en: "Trails, viewpoints, and highland energy with guided confidence.",
      ta: "பாதைகள், காட்சிகள் மற்றும் வழிகாட்டலுடன் மலை சாகசம்.",
      hi: "ट्रेल, व्यूपॉइंट और गाइडेड पहाड़ी रोमांच।",
    },
    body: {
      en: "For travellers who want more outdoors: guided walks, iconic viewpoints, and active days balanced with good rest.",
      ta: "வெளிப்புற அனுபவம் விரும்புவோருக்கு: வழிகாட்டல் நடைகள், காட்சி இடங்கள்.",
      hi: "आउटडोर प्रेमियों के लिए: गाइडेड वॉक और प्रसिद्ध व्यूपॉइंट।",
    },
  },
  "kodai-complete": {
    title: {
      en: "Kodai Complete",
      ta: "கொடை கம்ப்ளீட்",
      hi: "कोडई कम्प्लीट",
    },
    blurb: {
      en: "Our fullest Kodaikanal chapter — the flagship package.",
      ta: "எங்கள் முழுமையான கொடைக்கானல் அத்தியாயம் — முதன்மை பேக்கேஜ்.",
      hi: "हमारा सबसे पूरा कोडाइकनाल अध्याय — फ्लैगशिप पैकेज।",
    },
    body: {
      en: "Five nights covering the best of Kodaikanal with dedicated hosting, luxury stay options, and a flexible day-by-day plan built around you.",
      ta: "ஐந்து இரவுகள் — சிறந்த கொடை அனுபவங்கள், தனிப்பட்ட வழிகாட்டல்.",
      hi: "पाँच रातें — कोडाइकनाल का सर्वश्रेष्ठ, समर्पित होस्टिंग।",
    },
  },
};

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getPackage(id: string) {
  return packages.find((p) => p.id === id);
}
