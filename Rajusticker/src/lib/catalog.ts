import type { Product, ProductCategory, ProductSize } from "@/types";

const FULL_ROLL: ProductSize = {
  id: "full-roll",
  label: "Full Roll 1.52m × 18m",
  widthCm: 152,
  lengthM: 18,
  priceMultiplier: 1,
};

const HALF_ROLL: ProductSize = {
  id: "half-roll",
  label: "Half Roll 1.52m × 9m",
  widthCm: 152,
  lengthM: 9,
  priceMultiplier: 0.55,
};

const SAMPLE: ProductSize = {
  id: "sample",
  label: "Sample Swatch 30cm × 30cm",
  widthCm: 30,
  lengthM: 0.3,
  priceMultiplier: 0.05,
};

const DEFAULT_SIZES = [FULL_ROLL, HALF_ROLL, SAMPLE];

const SHARED_FEATURES = [
  "Premium quality PVC wrapping film",
  "High-tack air-release adhesive for bubble-free installs",
  "Approximately 150 micron thickness",
  "UV, scratch, and water resistant",
  "Suitable for cars, bikes, helmets, laptops, and interiors",
];

const SHARED_APPLICATION = [
  "Clean the surface thoroughly and remove wax, grease, and dust.",
  "Measure and cut the film with extra margin for edges and curves.",
  "Apply with a squeegee using firm, overlapping strokes.",
  "Use controlled heat on complex curves — do not overheat chrome finishes.",
  "Trim edges carefully and seal for a clean professional finish.",
];

const SHARED_CARE = [
  "Wait 48 hours after install before washing the vehicle.",
  "Hand wash preferred; avoid high-pressure jets on fresh edges.",
  "Do not use abrasive polishes on matte or chrome mirror finishes.",
  "Park in shade when possible to extend gloss and colour life.",
];

const SHARED_FAQ = [
  {
    question: "Is this a full car wrap roll?",
    answer:
      "Yes. The full roll size is 1.52m width × 18m length, suitable for full or partial vehicle wraps depending on the car size and panel plan.",
  },
  {
    question: "Can beginners install this film?",
    answer:
      "DIY is possible on flat panels with patience. Full vehicle wraps and chrome mirror finishes are best handled by an experienced installer.",
  },
  {
    question: "Will it damage my original paint?",
    answer:
      "When applied and removed correctly from healthy OEM paint, quality vinyl wrap is designed to protect paint rather than damage it. Always test a small area first.",
  },
];

function buildDetails(overrides: Record<string, string>) {
  return [
    { label: "Brand", value: overrides.brand || "Raju Stickers" },
    { label: "Type", value: "Premium Wrapping Film" },
    { label: "Color", value: overrides.color },
    { label: "Finish", value: overrides.finish },
    { label: "Material", value: "High Quality PVC" },
    { label: "Size", value: "1.52 m (W) × 18 m (L)" },
    { label: "Adhesive", value: "High Tack, Air Release" },
    { label: "Thickness", value: "~150 Micron" },
    { label: "Use", value: "Cars, Bikes, Laptops, Helmets, Interiors & More" },
  ];
}

export const catalogProducts: Product[] = [
  {
    id: "rsp-chrome-gold",
    slug: "chrome-gold-car-wrap",
    name: "Chrome Gold Car Wrap",
    shortDescription: "Mirror-finish chrome gold vinyl for a royal, high-impact look.",
    description:
      "Give your ride a royal look with our Chrome Gold Car Wrap. This premium mirror-finish PVC film delivers deep reflectivity, strong adhesion, and a show-stopping presence on full or partial wraps. Built with air-release adhesive for smoother installs and long-lasting shine.",
    price: 21999,
    compareAtPrice: 24999,
    currency: "INR",
    images: ["/products/chrome-gold.jpg"],
    category: "chrome-wraps",
    categories: ["chrome-wraps", "bike-wraps"],
    tags: ["chrome", "gold", "mirror", "luxury", "premium"],
    keywords: ["chrome gold wrap", "gold car wrap", "mirror gold vinyl", "luxury car wrap india"],
    sku: "RS-CG-152-18",
    brand: "Raju Stickers",
    material: "High Quality PVC",
    finish: "chrome-mirror",
    finishLabel: "Chrome Mirror",
    color: "Chrome Gold",
    adhesive: "High Tack, Air Release",
    thickness: "~150 Micron",
    sizes: DEFAULT_SIZES,
    stock: 24,
    featured: true,
    bestSeller: true,
    newArrival: false,
    seoTitle: "Chrome Gold Car Wrap | Mirror Finish Vinyl | Raju Stickers",
    seoDescription:
      "Buy Chrome Gold mirror-finish car wrap online. Premium 1.52×18m PVC vinyl with air-release adhesive. Shop Raju Stickers.",
    altText: "Chrome gold mirror finish car wrap on a luxury sedan with product roll",
    applicationInstructions: SHARED_APPLICATION,
    careInstructions: SHARED_CARE,
    details: buildDetails({ color: "Chrome Gold (Mirror Finish)", finish: "Chrome Mirror" }),
    faq: SHARED_FAQ,
  },
  {
    id: "rsp-holographic-carbon",
    slug: "holographic-carbon-fiber-rainbow-wrap",
    name: "Holographic Carbon Fiber Rainbow Wrap",
    shortDescription: "Rainbow holographic carbon texture that shifts with every angle.",
    description:
      "Make a statement with holographic carbon fiber rainbow wrap. The woven carbon look meets colour-shifting holographic depth for motorsport energy and night-time presence. Ideal for accents, roofs, mirrors, or full bold builds.",
    price: 19999,
    compareAtPrice: 22999,
    currency: "INR",
    images: ["/products/holographic-carbon.jpg"],
    category: "carbon-fiber",
    categories: ["carbon-fiber", "chrome-wraps", "bike-wraps"],
    tags: ["holographic", "carbon", "rainbow", "racing", "jdm"],
    keywords: ["holographic car wrap", "rainbow carbon wrap", "jdm wrap", "racing vinyl"],
    sku: "RS-HCR-152-18",
    brand: "Raju Stickers",
    material: "High Quality PVC",
    finish: "holographic",
    finishLabel: "Holographic Carbon",
    color: "Rainbow Holographic Carbon",
    adhesive: "High Tack, Air Release",
    thickness: "~150 Micron",
    sizes: DEFAULT_SIZES,
    stock: 18,
    featured: true,
    bestSeller: true,
    newArrival: true,
    seoTitle: "Holographic Carbon Fiber Rainbow Car Wrap | Raju Stickers",
    seoDescription:
      "Shop holographic carbon fiber rainbow car wrap. Colour-shifting PVC vinyl for racing and JDM style builds.",
    altText: "Holographic carbon fiber rainbow car wrap with real roll photo",
    applicationInstructions: SHARED_APPLICATION,
    careInstructions: SHARED_CARE,
    details: buildDetails({
      color: "Holographic Carbon Fiber (Rainbow)",
      finish: "Holographic Carbon",
    }),
    faq: SHARED_FAQ,
  },
  {
    id: "rsp-gloss-white",
    slug: "gloss-white-car-wrap",
    name: "Gloss White Car Wrap",
    shortDescription: "Clean gloss white finish for a timeless premium look.",
    description:
      "Transform your ride with Gloss White Car Wrap. A smooth, high-gloss solid finish that reads clean, modern, and premium — perfect for full wraps, contrast accents, or restoring a sharp showroom look.",
    price: 12999,
    compareAtPrice: 14999,
    currency: "INR",
    images: ["/products/gloss-white.jpg"],
    category: "solid-colors",
    categories: ["solid-colors", "bike-wraps"],
    tags: ["white", "gloss", "minimal", "clean", "solid"],
    keywords: ["gloss white wrap", "white car wrap", "minimal car wrap", "solid colour vinyl"],
    sku: "RS-GW-152-18",
    brand: "Raju Stickers",
    material: "High Quality PVC",
    finish: "gloss-solid",
    finishLabel: "Gloss Solid",
    color: "Gloss White",
    adhesive: "High Tack, Air Release",
    thickness: "~150 Micron",
    sizes: DEFAULT_SIZES,
    stock: 40,
    featured: true,
    bestSeller: true,
    newArrival: false,
    seoTitle: "Gloss White Car Wrap | Premium Solid Vinyl | Raju Stickers",
    seoDescription:
      "Buy gloss white car wrap online. Clean premium PVC vinyl for full or partial wraps. Fast shipping from Raju Stickers.",
    altText: "Gloss white car wrap applied on a sedan with roll photo",
    applicationInstructions: SHARED_APPLICATION,
    careInstructions: SHARED_CARE,
    details: buildDetails({ color: "Gloss White", finish: "Gloss Solid" }),
    faq: SHARED_FAQ,
  },
  {
    id: "rsp-nardo-blue",
    slug: "nardo-blue-car-wrap",
    name: "Nardo Blue Car Wrap",
    shortDescription: "Subtle yet stunning gloss Nardo Blue for modern builds.",
    description:
      "Nardo Blue Car Wrap delivers that sought-after cool blue tone with a refined gloss finish. Subtle from a distance, striking up close — ideal for OEM-plus restyles and clean performance aesthetics.",
    price: 15999,
    compareAtPrice: 17999,
    currency: "INR",
    images: ["/products/nardo-blue.jpg"],
    category: "solid-colors",
    categories: ["solid-colors", "metallic-wraps", "bike-wraps"],
    tags: ["nardo blue", "blue", "gloss", "modern", "audi style"],
    keywords: ["nardo blue wrap", "blue car wrap", "nardo blue vinyl india"],
    sku: "RS-NB-152-18",
    brand: "Raju Stickers",
    material: "High Quality PVC",
    finish: "gloss-solid",
    finishLabel: "Gloss",
    color: "Nardo Blue",
    adhesive: "High Tack, Air Release",
    thickness: "~150 Micron",
    sizes: DEFAULT_SIZES,
    stock: 22,
    featured: true,
    bestSeller: false,
    newArrival: false,
    seoTitle: "Nardo Blue Car Wrap | Gloss Vinyl Wrap | Raju Stickers",
    seoDescription:
      "Shop Nardo Blue gloss car wrap. Premium PVC film for a subtle yet stunning vehicle finish.",
    altText: "Nardo blue gloss car wrap on BMW-style sedan",
    applicationInstructions: SHARED_APPLICATION,
    careInstructions: SHARED_CARE,
    details: buildDetails({ color: "Nardo Blue (Gloss)", finish: "Gloss" }),
    faq: SHARED_FAQ,
  },
  {
    id: "rsp-carbon-fiber",
    slug: "carbon-fiber-car-wrap",
    name: "Carbon Fiber Car Wrap",
    shortDescription: "Authentic-look carbon weave for motorsport character.",
    description:
      "Carbon Fiber Car Wrap brings motorsport texture to roofs, hoods, mirrors, and full builds. High-resolution weave detail, durable PVC construction, and air-release adhesive for professional results.",
    price: 16999,
    compareAtPrice: 18999,
    currency: "INR",
    images: ["/products/carbon-fiber.jpg"],
    category: "carbon-fiber",
    categories: ["carbon-fiber", "bike-wraps"],
    tags: ["carbon fiber", "racing", "motorsport", "black", "texture"],
    keywords: ["carbon fiber wrap", "carbon vinyl", "racing car wrap", "bike carbon wrap"],
    sku: "RS-CF-152-18",
    brand: "Raju Stickers",
    material: "High Quality PVC",
    finish: "carbon-fiber",
    finishLabel: "Carbon Fiber",
    color: "Carbon Fiber Black/Grey",
    adhesive: "High Tack, Air Release",
    thickness: "~150 Micron",
    sizes: DEFAULT_SIZES,
    stock: 30,
    featured: true,
    bestSeller: true,
    newArrival: false,
    seoTitle: "Carbon Fiber Car Wrap | Motorsport Vinyl | Raju Stickers",
    seoDescription:
      "Buy carbon fiber car wrap online. Premium textured PVC for racing style roofs, accents, and full wraps.",
    altText: "Carbon fiber car wrap with textured weave detail and roll photo",
    applicationInstructions: SHARED_APPLICATION,
    careInstructions: SHARED_CARE,
    details: buildDetails({ color: "Carbon Fiber (Black/Grey)", finish: "Carbon Fiber" }),
    faq: SHARED_FAQ,
  },
  {
    id: "rsp-chrome-silver",
    slug: "chrome-silver-mirror-car-wrap",
    name: "Chrome Silver Mirror Car Wrap",
    shortDescription: "Ultra-reflective chrome silver that turns heads everywhere.",
    description:
      "Chrome Silver Mirror Car Wrap reflects your style with a true mirror finish. High-impact show car energy with durable PVC film and air-release adhesive for cleaner application on panels and accents.",
    price: 20999,
    compareAtPrice: 23999,
    currency: "INR",
    images: ["/products/chrome-silver.jpg"],
    category: "chrome-wraps",
    categories: ["chrome-wraps", "bike-wraps"],
    tags: ["chrome", "silver", "mirror", "show car", "reflective"],
    keywords: ["chrome silver wrap", "mirror wrap", "silver chrome vinyl"],
    sku: "RS-CS-152-18",
    brand: "Raju Stickers",
    material: "High Quality PVC",
    finish: "chrome-mirror",
    finishLabel: "Chrome Mirror",
    color: "Chrome Silver",
    adhesive: "High Tack, Air Release",
    thickness: "~150 Micron",
    sizes: DEFAULT_SIZES,
    stock: 16,
    featured: true,
    bestSeller: false,
    newArrival: true,
    seoTitle: "Chrome Silver Mirror Car Wrap | Raju Stickers",
    seoDescription:
      "Shop chrome silver mirror-finish car wrap. Premium reflective vinyl rolls for bold vehicle transformations.",
    altText: "Chrome silver mirror finish car wrap on luxury sedan",
    applicationInstructions: SHARED_APPLICATION,
    careInstructions: SHARED_CARE,
    details: buildDetails({ color: "Chrome Silver (Mirror Finish)", finish: "Chrome Mirror" }),
    faq: SHARED_FAQ,
  },
  {
    id: "rsp-chrome-red",
    slug: "chrome-red-car-wrap",
    name: "Chrome Red Car Wrap",
    shortDescription: "Fierce chrome red mirror finish for pure attitude.",
    description:
      "Wrap your passion on wheels with Chrome Red Car Wrap. A fierce mirror-red finish that delivers maximum presence for show builds, accents, and full transformations.",
    price: 21999,
    compareAtPrice: 24999,
    currency: "INR",
    images: ["/products/chrome-red.jpg"],
    category: "chrome-wraps",
    categories: ["chrome-wraps", "bike-wraps"],
    tags: ["chrome", "red", "mirror", "racing", "bold"],
    keywords: ["chrome red wrap", "red mirror wrap", "racing red vinyl"],
    sku: "RS-CR-152-18",
    brand: "Raju Stickers",
    material: "High Quality PVC",
    finish: "chrome-mirror",
    finishLabel: "Chrome Mirror",
    color: "Chrome Red",
    adhesive: "High Tack, Air Release",
    thickness: "~150 Micron",
    sizes: DEFAULT_SIZES,
    stock: 14,
    featured: true,
    bestSeller: true,
    newArrival: false,
    seoTitle: "Chrome Red Car Wrap | Mirror Finish Vinyl | Raju Stickers",
    seoDescription:
      "Buy Chrome Red mirror car wrap. Bold reflective PVC vinyl for racing-inspired vehicle style.",
    altText: "Chrome red mirror finish car wrap product showcase",
    applicationInstructions: SHARED_APPLICATION,
    careInstructions: SHARED_CARE,
    details: buildDetails({ color: "Chrome Red (Mirror Finish)", finish: "Chrome Mirror" }),
    faq: SHARED_FAQ,
  },
  {
    id: "rsp-nardo-blue-metallic",
    slug: "nardo-blue-metallic-car-wrap",
    name: "Nardo Blue Metallic Car Wrap",
    shortDescription: "Metallic Nardo Blue with depth and elegant flake.",
    description:
      "Nardo Blue Metallic Car Wrap adds metallic depth to the iconic cool-blue tone. Elegant from every angle with premium gloss metallic character for refined custom builds.",
    price: 17499,
    compareAtPrice: 19499,
    currency: "INR",
    images: ["/products/nardo-blue-metallic.jpg"],
    category: "metallic-wraps",
    categories: ["metallic-wraps", "solid-colors", "bike-wraps"],
    tags: ["nardo blue", "metallic", "blue", "elegant", "premium"],
    keywords: ["nardo blue metallic wrap", "metallic blue car wrap"],
    sku: "RS-NBM-152-18",
    brand: "Raju Stickers",
    material: "High Quality PVC",
    finish: "metallic-gloss",
    finishLabel: "Metallic Gloss",
    color: "Nardo Blue Metallic",
    adhesive: "High Tack, Air Release",
    thickness: "~150 Micron",
    sizes: DEFAULT_SIZES,
    stock: 20,
    featured: false,
    bestSeller: false,
    newArrival: true,
    seoTitle: "Nardo Blue Metallic Car Wrap | Raju Stickers",
    seoDescription:
      "Shop Nardo Blue Metallic car wrap. Premium metallic PVC vinyl with elegant depth and gloss.",
    altText: "Nardo blue metallic car wrap on sedan in modern showroom",
    applicationInstructions: SHARED_APPLICATION,
    careInstructions: SHARED_CARE,
    details: buildDetails({ color: "Nardo Blue Metallic", finish: "Metallic Gloss" }),
    faq: SHARED_FAQ,
  },
  {
    id: "rsp-metallic-red-matte",
    slug: "metallic-red-matte-car-wrap",
    name: "Metallic Red Matte Car Wrap",
    shortDescription: "Matte metallic red for luxury low-sheen attitude.",
    description:
      "Metallic Red Matte Car Wrap combines rich red metallic pigment with a controlled matte finish. Premium, modern, and aggressive without high-gloss glare.",
    price: 18499,
    compareAtPrice: 20999,
    currency: "INR",
    images: ["/products/metallic-red-matte.jpg"],
    category: "matte-wraps",
    categories: ["matte-wraps", "metallic-wraps", "bike-wraps"],
    tags: ["matte", "red", "metallic", "luxury", "low sheen"],
    keywords: ["matte red wrap", "metallic red matte vinyl", "matte car wrap"],
    sku: "RS-MRM-152-18",
    brand: "Raju Stickers",
    material: "High Quality PVC",
    finish: "matte",
    finishLabel: "Matte Metallic",
    color: "Metallic Red Matte",
    adhesive: "High Tack, Air Release",
    thickness: "~150 Micron",
    sizes: DEFAULT_SIZES,
    stock: 17,
    featured: true,
    bestSeller: false,
    newArrival: true,
    seoTitle: "Metallic Red Matte Car Wrap | Raju Stickers",
    seoDescription:
      "Buy metallic red matte car wrap. Luxury low-sheen PVC vinyl for bold custom vehicle builds.",
    altText: "Metallic red matte car wrap applied on performance sedan",
    applicationInstructions: SHARED_APPLICATION,
    careInstructions: [
      ...SHARED_CARE,
      "Avoid wax and gloss sealants on matte finishes — use matte-safe cleaners only.",
    ],
    details: buildDetails({ color: "Metallic Red (Matte Finish)", finish: "Matte Metallic" }),
    faq: SHARED_FAQ,
  },
  {
    id: "rsp-iridescent-matte",
    slug: "iridescent-matte-car-wrap",
    name: "Iridescent Matte Car Wrap",
    shortDescription: "Colour-shifting matte iridescence in blue, purple, and pink.",
    description:
      "Iridescent Matte Car Wrap shifts colour with every angle — soft blue to purple to pink — while keeping a refined matte surface. Built for people who want imagination, not imitation.",
    price: 19499,
    compareAtPrice: 22499,
    currency: "INR",
    images: ["/products/iridescent-matte.jpg"],
    category: "matte-wraps",
    categories: ["matte-wraps", "chrome-wraps", "bike-wraps"],
    tags: ["iridescent", "matte", "colour shift", "custom", "unique"],
    keywords: ["iridescent wrap", "colour shifting wrap", "matte iridescent vinyl"],
    sku: "RS-IM-152-18",
    brand: "Raju Stickers",
    material: "High Quality PVC",
    finish: "iridescent",
    finishLabel: "Iridescent Matte",
    color: "Iridescent Blue-Purple-Pink",
    adhesive: "High Tack, Air Release",
    thickness: "~150 Micron",
    sizes: DEFAULT_SIZES,
    stock: 12,
    featured: true,
    bestSeller: false,
    newArrival: true,
    seoTitle: "Iridescent Matte Car Wrap | Colour-Shift Vinyl | Raju Stickers",
    seoDescription:
      "Shop iridescent matte car wrap with blue-purple-pink colour shift. Unique premium vinyl from Raju Stickers.",
    altText: "Iridescent matte colour-shifting car wrap on white BMW-style sedan",
    applicationInstructions: SHARED_APPLICATION,
    careInstructions: [
      ...SHARED_CARE,
      "Use only matte-safe cleaners to preserve the colour-shift effect.",
    ],
    details: buildDetails({
      color: "Iridescent Matte (Blue-Purple-Pink)",
      finish: "Iridescent Matte",
    }),
    faq: SHARED_FAQ,
  },
  {
    id: "rsp-metallic-blue",
    slug: "metallic-blue-car-wrap",
    name: "Metallic Blue Car Wrap",
    shortDescription: "Rich gloss metallic blue with long-lasting shine.",
    description:
      "Metallic Blue Car Wrap delivers rich gloss, premium flake depth, and long-lasting colour. A versatile finish for full wraps and high-visibility accents on cars and bikes.",
    price: 16499,
    compareAtPrice: 18499,
    currency: "INR",
    images: ["/products/metallic-blue.jpg"],
    category: "metallic-wraps",
    categories: ["metallic-wraps", "bike-wraps"],
    tags: ["metallic", "blue", "gloss", "premium", "vibrant"],
    keywords: ["metallic blue wrap", "blue metallic car wrap", "gloss blue vinyl"],
    sku: "RS-MB-152-18",
    brand: "Raju Stickers",
    material: "High Quality PVC",
    finish: "metallic-gloss",
    finishLabel: "Metallic Gloss",
    color: "Metallic Blue",
    adhesive: "High Tack, Air Release",
    thickness: "~150 Micron",
    sizes: DEFAULT_SIZES,
    stock: 26,
    featured: false,
    bestSeller: true,
    newArrival: false,
    seoTitle: "Metallic Blue Car Wrap | Gloss Metallic Vinyl | Raju Stickers",
    seoDescription:
      "Buy metallic blue car wrap online. Rich gloss PVC vinyl for cars, bikes, and custom accents.",
    altText: "Metallic blue gloss car wrap with real roll photo",
    applicationInstructions: SHARED_APPLICATION,
    careInstructions: SHARED_CARE,
    details: buildDetails({ color: "Metallic Blue (Gloss Finish)", finish: "Metallic Gloss" }),
    faq: SHARED_FAQ,
  },
];

export const categoryMeta: Record<
  ProductCategory,
  { name: string; slug: string; description: string; seoTitle: string; seoDescription: string }
> = {
  "chrome-wraps": {
    name: "Chrome Wraps",
    slug: "chrome-wraps",
    description: "Mirror chrome finishes in gold, silver, red, and specialty reflective films.",
    seoTitle: "Chrome Car Wraps | Mirror Finish Vinyl | Raju Stickers",
    seoDescription:
      "Shop chrome and mirror-finish car wraps. Gold, silver, red, and holographic options from Raju Stickers.",
  },
  "metallic-wraps": {
    name: "Metallic Wraps",
    slug: "metallic-wraps",
    description: "Metallic gloss wraps with depth, flake, and premium colour richness.",
    seoTitle: "Metallic Car Wraps | Raju Stickers",
    seoDescription: "Browse metallic car wraps in blue and specialty tones. Premium PVC vinyl rolls.",
  },
  "matte-wraps": {
    name: "Matte Wraps",
    slug: "matte-wraps",
    description: "Low-sheen matte and iridescent matte wraps for modern custom builds.",
    seoTitle: "Matte Car Wraps | Raju Stickers",
    seoDescription: "Shop matte and iridescent matte car wraps for a refined low-sheen finish.",
  },
  "carbon-fiber": {
    name: "Carbon Fiber",
    slug: "carbon-fiber",
    description: "Carbon weave and holographic carbon wraps for motorsport style.",
    seoTitle: "Carbon Fiber Car Wraps | Raju Stickers",
    seoDescription: "Buy carbon fiber and holographic carbon car wraps for racing-inspired style.",
  },
  "solid-colors": {
    name: "Solid Colors",
    slug: "solid-colors",
    description: "Clean solid finishes including gloss white and Nardo Blue.",
    seoTitle: "Solid Color Car Wraps | Raju Stickers",
    seoDescription: "Shop solid colour car wraps — gloss white, Nardo Blue, and more.",
  },
  "bike-wraps": {
    name: "Bike Wraps",
    slug: "bike-wraps",
    description: "Wrap films suitable for bikes, helmets, and two-wheeler accents.",
    seoTitle: "Bike Wraps & Vinyl | Raju Stickers",
    seoDescription: "Premium vinyl wraps for bikes and two-wheelers. Same pro-grade film, flexible sizing.",
  },
  custom: {
    name: "Custom Stickers",
    slug: "custom",
    description: "Create custom text stickers and specialty vinyl pieces.",
    seoTitle: "Custom Car Stickers | Raju Stickers",
    seoDescription: "Design custom car stickers with your text, colour, and size.",
  },
};

export function matchProducts(list: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((p) => {
    const haystack = [
      p.name,
      p.description,
      p.shortDescription,
      p.category,
      p.color,
      p.finishLabel,
      p.sku,
      ...p.tags,
      ...p.keywords,
      ...p.categories,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q) || q.split(/\s+/).every((word) => haystack.includes(word));
  });
}

export function relatedFromList(list: Product[], product: Product, limit = 4): Product[] {
  return list
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.tags.some((t) => product.tags.includes(t))),
    )
    .slice(0, limit);
}

export function getUnitPrice(product: Product, sizeId: string): number {
  const size = product.sizes.find((s) => s.id === sizeId) || product.sizes[0];
  if (!size) return product.price;
  if (typeof size.price === "number" && size.price > 0) return size.price;
  return Math.round(product.price * size.priceMultiplier);
}

export function getTradeUnitPrice(product: Product, sizeId: string): number {
  const base = product.tradePrice ?? Math.round(product.price * 0.9);
  const size = product.sizes.find((s) => s.id === sizeId) || product.sizes[0];
  if (!size) return base;
  return Math.round(base * size.priceMultiplier);
}

export { SHARED_FEATURES, SHARED_APPLICATION, SHARED_CARE, SHARED_FAQ };
