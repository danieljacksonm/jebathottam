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
  {
    slug: "kodai-lake",
    image:
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "coakers-walk",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "pillar-rocks",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "pine-trails",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "valley-light",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
  },
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
