import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongoose";
import { Order } from "@/models/Order";
import crypto from "crypto";

/**
 * Verify Razorpay Payment
 * POST /api/payment/verify
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
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId, // Our internal order ID
    } = body;

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification data" },
        { status: 400 }
      );
    }

    // Verify signature
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeySecret) {
      return NextResponse.json(
        { error: "Razorpay not configured" },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the order
    const order = await Order.findOne({
      $or: [
        { _id: orderId },
        { "payment.razorpayOrderId": razorpay_order_id },
      ],
      user: session.user.id,
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Verify payment status with Razorpay
    const paymentResponse = await fetch(
      `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.RAZORPAY_KEY_ID}:${razorpayKeySecret}`
          ).toString("base64")}`,
        },
      }
    );

    if (!paymentResponse.ok) {
      return NextResponse.json(
        { error: "Failed to verify payment with Razorpay" },
        { status: 500 }
      );
    }

    const paymentData = await paymentResponse.json();

    // Check payment status
    if (paymentData.status !== "captured") {
      // Update order status to failed
      order.payment.status = "failed";
      order.payment.failureReason = paymentData.status;
      order.status = "payment_failed";
      order.statusHistory.push({
        status: "payment_failed",
        timestamp: new Date(),
        note: `Payment failed with status: ${paymentData.status}`,
      });
      await order.save();

      return NextResponse.json(
        { error: "Payment not captured", status: paymentData.status },
        { status: 400 }
      );
    }

    // Payment successful - update order
    order.payment.status = "completed";
    order.payment.razorpayPaymentId = razorpay_payment_id;
    order.payment.razorpaySignature = razorpay_signature;
    order.payment.paidAt = new Date();
    order.payment.amountPaid = paymentData.amount / 100; // Convert from paise

    order.status = "processing";
    order.statusHistory.push({
      status: "processing",
      timestamp: new Date(),
      note: "Payment verified and captured",
    });

    order.paymentDetails = {
      method: paymentData.method,
      card: paymentData.card
        ? {
            network: paymentData.card.network,
            last4: paymentData.card.last4,
            type: paymentData.card.type,
          }
        : undefined,
      upi: paymentData.upi
        ? {
            vpa: paymentData.upi.vpa,
            flow: paymentData.upi.flow,
          }
        : undefined,
      bank: paymentData.bank,
      wallet: paymentData.wallet,
    };

    await order.save();

    // TODO: Send confirmation email
    // await sendOrderConfirmationEmail(order, session.user.email);

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.payment.status,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
