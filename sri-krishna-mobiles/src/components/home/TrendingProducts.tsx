"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";

// Mock trending products data
const trendingProducts = [
  {
    id: 1,
    name: "iPhone 14 Pro Max OLED Display",
    category: "Screens",
    price: 15499,
    originalPrice: 18999,
    rating: 4.8,
    reviews: 245,
    image: "/products/screen-1.jpg",
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: 2,
    name: "Samsung Galaxy S23 Battery",
    category: "Batteries",
    price: 2999,
    originalPrice: 3999,
    rating: 4.6,
    reviews: 189,
    image: "/products/battery-1.jpg",
    badge: "Hot",
    inStock: true,
  },
  {
    id: 3,
    name: "OnePlus 65W Warp Charger",
    category: "Chargers",
    price: 1799,
    originalPrice: 2499,
    rating: 4.9,
    reviews: 312,
    image: "/products/charger-1.jpg",
    badge: "Trending",
    inStock: true,
  },
  {
    id: 4,
    name: "iPhone 13 Back Glass Panel",
    category: "Back Covers",
    price: 1299,
    originalPrice: 1999,
    rating: 4.5,
    reviews: 156,
    image: "/products/cover-1.jpg",
    badge: null,
    inStock: true,
  },
  {
    id: 5,
    name: "USB-C to Lightning Cable",
    category: "Cables",
    price: 599,
    originalPrice: 899,
    rating: 4.7,
    reviews: 423,
    image: "/products/cable-1.jpg",
    badge: "Sale",
    inStock: true,
  },
  {
    id: 6,
    name: "Pixel 7 Pro Camera Lens",
    category: "Camera Parts",
    price: 3499,
    originalPrice: 4999,
    rating: 4.4,
    reviews: 89,
    image: "/products/camera-1.jpg",
    badge: null,
    inStock: false,
  },
];

function ProductCard({ product }: { product: typeof trendingProducts[0] }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <Card className="group relative overflow-hidden border-[var(--border)] bg-[var(--card)] transition-all hover:shadow-lg">
      {/* Badge */}
      {product.badge && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white">
          {product.badge}
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-2 text-[var(--foreground-muted)] backdrop-blur transition-colors hover:bg-white hover:text-[var(--error)]"
      >
        <Heart
          className={`h-4 w-4 ${isWishlisted ? "fill-[var(--error)] text-[var(--error)]" : ""}`}
        />
      </button>

      {/* Image */}
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square bg-[var(--background-secondary)] p-4">
          <div className="flex h-full items-center justify-center">
            <span className="text-6xl">📱</span>
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="mb-1 text-xs text-[var(--foreground-muted)] uppercase tracking-wide">
          {product.category}
        </p>

        {/* Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-[var(--foreground)] hover:text-[var(--primary)]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-[var(--foreground)]">
            {product.rating}
          </span>
          <span className="text-xs text-[var(--foreground-muted)]">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-lg font-bold text-[var(--primary)]">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-[var(--foreground-muted)] line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <Button
          className="w-full gap-2"
          disabled={!product.inStock}
          variant={product.inStock ? "default" : "outline"}
        >
          <ShoppingCart className="h-4 w-4" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </Card>
  );
}

export function TrendingProducts() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {trendingProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
