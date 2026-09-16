import type { CheckoutFormData } from "@/types";

export type PaymentIntentInput = {
  orderId: string;
  amount: number;
  currency: "INR";
  customer: CheckoutFormData;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};

export type PaymentIntentResult = {
  configured: boolean;
  provider: "none" | "razorpay" | "stripe";
  clientSecret?: string;
  orderId: string;
  amount: number;
  message: string;
};

/**
 * Modular payment adapter.
 * Connect Razorpay/Stripe via env vars without rewriting checkout UI.
 */
export async function createPaymentIntent(
  input: PaymentIntentInput,
): Promise<PaymentIntentResult> {
  const razorpayKey = process.env.RAZORPAY_KEY_ID;
  const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
  const stripeSecret = process.env.STRIPE_SECRET_KEY;

  if (razorpayKey && razorpaySecret) {
    // Placeholder for Razorpay Orders API integration.
    // Keep secrets server-side; return only public order identifiers to the client.
    return {
      configured: true,
      provider: "razorpay",
      orderId: input.orderId,
      amount: input.amount,
      message: "Razorpay credentials detected. Wire Orders API in this adapter to collect payment.",
    };
  }

  if (stripeSecret) {
    return {
      configured: true,
      provider: "stripe",
      orderId: input.orderId,
      amount: input.amount,
      message: "Stripe credentials detected. Wire PaymentIntents in this adapter to collect payment.",
    };
  }

  return {
    configured: false,
    provider: "none",
    orderId: input.orderId,
    amount: input.amount,
    message: "No payment gateway configured.",
  };
}
