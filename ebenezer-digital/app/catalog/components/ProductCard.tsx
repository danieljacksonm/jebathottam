import Link from "next/link";
import {
  formatINR,
  getBestOffer,
  getMerchant,
  isOfferStale,
} from "@/lib/catalog/query";
import type { CatalogProduct } from "@/app/catalog/types";
import { buildAffiliateRedirectPath } from "@/lib/catalog/affiliate";
import { freshnessLabel, resolveProductImage } from "@/lib/affiliate/images";
import { AffiliateMedia } from "@/components/AffiliateMedia";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const offer = getBestOffer(product.id);
  const merchant = offer ? getMerchant(offer.merchantId) : null;
  const stale = offer ? isOfferStale(offer) : false;
  const image = resolveProductImage({
    name: product.name,
    brand: product.brand,
    image: product.image,
    imageSourceType: product.imageSourceType,
    brandDomain: product.brandDomain,
  });

  const specs = [
    product.specs.cpu,
    product.specs.ram_gb != null ? `${product.specs.ram_gb}GB RAM` : null,
    product.specs.storage_gb != null ? `${product.specs.storage_gb}GB SSD` : null,
    product.specs.capacity_gb != null ? `${product.specs.capacity_gb}GB` : null,
    product.specs.gpu && String(product.specs.gpu).length < 40 ? product.specs.gpu : null,
  ].filter(Boolean) as string[];

  return (
    <article className="aff-card flex flex-col">
      <Link href={`/catalog/p/${product.slug}`}>
        <AffiliateMedia image={image} />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--aff-muted)]">{product.brand}</p>
        <Link
          href={`/catalog/p/${product.slug}`}
          className="mt-1 font-semibold text-[var(--aff-ink)] hover:text-[var(--aff-brand-dk)]"
        >
          {product.name}
        </Link>
        {product.rating != null ? (
          <p className="mt-1 text-xs text-amber-600">★ {product.rating.toFixed(1)}{product.reviewCount ? ` · ${product.reviewCount} reviews` : ""}</p>
        ) : null}
        <ul className="mt-2 space-y-0.5 text-xs text-[var(--aff-muted)]">
          {specs.slice(0, 3).map((s) => (
            <li key={s}>{String(s)}</li>
          ))}
        </ul>
        <div className="mt-auto pt-4">
          {offer ? (
            <>
              <p className="text-lg font-bold text-[var(--aff-ink)]">{formatINR(offer.price)}</p>
              <p className="text-xs text-[var(--aff-muted)]">
                From {merchant?.name ?? "Merchant"}
                {stale ? <span className="aff-stale"> · Check latest price</span> : null}
              </p>
              <p className="aff-fresh mt-1">{freshnessLabel(offer.lastCheckedAt)}</p>
            </>
          ) : (
            <p className="text-sm text-[var(--aff-muted)]">Check latest price</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href={`/catalog/p/${product.slug}`} className="aff-btn aff-btn-ghost !py-1.5 !px-3 !text-xs">
              Compare prices
            </Link>
            {offer ? (
              <a
                href={buildAffiliateRedirectPath(offer.id)}
                className="aff-btn aff-btn-primary !py-1.5 !px-3 !text-xs"
                rel="sponsored noopener noreferrer"
              >
                View deal
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
