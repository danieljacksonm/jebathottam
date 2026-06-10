import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Cart } from "@/models/Cart";

/**
 * Create Razorpay Order
 * POST /api/payment/create-order
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { 
      items, 
      shippingAddress, 
      billingAddress, 
      couponCode,
      notes 
    } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // Calculate discount if coupon applied
    let discountAmount = 0;
    let couponId = null;
    
    if (couponCode) {
      // TODO: Validate coupon and calculate discount
      // const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      // if (coupon && coupon.isValid()) {
      //   discountAmount = coupon.calculateDiscount(subtotal);
      //   couponId = coupon._id;
      // }
    }

    // Calculate GST (18%)
    const taxableAmount = subtotal - discountAmount;
    const gstAmount = Math.round(taxableAmount * 0.18 * 100) / 100;

    // Calculate shipping
    const shippingAmount = taxableAmount >= 999 ? 0 : 99;

    // Final total
    const totalAmount = Math.round(
      (taxableAmount + gstAmount + shippingAmount) * 100
    ) / 100;

    // Create Razorpay Order
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeySecret) {
      return NextResponse.json(
        { error: "Razorpay not configured" },
        { status: 500 }
      );
    }

    const razorpayResponse = await fetch(
      "https://api.razorpay.com/v1/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.RAZORPAY_KEY_ID}:${razorpayKeySecret}`
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100), // Convert to paise
          currency: "INR",
          receipt: `order_rcpt_${Date.now()}`,
          notes: {
            userId: session.user.id,
            userEmail: session.user.email,
            ...notes,
          },
        }),
      }
    );

    if (!razorpayResponse.ok) {
      const error = await razorpayResponse.json();
      console.error("Razorpay order creation failed:", error);
      return NextResponse.json(
        { error: "Failed to create payment order" },
        { status: 500 }
      );
    }

    const razorpayOrder = await razorpayResponse.json();

    // Create order in database
    const order = await Order.create({
      user: session.user.id,
      items: items.map((item: any) => ({
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
      discountAmount,
      discountCode: couponCode,
      taxAmount: gstAmount,
      shippingAmount,
      total: totalAmount,
      payment: {
        method: "razorpay",
        status: "pending",
        razorpayOrderId: razorpayOrder.id,
      },
      status: "pending",
      timeline: [
        {
          status: "pending",
          timestamp: new Date(),
          description: "Order created, awaiting payment",
        },
      ],
    });

    // Clear cart after order creation
    await Cart.findOneAndUpdate(
      { user: session.user.id },
      { $set: { items: [], totalAmount: 0 } }
    );

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        razorpayOrderId: razorpayOrder.id,
        amount: totalAmount,
        currency: "INR",
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
