import Link from "next/link";
import type { Product } from "@/types";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { Media } from "@/components/media/Media";
import { focalFromSrc } from "@/lib/image-art";

export function ProductCard({ product }: { product: Product }) {
  const badge = product.newArrival
    ? "New"
    : product.bestSeller
      ? "Best Seller"
      : null;

  return (
    <article className="group flex flex-col h-full">
      <Link href={`/stickers/${product.slug}`} className="relative block border border-[var(--line)]">
        <Media
          src={product.images[0]}
          alt={product.altText}
          kind="product"
          zoom
          crop="frame"
          cropScale={1.4}
          focal={focalFromSrc(product.images[0])}
        />
        {badge && <span className="absolute top-3 left-3 badge z-10">{badge}</span>}
      </Link>

      <div className="pt-3.5 flex flex-col flex-1 gap-1.5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
          {product.finishLabel}
        </p>
        <Link href={`/stickers/${product.slug}`} className="hover:text-[var(--accent)] transition-colors">
          <h3 className="font-display text-[0.95rem] sm:text-[1.05rem] leading-snug min-h-[2.4em] line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
        <div className="mt-auto pt-3">
          <AddToCartButton product={product} className="btn-sm w-full" label="Add to Cart" />
        </div>
      </div>
    </article>
  );
}
