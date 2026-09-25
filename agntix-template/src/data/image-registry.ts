/**
 * Central image registry for Canaan Travel Hub.
 * Prefer destination-specific local assets under /images/travel/.
 * Do not reuse the homepage hero as destination/package/service art.
 */

export type ImageAsset = {
  src: string;
  alt: string;
  purpose: "hero" | "card" | "gallery" | "og" | "service";
};

export const HOME_IMAGES = {
  hero: {
    src: "/images/marketing/home-hero.jpg",
    alt: "Mountain peaks above clouds — journeys across India and beyond",
    purpose: "hero",
  },
} as const satisfies Record<string, ImageAsset>;

/** Destination heroes / cards — must match the named place. */
export const DESTINATION_IMAGES: Record<
  string,
  { hero: ImageAsset; card: ImageAsset }
> = {
  kodaikanal: {
    hero: {
      src: "/images/travel/d/kodaikanal.jpg",
      alt: "Kodaikanal hills and lake country",
      purpose: "hero",
    },
    card: {
      src: "/images/kodai/real/kodai-lake-boats.jpg",
      alt: "Boats on Kodaikanal Lake",
      purpose: "card",
    },
  },
  darjeeling: {
    hero: {
      src: "/images/travel/d/darjeeling.jpg",
      alt: "Darjeeling Himalayan landscape",
      purpose: "hero",
    },
    card: {
      src: "/images/travel/p/darjeeling/tiger-hill.jpg",
      alt: "Tiger Hill viewpoint near Darjeeling",
      purpose: "card",
    },
  },
  kerala: {
    hero: {
      src: "/images/travel/d/kerala.jpg",
      alt: "Kerala backwaters and palms",
      purpose: "hero",
    },
    card: {
      src: "/images/travel/p/kerala/alleppey.jpg",
      alt: "Alleppey backwaters in Kerala",
      purpose: "card",
    },
  },
  goa: {
    hero: {
      src: "/images/travel/d/goa.jpg",
      alt: "Goa coastline",
      purpose: "hero",
    },
    card: {
      src: "/images/travel/p/goa/calangute.jpg",
      alt: "Calangute beach in Goa",
      purpose: "card",
    },
  },
  rajasthan: {
    hero: {
      src: "/images/travel/d/rajasthan.jpg",
      alt: "Rajasthan palace and desert architecture",
      purpose: "hero",
    },
    card: {
      src: "/images/travel/d/jaipur-city.jpg",
      alt: "Jaipur cityscape in Rajasthan",
      purpose: "card",
    },
  },
  manali: {
    hero: {
      src: "/images/travel/d/manali.jpg",
      alt: "Manali mountain valley",
      purpose: "hero",
    },
    card: {
      src: "/images/travel/d/manali.jpg",
      alt: "Manali Himalayan slopes",
      purpose: "card",
    },
  },
  ooty: {
    hero: {
      src: "/images/travel/d/ooty.jpg",
      alt: "Ooty Nilgiri hills",
      purpose: "hero",
    },
    card: {
      src: "/images/travel/p/ooty/ooty-lake.jpg",
      alt: "Ooty Lake in the Nilgiris",
      purpose: "card",
    },
  },
  singapore: {
    hero: {
      src: "/images/travel/d/singapore.jpg",
      alt: "Singapore skyline",
      purpose: "hero",
    },
    card: {
      src: "/images/travel/p/singapore/marina-bay-sands.jpg",
      alt: "Marina Bay Sands, Singapore",
      purpose: "card",
    },
  },
};

export const PACKAGE_IMAGES_REGISTRY: Record<string, ImageAsset> = {
  "kodai-1n2d": {
    src: "/images/kodai/real/kodai-lake-boats.jpg",
    alt: "Kodaikanal 1 Night / 2 Days package — lake and hills",
    purpose: "hero",
  },
  "kodai-3n4d-family": {
    src: "/images/travel/p/kodaikanal/pine-forest.jpg",
    alt: "Kodaikanal pine forest for family scenic stay package",
    purpose: "hero",
  },
  "darjeeling-3n4d-mimbusty": {
    src: "/images/travel/p/darjeeling/tiger-hill.jpg",
    alt: "Tiger Hill sunrise ridge for Darjeeling Mimbusty package",
    purpose: "hero",
  },
  "darjeeling-3n4d-tabakoshi": {
    src: "/images/travel/p/darjeeling/mirik-lake.jpg",
    alt: "Mirik Lake for Darjeeling Tabakoshi package",
    purpose: "hero",
  },
  "darjeeling-tea-experience": {
    src: "/images/travel/p/darjeeling/happy-valley-tea.jpg",
    alt: "Happy Valley tea estate for Darjeeling tea experience",
    purpose: "hero",
  },
  "goa-3n4d-beach": {
    src: "/images/travel/p/goa/calangute.jpg",
    alt: "Calangute beach for Goa leisure package",
    purpose: "hero",
  },
  "bali-4n5d-couple": {
    src: "/images/travel/p/bali/tegallalang.jpg",
    alt: "Tegallalang rice terraces for Bali couple package",
    purpose: "hero",
  },
  "madurai-2n3d-temple": {
    src: "/images/travel/p/madurai/meenakshi-temple.jpg",
    alt: "Meenakshi Temple for Madurai heritage package",
    purpose: "hero",
  },
  "delhi-agra-3n4d": {
    src: "/images/travel/d/agra-taj-mahal.jpg",
    alt: "Taj Mahal for Delhi and Agra heritage package",
    purpose: "hero",
  },
  "ooty-2n3d-escape": {
    src: "/images/travel/p/ooty/ooty-lake.jpg",
    alt: "Ooty Lake for Nilgiri weekend package",
    purpose: "hero",
  },
};

/** Service heroes — each service uses a distinct photo (never the homepage hero). */
export const SERVICE_IMAGES_REGISTRY = {
  flights: {
    src: "/images/travel/d/tokyo.jpg",
    alt: "Tokyo skyline for flight booking assistance",
    purpose: "service",
  },
  hotels: {
    src: "/images/travel/d/udaipur-city.jpg",
    alt: "Udaipur lakeside city for hotel booking assistance",
    purpose: "service",
  },
  visa: {
    src: "/images/travel/d/dubai.jpg",
    alt: "Dubai skyline for visa assistance",
    purpose: "service",
  },
  tours: {
    src: "/images/travel/d/rajasthan.jpg",
    alt: "Rajasthan heritage landscape for tour planning",
    purpose: "service",
  },
  trains: {
    src: "/images/travel/p/darjeeling/batasia-loop.jpg",
    alt: "Mountain railway loop for train ticket assistance",
    purpose: "service",
  },
  consulting: {
    src: "/images/travel/d/maldives.jpg",
    alt: "Maldives coastline for custom travel consulting",
    purpose: "service",
  },
  corporate: {
    src: "/images/travel/d/london.jpg",
    alt: "London cityscape for corporate travel",
    purpose: "service",
  },
} as const satisfies Record<string, ImageAsset>;

export function destinationCardImage(slug: string, fallback: string): ImageAsset {
  const entry = DESTINATION_IMAGES[slug];
  if (entry?.card) return entry.card;
  if (entry?.hero) return entry.hero;
  return {
    src: fallback,
    alt: "Travel destination with Canaan Travel Hub",
    purpose: "card",
  };
}

export function destinationHero(slug: string): ImageAsset {
  return (
    DESTINATION_IMAGES[slug]?.hero ?? {
      src: "/images/travel/d/darjeeling.jpg",
      alt: "Travel destination with Canaan Travel Hub",
      purpose: "hero",
    }
  );
}

export function packageImage(id: string): ImageAsset | undefined {
  return PACKAGE_IMAGES_REGISTRY[id];
}
