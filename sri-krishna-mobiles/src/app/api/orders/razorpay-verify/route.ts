import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      email,
      name,
      items,
    } = body as {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      email: string;
      name?: string;
      items: { productId: number; quantity: number; price: number }[];
    };
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !email || !items?.length) {
      return NextResponse.json(
        { error: "razorpayOrderId, razorpayPaymentId, signature, email, and items required" },
        { status: 400 }
      );
    }
    const valid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const order = await prisma.order.create({
      data: {
        razorpayOrderId,
        razorpayPaymentId,
        email,
        name: name ?? null,
        total,
        status: "PAID",
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });
    return NextResponse.json({ order });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Verify failed" },
      { status: 500 }
    );
  }
}
