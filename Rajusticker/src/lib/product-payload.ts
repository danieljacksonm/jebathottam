import { z } from "zod";
import { SHARED_APPLICATION, SHARED_CARE, SHARED_FAQ } from "@/lib/catalog";
import { slugify } from "@/lib/slug";
import type { ProductCategory } from "@/types";

export const productPayloadSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  price: z.coerce.number().int().positive(),
  compareAtPrice: z.coerce.number().int().positive().optional().nullable(),
  tradePrice: z.coerce.number().int().positive().optional().nullable(),
  sku: z.string().min(2),
  category: z.string().min(2),
  finish: z.string().min(2),
  finishLabel: z.string().min(2),
  color: z.string().min(2),
  stock: z.coerce.number().int().min(0),
  shortDescription: z.string().min(4),
  description: z.string().min(8),
  imageUrl: z.string().min(1),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  published: z.boolean().default(true),
  sizes: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        widthCm: z.coerce.number(),
        lengthM: z.coerce.number(),
        priceMultiplier: z.coerce.number().positive(),
      }),
    )
    .min(1),
});

export type ProductPayload = z.infer<typeof productPayloadSchema>;

export function payloadToWrite(input: ProductPayload, id: string) {
  const slug = slugify(input.slug || input.name);
  const categories = [input.category as ProductCategory];
  return {
    id,
    slug,
    name: input.name.trim(),
    description: input.description.trim(),
    shortDescription: input.shortDescription.trim(),
    price: input.price,
    compareAtPrice: input.compareAtPrice ?? null,
    tradePrice: input.tradePrice ?? Math.round(input.price * 0.9),
    currency: "INR",
    imageUrl: input.imageUrl,
    imagesJson: JSON.stringify([input.imageUrl]),
    category: input.category,
    categoriesJson: JSON.stringify(categories),
    tagsJson: JSON.stringify([input.finishLabel.toLowerCase(), input.color.toLowerCase()]),
    keywordsJson: JSON.stringify([input.name.toLowerCase(), input.sku.toLowerCase()]),
    sku: input.sku.trim().toUpperCase(),
    brand: "Raju Stickers",
    material: "High Quality PVC",
    finish: input.finish,
    finishLabel: input.finishLabel,
    color: input.color,
    adhesive: "High Tack, Air Release",
    thickness: "~150 Micron",
    stock: input.stock,
    featured: input.featured,
    bestSeller: input.bestSeller,
    newArrival: input.newArrival,
    published: input.published,
    seoTitle: `${input.name} | Raju Stickers`,
    seoDescription: input.shortDescription.slice(0, 160),
    altText: input.name,
    applicationJson: JSON.stringify(SHARED_APPLICATION),
    careJson: JSON.stringify(SHARED_CARE),
    detailsJson: JSON.stringify([
      { label: "Brand", value: "Raju Stickers" },
      { label: "Color", value: input.color },
      { label: "Finish", value: input.finishLabel },
      { label: "SKU", value: input.sku.trim().toUpperCase() },
    ]),
    faqJson: JSON.stringify(SHARED_FAQ),
    sizes: input.sizes.map((size) => ({
      sizeKey: slugify(size.id) || "size",
      label: size.label,
      widthCm: size.widthCm,
      lengthM: size.lengthM,
      priceMultiplier: size.priceMultiplier,
    })),
  };
}
