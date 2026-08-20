/**
 * Normalize CSV/JSON rows into catalog product + offer shapes.
 * Only for approved feeds / manual import — not scraping.
 */

import type { CatalogCategoryId, CatalogProduct, Offer } from "@/app/catalog/types";

export type ImportRow = Record<string, unknown>;

function str(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  return String(v).trim();
}

function num(v: unknown): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(String(v).replace(/[,₹$]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function normalizeImportRows(rows: ImportRow[]): {
  products: CatalogProduct[];
  offers: Offer[];
  errors: string[];
} {
  const products: CatalogProduct[] = [];
  const offers: Offer[] = [];
  const errors: string[] = [];
  const now = new Date().toISOString();

  rows.forEach((row, i) => {
    const name = str(row.name || row.title);
    const brand = str(row.brand);
    const categoryId = str(row.category || row.categoryId || "laptops") as CatalogCategoryId;
    if (!name) {
      errors.push(`Row ${i + 1}: missing name`);
      return;
    }
    const id = str(row.id) || `imp_${slugify(name)}_${i}`;
    const slug = str(row.slug) || slugify(`${brand}-${name}`);
    const specs: CatalogProduct["specs"] = {};
    const cpu = str(row.cpu);
    const gpu = str(row.gpu);
    if (cpu) specs.cpu = cpu;
    if (gpu) specs.gpu = gpu;
    const ram = num(row.ram_gb ?? row.ram);
    const storage = num(row.storage_gb ?? row.storage);
    const cpuScore = num(row.cpu_score);
    const gpuScore = num(row.gpu_score);
    if (ram != null) specs.ram_gb = ram;
    if (storage != null) specs.storage_gb = storage;
    if (cpuScore != null) specs.cpu_score = cpuScore;
    if (gpuScore != null) specs.gpu_score = gpuScore;
    const product: CatalogProduct = {
      id,
      slug,
      name,
      brand: brand || "Unknown",
      model: str(row.model) || name,
      categoryId,
      shortDescription: str(row.shortDescription || row.tagline) || name,
      description: str(row.description) || "Information unavailable",
      image: str(row.image) || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
      specs,
      pros: str(row.pros)
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean),
      cons: str(row.cons)
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean),
      bestFor: str(row.bestFor)
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean),
      notIdealFor: str(row.notIdealFor)
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean),
      status: "active",
      updatedAt: now,
    };
    products.push(product);

    const price = num(row.price);
    if (price != null) {
      offers.push({
        id: `off_${id}_${str(row.merchantId || "manual")}`,
        productId: id,
        merchantId: str(row.merchantId) || "amazon-in",
        price,
        currency: (str(row.currency) as "INR" | "USD") || "INR",
        availability: (str(row.availability) as Offer["availability"]) || "unknown",
        url: str(row.url) || str(row.affiliateUrl) || "https://ebenezerdigital.com/catalog",
        affiliateUrl: str(row.affiliateUrl) || undefined,
        lastCheckedAt: str(row.lastCheckedAt) || now,
        source: "manual",
        confidence: "low",
      });
    }
  });

  return { products, offers, errors };
}
