import {
  pickLocalized,
  type LocalizedString,
} from "@/lib/content/types";
import { LOCAL_SCENES } from "@/lib/media";

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
  image: string;
  blurb: LocalizedString;
  sceneId?: string;
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
    image: LOCAL_SCENES["dolphins-nose"],
  },
  {
    id: "pine",
    title: {
      en: "Pine Forest Walk",
      ta: "பைன் காடு நடை",
      hi: "पाइन जंगल सैर",
    },
    image: LOCAL_SCENES["pine-forest"],
  },
  {
    id: "mannavanur",
    title: { en: "Mannavanur", ta: "மன்னவனூர்", hi: "मन्नवनूर" },
    image: LOCAL_SCENES.mannavanur,
  },
  {
    id: "poombarai",
    title: {
      en: "Poombarai Village",
      ta: "பூம்பராய் கிராமம்",
      hi: "पूमबराई गाँव",
    },
    image: LOCAL_SCENES.poombarai,
  },
  {
    id: "boating",
    title: { en: "Boating", ta: "படகு சவாரி", hi: "बोटिंग" },
    image: LOCAL_SCENES["kodai-lake"],
  },
  {
    id: "falls",
    title: { en: "Waterfalls", ta: "அருவிகள்", hi: "जलप्रपात" },
    image: LOCAL_SCENES["silver-cascade"],
  },
  {
    id: "camping",
    title: { en: "Camping", ta: "முகாம்", hi: "कैंपिंग" },
    image: LOCAL_SCENES.camping,
  },
  {
    id: "resorts",
    title: {
      en: "Quiet hillside stays",
      ta: "அமைதியான மலை தங்கல்",
      hi: "शांत पहाड़ी ठहराव",
    },
    image: LOCAL_SCENES["dolphins-nose"],
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
    id: "kodai-lake",
    sceneId: "kodai-lake",
    name: { en: "Kodai Lake", ta: "கொடை ஏரி", hi: "कोडई झील" },
    x: 48,
    y: 50,
    image: LOCAL_SCENES["kodai-lake"],
    blurb: {
      en: "Still water where the hills meet the sky.",
      ta: "மலைகள் வானத்தைச் சந்திக்கும் அமைதியான நீர்.",
      hi: "शांत पानी जहाँ पहाड़ आसमान से मिलते हैं।",
    },
  },
  {
    id: "coakers-walk",
    sceneId: "coakers-walk",
    name: { en: "Coaker’s Walk", ta: "கோக்கர்ஸ் வாக்", hi: "कोकर्स वॉक" },
    x: 62,
    y: 38,
    image: LOCAL_SCENES["coakers-walk"],
    blurb: {
      en: "A misted ridge walk at first light.",
      ta: "முதல் ஒளியில் மூடுபனி முகட்டு நடை.",
      hi: "पहली रोशनी में कोहरे वाली पहाड़ी सैर।",
    },
  },
  {
    id: "pillar-rocks",
    sceneId: "pillar-rocks",
    name: { en: "Pillar Rocks", ta: "பில்லர் ராக்ஸ்", hi: "पिलर रॉक्स" },
    x: 34,
    y: 56,
    image: LOCAL_SCENES["pillar-rocks"],
    blurb: {
      en: "Three stone columns in the clouds.",
      ta: "மேகங்களில் மூன்று கல் தூண்கள்.",
      hi: "बादलों में तीन पत्थर के स्तंभ।",
    },
  },
  {
    id: "pine-forest",
    sceneId: "pine-forest",
    name: { en: "Pine Forest", ta: "பைன் காடு", hi: "पाइन जंगल" },
    x: 22,
    y: 44,
    image: LOCAL_SCENES["pine-forest"],
    blurb: {
      en: "Tall silence and moving light.",
      ta: "உயர் அமைதியும் நகரும் ஒளியும்.",
      hi: "ऊँची खामोशी और चलती रोशनी।",
    },
  },
  {
    id: "guna-caves",
    name: { en: "Guna Caves", ta: "குணா குகைகள்", hi: "गुना केव्स" },
    x: 30,
    y: 64,
    image: LOCAL_SCENES.mannavanur,
    blurb: {
      en: "Deep rock chambers above the valley.",
      ta: "பள்ளத்தாக்குக்கு மேல் ஆழமான பாறை அறைகள்.",
      hi: "घाटी के ऊपर गहरी चट्टानी गुफाएँ।",
    },
  },
  {
    id: "dolphins-nose",
    sceneId: "dolphins-nose",
    name: { en: "Dolphin’s Nose", ta: "டால்பின் நோஸ்", hi: "डॉल्फिन नोज़" },
    x: 18,
    y: 70,
    image: LOCAL_SCENES["dolphins-nose"],
    blurb: {
      en: "A cliff that looks out forever.",
      ta: "என்றும் பார்க்கும் ஒரு முனை.",
      hi: "एक चट्टान जो बहुत दूर तक देखती है।",
    },
  },
  {
    id: "poombarai",
    sceneId: "poombarai",
    name: { en: "Poombarai", ta: "பூம்பராய்", hi: "पूमबराई" },
    x: 72,
    y: 58,
    image: LOCAL_SCENES.poombarai,
    blurb: {
      en: "Village terraces in the folds of cloud.",
      ta: "மேக மடிப்புகளில் கிராமப் படிகள்.",
      hi: "बादलों की सिलवटों में गाँव की सीढ़ियाँ।",
    },
  },
  {
    id: "mannavanur",
    sceneId: "mannavanur",
    name: { en: "Mannavanur", ta: "மன்னவனூர்", hi: "मन्नवनूर" },
    x: 80,
    y: 42,
    image: LOCAL_SCENES.mannavanur,
    blurb: {
      en: "Open meadows and slow wind.",
      ta: "திறந்த புல்வெளிகளும் மெதுவான காற்றும்.",
      hi: "खुले मैदान और धीमी हवा।",
    },
  },
  {
    id: "berijam",
    sceneId: "berijam",
    name: { en: "Berijam Lake", ta: "பெரியம் ஏரி", hi: "बेरिजाम झील" },
    x: 14,
    y: 32,
    image: LOCAL_SCENES.berijam,
    blurb: {
      en: "Almost no words. Only atmosphere.",
      ta: "சொற்கள் இல்லை. சூழல் மட்டும்.",
      hi: "शब्द लगभग नहीं। सिर्फ़ माहौल।",
    },
  },
  {
    id: "bryant",
    name: { en: "Bryant Park", ta: "பிரையண்ட் பார்க்", hi: "ब्रायंट पार्क" },
    x: 54,
    y: 46,
    image: LOCAL_SCENES.bryant,
    blurb: {
      en: "Garden quiet beside the lake.",
      ta: "ஏரி அருகே தோட்ட அமைதி.",
      hi: "झील के पास बगीचे की शांति।",
    },
  },
  {
    id: "silver-cascade",
    sceneId: "silver-cascade",
    name: { en: "Silver Cascade", ta: "சில்வர் கேஸ்கேட்", hi: "सिल्वर कैस्केड" },
    x: 40,
    y: 74,
    image: LOCAL_SCENES["silver-cascade"],
    blurb: {
      en: "The mountain speaking in water.",
      ta: "மலை நீரில் பேசுகிறது.",
      hi: "पहाड़ पानी की भाषा में बोलता है।",
    },
  },
  {
    id: "vattakanal",
    name: { en: "Vattakanal", ta: "வட்டக்கனல்", hi: "वट्टकनाल" },
    x: 66,
    y: 72,
    image: LOCAL_SCENES.camping,
    blurb: {
      en: "Cliff hamlet above the valley floor.",
      ta: "பள்ளத்தாக்குக்கு மேல் முனை கிராமம்.",
      hi: "घाटी के ऊपर चट्टानी बस्ती।",
    },
  },
];

export const galleryImages = [
  LOCAL_SCENES["dolphins-nose"],
  LOCAL_SCENES.mannavanur,
  LOCAL_SCENES["pine-forest"],
  LOCAL_SCENES.berijam,
  LOCAL_SCENES.poombarai,
  LOCAL_SCENES["kodai-lake"],
  LOCAL_SCENES.camping,
  LOCAL_SCENES.bryant,
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
    blurb: pickLocalized(point.blurb, locale),
  }));
}

export function localizeWhyStats(locale: string) {
  return whyStats.map((stat) => ({
    ...stat,
    label: pickLocalized(stat.label, locale),
  }));
}
