"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { formatCurrency, calculateGST } from "@/lib/utils";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
  Shield,
  RotateCcw,
  Package,
} from "lucide-react";

interface CartItem {
  productId: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string | null;
  stock: number;
  sku: string;
}

// Mock cart data for demo
const mockCartItems: CartItem[] = [
  {
    productId: 1,
    name: "iPhone 14 Pro Max OLED Display - Original Quality",
    slug: "iphone-14-pro-max-oled-display",
    price: 15499,
    originalPrice: 18999,
    quantity: 1,
    image: null,
    stock: 15,
    sku: "SCR-IP14PM-OLED",
  },
  {
    productId: 2,
    name: "iPhone 14 Pro Battery",
    slug: "iphone-14-pro-battery",
    price: 3499,
    originalPrice: 4499,
    quantity: 2,
    image: null,
    stock: 20,
    sku: "BAT-IP14P-OEM",
  },
  {
    productId: 3,
    name: "USB-C to Lightning Cable (1m)",
    slug: "usb-c-to-lightning-cable-1m",
    price: 599,
    originalPrice: 899,
    quantity: 1,
    image: null,
    stock: 50,
    sku: "CBL-USBCL-1M",
  },
];

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    // Load from localStorage or use mock data
    const raw = localStorage.getItem("cart");
    setCart(raw ? JSON.parse(raw) : mockCartItems);
    setMounted(true);
  }, []);

  const updateQuantity = (productId: number, delta: number) => {
    const next = cart
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(0, Math.min(item.quantity + delta, item.stock)) }
          : item
      )
      .filter((item) => item.quantity > 0);
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const removeItem = (productId: number) => {
    const next = cart.filter((item) => item.productId !== productId);
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const applyPromoCode = () => {
    setPromoError("");
    if (!promoCode.trim()) return;

    // Mock promo code validation
    if (promoCode.toUpperCase() === "SAVE10") {
      setPromoApplied(true);
    } else {
      setPromoError("Invalid promo code");
      setPromoApplied(false);
    }
  };

  const removePromoCode = () => {
    setPromoCode("");
    setPromoApplied(false);
    setPromoError("");
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateSavings = () => {
    return cart.reduce(
      (sum, item) =>
        sum + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0),
      0
    );
  };

  const subtotal = calculateSubtotal();
  const savings = calculateSavings();
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const discountedSubtotal = subtotal - discount;
  const gst = calculateGST(discountedSubtotal);
  const shipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = discountedSubtotal + gst + shipping;

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="container mx-auto px-4 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-[var(--background-secondary)] rounded" />
            <div className="h-64 bg-[var(--background-secondary)] rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        {/* Breadcrumbs */}
        <div className="border-b border-[var(--border)]">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumbs />
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-[var(--background-secondary)] p-6">
                <ShoppingBag className="h-12 w-12 text-[var(--foreground-muted)]" />
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-[var(--foreground)]">
              Your Cart is Empty
            </h1>
            <p className="mb-6 text-[var(--foreground-muted)]">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/shop">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Shopping
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Breadcrumbs */}
      <div className="border-b border-[var(--border)]">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-[var(--foreground)]">
          Shopping Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card
                key={item.productId}
                className="flex gap-4 border-[var(--border)] bg-[var(--card)] p-4"
              >
                {/* Product Image */}
                <Link
                  href={`/product/${item.slug}`}
                  className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-lg bg-[var(--background-secondary)]"
                >
                  <div className="flex h-full items-center justify-center">
                    <span className="text-3xl">📱</span>
                  </div>
                </Link>

                {/* Product Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="font-semibold text-[var(--foreground)] hover:text-[var(--primary)] line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                      SKU: {item.sku}
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-semibold text-[var(--primary)]">
                        {formatCurrency(item.price)}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-sm text-[var(--foreground-muted)] line-through">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center rounded-lg border border-[var(--border)]">
                      <button
                        onClick={() => updateQuantity(item.productId, -1)}
                        disabled={item.quantity <= 1}
                        className="flex h-8 w-8 items-center justify-center text-[var(--foreground)] transition-colors hover:bg-[var(--background-secondary)] disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex h-8 w-12 items-center justify-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, 1)}
                        disabled={item.quantity >= item.stock}
                        className="flex h-8 w-8 items-center justify-center text-[var(--foreground)] transition-colors hover:bg-[var(--background-secondary)] disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-[var(--foreground)]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--error)]/10 hover:text-[var(--error)]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Continue Shopping */}
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-[var(--primary)] hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card className="border-[var(--border)] bg-[var(--card)] p-6">
              <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
                Order Summary
              </h2>

              {/* Promo Code */}
              <div className="mb-6 space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code (try SAVE10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                    className="flex-1"
                  />
                  {promoApplied ? (
                    <Button variant="outline" onClick={removePromoCode}>
                      Remove
                    </Button>
                  ) : (
                    <Button onClick={applyPromoCode}>
                      <Tag className="mr-2 h-4 w-4" />
                      Apply
                    </Button>
                  )}
                </div>
                {promoApplied && (
                  <p className="text-sm text-[var(--success)]">
                    Promo code applied! You saved {formatCurrency(discount)}
                  </p>
                )}
                {promoError && (
                  <p className="text-sm text-[var(--error)]">{promoError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-b border-[var(--border)] pb-4">
                <div className="flex justify-between text-sm text-[var(--foreground-secondary)]">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm text-[var(--success)]">
                    <span>Savings</span>
                    <span>-{formatCurrency(savings)}</span>
                  </div>
                )}
                {promoApplied && (
                  <div className="flex justify-between text-sm text-[var(--success)]">
                    <span>Promo Discount (10%)</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-[var(--foreground-secondary)]">
                  <span>GST (18%)</span>
                  <span>{formatCurrency(gst)}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--foreground-secondary)]">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-[var(--success)]">FREE</span>
                  ) : (
                    <span>{formatCurrency(shipping)}</span>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-[var(--foreground)]">
                  Total
                </span>
                <span className="text-2xl font-bold text-[var(--primary)]">
                  {formatCurrency(total)}
                </span>
              </div>

              {/* Free Shipping Progress */}
              {shipping > 0 && (
                <div className="mt-4 rounded-lg bg-[var(--background-secondary)] p-3 text-center">
                  <p className="text-sm text-[var(--foreground-secondary)]">
                    Add {formatCurrency(FREE_SHIPPING_THRESHOLD - discountedSubtotal)} more for FREE shipping!
                  </p>
                  <div className="mt-2 h-2 w-full rounded-full bg-[var(--border)]">
                    <div
                      className="h-full rounded-full bg-[var(--primary)] transition-all"
                      style={{
                        width: `${Math.min(100, (discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <Link href="/checkout">
                <Button
                  size="lg"
                  className="mt-6 w-full gap-2"
                  onClick={() => setIsCheckingOut(true)}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <p className="mt-3 text-center text-xs text-[var(--foreground-muted)]">
                Shipping & taxes calculated at checkout
              </p>
            </Card>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-[var(--background-secondary)] p-3 text-xs text-[var(--foreground-secondary)]">
                <Truck className="h-4 w-4 text-[var(--primary)]" />
                Free shipping over ₹999
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-[var(--background-secondary)] p-3 text-xs text-[var(--foreground-secondary)]">
                <Shield className="h-4 w-4 text-[var(--success)]" />
                Secure checkout
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-[var(--background-secondary)] p-3 text-xs text-[var(--foreground-secondary)]">
                <RotateCcw className="h-4 w-4 text-[var(--accent)]" />
                7-day returns
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-[var(--background-secondary)] p-3 text-xs text-[var(--foreground-secondary)]">
                <Package className="h-4 w-4 text-[var(--warning)]" />
                Genuine products
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
