import type { StoreProduct } from "./data";
import { STORE_PRODUCTS } from "./data";

function scoreRelated(base: StoreProduct, other: StoreProduct): number {
  if (other.status !== "published" || other.id === base.id) return -1;
  let score = 0;
  if (other.productType === base.productType) score += 8;
  if (other.category === base.category) score += 5;
  if (other.isBundle && base.isBundle) score += 2;
  if (base.isBundle && other.isBundle === false && (base.bundleItems || []).includes(other.slug)) score += 12;
  if (other.isBundle && (other.bundleItems || []).includes(base.slug)) score += 10;

  const baseTags = new Set((base.tags || []).map((t) => t.toLowerCase()));
  for (const t of other.tags || []) {
    if (baseTags.has(t.toLowerCase())) score += 3;
  }

  const baseTech = new Set((base.techStack || []).map((t) => t.toLowerCase()));
  for (const t of other.techStack || []) {
    if (baseTech.has(t.toLowerCase())) score += 2;
  }

  // Prefer usable tools/templates over free PDF resources when viewing tools/templates
  if (
    (base.productType === "digital_tool" ||
      base.productType === "website_template" ||
      base.productType === "software") &&
    (other.productType === "free_resource" || other.productType === "ebook" || other.productType === "documentation")
  ) {
    score -= 4;
  }

  return score;
}

/** Smart “You may also need” recommendations for product pages. */
export function getRelatedProducts(product: StoreProduct, limit = 4): StoreProduct[] {
  return STORE_PRODUCTS.map((p) => ({ p, score: scoreRelated(product, p) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name))
    .slice(0, limit)
    .map((x) => x.p);
}
