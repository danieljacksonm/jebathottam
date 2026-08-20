/**
 * Catalog persistence — separate from digital store.json.
 * Seeds from app/catalog/data.ts defaults, then persists admin edits to data/catalog.json.
 */

import fs from "fs";
import path from "path";
import type {
  CatalogProduct,
  Merchant,
  Offer,
  ProductVariant,
} from "@/app/catalog/types";
import {
  CATALOG_PRODUCTS as SEED_PRODUCTS,
  MERCHANTS as SEED_MERCHANTS,
  OFFERS as SEED_OFFERS,
  PRODUCT_VARIANTS as SEED_VARIANTS,
} from "@/app/catalog/data";

export type BuyingGuide = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  categoryId?: string;
  relatedProductIds: string[];
  seoTitle?: string;
  seoDescription?: string;
  status: "draft" | "published";
  updatedAt: string;
};

export type CuratedComparison = {
  id: string;
  slug: string;
  title: string;
  productIds: string[];
  recommendedProductId?: string;
  editorialNote?: string;
  status: "draft" | "published";
  updatedAt: string;
};

export type AnalyticsEvent = {
  id: string;
  type: "product_view" | "search" | "compare" | "affiliate_click" | "recommend";
  productId?: string;
  offerId?: string;
  query?: string;
  meta?: Record<string, string | number | boolean>;
  createdAt: string;
};

export type CatalogStore = {
  products: CatalogProduct[];
  offers: Offer[];
  merchants: Merchant[];
  variants: ProductVariant[];
  guides: BuyingGuide[];
  comparisons: CuratedComparison[];
  events: AnalyticsEvent[];
  updatedAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const CATALOG_FILE = path.join(DATA_DIR, "catalog.json");

const DEFAULT_GUIDES: BuyingGuide[] = [
  {
    id: "guide-laptop-50k",
    slug: "best-laptop-under-50000",
    title: "Best laptop under ₹50,000",
    excerpt: "What matters for study and light work when your budget is tight.",
    content: `## Who this guide is for
Students and first-time buyers who need a reliable Windows laptop under ₹50,000.

## What to prioritise
1. **RAM** — prefer 16GB if possible; 8GB fills up fast with Chrome.
2. **SSD** — 512GB NVMe is ideal; avoid HDD-only machines.
3. **CPU** — modern Ryzen 5 or Intel i5 generation matters more than brand stickers.
4. **Display** — Full HD IPS is enough; ignore 4K at this price.
5. **Battery** — check Wh rating and real reviews; gaming shells drain faster.

## What to skip
- Dedicated GPUs that force heat and noise into a thin budget chassis
- Fake “gaming” labels without RTX-class cards
- Inflated “compare at” prices

## How Ebenezer ranks
We score CPU, RAM, storage, price fit, and ratings from structured catalog data — not invented claims.

## Next step
Use [Find My Product](/catalog/recommend?q=laptop%20under%2050000%20for%20students) with your exact use case.`,
    categoryId: "laptops",
    relatedProductIds: ["lp-aspire5-ryzen5", "lp-ideapad-slim3"],
    seoTitle: "Best Laptop under ₹50,000 — Buying Guide",
    seoDescription: "Practical guide to choosing a laptop under ₹50,000 for study and everyday work.",
    status: "published",
    updatedAt: "2026-08-18T10:00:00.000Z",
  },
  {
    id: "guide-ssd-gaming",
    slug: "best-ssd-for-gaming",
    title: "Best SSD for gaming",
    excerpt: "NVMe vs SATA, Gen3 vs Gen4, and how much capacity you actually need.",
    content: `## Quick answer
For most gaming PCs in India, a **1TB PCIe Gen4 NVMe** (M.2 2280) is the sweet spot.

## Checklist
- Confirm your motherboard has an M.2 slot
- Gen4 needs a Gen4-capable slot for full speed
- 1TB leaves room for Windows + several large games
- Prefer drives with clear warranty (3–5 years)

## Avoid
- Buying SATA SSDs for a free M.2 Gen4 slot
- Extremely cheap no-name drives with no warranty data

Open the [SSD category](/catalog/ssd) and compare offers before you buy.`,
    categoryId: "ssd",
    relatedProductIds: ["ssd-wd-sn770-1tb"],
    status: "published",
    updatedAt: "2026-08-18T10:00:00.000Z",
  },
  {
    id: "guide-ram-laptop",
    slug: "best-ram-for-laptops",
    title: "Best RAM for laptops",
    excerpt: "DDR4 vs DDR5, SODIMM, and how much RAM coding and Photoshop need.",
    content: `## How much RAM?
- **8GB** — basic browsing (tight)
- **16GB** — coding, Office, light Photoshop
- **32GB** — heavy multitasking, VMs, serious creative work

## Critical
Laptop RAM is usually **SODIMM**. Desktop DIMM will not fit.
Match **DDR4 vs DDR5** to your motherboard/laptop generation.

If RAM is soldered, upgrade may be impossible — check the product page specs.`,
    categoryId: "ram",
    relatedProductIds: ["ram-corsair-32-ddr4"],
    status: "published",
    updatedAt: "2026-08-18T10:00:00.000Z",
  },
];

const DEFAULT_COMPARISONS: CuratedComparison[] = [
  {
    id: "cmp-aspire-ideapad",
    slug: "aspire-5-vs-ideapad-slim-3",
    title: "Acer Aspire 5 vs Lenovo IdeaPad Slim 3",
    productIds: ["lp-aspire5-ryzen5", "lp-ideapad-slim3"],
    recommendedProductId: "lp-ideapad-slim3",
    editorialNote:
      "For coding + light Photoshop under ₹60k, IdeaPad Slim 3 usually edges ahead on CPU and portability. Aspire 5 remains strong value if price is lower.",
    status: "published",
    updatedAt: "2026-08-18T10:00:00.000Z",
  },
];

function seedClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function seedStore(): CatalogStore {
  return {
    products: seedClone(SEED_PRODUCTS),
    offers: seedClone(SEED_OFFERS),
    merchants: seedClone(SEED_MERCHANTS),
    variants: seedClone(SEED_VARIANTS),
    guides: seedClone(DEFAULT_GUIDES),
    comparisons: seedClone(DEFAULT_COMPARISONS),
    events: [],
    updatedAt: new Date().toISOString(),
  };
}

let memory: CatalogStore | null = null;

export function loadCatalogStore(): CatalogStore {
  if (memory) return memory;
  try {
    if (fs.existsSync(CATALOG_FILE)) {
      const raw = fs.readFileSync(CATALOG_FILE, "utf-8");
      const parsed = JSON.parse(raw) as CatalogStore;
      memory = {
        ...seedStore(),
        ...parsed,
        products: (parsed.products?.length ? parsed.products : seedStore().products).map((p) => {
          const seed = SEED_PRODUCTS.find((s) => s.id === p.id);
          // Strip Unsplash; prefer authorized seed images / brand logos
          if (p.image && /unsplash\.com/i.test(p.image)) {
            if (seed) {
              return {
                ...p,
                image: seed.image,
                imageSourceType: seed.imageSourceType,
                imageSourceLabel: seed.imageSourceLabel,
                brandDomain: seed.brandDomain || p.brandDomain,
                gtin: p.gtin || seed.gtin,
                mpn: p.mpn || seed.mpn,
                sku: p.sku || seed.sku,
              };
            }
            return { ...p, image: "", imageSourceType: "branded_placeholder" as const };
          }
          if (seed && (!p.brandDomain || !p.imageSourceType)) {
            return {
              ...p,
              brandDomain: p.brandDomain || seed.brandDomain,
              imageSourceType: p.imageSourceType || seed.imageSourceType,
              imageSourceLabel: p.imageSourceLabel || seed.imageSourceLabel,
              image: p.image || seed.image,
            };
          }
          return p;
        }),
        offers: parsed.offers?.length ? parsed.offers : seedStore().offers,
        merchants: parsed.merchants?.length ? parsed.merchants : seedStore().merchants,
        guides: parsed.guides?.length ? parsed.guides : seedStore().guides,
        comparisons: parsed.comparisons?.length ? parsed.comparisons : seedStore().comparisons,
        variants: parsed.variants?.length ? parsed.variants : seedStore().variants,
        events: Array.isArray(parsed.events) ? parsed.events.slice(-5000) : [],
      };
      return memory;
    }
  } catch (e) {
    console.error("Failed to load catalog.json", e);
  }
  memory = seedStore();
  saveCatalogStore(memory);
  return memory;
}

export function saveCatalogStore(store: CatalogStore): void {
  store.updatedAt = new Date().toISOString();
  memory = store;
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(CATALOG_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save catalog.json", e);
  }
}

export function mutateCatalog(mutator: (store: CatalogStore) => void): CatalogStore {
  const store = loadCatalogStore();
  mutator(store);
  saveCatalogStore(store);
  return store;
}

export function trackEvent(
  event: Omit<AnalyticsEvent, "id" | "createdAt"> & { id?: string; createdAt?: string }
): void {
  mutateCatalog((store) => {
    store.events.push({
      id: event.id || `ev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: event.type,
      productId: event.productId,
      offerId: event.offerId,
      query: event.query,
      meta: event.meta,
      createdAt: event.createdAt || new Date().toISOString(),
    });
    if (store.events.length > 5000) {
      store.events = store.events.slice(-4000);
    }
  });
}

export function getAnalyticsSummary() {
  const store = loadCatalogStore();
  const events = store.events;
  const count = (type: AnalyticsEvent["type"]) => events.filter((e) => e.type === type).length;
  const topProducts = Object.entries(
    events
      .filter((e) => e.productId && (e.type === "product_view" || e.type === "affiliate_click"))
      .reduce<Record<string, number>>((acc, e) => {
        acc[e.productId!] = (acc[e.productId!] || 0) + 1;
        return acc;
      }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([productId, hits]) => ({ productId, hits }));

  return {
    totalEvents: events.length,
    productViews: count("product_view"),
    searches: count("search"),
    compares: count("compare"),
    affiliateClicks: count("affiliate_click"),
    recommends: count("recommend"),
    topProducts,
    updatedAt: store.updatedAt,
  };
}
