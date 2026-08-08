export type ServiceSlug = "flights" | "hotels" | "visa" | "tours" | "insurance";

export type ServiceItem = {
  slug: ServiceSlug;
  image: string;
  href: string;
};

export const services: ServiceItem[] = [
  {
    slug: "flights",
    href: "/flights",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "hotels",
    href: "/hotels",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "visa",
    href: "/visa",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "tours",
    href: "/tours",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "insurance",
    href: "/services",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  },
];

export const whyUs = [
  {
    key: "vehicles" as const,
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    key: "guides" as const,
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1000&q=80",
  },
  {
    key: "stays" as const,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    key: "custom" as const,
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80",
  },
  {
    key: "insurance" as const,
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=80",
  },
];

export const trustKeys = [
  "handpicked",
  "price",
  "support",
  "secure",
  "trusted",
] as const;
