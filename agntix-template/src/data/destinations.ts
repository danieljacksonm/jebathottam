import { packageRows, type PackageRow } from "@/data/packages";

export type DestinationSlug = "kodaikanal" | "darjeeling";

export type Destination = {
  slug: DestinationSlug;
  featured?: boolean;
  priceFrom: number;
  image: string;
  country: "India";
  region: "india";
  status: "published";
  continent: "Asia";
};

export const destinations: Destination[] = [
  {
    slug: "kodaikanal",
    featured: true,
    priceFrom: 1799,
    country: "India",
    region: "india",
    status: "published",
    continent: "Asia",
    image: "/images/kodai/hero.webp",
  },
  {
    slug: "darjeeling",
    featured: true,
    priceFrom: 6550,
    country: "India",
    region: "india",
    status: "published",
    continent: "Asia",
    image: "/images/darjeeling/hero/darjeeling-hero.jpg",
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
      en: "Misty pine forests, quiet lakes, and our verified 1 Night / 2 Days Kodaikanal package — with custom plans for larger groups. Worldwide flights, hotels and visas available as travel support.",
      ta: "மூடுபனி பைன் காடுகள், அமைதியான ஏரிகள், மற்றும் உறுதிப்படுத்தப்பட்ட 1 இரவு / 2 நாள் கொடை பேக்கேஜ் — பெரிய குழுக்களுக்கு தனிப்பயன் திட்டங்கள்.",
      hi: "कोहरा, चीड़ के जंगल, शांत झीलें और हमारा सत्यापित 1 रात / 2 दिन कोडाइकनाल पैकेज — बड़े समूहों के लिए कस्टम प्लान।",
    },
  },
  darjeeling: {
    name: { en: "Darjeeling", ta: "டார்ஜீலிங்", hi: "दार्जिलिंग" },
    tagline: {
      en: "Tea hills, Kanchenjunga views, and NJP–NJP group circuits",
      ta: "தேயிலை மலைகள், கஞ்சன்ஜங்கா காட்சிகள், NJP–NJP குழு சுற்றுலா",
      hi: "चाय की पहाड़ियाँ, कंचनजंगा दृश्य, और NJP–NJP समूह सर्किट",
    },
    body: {
      en: "Verified 3 Night / 4 Day Darjeeling group packages from NJP — Dawaipani, classic town sightseeing, Mimbusty or Tabakoshi stays, and Mirik on the return. From ₹6,550 per person on a 7-guest quote basis.",
      ta: "NJP முதல் சரிபார்க்கப்பட்ட 3 இரவு / 4 நாள் டார்ஜீலிங் குழு பேக்கேஜ்கள் — தவைபனி, நகர சுற்றுலா, மிம்புஸ்டி அல்லது தபகோசி தங்கல், திரும்பும்போது மிரிக். 7 பேர் மேற்கோள் அடிப்படையில் ₹6,550/நபர் முதல்.",
      hi: "NJP से सत्यापित 3 रात / 4 दिन दार्जिलिंग समूह पैकेज — दवाइपानी, शहर साइटसीइंग, मिम्बुस्टी या तबकोशी ठहराव, और वापसी पर मिरिक। 7 अतिथि कोट के आधार पर ₹6,550 प्रति व्यक्ति से।",
    },
  },
};

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug);
}

export function getPublishedDestinations() {
  return destinations.filter((d) => d.status === "published");
}

export function packagesForDestination(
  slug: DestinationSlug | string,
): PackageRow[] {
  return packageRows.filter((row) => row.destinationSlug === slug);
}
