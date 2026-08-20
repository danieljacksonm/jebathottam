import type { CatalogProduct } from "@/app/catalog/types";

/**
 * Normalized product identity matching.
 * Prefer strong identifiers. Never merge products solely because titles look similar.
 */

export type ProductIdentity = {
  gtin?: string;
  mpn?: string;
  sku?: string;
  asin?: string;
  brand?: string;
  model?: string;
};

function norm(s?: string): string {
  return (s || "").trim().toLowerCase().replace(/\s+/g, " ");
}

export function identitiesMatch(a: ProductIdentity, b: ProductIdentity): boolean {
  if (a.gtin && b.gtin && norm(a.gtin) === norm(b.gtin)) return true;
  if (a.asin && b.asin && norm(a.asin) === norm(b.asin)) return true;
  if (a.mpn && b.mpn && a.brand && b.brand && norm(a.mpn) === norm(b.mpn) && norm(a.brand) === norm(b.brand)) {
    return true;
  }
  if (a.sku && b.sku && a.brand && b.brand && norm(a.sku) === norm(b.sku) && norm(a.brand) === norm(b.brand)) {
    return true;
  }
  // Weak fallback only when brand + exact model both present and equal
  if (a.brand && b.brand && a.model && b.model && norm(a.brand) === norm(b.brand) && norm(a.model) === norm(b.model)) {
    return true;
  }
  return false;
}

export function findMatchingProducts(
  needle: ProductIdentity,
  catalog: CatalogProduct[]
): CatalogProduct[] {
  return catalog.filter((p) =>
    identitiesMatch(needle, {
      gtin: p.gtin,
      mpn: p.mpn,
      sku: p.sku,
      brand: p.brand,
      model: p.model,
    })
  );
}

export function productIdentityKey(p: CatalogProduct): string {
  if (p.gtin) return `gtin:${norm(p.gtin)}`;
  if (p.mpn && p.brand) return `mpn:${norm(p.brand)}:${norm(p.mpn)}`;
  if (p.sku && p.brand) return `sku:${norm(p.brand)}:${norm(p.sku)}`;
  return `model:${norm(p.brand)}:${norm(p.model)}:${p.id}`;
}
