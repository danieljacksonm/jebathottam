import type { Prisma } from "@prisma/client";
import type { FinishType, Product as CatalogProduct, ProductCategory } from "@/types";
import { prisma } from "@/lib/db";
import {
  catalogProducts,
  categoryMeta,
  getTradeUnitPrice,
  getUnitPrice,
  matchProducts,
  relatedFromList,
} from "@/lib/catalog";

type ProductRow = Prisma.ProductGetPayload<{ include: { sizes: true } }>;

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function mapProduct(row: ProductRow): CatalogProduct {
  const images = parseJson<string[]>(row.imagesJson, []);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    shortDescription: row.shortDescription,
    price: row.price,
    compareAtPrice: row.compareAtPrice ?? undefined,
    tradePrice: row.tradePrice ?? undefined,
    currency: "INR",
    images: images.length > 0 ? images : [row.imageUrl],
    category: row.category as ProductCategory,
    categories: parseJson<ProductCategory[]>(row.categoriesJson, [row.category as ProductCategory]),
    tags: parseJson<string[]>(row.tagsJson, []),
    keywords: parseJson<string[]>(row.keywordsJson, []),
    sku: row.sku,
    brand: row.brand,
    material: row.material,
    finish: row.finish as FinishType,
    finishLabel: row.finishLabel,
    color: row.color,
    adhesive: row.adhesive,
    thickness: row.thickness,
    sizes: row.sizes.map((size) => ({
      id: size.sizeKey,
      label: size.label,
      widthCm: size.widthCm,
      lengthM: size.lengthM,
      priceMultiplier: size.priceMultiplier,
      price: size.price ?? undefined,
    })),
    stock: row.stock,
    published: row.published,
    featured: row.featured,
    bestSeller: row.bestSeller,
    newArrival: row.newArrival,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    altText: row.altText,
    applicationInstructions: parseJson<string[]>(row.applicationJson, []),
    careInstructions: parseJson<string[]>(row.careJson, []),
    details: parseJson<{ label: string; value: string }[]>(row.detailsJson, []),
    faq: parseJson<{ question: string; answer: string }[]>(row.faqJson, []),
  };
}

const includeSizes = { sizes: { orderBy: { priceMultiplier: "desc" as const } } };

export async function getAllProducts(): Promise<CatalogProduct[]> {
  const rows = await prisma.product.findMany({
    where: { published: true },
    include: includeSizes,
    orderBy: { name: "asc" },
  });
  return rows.map(mapProduct);
}

export async function getAllProductsAdmin(): Promise<CatalogProduct[]> {
  const rows = await prisma.product.findMany({
    include: includeSizes,
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | undefined> {
  const row = await prisma.product.findFirst({
    where: { slug, published: true },
    include: includeSizes,
  });
  return row ? mapProduct(row) : undefined;
}

export async function getProductById(id: string): Promise<CatalogProduct | undefined> {
  const row = await prisma.product.findUnique({
    where: { id },
    include: includeSizes,
  });
  return row ? mapProduct(row) : undefined;
}

export async function getProductsByCategory(category: ProductCategory): Promise<CatalogProduct[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.category === category || p.categories.includes(category));
}

export async function getFeaturedProducts(limit = 8): Promise<CatalogProduct[]> {
  const rows = await prisma.product.findMany({
    where: { published: true, featured: true },
    include: includeSizes,
    take: limit,
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(mapProduct);
}

export async function getBestSellers(limit = 8): Promise<CatalogProduct[]> {
  const rows = await prisma.product.findMany({
    where: { published: true, bestSeller: true },
    include: includeSizes,
    take: limit,
    orderBy: { name: "asc" },
  });
  return rows.map(mapProduct);
}

export async function getRelatedProducts(product: CatalogProduct, limit = 4): Promise<CatalogProduct[]> {
  const all = await getAllProducts();
  return relatedFromList(all, product, limit);
}

export async function searchProducts(query: string): Promise<CatalogProduct[]> {
  const all = await getAllProducts();
  return matchProducts(all, query);
}

export async function getServerProductPrice(productId: string, sizeId: string, quantity: number) {
  const product = await getProductById(productId);
  if (!product || product.published === false || product.stock < quantity) return null;
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return null;
  const unit = getUnitPrice(product, sizeId);
  return {
    product,
    unitPrice: unit,
    lineTotal: unit * quantity,
  };
}

export function toCreateData(product: CatalogProduct, published = true) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    shortDescription: product.shortDescription,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
    tradePrice: product.tradePrice ?? Math.round(product.price * 0.9),
    currency: "INR",
    imageUrl: product.images[0] || "/products/chrome-gold.jpg",
    imagesJson: JSON.stringify(product.images),
    category: product.category,
    categoriesJson: JSON.stringify(product.categories),
    tagsJson: JSON.stringify(product.tags),
    keywordsJson: JSON.stringify(product.keywords),
    sku: product.sku,
    brand: product.brand,
    material: product.material,
    finish: product.finish,
    finishLabel: product.finishLabel,
    color: product.color,
    adhesive: product.adhesive,
    thickness: product.thickness,
    stock: product.stock,
    featured: product.featured,
    bestSeller: product.bestSeller,
    newArrival: product.newArrival,
    published,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    altText: product.altText,
    applicationJson: JSON.stringify(product.applicationInstructions),
    careJson: JSON.stringify(product.careInstructions),
    detailsJson: JSON.stringify(product.details),
    faqJson: JSON.stringify(product.faq),
    sizes: {
      create: product.sizes.map((size) => ({
        sizeKey: size.id,
        label: size.label,
        widthCm: size.widthCm,
        lengthM: size.lengthM,
        priceMultiplier: size.priceMultiplier,
        price: size.price ?? null,
      })),
    },
  };
}

export { categoryMeta, catalogProducts, getUnitPrice, getTradeUnitPrice };
