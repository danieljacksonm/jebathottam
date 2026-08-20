/** Ebenezer Products (physical) — core domain types */

export type CatalogCategoryId =
  | "laptops"
  | "desktops"
  | "mini-pcs"
  | "workstations"
  | "cpu"
  | "gpu"
  | "motherboard"
  | "ram"
  | "ssd"
  | "hdd"
  | "psu"
  | "monitors"
  | "keyboards"
  | "mice"
  | "headphones"
  | "smartphones"
  | "tablets"
  | "routers"
  | "wifi"
  | "switches"
  | "adapters"
  | "webcams"
  | "microphones"
  | "laptop-bags"
  | "usb-hubs"
  | "cables"
  | "chargers"
  | "cooling";

export type CatalogCategory = {
  id: CatalogCategoryId;
  name: string;
  slug: string;
  description: string;
  parent?:
    | "computers"
    | "components"
    | "displays"
    | "peripherals"
    | "mobile"
    | "networking"
    | "accessories";
};

export type SpecValue = string | number | boolean | null;

export type ProductSpecs = Record<string, SpecValue>;

export type Merchant = {
  id: string;
  name: string;
  logo?: string;
  website: string;
  country: string;
  currency: "INR" | "USD";
  affiliateNetwork?: string;
  status: "active" | "paused";
};

export type Offer = {
  id: string;
  productId: string;
  variantId?: string;
  merchantId: string;
  price: number;
  currency: "INR" | "USD";
  availability: "in_stock" | "limited" | "out_of_stock" | "unknown";
  url: string;
  affiliateUrl?: string;
  shippingNote?: string;
  warranty?: string;
  lastCheckedAt: string; // ISO
  source: "manual" | "affiliate_feed" | "api";
  confidence: "high" | "medium" | "low";
};

export type ProductVariant = {
  id: string;
  productId: string;
  name: string;
  specs: ProductSpecs;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  categoryId: CatalogCategoryId;
  shortDescription: string;
  description: string;
  image: string;
  gallery?: string[];
  /** Image provenance — never use Unsplash for product representation */
  imageSourceType?:
    | "affiliate_feed"
    | "affiliate_api"
    | "merchant_feed"
    | "official"
    | "authorized_asset"
    | "brand_logo"
    | "branded_placeholder";
  imageSourceLabel?: string;
  brandDomain?: string;
  gtin?: string;
  mpn?: string;
  sku?: string;
  specs: ProductSpecs;
  pros: string[];
  cons: string[];
  bestFor: string[];
  notIdealFor: string[];
  rating?: number; // only if verified; else omit
  reviewCount?: number;
  releaseDate?: string;
  status: "active" | "archived";
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: string;
};

export type UseCase =
  | "programming"
  | "gaming"
  | "office"
  | "video_editing"
  | "photoshop"
  | "general"
  | "students";

export type RecommendationRequest = {
  budget?: number;
  currency?: "INR" | "USD";
  country?: string;
  categoryId?: CatalogCategoryId;
  useCases?: UseCase[];
  preferredBrands?: string[];
  minSpecs?: ProductSpecs;
  priorities?: Partial<Record<ScoreFactor, number>>;
  query?: string;
};

export type ScoreFactor =
  | "price_value"
  | "cpu"
  | "gpu"
  | "ram"
  | "storage"
  | "display"
  | "battery"
  | "portability"
  | "warranty"
  | "rating"
  | "availability";

export type ScoredProduct = {
  product: CatalogProduct;
  score: number;
  breakdown: Partial<Record<ScoreFactor, number>>;
  bestOffer: Offer | null;
  reasons: string[];
};

export type RecommendationBucket =
  | "best_overall"
  | "best_value"
  | "best_performance"
  | "best_budget"
  | "best_premium";

export type RecommendationResult = {
  buckets: Partial<Record<RecommendationBucket, ScoredProduct>>;
  ranked: ScoredProduct[];
  notes: string[];
};
