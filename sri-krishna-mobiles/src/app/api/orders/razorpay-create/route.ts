import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body as {
      items: { productId: number; quantity: number; price: number }[];
    };
    if (!items?.length) {
      return NextResponse.json({ error: "Items required" }, { status: 400 });
    }
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const amountPaise = Math.round(total * 100); // ₹ to paise
    if (amountPaise < 100) {
      return NextResponse.json({ error: "Minimum amount is ₹1" }, { status: 400 });
    }
    const receipt = `rec_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const razorpayOrderId = await createRazorpayOrder(amountPaise, receipt);
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID ?? "";
    return NextResponse.json({
      razorpayOrderId,
      amount: amountPaise,
      currency: "INR",
      keyId,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create order" },
      { status: 500 }
    );
  }
}
