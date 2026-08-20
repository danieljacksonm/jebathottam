import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CatalogNav } from "../../components/CatalogNav";
import { CatalogAskAi } from "../../components/CatalogAskAi";
import { TrackView } from "../../components/TrackView";
import {
  formatINR,
  getBestOffer,
  getCategory,
  getMerchant,
  getOffersForProduct,
  getProductBySlug,
  getProductsByCategory,
  isOfferStale,
} from "@/lib/catalog/query";
import {
  buildAffiliateRedirectPath,
  discloseAffiliate,
} from "@/lib/catalog/affiliate";
import { freshnessLabel, resolveProductImage } from "@/lib/affiliate/images";
import { AffiliateMedia } from "@/components/AffiliateMedia";

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Product" };
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

export default function ProductDetailPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const category = getCategory(product.categoryId);
  const offers = getOffersForProduct(product.id);
  const best = getBestOffer(product.id);
  const alternatives = getProductsByCategory(product.categoryId)
    .filter((p) => p.id !== product.id)
    .slice(0, 3);
  const resolvedImage = resolveProductImage({
    name: product.name,
    brand: product.brand,
    image: product.image,
    imageSourceType: product.imageSourceType,
    brandDomain: product.brandDomain,
  });

  const specEntries = Object.entries(product.specs).filter(([k]) => !k.endsWith("_score"));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: product.brand,
    description: product.shortDescription,
    image: resolvedImage.sourceType === "branded_placeholder" ? undefined : resolvedImage.url,
    sku: product.sku || product.id,
    mpn: product.mpn,
    gtin: product.gtin,
    ...(best
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: best.currency,
            lowPrice: best.price,
            offerCount: offers.length,
            availability:
              best.availability === "in_stock"
                ? "https://schema.org/InStock"
                : "https://schema.org/LimitedAvailability",
          },
        }
      : {}),
    ...(product.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount || 1,
          },
        }
      : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Products", item: "https://products.ebenezerdigital.com/catalog" },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: category.name,
              item: `https://products.ebenezerdigital.com/catalog/${category.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: category ? 3 : 2,
        name: product.name,
        item: `https://products.ebenezerdigital.com/catalog/p/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <TrackView productId={product.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <CatalogNav />
      <div className="c-page py-8">
        <p className="text-sm text-[var(--c-muted)]">
          <Link href="/catalog" className="hover:text-[var(--c-brand)]">
            Products
          </Link>
          {category ? (
            <>
              {" / "}
              <Link href={`/catalog/${category.slug}`} className="hover:text-[var(--c-brand)]">
                {category.name}
              </Link>
            </>
          ) : null}
          {" / "}
          {product.name}
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="aff-card overflow-hidden p-2">
            <AffiliateMedia image={resolvedImage} size="hero" showSource />
          </div>

          <div>
            <p className="text-sm font-medium text-[var(--aff-muted)]">{product.brand}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="mt-3 text-[var(--aff-ink-2)]">{product.shortDescription}</p>

            <div className="mt-5 rounded-xl border border-[var(--aff-line)] bg-white p-4">
              {best ? (
                <>
                  <p className="text-sm text-[var(--aff-muted)]">Best listed sample price</p>
                  <p className="text-3xl font-extrabold mt-1">{formatINR(best.price)}</p>
                  <p className="text-sm text-[var(--aff-muted)] mt-1">
                    at {getMerchant(best.merchantId)?.name ?? "merchant"}
                    {isOfferStale(best) ? <span className="aff-stale"> · Check latest price</span> : null}
                  </p>
                  <p className="aff-fresh mt-2">{freshnessLabel(best.lastCheckedAt)}</p>
                </>
              ) : (
                <p className="text-[var(--aff-muted)]">Check latest price</p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {best ? (
                <a
                  href={buildAffiliateRedirectPath(best.id)}
                  className="aff-btn aff-btn-primary"
                  rel="sponsored noopener noreferrer"
                >
                  Check best price
                </a>
              ) : null}
              <Link href={`/catalog/compare?ids=${product.slug}`} className="aff-btn aff-btn-ghost">
                Compare
              </Link>
              <Link
                href={`/catalog/recommend?q=${encodeURIComponent(
                  `${product.categoryId} like ${product.name}`
                )}`}
                className="aff-btn aff-btn-ghost"
              >
                AI recommendation
              </Link>
            </div>

            <p className="aff-disclosure mt-4">{discloseAffiliate()}</p>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold">Price comparison</h2>
          <p className="text-sm text-[var(--c-muted)] mt-1">
            Verify live price on the merchant site before buying.
          </p>
          <div className="mt-4 overflow-x-auto c-card">
            <table className="c-table">
              <thead>
                <tr>
                  <th>Merchant</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th>Shipping</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {offers.length === 0 ? (
                  <tr>
                    <td colSpan={5}>Information unavailable</td>
                  </tr>
                ) : (
                  offers.map((o) => (
                    <tr key={o.id}>
                      <td className="font-medium">{getMerchant(o.merchantId)?.name ?? o.merchantId}</td>
                      <td>
                        {formatINR(o.price)}
                        {best?.id === o.id ? <span className="c-badge ml-2">Best price</span> : null}
                        {isOfferStale(o) ? <div className="c-stale">Price may have changed</div> : null}
                      </td>
                      <td className="capitalize">{o.availability.replace("_", " ")}</td>
                      <td>{o.shippingNote || "Information unavailable"}</td>
                      <td>
                        <a
                          href={buildAffiliateRedirectPath(o.id)}
                          className="font-semibold text-[var(--c-brand-dk)] hover:underline"
                          rel="sponsored noopener noreferrer"
                        >
                          View →
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold">Specifications</h2>
            <div className="mt-4 c-card overflow-hidden">
              <table className="c-table">
                <tbody>
                  {specEntries.map(([k, v]) => (
                    <tr key={k}>
                      <th className="w-1/2 !normal-case !tracking-normal !text-left !bg-transparent !text-[var(--c-muted)]">
                        {k.replace(/_/g, " ")}
                      </th>
                      <td className="font-medium">{v === null || v === undefined ? "Information unavailable" : String(v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Pros</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {product.pros.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-teal-600">+</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold">Cons</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {product.cons.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="text-red-500">−</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold">Best for</h2>
              <p className="mt-2 text-sm text-[var(--c-ink-2)]">{product.bestFor.join(" · ") || "Information unavailable"}</p>
              <h3 className="mt-4 font-semibold">Not ideal for</h3>
              <p className="mt-1 text-sm text-[var(--c-muted)]">{product.notIdealFor.join(" · ") || "Information unavailable"}</p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold">Expert analysis</h2>
          <p className="mt-3 text-[var(--aff-ink-2)] leading-relaxed max-w-3xl">{product.description}</p>
          <p className="text-xs text-[var(--aff-muted)] mt-3">
            Last updated: {new Date(product.updatedAt).toLocaleDateString("en-IN")}
          </p>
          {(product.mpn || product.sku || product.gtin) && (
            <p className="text-xs text-[var(--aff-muted)] mt-2">
              Identifiers:{" "}
              {[
                product.brand ? `Brand ${product.brand}` : null,
                product.model ? `Model ${product.model}` : null,
                product.mpn ? `MPN ${product.mpn}` : null,
                product.sku ? `SKU ${product.sku}` : null,
                product.gtin ? `GTIN ${product.gtin}` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </section>

        <section className="mt-10 aff-card p-5 bg-[var(--aff-brand-soft)] border-teal-200">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--aff-brand-dk)]">
            Ebenezer recommendation
          </p>
          <p className="mt-2 text-[var(--aff-ink-2)]">
            {product.name} suits {product.bestFor.slice(0, 2).join(" and ") || "careful buyers who match the specs"}.
            Compare merchants above, confirm the live price, and skip it if you need{" "}
            {product.notIdealFor[0]?.toLowerCase() || "capabilities this model does not offer"}.
          </p>
        </section>

        {alternatives.length > 0 ? (
          <section className="mt-12 pb-8">
            <h2 className="text-xl font-bold">Alternatives</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {alternatives.map((p) => (
                <Link key={p.id} href={`/catalog/p/${p.slug}`} className="aff-card p-4 hover:border-teal-300">
                  <p className="text-xs text-[var(--aff-muted)]">{p.brand}</p>
                  <p className="font-semibold mt-1">{p.name}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
      <CatalogAskAi />
    </>
  );
}
