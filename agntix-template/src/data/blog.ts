export type BlogSlug =
  | "kodai-first-timer"
  | "best-time-kodaikanal"
  | "visa-checklist"
  | "family-hill-packing"
  | "honeymoon-kodai"
  | "digital-tourism-explained";

export type BlogPost = {
  slug: BlogSlug;
  date: string;
  readMinutes: number;
  image: string;
  tags: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "kodai-first-timer",
    date: "2026-07-12",
    readMinutes: 6,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
    tags: ["Kodaikanal", "Guides"],
  },
  {
    slug: "best-time-kodaikanal",
    date: "2026-07-20",
    readMinutes: 5,
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
    tags: ["Kodaikanal", "Seasons"],
  },
  {
    slug: "visa-checklist",
    date: "2026-07-28",
    readMinutes: 7,
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80",
    tags: ["Visa", "Digital Tourism"],
  },
  {
    slug: "family-hill-packing",
    date: "2026-08-01",
    readMinutes: 4,
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80",
    tags: ["Family", "Tips"],
  },
  {
    slug: "honeymoon-kodai",
    date: "2026-08-03",
    readMinutes: 5,
    image:
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93bd?auto=format&fit=crop&w=1400&q=80",
    tags: ["Honeymoon", "Kodaikanal"],
  },
  {
    slug: "digital-tourism-explained",
    date: "2026-08-05",
    readMinutes: 6,
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
    tags: ["Digital Tourism", "Services"],
  },
];

export const blogCopy: Record<
  BlogSlug,
  {
    title: Record<"en" | "ta" | "hi", string>;
    excerpt: Record<"en" | "ta" | "hi", string>;
    body: string[];
  }
> = {
  "kodai-first-timer": {
    title: {
      en: "Kodaikanal for first-timers: a calm plan",
      ta: "முதல் முறை கொடைக்கானல்: அமைதியான திட்டம்",
      hi: "पहली बार कोडाइकनाल: शांत योजना",
    },
    excerpt: {
      en: "How to see the best of Kodai without rushing every viewpoint in one day.",
      ta: "ஒரே நாளில் எல்லா இடங்களையும் ஓடாமல் கொடையின் சிறப்பை காணும் வழி.",
      hi: "एक दिन में सब जगह घूमे बिना कोडई का सर्वश्रेष्ठ कैसे देखें।",
    },
    body: [
      "Kodaikanal rewards slow travel. Instead of stacking ten viewpoints into a single day, begin with the lake circuit and one gentle walk.",
      "Choose a stay slightly away from the busiest market lanes if you want quiet mornings. Private transfers make the climb from Madurai or Coimbatore far more comfortable.",
      "Canaan’s Kodai Escape and Kodai Complete packages are built around this pacing — curated, not crowded.",
    ],
  },
  "best-time-kodaikanal": {
    title: {
      en: "Best time to visit Kodaikanal",
      ta: "கொடைக்கானல் செல்ல சிறந்த நேரம்",
      hi: "कोडाइकनाल जाने का सबसे अच्छा समय",
    },
    excerpt: {
      en: "Seasons, mist, and what each month feels like on the hills.",
      ta: "பருவங்கள், மூடுபனி மற்றும் ஒவ்வொரு மாதத்தின் உணர்வு.",
      hi: "मौसम, कोहरा और हर महीने पहाड़ियों का अहसास।",
    },
    body: [
      "April to June is popular for clear views and pleasant evenings. Monsoon months bring dramatic mist and fewer crowds, with occasional road caution.",
      "Winter mornings can be crisp — ideal for couples and photography if you pack warm layers.",
      "Tell us your preferred month when you enquire; we adjust stays and outdoor plans accordingly.",
    ],
  },
  "visa-checklist": {
    title: {
      en: "Foreign visa checklist before you apply",
      ta: "விசா விண்ணப்பத்திற்கு முன் சரிபார்ப்பு பட்டியல்",
      hi: "वीज़ा आवेदन से पहले चेकलिस्ट",
    },
    excerpt: {
      en: "Documents, timelines, and common mistakes travellers make.",
      ta: "ஆவணங்கள், காலக்கெடு மற்றும் பொதுவான தவறுகள்.",
      hi: "दस्तावेज़, समयसीमा और आम गलतियाँ।",
    },
    body: [
      "Start with passport validity (usually six months beyond travel), clear photos, and a consistent travel itinerary.",
      "Bank statements, employment proof, and hotel bookings should match your application story. Inconsistencies cause delays.",
      "Canaan’s visa assistance helps you organise paperwork and timelines for popular destinations — enquire for current requirements.",
    ],
  },
  "family-hill-packing": {
    title: {
      en: "Packing for a family hill trip",
      ta: "குடும்ப மலை பயணத்திற்கான பொருட்கள்",
      hi: "पारिवारिक पहाड़ी यात्रा के लिए पैकिंग",
    },
    excerpt: {
      en: "Light layers, medicines, and the small things that save a day.",
      ta: "இலகு அடுக்கு ஆடைகள், மருந்துகள் மற்றும் சிறிய உதவிகள்.",
      hi: "हल्के लेयर, दवाइयाँ और छोटी ज़रूरी चीज़ें।",
    },
    body: [
      "Hills change temperature quickly. Pack light layers, a compact rain jacket, and comfortable walking shoes for everyone.",
      "Carry basic medicines, snacks for children, and power banks — network can be patchy on some stretches.",
      "Our Kodai Family package keeps daily plans flexible so packing stays practical rather than excessive.",
    ],
  },
  "honeymoon-kodai": {
    title: {
      en: "A honeymoon rhythm in Kodaikanal",
      ta: "கொடைக்கானலில் தேனிலவு தாளம்",
      hi: "कोडाइकनाल में हनीमून लय",
    },
    excerpt: {
      en: "Private evenings, soft mornings, and views worth lingering for.",
      ta: "தனியார் மாலைகள், மென்மையான காலைகள்.",
      hi: "निजी शामें और धीमी सुबहें।",
    },
    body: [
      "Honeymoon travel works best when the itinerary leaves white space — time for quiet breakfasts and unhurried viewpoints.",
      "Choose a stay with privacy and valley light. Add one special dinner and one private experience rather than a packed checklist.",
      "Kodai Honeymoon and Kodai Luxury are designed around that rhythm.",
    ],
  },
  "digital-tourism-explained": {
    title: {
      en: "What digital tourism services include",
      ta: "டிஜிட்டல் சுற்றுலா சேவைகளில் என்ன உள்ளது",
      hi: "डिजिटल पर्यटन सेवाओं में क्या शामिल है",
    },
    excerpt: {
      en: "Flights, hotels, visas, and worldwide planning under one hub.",
      ta: "விமானம், ஹோட்டல், விசா மற்றும் உலகளாவிய திட்டமிடல்.",
      hi: "फ़्लाइट, होटल, वीज़ा और वैश्विक योजना एक हब में।",
    },
    body: [
      "Digital tourism means you can plan packages, flights, hotels, and visa support through one trusted team — without chasing multiple agents.",
      "Canaan focuses first on complete Kodaikanal packages, then supports worldwide digital services for destinations across Asia, the Middle East, and Europe.",
      "Start with an enquiry: share dates, travellers, and destination. We respond with a clear plan and next steps.",
    ],
  },
};

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
