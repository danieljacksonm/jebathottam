export type DestinationSlug =
  | "kodaikanal"
  | "bali"
  | "dubai"
  | "maldives"
  | "switzerland";

export type Destination = {
  slug: DestinationSlug;
  featured?: boolean;
  priceFrom: number;
  image: string;
  region: "india" | "asia" | "middle-east" | "europe" | "islands";
};

export const destinations: Destination[] = [
  {
    slug: "kodaikanal",
    featured: true,
    priceFrom: 12999,
    region: "india",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "bali",
    priceFrom: 45999,
    region: "asia",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "dubai",
    priceFrom: 52999,
    region: "middle-east",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "maldives",
    priceFrom: 68999,
    region: "islands",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "switzerland",
    priceFrom: 129999,
    region: "europe",
    image:
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1400&q=80",
  },
];

export const destinationCopy: Record<
  DestinationSlug,
  {
    name: Record<"en" | "ta" | "hi", string>;
    tagline: Record<"en" | "ta" | "hi", string>;
    body: Record<"en" | "ta" | "hi", string>;
  }
> = {
  kodaikanal: {
    name: { en: "Kodaikanal", ta: "கொடைக்கானல்", hi: "कोडाइकनाल" },
    tagline: {
      en: "Princess of the Hills — our flagship destination",
      ta: "மலைகளின் இளவரசி — எங்கள் முதன்மை இடம்",
      hi: "पहाड़ियों की राजकुमारी — हमारा मुख्य गंतव्य",
    },
    body: {
      en: "Misty pine forests, quiet lakes, and curated hill packages. Canaan begins here with full Kodaikanal collections — escape, family, honeymoon, luxury, and adventure.",
      ta: "மூடுபனி பைன் காடுகள், அமைதியான ஏரிகள், தேர்ந்தெடுக்கப்பட்ட மலை பேக்கேஜ்கள். கானான் இங்கிருந்து தொடங்குகிறது.",
      hi: "कोहरा, चीड़ के जंगल और शांत झीलें। कनान की शुरुआत यहीं से होती है।",
    },
  },
  bali: {
    name: { en: "Bali", ta: "பாலி", hi: "बाली" },
    tagline: {
      en: "Temples, cliffs, and warm island evenings",
      ta: "கோயில்கள், பாறைகள் மற்றும் தீவு மாலைகள்",
      hi: "मंदिर, चट्टानें और द्वीप की शामें",
    },
    body: {
      en: "Worldwide digital tourism support for Bali — stays, transfers, and curated experiences arranged through Canaan.",
      ta: "பாலிக்கான உலகளாவிய டிஜிட்டல் சுற்றுலா ஆதரவு — தங்குமிடம், பயணம், அனுபவங்கள்.",
      hi: "बाली के लिए वैश्विक डिजिटल पर्यटन सहायता — ठहराव, ट्रांसफर और अनुभव।",
    },
  },
  dubai: {
    name: { en: "Dubai", ta: "துபாய்", hi: "दुबई" },
    tagline: {
      en: "Skyline luxury and desert horizons",
      ta: "வானளாவி ஆடம்பரம் மற்றும் பாலைவன அடிவானம்",
      hi: "स्काईलाइन लक्ज़री और रेगिस्तानी क्षितिज",
    },
    body: {
      en: "City stays, desert experiences, and seamless digital booking support for Dubai travellers.",
      ta: "நகர தங்குமிடம், பாலைவன அனுபவங்கள், துபாய் பயணிகளுக்கான டிஜிட்டல் முன்பதிவு.",
      hi: "शहर ठहराव, रेगिस्तान अनुभव और दुबई यात्रियों के लिए डिजिटल बुकिंग।",
    },
  },
  maldives: {
    name: { en: "Maldives", ta: "மாலத்தீவு", hi: "मालदीव" },
    tagline: {
      en: "Overwater calm and turquoise mornings",
      ta: "நீரின் மேல் அமைதி மற்றும் நீல காலைகள்",
      hi: "पानी पर शांति और फ़िरोज़ी सुबहें",
    },
    body: {
      en: "Resort selection, transfers, and honeymoon-ready arrangements for the Maldives.",
      ta: "ரிசார்ட் தேர்வு, பயணம், தேனிலவு ஏற்பாடுகள்.",
      hi: "रिसॉर्ट चयन, ट्रांसफर और हनीमून व्यवस्था।",
    },
  },
  switzerland: {
    name: { en: "Switzerland", ta: "சுவிட்சர்லாந்து", hi: "स्विट्ज़रलैंड" },
    tagline: {
      en: "Alpine precision and scenic rail journeys",
      ta: "ஆல்ப்ஸ் நேர்த்தி மற்றும் ரயில் பயணங்கள்",
      hi: "अल्पाइन सुंदरता और रेल यात्राएँ",
    },
    body: {
      en: "European digital tourism planning — stays, rail advice, and itinerary design for Switzerland.",
      ta: "ஐரோப்பிய டிஜிட்டல் சுற்றுலா திட்டமிடல் — தங்குமிடம், ரயில் ஆலோசனை.",
      hi: "यूरोपीय डिजिटल पर्यटन योजना — ठहराव और रेल सलाह।",
    },
  },
};

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug);
}
