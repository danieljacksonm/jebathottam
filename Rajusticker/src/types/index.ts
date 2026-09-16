export type ProductCategory =
  | "chrome-wraps"
  | "metallic-wraps"
  | "matte-wraps"
  | "carbon-fiber"
  | "solid-colors"
  | "bike-wraps"
  | "custom";

export type FinishType =
  | "chrome-mirror"
  | "metallic-gloss"
  | "matte"
  | "carbon-fiber"
  | "holographic"
  | "iridescent"
  | "gloss-solid";

export type ProductSize = {
  id: string;
  label: string;
  widthCm: number;
  lengthM: number;
  priceMultiplier: number;
  price?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  tradePrice?: number;
  currency: "INR";
  images: string[];
  category: ProductCategory;
  categories: ProductCategory[];
  tags: string[];
  keywords: string[];
  sku: string;
  brand: string;
  material: string;
  finish: FinishType;
  finishLabel: string;
  color: string;
  adhesive: string;
  thickness: string;
  sizes: ProductSize[];
  stock: number;
  published?: boolean;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  seoTitle: string;
  seoDescription: string;
  altText: string;
  applicationInstructions: string[];
  careInstructions: string[];
  details: { label: string; value: string }[];
  faq: { question: string; answer: string }[];
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  sizeId: string;
  sizeLabel: string;
  quantity: number;
};

export type CustomStickerDraft = {
  text: string;
  color: string;
  size: string;
  quantity: number;
  notes: string;
};

export type CheckoutFormData = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readingTime: string;
  image: string;
  imageAlt: string;
  tags: string[];
  relatedProductSlugs: string[];
  relatedArticleSlugs: string[];
  seoTitle: string;
  seoDescription: string;
  faq?: { question: string; answer: string }[];
};

export type RecommendationIntent =
  | "racing"
  | "jdm"
  | "funny"
  | "minimal"
  | "motivational"
  | "car-brand"
  | "motorsport"
  | "custom"
  | "chrome"
  | "matte"
  | "carbon"
  | "other";

export type AnalyticsEvent =
  | { name: "product_view"; productId: string; slug: string }
  | { name: "search"; query: string; resultsCount: number }
  | { name: "add_to_cart"; productId: string; quantity: number; price: number }
  | { name: "remove_from_cart"; productId: string }
  | { name: "begin_checkout"; itemCount: number; value: number }
  | { name: "purchase"; orderId: string; value: number };
