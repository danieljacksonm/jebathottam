import Image from "next/image";
import Link from "next/link";
import { categoryMeta } from "@/lib/catalog";
import type { ProductCategory } from "@/types";

const CATEGORY_IMAGES: Partial<Record<ProductCategory, string>> = {
  "chrome-wraps": "/products/chrome-gold.jpg",
  "metallic-wraps": "/products/metallic-blue.jpg",
  "matte-wraps": "/products/metallic-red-matte.jpg",
  "carbon-fiber": "/products/carbon-fiber.jpg",
  "solid-colors": "/products/gloss-white.jpg",
  "bike-wraps": "/products/nardo-blue.jpg",
  custom: "/products/iridescent-matte.jpg",
};

export function CategoryCard({ category }: { category: ProductCategory }) {
  const meta = categoryMeta[category];
  const image = CATEGORY_IMAGES[category] || "/products/chrome-gold.jpg";

  return (
    <Link
      href={category === "custom" ? "/custom-stickers" : `/shop/${meta.slug}`}
      className="group relative block overflow-hidden border border-[var(--line)] min-h-[200px] sm:min-h-[240px]"
    >
      <Image
        src={image}
        alt={`${meta.name} collection`}
        fill
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <h3 className="font-display text-lg sm:text-xl text-white tracking-[0.04em]">{meta.name}</h3>
        <p className="mt-1 text-[11px] text-white/65 line-clamp-2 leading-relaxed">{meta.description}</p>
      </div>
    </Link>
  );
}
