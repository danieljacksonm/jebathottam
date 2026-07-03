import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Cart } from "@/models/Cart";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, shippingAddress, billingAddress, couponCode } = body;

    if (!items?.length || !shippingAddress) {
      return NextResponse.json({ error: "Items and shipping address are required" }, { status: 400 });
    }

    await connectDB();

    const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
    const taxableAmount = subtotal;
    const gstAmount = Math.round(taxableAmount * 0.18 * 100) / 100;
    const shippingAmount = taxableAmount >= 999 ? 0 : 99;
    const totalAmount = Math.round((taxableAmount + gstAmount + shippingAmount) * 100) / 100;

    const order = await Order.create({
      user: session.user.id,
      items: items.map((item: { productId: string; name: string; sku?: string; quantity: number; price: number }) => ({
        product: item.productId,
        name: item.name,
        sku: item.sku || "N/A",
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      })),
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      subtotal,
      discountAmount: 0,
      taxAmount: gstAmount,
      shippingAmount,
      total: totalAmount,
      payment: { method: "cash", status: "pending" },
      status: "confirmed",
      timeline: [{ status: "confirmed", timestamp: new Date(), description: "COD order placed" }],
    });

    await Cart.findOneAndUpdate({ user: session.user.id }, { $set: { items: [], totalAmount: 0 } });

    return NextResponse.json({
      success: true,
      order: { id: order._id, orderNumber: order.orderNumber },
    });
  } catch (error) {
    console.error("COD order error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
