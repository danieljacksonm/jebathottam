"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Check,
  Minus,
  Plus,
  Truck,
  Shield,
  AlertCircle,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  category: { name: string; slug: string };
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  sku: string;
  description: string;
  inStock: boolean;
  badge?: string | null;
}

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, product.stock)));
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;
    setIsAddingToCart(true);
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  const handleBuyNow = () => {
    if (!product.inStock) return;
    // Navigate to checkout
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category & Brand */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href={`/shop?category=${product.category.slug}`}
          className="text-[var(--primary)] hover:underline"
        >
          {product.category.name}
        </Link>
        <span className="text-[var(--border)]">•</span>
        <Link
          href={`/shop?brand=${product.brand.toLowerCase()}`}
          className="text-[var(--foreground-muted)] hover:text-[var(--primary)]"
        >
          {product.brand}
        </Link>
      </div>

      {/* Title & Badge */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
          {product.name}
        </h1>
        {product.badge && (
          <span className="mt-2 inline-block rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white">
            {product.badge}
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-[var(--foreground)]">
            {product.rating}
          </span>
          <span className="text-[var(--foreground-muted)]">
            ({product.reviews} reviews)
          </span>
        </div>
        <span className="h-4 w-px bg-[var(--border)]" />
        <span className="text-sm text-[var(--success)]">
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
        <span className="h-4 w-px bg-[var(--border)]" />
        <span className="text-sm text-[var(--foreground-muted)]">
          SKU: {product.sku}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-[var(--primary)]">
          {formatCurrency(product.price)}
        </span>
        {product.originalPrice && product.originalPrice > product.price && (
          <>
            <span className="text-xl text-[var(--foreground-muted)] line-through">
              {formatCurrency(product.originalPrice)}
            </span>
            <span className="rounded-full bg-[var(--error)]/10 px-2 py-1 text-sm font-semibold text-[var(--error)]">
              Save {discount}%
            </span>
          </>
        )}
      </div>

      {/* Short Description */}
      <p className="text-[var(--foreground-secondary)] leading-relaxed">
        {product.description}
      </p>

      {/* Stock Alert */}
      {product.stock > 0 && product.stock <= 5 && (
        <div className="flex items-center gap-2 rounded-lg bg-[var(--warning)]/10 p-3 text-sm text-[var(--warning)]">
          <AlertCircle className="h-4 w-4" />
          Only {product.stock} left in stock - order soon!
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-[var(--foreground)]">
          Quantity:
        </span>
        <div className="flex items-center rounded-lg border border-[var(--border)]">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="h-10 w-10 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--background-secondary)] disabled:opacity-50"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="h-10 w-12 flex items-center justify-center text-sm font-semibold">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= product.stock}
            className="h-10 w-10 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--background-secondary)] disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="flex-1 gap-2"
          onClick={handleAddToCart}
          disabled={!product.inStock || isAddingToCart}
        >
          {isAddingToCart ? (
            <Check className="h-5 w-5" />
          ) : (
            <ShoppingCart className="h-5 w-5" />
          )}
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          onClick={handleBuyNow}
          disabled={!product.inStock}
        >
          Buy Now
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)] transition-colors hover:text-[var(--error)]"
        >
          <Heart
            className={`h-5 w-5 ${
              isWishlisted ? "fill-[var(--error)] text-[var(--error)]" : ""
            }`}
          />
          {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
        </button>
        <span className="h-4 w-px bg-[var(--border)]" />
        <button className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)] transition-colors hover:text-[var(--primary)]">
          <Share2 className="h-5 w-5" />
          Share
        </button>
      </div>

      {/* Trust Icons */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
            <Truck className="h-4 w-4 text-[var(--primary)]" />
            Free shipping over ₹999
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
            <Shield className="h-4 w-4 text-[var(--success)]" />
            6 month warranty
          </div>
        </div>
      </div>
    </div>
  );
}
