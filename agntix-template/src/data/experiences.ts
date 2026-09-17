import { LOCAL_SCENES } from "@/lib/media";

export type ExperienceSlug =
  | "kodai-lake"
  | "coakers-walk"
  | "pillar-rocks"
  | "pine-trails"
  | "valley-light";

export type KodaiExperience = {
  slug: ExperienceSlug;
  image: string;
};

/** Places and moments inside Kodaikanal only — not other cities. */
export const kodaiExperiences: KodaiExperience[] = [
  { slug: "kodai-lake", image: LOCAL_SCENES["kodai-lake"] },
  { slug: "coakers-walk", image: LOCAL_SCENES["coakers-walk"] },
  { slug: "pillar-rocks", image: LOCAL_SCENES["pillar-rocks"] },
  { slug: "pine-trails", image: LOCAL_SCENES["pine-forest"] },
  { slug: "valley-light", image: LOCAL_SCENES.mannavanur },
];

export const experienceCopy: Record<
  ExperienceSlug,
  {
    name: Record<"en" | "ta" | "hi", string>;
    tagline: Record<"en" | "ta" | "hi", string>;
  }
> = {
  "kodai-lake": {
    name: { en: "Kodai Lake", ta: "கொடை ஏரி", hi: "कोडई झील" },
    tagline: {
      en: "Still water and soft evening light",
      ta: "அமைதியான நீர் மற்றும் மென்மையான மாலை ஒளி",
      hi: "शांत पानी और नरम शाम की रोशनी",
    },
  },
  "coakers-walk": {
    name: { en: "Coaker’s Walk", ta: "கோக்கர்ஸ் வாக்", hi: "कोकर्स वॉक" },
    tagline: {
      en: "Mist on the ridge at dawn",
      ta: "காலையில் முகட்டில் மூடுபனி",
      hi: "सुबह रिज पर कोहरा",
    },
  },
  "pillar-rocks": {
    name: { en: "Pillar Rocks", ta: "பில்லர் ராக்ஸ்", hi: "पिलर रॉक्स" },
    tagline: {
      en: "Stone pillars above the clouds",
      ta: "மேகங்களுக்கு மேல் பாறைத் தூண்கள்",
      hi: "बादलों के ऊपर पत्थर के स्तंभ",
    },
  },
  "pine-trails": {
    name: { en: "Pine trails", ta: "பைன் பாதைகள்", hi: "चीड़ के रास्ते" },
    tagline: {
      en: "Quiet forest walks and cool air",
      ta: "அமைதியான காட்டு நடை மற்றும் குளிர் காற்று",
      hi: "शांत जंगल की सैर और ठंडी हवा",
    },
  },
  "valley-light": {
    name: { en: "Valley light", ta: "பள்ளத்தாக்கு ஒளி", hi: "घाटी की रोशनी" },
    tagline: {
      en: "Golden hour over the Western Ghats",
      ta: "மேற்குத் தொடர்ச்சி மலைகளில் பொன்வேளை",
      hi: "पश्चिमी घाट पर सुनहरी घड़ी",
    },
  },
};
