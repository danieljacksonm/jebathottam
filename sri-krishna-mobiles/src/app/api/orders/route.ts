import { NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, currency = "INR" } = body as {
      items: { productId: number; name: string; quantity: number; price: number }[];
      currency?: string;
    };
    if (!items?.length) {
      return NextResponse.json({ error: "Items required" }, { status: 400 });
    }
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const paypalItems = items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      unit_amount: i.price,
    }));
    const paypalOrderId = await createPayPalOrder(total, currency, paypalItems);
    return NextResponse.json({ orderId: paypalOrderId, total });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create order" },
      { status: 500 }
    );
  }
}
