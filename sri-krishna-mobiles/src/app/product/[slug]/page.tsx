import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductTabs } from "@/components/product/ProductTabs";
import { CompatibilityChecker } from "@/components/product/CompatibilityChecker";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { Shield, Truck, RotateCcw } from "lucide-react";
import { prisma } from "@/lib/db";

const relatedProducts = [
  {
    id: 2,
    name: "iPhone 14 Pro Battery",
    slug: "iphone-14-pro-battery",
    price: 3499,
    originalPrice: 4499,
    rating: 4.7,
    reviews: 189,
  },
  {
    id: 3,
    name: "iPhone 14 Pro Max Back Glass",
    slug: "iphone-14-pro-max-back-glass",
    price: 2499,
    originalPrice: 3499,
    rating: 4.5,
    reviews: 156,
  },
  {
    id: 4,
    name: "iPhone 14 Pro Charging Port",
    slug: "iphone-14-pro-charging-port",
    price: 1299,
    originalPrice: 1999,
    rating: 4.6,
    reviews: 98,
  },
  {
    id: 5,
    name: "iPhone 14 Pro Max Camera Lens",
    slug: "iphone-14-pro-max-camera-lens",
    price: 4999,
    originalPrice: 6499,
    rating: 4.8,
    reviews: 87,
  },
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!dbProduct) notFound();

  const product = {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    brand: dbProduct.category?.name || "General",
    category: { name: dbProduct.category?.name || "General", slug: dbProduct.category?.slug || "general" },
    price: dbProduct.price,
    originalPrice: Math.round(dbProduct.price * 1.15),
    rating: 4.5,
    reviews: 0,
    stock: dbProduct.inStock ? 10 : 0,
    sku: `SKU-${dbProduct.id}`,
    description: dbProduct.description,
    images: dbProduct.imageUrl
      ? [{ id: 1, url: dbProduct.imageUrl, alt: dbProduct.name }]
      : [{ id: 1, url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800", alt: dbProduct.name }],
    compatibility: ["Check product description for compatibility"],
    specifications: [
      { label: "Category", value: dbProduct.category?.name || "General" },
      { label: "Availability", value: dbProduct.inStock ? "In Stock" : "Out of Stock" },
      { label: "Warranty", value: "6 Months" },
    ],
    inStock: dbProduct.inStock,
    badge: dbProduct.inStock ? null : "Out of Stock",
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Breadcrumbs */}
      <div className="border-b border-[var(--border)]">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Product Main Section */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left - Image Gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Right - Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Trust Badges */}
        <div className="mt-8 grid gap-4 border-y border-[var(--border)] py-6 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success)]/10">
              <Shield className="h-5 w-5 text-[var(--success)]" />
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)]">6 Month Warranty</p>
              <p className="text-sm text-[var(--foreground-muted)]">On all products</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10">
              <Truck className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)]">Free Shipping</p>
              <p className="text-sm text-[var(--foreground-muted)]">On orders above ₹999</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10">
              <RotateCcw className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)]">Easy Returns</p>
              <p className="text-sm text-[var(--foreground-muted)]">7-day return policy</p>
            </div>
          </div>
        </div>

        {/* Compatibility Checker */}
        <div className="mt-12">
          <CompatibilityChecker 
            productName={product.name}
            compatibility={product.compatibility}
          />
        </div>

        {/* Product Tabs */}
        <div className="mt-12">
          <ProductTabs 
            description={product.description}
            specifications={product.specifications}
            compatibility={product.compatibility}
            rating={product.rating}
            reviews={product.reviews}
          />
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </div>
  );
}
