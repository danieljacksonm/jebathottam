import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { capturePayPalOrder } from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paypalOrderId, email, name, items } = body as {
      paypalOrderId: string;
      email: string;
      name?: string;
      items: { productId: number; quantity: number; price: number }[];
    };
    if (!paypalOrderId || !email || !items?.length) {
      return NextResponse.json(
        { error: "paypalOrderId, email, and items required" },
        { status: 400 }
      );
    }
    const capture = await capturePayPalOrder(paypalOrderId);
    if (capture.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "PayPal capture not completed" },
        { status: 400 }
      );
    }
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const order = await prisma.order.create({
      data: {
        paypalOrderId,
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
      { error: e instanceof Error ? e.message : "Capture failed" },
      { status: 500 }
    );
  }
}
