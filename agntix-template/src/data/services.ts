import { SERVICE_IMAGES_REGISTRY } from "@/data/image-registry";

export type ServiceSlug =
  | "flights"
  | "hotels"
  | "visa"
  | "trains"
  | "consulting"
  | "tours"
  | "corporate";

export type ServiceItem = {
  slug: ServiceSlug;
  image: string;
  href: string;
  blurb: string;
};

/** Primary travel services shown on hub pages (enquiry-based; no fake inventory). */
export const travelServices: ServiceItem[] = [
  {
    slug: "flights",
    href: "/flights",
    image: SERVICE_IMAGES_REGISTRY.flights.src,
    blurb: "Domestic and international flight assistance on enquiry.",
  },
  {
    slug: "trains",
    href: "/services/train-tickets",
    image: SERVICE_IMAGES_REGISTRY.trains.src,
    blurb: "Train search and ticket booking assistance — not Indian Railways.",
  },
  {
    slug: "hotels",
    href: "/hotels",
    image: SERVICE_IMAGES_REGISTRY.hotels.src,
    blurb: "Hotel and stay booking help for leisure and corporate trips.",
  },
  {
    slug: "visa",
    href: "/visa",
    image: SERVICE_IMAGES_REGISTRY.visa.src,
    blurb: "Document guidance and application support — no approval guarantees.",
  },
  {
    slug: "consulting",
    href: "/services/travel-consulting",
    image: SERVICE_IMAGES_REGISTRY.consulting.src,
    blurb: "Custom itineraries shaped around dates, budget, and travel style.",
  },
  {
    slug: "corporate",
    href: "/corporate-travel",
    image: SERVICE_IMAGES_REGISTRY.corporate.src,
    blurb: "Business trips, retreats, and coordinated group travel.",
  },
];

/** @deprecated Prefer travelServices — kept for older imports. */
export const services: ServiceItem[] = travelServices.filter((s) =>
  ["flights", "hotels", "visa", "tours"].includes(s.slug),
).concat([
  {
    slug: "tours",
    href: "/tours",
    image: SERVICE_IMAGES_REGISTRY.tours.src,
    blurb: "Published packages and custom day plans.",
  },
]);

export const whyUs = [
  { key: "vehicles" as const, image: "/images/travel/d/manali.jpg" },
  { key: "guides" as const, image: "/images/travel/d/kerala.jpg" },
  { key: "stays" as const, image: "/images/travel/d/udaipur-city.jpg" },
  { key: "custom" as const, image: "/images/travel/d/maldives.jpg" },
  { key: "insurance" as const, image: "/images/travel/d/singapore.jpg" },
];

export const trustKeys = [
  "handpicked",
  "price",
  "support",
  "secure",
  "trusted",
] as const;
