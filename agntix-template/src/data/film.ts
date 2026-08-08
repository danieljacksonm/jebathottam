export type FilmScene = {
  id: string;
  place: string;
  quote: string;
  note?: string;
  image: string;
  tone: "gold" | "mist" | "forest" | "lake" | "night" | "falls";
};

/** Emotional scroll journey — packages only after the last beat. */
export const filmScenes: FilmScene[] = [
  {
    id: "dolphins-nose",
    place: "Dolphin’s Nose",
    quote: "The mountains wake before you do.",
    note: "Sunrise above the ridge",
    tone: "gold",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "coakers-walk",
    place: "Coaker’s Walk",
    quote: "Fog holds the path until you are ready.",
    note: "Morning steps through mist",
    tone: "mist",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "kodai-lake",
    place: "Kodai Lake",
    quote: "Water keeps every quiet secret.",
    note: "Walk beside the light",
    tone: "lake",
    image:
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "pine-forest",
    place: "Pine Forest",
    quote: "Breath turns colder. Thoughts turn softer.",
    note: "Light through tall silence",
    tone: "forest",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "poombarai",
    place: "Poombarai Village",
    quote: "Clouds pass through homes like visiting kin.",
    note: "Village in the folds",
    tone: "mist",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "mannavanur",
    place: "Mannavanur",
    quote: "Meadows run until the sky begins.",
    note: "Green open air",
    tone: "forest",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "berijam",
    place: "Berijam Lake",
    quote: "",
    note: "Almost no words. Only atmosphere.",
    tone: "lake",
    image:
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93bd?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "silver-cascade",
    place: "Silver Cascade Falls",
    quote: "The mountain speaks in water.",
    note: "Mist rising from the fall",
    tone: "falls",
    image:
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "camping",
    place: "Night Camping",
    quote: "Stars arrive when the wind rests.",
    note: "Warm fire. Dark luxury.",
    tone: "night",
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=2400&q=80",
  },
];

export const placeRibbon = [
  "Kodai Lake",
  "Coaker’s Walk",
  "Pillar Rocks",
  "Dolphin’s Nose",
  "Pine Forest",
  "Guna Caves",
  "Mannavanur",
  "Poombarai",
  "Berijam Lake",
  "Bryant Park",
  "Silver Cascade",
  "Moir Point",
  "Kurinji Andavar",
  "Vattakanal",
  "Upper Lake View",
  "Silent Valley View",
  "Green Valley View",
  "Fairy Falls",
  "Pambar Falls",
];
