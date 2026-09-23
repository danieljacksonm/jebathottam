export const REAL_KODAI = {
  mistyTerraces: "/images/kodai/real/misty-terraces.jpg",
  greenHighlands: "/images/kodai/real/green-highlands.jpg",
  pineCanopy: "/images/kodai/real/pine-canopy.jpg",
  kodaiLakeBoats: "/images/kodai/real/kodai-lake-boats.jpg",
  mistyValleyHomes: "/images/kodai/real/misty-valley-homes.jpg",
  hillTown: "/images/kodai/real/hill-town.jpg",
  seaOfClouds: "/images/kodai/real/sea-of-clouds.jpg",
} as const;

export const REAL_KODAI_LIST = Object.values(REAL_KODAI);

export const REAL_KODAI_ALT: Record<keyof typeof REAL_KODAI, string> = {
  mistyTerraces: "Misty terraced hillsides in Kodaikanal",
  greenHighlands: "Open green highlands under overcast sky in Kodaikanal",
  pineCanopy: "Looking up through tall pine trees in Kodaikanal forest",
  kodaiLakeBoats: "Boats on Kodaikanal Lake with forested hills beyond",
  mistyValleyHomes: "Hillside homes in misty Kodaikanal valley",
  hillTown: "Colourful hillside townscape in Kodaikanal",
  seaOfClouds: "Sea of clouds filling a Kodaikanal mountain valley",
};

/** Prefer real photography for LCP hero. */
export const HERO_IMAGE = REAL_KODAI.mistyTerraces;
export const HERO_IMAGE_MOBILE = REAL_KODAI.mistyTerraces;
export const HERO_OG = REAL_KODAI.seaOfClouds;

export const LOCAL_SCENES = {
  "dolphins-nose": "/images/kodai/dolphins-nose.webp",
  "coakers-walk": "/images/kodai/coakers-walk.webp",
  "pillar-rocks": "/images/kodai/pillar-rocks.webp",
  "kodai-lake": REAL_KODAI.kodaiLakeBoats,
  "pine-forest": REAL_KODAI.pineCanopy,
  poombarai: "/images/kodai/poombarai.webp",
  mannavanur: REAL_KODAI.greenHighlands,
  berijam: REAL_KODAI.seaOfClouds,
  "silver-cascade": "/images/kodai/silver-cascade.webp",
  camping: REAL_KODAI.mistyValleyHomes,
  bryant: REAL_KODAI.hillTown,
} as const;

export const LOCAL_SCENE_LIST = Object.values(LOCAL_SCENES);

export const SERVICE_IMAGES = {
  flights: REAL_KODAI.seaOfClouds,
  hotels: REAL_KODAI.mistyValleyHomes,
  visa: REAL_KODAI.hillTown,
  tours: REAL_KODAI.kodaiLakeBoats,
} as const;

export const PACKAGE_IMAGES: Record<string, string> = {
  "kodai-1n2d": REAL_KODAI.kodaiLakeBoats,
  "kodai-escape": REAL_KODAI.kodaiLakeBoats,
  "kodai-family": REAL_KODAI.kodaiLakeBoats,
  "kodai-honeymoon": REAL_KODAI.kodaiLakeBoats,
  "kodai-luxury": REAL_KODAI.kodaiLakeBoats,
  "kodai-adventure": REAL_KODAI.kodaiLakeBoats,
  "kodai-complete": REAL_KODAI.kodaiLakeBoats,
  "darjeeling-3n4d-mimbusty": "/images/packages/darjeeling-3n4d.jpg",
  "darjeeling-3n4d-tabakoshi": "/images/travel/p/darjeeling/mirik-lake.jpg",
};

/** Deterministic local scene for content rows keyed by slug/id. */
export function localSceneForKey(key: string): string {
  const pool = [...REAL_KODAI_LIST, ...LOCAL_SCENE_LIST];
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % pool.length;
  }
  return pool[hash] ?? REAL_KODAI.mistyTerraces;
}
