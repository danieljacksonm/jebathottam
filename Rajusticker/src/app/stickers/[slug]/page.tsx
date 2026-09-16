import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductViewTracker } from "@/components/product/ProductViewTracker";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FAQ } from "@/components/ui/FAQ";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  productJsonLd,
} from "@/lib/seo";
import { categoryMeta } from "@/lib/products";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return buildMetadata({
    title: product.seoTitle,
    description: product.seoDescription,
    path: `/stickers/${product.slug}`,
    image: product.images[0],
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const together = await getRelatedProducts(product, 2);
  const cat = categoryMeta[product.category];

  return (
    <div className="container-x py-8 sm:py-12 pb-28 sm:pb-12">
      <ProductViewTracker productId={product.id} slug={product.slug} />
      <JsonLd
        data={productJsonLd({
          name: product.name,
          description: product.description,
          images: product.images,
          sku: product.sku,
          brand: product.brand,
          price: product.price,
          currency: product.currency,
          stock: product.stock,
          slug: product.slug,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: cat.name, path: `/shop/${cat.slug}` },
          { name: product.name, path: `/stickers/${product.slug}` },
        ])}
      />
      <JsonLd data={faqJsonLd(product.faq)} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: cat.name, href: `/shop/${cat.slug}` },
          { label: product.name },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery product={product} />
        <ProductPurchasePanel product={product} />
      </div>

      <section className="mt-14 grid lg:grid-cols-2 gap-10">
        <div>
          <h2 className="font-display text-2xl mb-4">Product Details</h2>
          <p className="text-[var(--text-muted)] mb-6">{product.description}</p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.details.map((row) => (
              <div key={row.label} className="border border-[var(--border)] rounded-[var(--radius-sm)] p-3">
                <dt className="text-xs uppercase tracking-wider text-[var(--text-subtle)]">{row.label}</dt>
                <dd className="mt-1 text-sm">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-2xl mb-4">Application</h2>
            <ol className="space-y-2 text-sm text-[var(--text-muted)] list-decimal pl-5">
              {product.applicationInstructions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="font-display text-2xl mb-4">Care</h2>
            <ul className="space-y-2 text-sm text-[var(--text-muted)] list-disc pl-5">
              {product.careInstructions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {together.length > 0 && (
        <section className="mt-14">
          <h2 className="section-title text-2xl mb-2">Frequently Bought Together</h2>
          <p className="section-sub mb-6">Complementary finishes customers often pair.</p>
          <ProductGrid products={together} />
        </section>
      )}

      <section className="mt-14">
        <h2 className="section-title text-2xl mb-2">Related Products</h2>
        <ProductGrid products={related} />
      </section>

      <section className="mt-14 card-surface p-6">
        <h2 className="font-display text-2xl mb-3">Reviews</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Customer reviews will appear here once collected. We do not display placeholder ratings.
        </p>
        <Link href="/contact" className="btn btn-secondary mt-4 inline-flex">
          Share your install photos
        </Link>
      </section>

      <section className="mt-14 mb-8">
        <FAQ items={product.faq} />
      </section>
    </div>
  );
}
