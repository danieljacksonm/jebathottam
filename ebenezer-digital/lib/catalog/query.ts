import { loadCatalogStore } from "./repository";
import type { CatalogProduct, Offer } from "@/app/catalog/types";
import { CATALOG_CATEGORIES } from "@/app/catalog/data";

export { filtersForCategory } from "./filters-schema";

export function listActiveProducts(): CatalogProduct[] {
  return loadCatalogStore().products.filter((p) => p.status === "active");
}

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return loadCatalogStore().products.find((p) => p.slug === slug && p.status === "active");
}

export function getProductById(id: string): CatalogProduct | undefined {
  return loadCatalogStore().products.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): CatalogProduct[] {
  return listActiveProducts().filter((p) => p.categoryId === categoryId);
}

export function getOffersForProduct(productId: string): Offer[] {
  return loadCatalogStore()
    .offers.filter((o) => o.productId === productId)
    .sort((a, b) => a.price - b.price);
}

export function getBestOffer(productId: string): Offer | null {
  const offers = getOffersForProduct(productId).filter((o) => o.availability !== "out_of_stock");
  return offers[0] ?? null;
}

export function getMerchant(id: string) {
  return loadCatalogStore().merchants.find((m) => m.id === id);
}

export function getCategory(id: string) {
  return CATALOG_CATEGORIES.find((c) => c.id === id || c.slug === id);
}

export function listGuides(publishedOnly = true) {
  const guides = loadCatalogStore().guides;
  return publishedOnly ? guides.filter((g) => g.status === "published") : guides;
}

export function getGuideBySlug(slug: string) {
  return loadCatalogStore().guides.find((g) => g.slug === slug && g.status === "published");
}

export function listComparisons(publishedOnly = true) {
  const rows = loadCatalogStore().comparisons;
  return publishedOnly ? rows.filter((c) => c.status === "published") : rows;
}

export function getComparisonBySlug(slug: string) {
  return loadCatalogStore().comparisons.find((c) => c.slug === slug && c.status === "published");
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isOfferStale(offer: Offer, maxAgeHours = 72) {
  const age = Date.now() - new Date(offer.lastCheckedAt).getTime();
  return age > maxAgeHours * 60 * 60 * 1000;
}

export type FilterParams = Record<string, string | undefined>;

export function applyProductFilters(
  products: CatalogProduct[],
  filters: FilterParams,
  getOffer: (id: string) => Offer | null
): CatalogProduct[] {
  return products.filter((p) => {
    if (filters.brand && p.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
    if (filters.os && String(p.specs.os || "").toLowerCase() !== filters.os.toLowerCase()) return false;
    if (filters.ddr_gen && String(p.specs.ddr_gen || "") !== filters.ddr_gen) return false;
    if (filters.form_factor && String(p.specs.form_factor || "") !== filters.form_factor) return false;
    if (
      filters.interface &&
      !String(p.specs.interface || "").toLowerCase().includes(filters.interface.toLowerCase())
    ) {
      return false;
    }
    if (filters.panel && String(p.specs.panel || "") !== filters.panel) return false;

    const minChecks: Array<[string, string]> = [
      ["ram_gb", "ram_gb"],
      ["storage_gb", "storage_gb"],
      ["capacity_gb", "capacity_gb"],
      ["refresh_hz", "refresh_hz"],
      ["speed_mt", "speed_mt"],
      ["read_mbps", "read_mbps"],
      ["vram_gb", "vram_gb"],
    ];
    for (const [param, specKey] of minChecks) {
      if (filters[param]) {
        const min = Number(filters[param]);
        const val = Number(p.specs[specKey] ?? 0);
        if (!Number.isNaN(min) && val < min) return false;
      }
    }

    if (filters.display_inches) {
      if (String(p.specs.display_inches) !== filters.display_inches) return false;
    }
    if (filters.size_inches) {
      if (String(p.specs.size_inches) !== filters.size_inches) return false;
    }

    if (filters.price_max) {
      const max = Number(filters.price_max);
      const offer = getOffer(p.id);
      if (!Number.isNaN(max) && offer && offer.price > max) return false;
      if (!Number.isNaN(max) && !offer) return false;
    }

    if (filters.q) {
      const q = filters.q.toLowerCase();
      const hay = `${p.name} ${p.brand} ${p.model} ${p.shortDescription}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function paginate<T>(items: T[], page = 1, pageSize = 12) {
  const p = Math.max(1, page);
  const size = Math.min(48, Math.max(1, pageSize));
  const start = (p - 1) * size;
  return {
    items: items.slice(start, start + size),
    page: p,
    pageSize: size,
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
  };
}
