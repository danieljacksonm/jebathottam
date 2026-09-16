import Link from "next/link";
import { Media } from "@/components/media/Media";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

/**
 * Composition C + B — Featured drop as editorial art.
 * Full poster shown contained (honest artwork) — not forced into a car crop card.
 * Asymmetric ~55/45 split.
 */
export function FeaturedDrop({ product }: { product: Product }) {
  return (
    <section className="border-b border-[var(--line)] bg-[var(--bg-raised)]">
      <div className="grid lg:grid-cols-12 lg:min-h-[min(780px,90svh)]">
        <div className="lg:col-span-7 relative flex items-center justify-center bg-[#060608] px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
          <div className="w-full max-w-[420px] lg:max-w-[480px]">
            <Media
              src={product.images[0]}
              alt={product.altText}
              kind="poster"
              priority
              crop="none"
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="border border-[var(--line)] shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center px-[var(--gutter)] py-12 lg:py-16 lg:pl-12 xl:pl-16 border-t lg:border-t-0 lg:border-l border-[var(--line)]">
          <p className="section-kicker">New Drop</p>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[0.95] mt-3">
            {product.name}
          </h2>
          <p className="mt-5 text-[var(--ink-2)] max-w-sm leading-relaxed">
            {product.shortDescription}
          </p>
          <p className="price text-2xl mt-6">{formatPrice(product.price)}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/stickers/${product.slug}`} className="btn btn-primary">
              View Product →
            </Link>
            <Link href="/shop" className="btn btn-secondary">
              Full Catalogue
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
            <li>{product.finishLabel}</li>
            <li>{product.material}</li>
            <li>{product.thickness}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
