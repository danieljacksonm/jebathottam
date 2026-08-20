import Link from "next/link";
import {
  formatINR,
  getBestOffer,
  getMerchant,
  isOfferStale,
} from "@/lib/catalog/query";
import type { CatalogProduct } from "@/app/catalog/types";
import { buildAffiliateRedirectPath } from "@/lib/catalog/affiliate";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const offer = getBestOffer(product.id);
  const merchant = offer ? getMerchant(offer.merchantId) : null;
  const stale = offer ? isOfferStale(offer) : false;

  return (
    <article className="c-card flex flex-col">
      <Link href={`/catalog/p/${product.slug}`} className="block aspect-[16/10] bg-slate-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--c-muted)]">{product.brand}</p>
        <Link href={`/catalog/p/${product.slug}`} className="mt-1 font-semibold text-[var(--c-ink)] hover:text-[var(--c-brand-dk)]">
          {product.name}
        </Link>
        <p className="mt-1.5 text-sm text-[var(--c-muted)] line-clamp-2">{product.shortDescription}</p>
        <div className="mt-auto pt-4 flex items-end justify-between gap-2">
          <div>
            {offer ? (
              <>
                <p className="text-lg font-bold text-[var(--c-ink)]">{formatINR(offer.price)}</p>
                <p className="text-xs text-[var(--c-muted)]">
                  {merchant?.name ?? "Merchant"}
                  {stale ? <span className="c-stale"> · Price may have changed</span> : null}
                </p>
              </>
            ) : (
              <p className="text-sm text-[var(--c-muted)]">Information unavailable</p>
            )}
          </div>
          {offer ? (
            <a
              href={buildAffiliateRedirectPath(offer.id)}
              className="text-xs font-semibold text-[var(--c-brand-dk)] hover:underline"
              rel="sponsored noopener noreferrer"
            >
              Check price →
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
