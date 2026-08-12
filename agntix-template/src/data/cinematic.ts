import {
  pickLocalized,
  type LocalizedString,
} from "@/lib/content/types";

export type CinematicExperience = {
  id: string;
  title: LocalizedString;
  image: string;
};

export type TimelineBeat = {
  id: string;
  title: LocalizedString;
  line: LocalizedString;
};

export type MapPoint = {
  id: string;
  name: LocalizedString;
  x: number;
  y: number;
};

export type WhyStat = {
  label: LocalizedString;
  value: number;
  suffix: string;
};

export const cinematicExperiences: CinematicExperience[] = [
  {
    id: "sunrise",
    title: {
      en: "Sunrise Viewpoints",
      ta: "சூரிய உதய காட்சிகள்",
      hi: "सूर्योदय व्यूपॉइंट",
    },
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "pine",
    title: {
      en: "Pine Forest Walk",
      ta: "பைன் காடு நடை",
      hi: "पाइन जंगल सैर",
    },
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "mannavanur",
    title: { en: "Mannavanur", ta: "மன்னவனூர்", hi: "मन्नवनूर" },
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "poombarai",
    title: {
      en: "Poombarai Village",
      ta: "பூம்பராய் கிராமம்",
      hi: "पूमबराई गाँव",
    },
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "boating",
    title: { en: "Boating", ta: "படகு சவாரி", hi: "बोटिंग" },
    image:
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "falls",
    title: { en: "Waterfalls", ta: "அருவிகள்", hi: "जलप्रपात" },
    image:
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "camping",
    title: { en: "Camping", ta: "முகாம்", hi: "कैंपिंग" },
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "resorts",
    title: {
      en: "Quiet hillside stays",
      ta: "அமைதியான மலை தங்கல்",
      hi: "शांत पहाड़ी ठहराव",
    },
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "horse",
    title: { en: "Horse Riding", ta: "குதிரை சவாரி", hi: "घुड़सवारी" },
    image:
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1400&q=80",
  },
];

export const timelineBeats: TimelineBeat[] = [
  {
    id: "arrival",
    title: { en: "Arrival", ta: "வருகை", hi: "आगमन" },
    line: {
      en: "The air turns cool. The hills open.",
      ta: "காற்று குளிர்கிறது. மலைகள் திறக்கின்றன.",
      hi: "हवा ठंडी होती है। पहाड़ खुलते हैं।",
    },
  },
  {
    id: "coffee",
    title: { en: "Coffee", ta: "காபி", hi: "कॉफ़ी" },
    line: {
      en: "Slow mornings. Steam against misted glass.",
      ta: "மெதுவான காலைகள். மூடுபனி கண்ணாடியில் நீராவி.",
      hi: "धीमी सुबहें। धुँधले शीशे पर भाप।",
    },
  },
  {
    id: "roads",
    title: { en: "Misty Roads", ta: "மூடுபனி சாலைகள்", hi: "कोहरे वाली सड़कें" },
    line: {
      en: "Curves through pine. Soft light ahead.",
      ta: "பைன் வழியாக வளைவுகள். முன்னால் மென்மையான ஒளி.",
      hi: "चीड़ के बीच मोड़। आगे कोमल रोशनी।",
    },
  },
  {
    id: "lake",
    title: { en: "Lake", ta: "ஏரி", hi: "झील" },
    line: {
      en: "Still water. Quiet reflections.",
      ta: "அமைதியான நீர். அமைதியான பிரதிபலிப்புகள்.",
      hi: "शांत पानी। खामोश परछाइयाँ।",
    },
  },
  {
    id: "sunset",
    title: { en: "Sunset", ta: "சூரிய அஸ்தமனம்", hi: "सूर्यास्त" },
    line: {
      en: "Gold over the Western Ghats.",
      ta: "மேற்கு தொடர்ச்சி மலைகளின் மேல் பொன்.",
      hi: "पश्चिमी घाट पर सोना।",
    },
  },
  {
    id: "campfire",
    title: { en: "Campfire", ta: "முகாம் நெருப்பு", hi: "अलाव" },
    line: {
      en: "Stories under a highland sky.",
      ta: "மலை வானத்தின் கீழ் கதைகள்.",
      hi: "पहाड़ी आसमान के नीचे कहानियाँ।",
    },
  },
  {
    id: "sunrise",
    title: { en: "Morning Sunrise", ta: "காலை சூரிய உதயம்", hi: "सुबह का सूर्योदय" },
    line: {
      en: "First light through the mist.",
      ta: "மூடுபனி வழியாக முதல் ஒளி.",
      hi: "कोहरे से होती पहली रोशनी।",
    },
  },
  {
    id: "departure",
    title: { en: "Departure", ta: "புறப்பாடு", hi: "विदाई" },
    line: {
      en: "You leave lighter — and already return in memory.",
      ta: "நீங்கள் இலகுவாகச் செல்கிறீர்கள் — நினைவில் ஏற்கனவே திரும்புகிறீர்கள்.",
      hi: "आप हल्के होकर जाते हैं — और याद में पहले से लौटते हैं।",
    },
  },
];

export const mapPoints: MapPoint[] = [
  {
    id: "lake",
    name: { en: "Kodai Lake", ta: "கொடை ஏரி", hi: "कोडई झील" },
    x: 48,
    y: 52,
  },
  {
    id: "coaker",
    name: { en: "Coaker’s Walk", ta: "கோக்கர்ஸ் வாக்", hi: "कोकर्स वॉक" },
    x: 62,
    y: 40,
  },
  {
    id: "pillar",
    name: { en: "Pillar Rocks", ta: "பில்லர் ராக்ஸ்", hi: "पिलर रॉक्स" },
    x: 34,
    y: 58,
  },
  {
    id: "bryant",
    name: { en: "Bryant Park", ta: "பிரையண்ட் பார்க்", hi: "ब्रायंट पार्क" },
    x: 55,
    y: 48,
  },
  {
    id: "dolphin",
    name: { en: "Dolphin’s Nose", ta: "டால்பின் நோஸ்", hi: "डॉल्फिन नोज़" },
    x: 28,
    y: 68,
  },
];

export const galleryImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93bd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80",
];

export const whyStats: WhyStat[] = [
  {
    label: { en: "Elevation", ta: "உயரம்", hi: "ऊँचाई" },
    value: 2133,
    suffix: "m",
  },
  {
    label: {
      en: "Private stays curated",
      ta: "தேர்ந்த தனியார் தங்கல்",
      hi: "चुनिंदा निजी ठहराव",
    },
    value: 40,
    suffix: "+",
  },
  {
    label: { en: "Guest love", ta: "விருந்தினர் விருப்பம்", hi: "अतिथि प्रेम" },
    value: 98,
    suffix: "%",
  },
];

export function localizeExperiences(locale: string) {
  return cinematicExperiences.map((item) => ({
    ...item,
    title: pickLocalized(item.title, locale),
  }));
}

export function localizeTimeline(locale: string) {
  return timelineBeats.map((beat) => ({
    ...beat,
    title: pickLocalized(beat.title, locale),
    line: pickLocalized(beat.line, locale),
  }));
}

export function localizeMapPoints(locale: string) {
  return mapPoints.map((point) => ({
    ...point,
    name: pickLocalized(point.name, locale),
  }));
}

export function localizeWhyStats(locale: string) {
  return whyStats.map((stat) => ({
    ...stat,
    label: pickLocalized(stat.label, locale),
  }));
}
