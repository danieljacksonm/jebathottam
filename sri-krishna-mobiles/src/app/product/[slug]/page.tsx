import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductTabs } from "@/components/product/ProductTabs";
import { CompatibilityChecker } from "@/components/product/CompatibilityChecker";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { Shield, Truck, RotateCcw } from "lucide-react";

// Mock product data for demo
const mockProduct = {
  id: 1,
  name: "iPhone 14 Pro Max OLED Display - Original Quality",
  slug: "iphone-14-pro-max-oled-display",
  brand: "Apple",
  category: { name: "Screens", slug: "screens" },
  price: 15499,
  originalPrice: 18999,
  rating: 4.8,
  reviews: 245,
  stock: 15,
  sku: "SCR-IP14PM-OLED",
  description:
    "Genuine OLED display replacement for iPhone 14 Pro Max. Features Super Retina XDR display with ProMotion technology, 120Hz refresh rate, and True Tone. Perfect color accuracy and touch responsiveness. Comes with pre-installed front camera and sensor assembly.",
  images: [
    { id: 1, url: "/products/screen-1.jpg", alt: "Front view" },
    { id: 2, url: "/products/screen-2.jpg", alt: "Side view" },
    { id: 3, url: "/products/screen-3.jpg", alt: "Back view" },
    { id: 4, url: "/products/screen-4.jpg", alt: "Detail view" },
  ],
  compatibility: [
    "iPhone 14 Pro Max (A2894, A2895, A2896)",
    "All carriers - Worldwide",
  ],
  specifications: [
    { label: "Display Type", value: "Super Retina XDR OLED" },
    { label: "Resolution", value: "2796 x 1290 pixels" },
    { label: "Refresh Rate", value: "120Hz ProMotion" },
    { label: "Brightness", value: "2000 nits peak" },
    { label: "Touch Technology", value: "3D Touch / Haptic Touch" },
    { label: "Warranty", value: "6 Months" },
    { label: "Origin", value: "OEM Quality" },
  ],
  inStock: true,
  badge: "Best Seller",
};

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
  
  // In real implementation, fetch from API
  // const product = await getProduct(slug);
  // if (!product) notFound();
  
  const product = mockProduct;

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
