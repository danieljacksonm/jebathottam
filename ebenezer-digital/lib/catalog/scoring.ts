import {
  getBestOffer,
  getOffersForProduct,
  listActiveProducts,
  getProductById,
  getProductBySlug,
} from "@/lib/catalog/query";
import type {
  CatalogProduct,
  Offer,
  RecommendationRequest,
  RecommendationResult,
  ScoreFactor,
  ScoredProduct,
  UseCase,
} from "@/app/catalog/types";

const USE_CASE_WEIGHTS: Record<UseCase, Partial<Record<ScoreFactor, number>>> = {
  gaming: {
    gpu: 1.4,
    cpu: 1.1,
    display: 1.0,
    ram: 0.9,
    storage: 0.8,
    battery: 0.4,
    portability: 0.4,
    price_value: 1.0,
    rating: 0.7,
    availability: 0.6,
    warranty: 0.5,
  },
  programming: {
    cpu: 1.3,
    ram: 1.3,
    storage: 1.0,
    display: 0.9,
    battery: 0.9,
    portability: 0.8,
    gpu: 0.5,
    price_value: 1.1,
    rating: 0.7,
    availability: 0.6,
    warranty: 0.5,
  },
  photoshop: {
    cpu: 1.1,
    ram: 1.3,
    display: 1.2,
    gpu: 0.9,
    storage: 1.0,
    battery: 0.7,
    portability: 0.7,
    price_value: 1.0,
    rating: 0.7,
    availability: 0.6,
    warranty: 0.5,
  },
  video_editing: {
    cpu: 1.3,
    gpu: 1.3,
    ram: 1.4,
    storage: 1.2,
    display: 1.0,
    battery: 0.5,
    portability: 0.5,
    price_value: 0.9,
    rating: 0.7,
    availability: 0.6,
    warranty: 0.5,
  },
  office: {
    battery: 1.3,
    portability: 1.1,
    display: 0.9,
    cpu: 0.8,
    ram: 0.9,
    storage: 0.8,
    gpu: 0.3,
    price_value: 1.2,
    rating: 0.8,
    availability: 0.7,
    warranty: 0.6,
  },
  students: {
    price_value: 1.4,
    battery: 1.1,
    portability: 1.0,
    cpu: 0.9,
    ram: 1.0,
    storage: 0.9,
    display: 0.8,
    gpu: 0.4,
    rating: 0.7,
    availability: 0.7,
    warranty: 0.6,
  },
  general: {
    price_value: 1.1,
    cpu: 1.0,
    ram: 1.0,
    storage: 0.9,
    display: 0.8,
    battery: 0.8,
    gpu: 0.6,
    portability: 0.7,
    rating: 0.7,
    availability: 0.6,
    warranty: 0.5,
  },
};

function num(specs: CatalogProduct["specs"], key: string): number {
  const v = specs[key];
  return typeof v === "number" ? v : 0;
}

function mergeWeights(useCases: UseCase[]): Record<ScoreFactor, number> {
  const base: Record<ScoreFactor, number> = {
    price_value: 1,
    cpu: 1,
    gpu: 1,
    ram: 1,
    storage: 1,
    display: 1,
    battery: 1,
    portability: 1,
    warranty: 1,
    rating: 1,
    availability: 1,
  };
  const cases = useCases.length ? useCases : (["general"] as UseCase[]);
  for (const key of Object.keys(base) as ScoreFactor[]) {
    let sum = 0;
    for (const uc of cases) sum += USE_CASE_WEIGHTS[uc][key] ?? 1;
    base[key] = sum / cases.length;
  }
  return base;
}

function scoreProduct(
  product: CatalogProduct,
  offer: Offer | null,
  req: RecommendationRequest,
  weights: Record<ScoreFactor, number>
): ScoredProduct {
  const breakdown: Partial<Record<ScoreFactor, number>> = {};
  const reasons: string[] = [];
  const specs = product.specs;

  const cpu = num(specs, "cpu_score") || Math.min(100, num(specs, "ram_gb") * 2);
  const gpu = num(specs, "gpu_score") || num(specs, "storage_score") || 30;
  const ram = Math.min(100, (num(specs, "ram_gb") || num(specs, "capacity_gb") / 4 || 8) * 5);
  const storage = Math.min(100, (num(specs, "storage_gb") || num(specs, "capacity_gb") || 256) / 10);
  const display =
    num(specs, "display_score") ||
    Math.min(100, (num(specs, "refresh_hz") || 60) / 1.5 + (num(specs, "display_inches") || 14));
  const battery = Math.min(100, (num(specs, "battery_wh") || 40) * 1.4);
  const portability = Math.max(0, 100 - (num(specs, "weight_kg") || 2) * 30);
  const warranty = Math.min(100, (num(specs, "warranty_years") || 1) * 30);
  const rating = product.rating ? product.rating * 20 : 50;

  let availability = 50;
  if (offer?.availability === "in_stock") availability = 100;
  else if (offer?.availability === "limited") availability = 70;
  else if (offer?.availability === "out_of_stock") availability = 10;
  else if (offer?.availability === "unknown") availability = 40;

  let priceValue = 55;
  if (offer && req.budget) {
    const ratio = offer.price / req.budget;
    if (ratio <= 0.85) {
      priceValue = 95;
      reasons.push(`Well under your budget (${Math.round(ratio * 100)}% of budget)`);
    } else if (ratio <= 1.0) {
      priceValue = 85;
      reasons.push("Fits within your stated budget");
    } else if (ratio <= 1.15) {
      priceValue = 55;
      reasons.push("Slightly above budget — only consider if features matter more");
    } else {
      priceValue = 20;
      reasons.push("Above your budget");
    }
  } else if (offer) {
    priceValue = 70;
  }

  breakdown.cpu = cpu;
  breakdown.gpu = gpu;
  breakdown.ram = ram;
  breakdown.storage = storage;
  breakdown.display = display;
  breakdown.battery = battery;
  breakdown.portability = portability;
  breakdown.warranty = warranty;
  breakdown.rating = rating;
  breakdown.availability = availability;
  breakdown.price_value = priceValue;

  let score = 0;
  let weightSum = 0;
  for (const factor of Object.keys(weights) as ScoreFactor[]) {
    const w = weights[factor];
    const v = breakdown[factor] ?? 50;
    score += w * v;
    weightSum += w;
  }
  score = weightSum ? score / weightSum : 0;

  if (num(specs, "ram_gb") >= 16) reasons.push("16GB+ RAM helps multitasking");
  if (num(specs, "gpu_score") >= 50) reasons.push("Discrete / stronger GPU for games or creative apps");
  if (num(specs, "cpu_score") >= 75) reasons.push("Strong CPU for development workloads");
  if (product.bestFor.length) reasons.push(`Best for: ${product.bestFor.slice(0, 2).join(", ")}`);

  return { product, score, breakdown, bestOffer: offer, reasons: reasons.slice(0, 5) };
}

function matchesFilters(product: CatalogProduct, offer: Offer | null, req: RecommendationRequest): boolean {
  if (req.categoryId && product.categoryId !== req.categoryId) return false;
  if (req.preferredBrands?.length) {
    const ok = req.preferredBrands.some((b) => product.brand.toLowerCase() === b.toLowerCase());
    if (!ok) return false;
  }
  if (req.budget && offer && offer.price > req.budget * 1.2) return false;
  if (req.minSpecs) {
    for (const [k, v] of Object.entries(req.minSpecs)) {
      if (typeof v === "number") {
        const pv = product.specs[k];
        if (typeof pv === "number" && pv < v) return false;
      }
    }
  }
  if (req.query) {
    const q = req.query.toLowerCase();
    const hay = `${product.name} ${product.brand} ${product.model} ${product.shortDescription} ${product.categoryId}`.toLowerCase();
    const tokens = q.split(/\s+/).filter((t) => t.length > 2 && !["for", "and", "the", "with", "under"].includes(t));
    if (tokens.length && !tokens.some((t) => hay.includes(t))) {
      // allow through if budget/category already set — query may be natural language
      if (!req.categoryId && !req.budget) return false;
    }
  }
  return true;
}

/**
 * Deterministic recommendation engine.
 * AI must only explain these results — never invent ranking.
 */
export function recommend(req: RecommendationRequest): RecommendationResult {
  const weights = mergeWeights(req.useCases ?? ["general"]);
  if (req.priorities) {
    for (const [k, v] of Object.entries(req.priorities)) {
      if (typeof v === "number") weights[k as ScoreFactor] = v;
    }
  }

  const scored: ScoredProduct[] = [];
  for (const product of listActiveProducts()) {
    if (product.status !== "active") continue;
    const offer = getBestOffer(product.id);
    if (!matchesFilters(product, offer, req)) continue;
    scored.push(scoreProduct(product, offer, req, weights));
  }

  scored.sort((a, b) => b.score - a.score);

  const notes: string[] = [
    "Rankings are generated from structured product data and your requirements.",
    "Prices are sample/demo values until live affiliate feeds are connected — verify on the merchant site before buying.",
  ];
  if (!scored.length) {
    notes.push("No products matched your filters. Try a higher budget or broader category.");
  }

  const underBudget = req.budget
    ? scored.filter((s) => s.bestOffer && s.bestOffer.price <= req.budget!)
    : scored;

  const buckets: RecommendationResult["buckets"] = {};
  if (scored[0]) buckets.best_overall = scored[0];
  if (underBudget[0]) buckets.best_budget = underBudget[underBudget.length - 1] && underBudget.length > 1
    ? underBudget.reduce((best, cur) =>
        cur.bestOffer && best.bestOffer && cur.bestOffer.price < best.bestOffer.price ? cur : best
      )
    : underBudget[0];
  const byPerf = [...scored].sort(
    (a, b) =>
      (b.breakdown.cpu ?? 0) + (b.breakdown.gpu ?? 0) - ((a.breakdown.cpu ?? 0) + (a.breakdown.gpu ?? 0))
  );
  if (byPerf[0]) buckets.best_performance = byPerf[0];
  const byValue = [...scored].sort((a, b) => (b.breakdown.price_value ?? 0) - (a.breakdown.price_value ?? 0));
  if (byValue[0]) buckets.best_value = byValue[0];
  if (scored.length) {
    const premium = [...scored].sort((a, b) => (b.bestOffer?.price ?? 0) - (a.bestOffer?.price ?? 0))[0];
    buckets.best_premium = premium;
  }

  return { buckets, ranked: scored, notes };
}

export function parseNaturalQuery(text: string): RecommendationRequest {
  const lower = text.toLowerCase();
  const req: RecommendationRequest = { query: text, currency: "INR", country: "IN" };

  const budgetMatch =
    lower.match(/(?:₹|rs\.?\s*|inr\s*)\s*([\d,]+)/i) ||
    lower.match(/under\s+([\d,]+)/i) ||
    lower.match(/below\s+([\d,]+)/i) ||
    lower.match(/budget\s+(?:of\s+)?([\d,]+)/i);
  if (budgetMatch) {
    req.budget = Number(budgetMatch[1].replace(/,/g, ""));
  }

  if (/\blaptop/.test(lower)) req.categoryId = "laptops";
  else if (/\bssd\b/.test(lower)) req.categoryId = "ssd";
  else if (/\bram\b/.test(lower)) req.categoryId = "ram";
  else if (/\bmonitor/.test(lower)) req.categoryId = "monitors";
  else if (/\bgpu\b|graphics card/.test(lower)) req.categoryId = "gpu";
  else if (/\bphone|smartphone/.test(lower)) req.categoryId = "smartphones";

  const useCases: UseCase[] = [];
  if (/cod|develop|program|web\s*dev/.test(lower)) useCases.push("programming");
  if (/game|gaming|rtx/.test(lower)) useCases.push("gaming");
  if (/photoshop|design|photo/.test(lower)) useCases.push("photoshop");
  if (/edit|premiere|video/.test(lower)) useCases.push("video_editing");
  if (/office|excel|word/.test(lower)) useCases.push("office");
  if (/student|college|study/.test(lower)) useCases.push("students");
  if (useCases.length) req.useCases = useCases;

  const ramMatch = lower.match(/(\d+)\s*gb\s*ram/);
  if (ramMatch) req.minSpecs = { ...(req.minSpecs || {}), ram_gb: Number(ramMatch[1]) };

  return req;
}

export function getCompareRows(productIds: string[]) {
  const products = productIds
    .map((id) => getProductById(id) || getProductBySlug(id))
    .filter(Boolean) as CatalogProduct[];

  const keys = [
    "cpu",
    "gpu",
    "ram_gb",
    "storage_gb",
    "display_inches",
    "refresh_hz",
    "battery_wh",
    "weight_kg",
    "warranty_years",
    "os",
  ];

  return {
    products,
    offers: products.map((p) => ({ productId: p.id, offers: getOffersForProduct(p.id) })),
    specKeys: keys,
  };
}
