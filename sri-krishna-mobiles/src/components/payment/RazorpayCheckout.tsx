"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";

interface RazorpayCheckoutProps {
  orderId: string;
  amount: number; // in rupees
  currency?: string;
  name?: string;
  description?: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess?: (response: RazorpayResponse) => void;
  onFailure?: (error: Error) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency?: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

export function RazorpayCheckout({
  orderId,
  amount,
  currency = "INR",
  name = "Sri Krishna Mobiles",
  description = "Order Payment",
  image = "/logo.png",
  prefill = {},
  notes = {},
  onSuccess,
  onFailure,
}: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Amount in paise for Razorpay
  const amountInPaise = Math.round(amount * 100);

  const handlePayment = async () => {
    if (!window.Razorpay) {
      onFailure?.(new Error("Razorpay SDK not loaded"));
      return;
    }

    setIsLoading(true);

    try {
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: amountInPaise,
        currency,
        name,
        description,
        image,
        order_id: orderId,
        handler: (response: RazorpayResponse) => {
          setIsLoading(false);
          onSuccess?.(response);
        },
        prefill,
        notes,
        theme: {
          color: "#4F46E5", // Primary color
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on("payment.failed", () => {
        setIsLoading(false);
        onFailure?.(new Error("Payment failed"));
      });

      razorpay.open();
    } catch (error) {
      setIsLoading(false);
      onFailure?.(error as Error);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsScriptLoaded(true)}
        onError={() => setIsScriptLoaded(false)}
      />
      <Button
        onClick={handlePayment}
        disabled={isLoading || !isScriptLoaded}
        size="lg"
        className="w-full gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            Pay with Razorpay
          </>
        )}
      </Button>
      {!isScriptLoaded && (
        <p className="mt-2 text-center text-xs text-[var(--foreground-muted)]">
          Loading payment gateway...
        </p>
      )}
    </>
  );
}
