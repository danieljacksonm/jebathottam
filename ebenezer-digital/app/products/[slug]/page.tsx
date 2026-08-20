import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { getProduct, STORE_PRODUCTS, formatINR } from "../data";
import { ProductView } from "./ProductView";
import { canonicalFor, pageMetadata } from "@/lib/site-url";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return STORE_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct(params.slug);
  if (!product) return { title: "Product not found | Ebenezer Store" };

  const base = pageMetadata({
    title: product.seoTitle || `${product.name} | Ebenezer Store`,
    description: product.seoDescription || product.tagline,
    path: `/products/${product.slug}`,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: [{ url: product.image }],
    },
    twitter: {
      ...base.twitter,
      images: [product.image],
    },
  };
}

export default function ProductPage({ params }: Props) {
  if (params.slug === "yegova-saas") {
    redirect("/products/ebenezer-saas");
  }
  const product = getProduct(params.slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: { "@type": "Brand", name: "Ebenezer Store" },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: canonicalFor(`/products/${product.slug}`),
    },
    ...(product.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviews || 1,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <span className="sr-only">{formatINR(product.price)}</span>
      <ProductView product={product} />
    </>
  );
}
