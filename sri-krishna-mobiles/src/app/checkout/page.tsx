"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { formatCurrency, calculateGST } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronRight,
  MapPin,
  CreditCard,
  Shield,
  Truck,
  Package,
  Lock,
} from "lucide-react";

interface CartItem {
  productId: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string | null;
  sku: string;
}

// Mock cart data
const mockCartItems: CartItem[] = [
  {
    productId: 1,
    name: "iPhone 14 Pro Max OLED Display",
    slug: "iphone-14-pro-max-oled-display",
    price: 15499,
    originalPrice: 18999,
    quantity: 1,
    sku: "SCR-IP14PM-OLED",
  },
  {
    productId: 2,
    name: "iPhone 14 Pro Battery",
    slug: "iphone-14-pro-battery",
    price: 3499,
    quantity: 2,
    sku: "BAT-IP14P-OEM",
  },
];

type CheckoutStep = "shipping" | "payment" | "review";

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping form state
  const [shippingData, setShippingData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay" | "paypal">("razorpay");

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    setCart(raw ? JSON.parse(raw) : mockCartItems);
    setMounted(true);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const gst = calculateGST(subtotal);
  const total = subtotal + shipping + gst;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = () => {
    setCurrentStep("review");
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === "cod") {
      // Handle Cash on Delivery
      setIsProcessing(true);
      try {
        const response = await fetch("/api/payment/cod-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart.map((item) => ({
              productId: item.productId,
              name: item.name,
              sku: item.sku,
              quantity: item.quantity,
              price: item.price,
            })),
            shippingAddress: {
              name: `${shippingData.firstName} ${shippingData.lastName}`,
              email: shippingData.email,
              phone: shippingData.phone,
              address: shippingData.address,
              city: shippingData.city,
              state: shippingData.state,
              pincode: shippingData.pincode,
              country: shippingData.country,
            },
            paymentMethod: "cod",
          }),
        });

        const data = await response.json();
        if (data.success) {
          window.location.href = `/order-success?orderId=${data.order.orderNumber}`;
        } else {
          alert("Failed to place order. Please try again.");
        }
      } catch (error) {
        console.error("Order error:", error);
        alert("Something went wrong. Please try again.");
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Razorpay Payment Flow
    setIsProcessing(true);
    try {
      // Step 1: Create order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: {
            name: `${shippingData.firstName} ${shippingData.lastName}`,
            email: shippingData.email,
            phone: shippingData.phone,
            address: shippingData.address,
            city: shippingData.city,
            state: shippingData.state,
            pincode: shippingData.pincode,
            country: shippingData.country,
          },
          notes: {
            userEmail: shippingData.email,
          },
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Step 2: Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount * 100, // in paise
        currency: "INR",
        name: "Sri Krishna Mobiles",
        description: `Order #${orderData.order.orderNumber}`,
        order_id: orderData.order.razorpayOrderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // Step 3: Verify payment
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.order.id,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            // Payment successful - redirect to success page
            window.location.href = `/order-success?orderId=${orderData.order.orderNumber}`;
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: `${shippingData.firstName} ${shippingData.lastName}`,
          email: shippingData.email,
          contact: shippingData.phone,
        },
        theme: {
          color: "#4F46E5",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      // Load Razorpay script if not loaded
      if (!(window as any).Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => (script.onload = resolve));
      }

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const steps: { id: CheckoutStep; label: string; icon: React.ElementType }[] = [
    { id: "shipping", label: "Shipping", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "review", label: "Review", icon: Check },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="container mx-auto px-4 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-[var(--background-secondary)] rounded" />
            <div className="h-96 bg-[var(--background-secondary)] rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="border-b border-[var(--border)]">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumbs />
          </div>
        </div>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-[var(--foreground-muted)]">Your cart is empty.</p>
          <Link href="/shop">
            <Button className="mt-4">Go to Shop</Button>
          </Link>
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
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted =
                steps.findIndex((s) => s.id === currentStep) > index;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2",
                      isActive
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                        : isCompleted
                        ? "border-[var(--success)] bg-[var(--success)] text-white"
                        : "border-[var(--border)] text-[var(--foreground-muted)]"
                    )}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span
                    className={cn(
                      "ml-2 text-sm font-medium",
                      isActive
                        ? "text-[var(--primary)]"
                        : isCompleted
                        ? "text-[var(--success)]"
                        : "text-[var(--foreground-muted)]"
                    )}
                  >
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="mx-4 h-px w-12 bg-[var(--border)]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Step */}
            {currentStep === "shipping" && (
              <Card className="border-[var(--border)] bg-[var(--card)] p-6">
                <h2 className="mb-6 text-xl font-semibold text-[var(--foreground)]">
                  Shipping Information
                </h2>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                        Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={shippingData.email}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                        Phone *
                      </label>
                      <Input
                        type="tel"
                        required
                        value={shippingData.phone}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                        First Name *
                      </label>
                      <Input
                        required
                        value={shippingData.firstName}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                        Last Name *
                      </label>
                      <Input
                        required
                        value={shippingData.lastName}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                      Address *
                    </label>
                    <Input
                      required
                      value={shippingData.address}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, address: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                        City *
                      </label>
                      <Input
                        required
                        value={shippingData.city}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, city: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                        State *
                      </label>
                      <Input
                        required
                        value={shippingData.state}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, state: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                        Pincode *
                      </label>
                      <Input
                        required
                        value={shippingData.pincode}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, pincode: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="mt-4 w-full">
                    Continue to Payment
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Card>
            )}

            {/* Payment Step */}
            {currentStep === "payment" && (
              <Card className="border-[var(--border)] bg-[var(--card)] p-6">
                <h2 className="mb-6 text-xl font-semibold text-[var(--foreground)]">
                  Payment Method
                </h2>
                <div className="space-y-4">
                  {/* Razorpay */}
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors",
                      paymentMethod === "razorpay"
                        ? "border-[var(--primary)] bg-[var(--primary)]/5"
                        : "border-[var(--border)] hover:border-[var(--primary)]/50"
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="h-4 w-4 text-[var(--primary)]"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-[var(--foreground)]">Razorpay</p>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        Pay via UPI, Cards, Net Banking
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <span className="rounded bg-[var(--background)] px-2 py-1 text-xs">UPI</span>
                      <span className="rounded bg-[var(--background)] px-2 py-1 text-xs">Card</span>
                    </div>
                  </label>

                  {/* COD */}
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors",
                      paymentMethod === "cod"
                        ? "border-[var(--primary)] bg-[var(--primary)]/5"
                        : "border-[var(--border)] hover:border-[var(--primary)]/50"
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="h-4 w-4 text-[var(--primary)]"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-[var(--foreground)]">Cash on Delivery</p>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        Pay when you receive your order
                      </p>
                    </div>
                  </label>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("shipping")}
                    >
                      Back
                    </Button>
                    <Button onClick={handlePaymentSubmit} className="flex-1">
                      Continue to Review
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Review Step */}
            {currentStep === "review" && (
              <Card className="border-[var(--border)] bg-[var(--card)] p-6">
                <h2 className="mb-6 text-xl font-semibold text-[var(--foreground)]">
                  Review Order
                </h2>

                {/* Shipping Address */}
                <div className="mb-6 rounded-lg bg-[var(--background-secondary)] p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                    <MapPin className="h-4 w-4 text-[var(--primary)]" />
                    Shipping Address
                  </div>
                  <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
                    {shippingData.firstName} {shippingData.lastName}
                    <br />
                    {shippingData.address}
                    <br />
                    {shippingData.city}, {shippingData.state} {shippingData.pincode}
                    <br />
                    {shippingData.country}
                  </p>
                  <button
                    onClick={() => setCurrentStep("shipping")}
                    className="mt-2 text-sm text-[var(--primary)] hover:underline"
                  >
                    Edit
                  </button>
                </div>

                {/* Payment Method */}
                <div className="mb-6 rounded-lg bg-[var(--background-secondary)] p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                    <CreditCard className="h-4 w-4 text-[var(--primary)]" />
                    Payment Method
                  </div>
                  <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
                    {paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay (UPI/Cards/Net Banking)"}
                  </p>
                  <button
                    onClick={() => setCurrentStep("payment")}
                    className="mt-2 text-sm text-[var(--primary)] hover:underline"
                  >
                    Edit
                  </button>
                </div>

                {/* Terms */}
                <div className="mb-6 flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 h-4 w-4 rounded border-[var(--border)] text-[var(--primary)]"
                  />
                  <label htmlFor="terms" className="text-sm text-[var(--foreground-secondary)]">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[var(--primary)] hover:underline">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[var(--primary)] hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("payment")}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 gap-2"
                    size="lg"
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Place Order • {formatCurrency(total)}
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-4 border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
                Order Summary
              </h3>

              {/* Items */}
              <div className="mb-4 space-y-3">
                {cart.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--background-secondary)]">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--foreground)] line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm text-[var(--primary)]">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--border)] pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-[var(--foreground-secondary)]">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[var(--foreground-secondary)]">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-[var(--success)]">FREE</span>
                    ) : (
                      <span>{formatCurrency(shipping)}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm text-[var(--foreground-secondary)]">
                    <span>GST (18%)</span>
                    <span>{formatCurrency(gst)}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
                  <span className="text-lg font-semibold text-[var(--foreground)]">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-[var(--primary)]">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                  <Shield className="h-3 w-3 text-[var(--success)]" />
                  Secure Checkout
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                  <Truck className="h-3 w-3 text-[var(--primary)]" />
                  Fast Delivery
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                  <Package className="h-3 w-3 text-[var(--warning)]" />
                  Genuine Products
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                  <Check className="h-3 w-3 text-[var(--accent)]" />
                  6-Month Warranty
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
