import { LOCAL_SCENES, SERVICE_IMAGES } from "@/lib/media";

export type ServiceSlug = "flights" | "hotels" | "visa" | "tours";

export type ServiceItem = {
  slug: ServiceSlug;
  image: string;
  href: string;
};

export const services: ServiceItem[] = [
  {
    slug: "flights",
    href: "/flights",
    image: SERVICE_IMAGES.flights,
  },
  {
    slug: "hotels",
    href: "/hotels",
    image: SERVICE_IMAGES.hotels,
  },
  {
    slug: "visa",
    href: "/visa",
    image: SERVICE_IMAGES.visa,
  },
  {
    slug: "tours",
    href: "/tours",
    image: SERVICE_IMAGES.tours,
  },
];

export const whyUs = [
  { key: "vehicles" as const, image: LOCAL_SCENES.mannavanur },
  { key: "guides" as const, image: LOCAL_SCENES.poombarai },
  { key: "stays" as const, image: LOCAL_SCENES.bryant },
  { key: "custom" as const, image: LOCAL_SCENES.berijam },
  { key: "insurance" as const, image: LOCAL_SCENES["coakers-walk"] },
];

export const trustKeys = [
  "handpicked",
  "price",
  "support",
  "secure",
  "trusted",
] as const;
