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
      src: "/images/travel/d/kerala.jpg",
      alt: "Kerala waterways",
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
      src: "/images/travel/d/goa.jpg",
      alt: "Goa beach landscape",
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
      src: "/images/travel/d/rajasthan.jpg",
      alt: "Rajasthan heritage landscape",
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
      src: "/images/travel/d/ooty.jpg",
      alt: "Ooty highland scenery",
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
      src: "/images/travel/d/singapore.jpg",
      alt: "Singapore cityscape",
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
  "darjeeling-3n4d-mimbusty": {
    src: "/images/packages/darjeeling-3n4d.jpg",
    alt: "Darjeeling 3N/4D Mimbusty stay package",
    purpose: "hero",
  },
  "darjeeling-3n4d-tabakoshi": {
    src: "/images/travel/p/darjeeling/mirik-lake.jpg",
    alt: "Darjeeling 3N/4D Tabakoshi stay — Mirik Lake",
    purpose: "hero",
  },
};

/** Service heroes — destination-neutral travel photography (not the home hero). */
export const SERVICE_IMAGES_REGISTRY = {
  flights: {
    src: "/images/travel/d/singapore.jpg",
    alt: "City skyline for flight booking assistance",
    purpose: "service",
  },
  hotels: {
    src: "/images/travel/d/udaipur-city.jpg",
    alt: "Heritage lakeside city for hotel booking assistance",
    purpose: "service",
  },
  visa: {
    src: "/images/travel/d/dubai.jpg",
    alt: "International skyline for visa assistance",
    purpose: "service",
  },
  tours: {
    src: "/images/travel/d/rajasthan.jpg",
    alt: "Heritage landscape for tour planning",
    purpose: "service",
  },
  trains: {
    src: "/images/travel/d/darjeeling.jpg",
    alt: "Hill destination for train ticket assistance",
    purpose: "service",
  },
  consulting: {
    src: "/images/travel/d/maldives.jpg",
    alt: "Coastal destination for custom travel consulting",
    purpose: "service",
  },
  corporate: {
    src: "/images/travel/d/singapore.jpg",
    alt: "Business cityscape for corporate travel",
    purpose: "service",
  },
} as const satisfies Record<string, ImageAsset>;

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
