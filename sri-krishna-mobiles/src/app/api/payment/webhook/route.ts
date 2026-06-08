import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import crypto from "crypto";

/**
 * Razorpay Webhook Handler
 * POST /api/payment/webhook
 */
export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error("Razorpay webhook secret not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    // Get the raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing webhook signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const isSignatureValid = signature === expectedSignature;

    if (!isSignatureValid) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payment = event.payload?.payment?.entity;
    const order = event.payload?.order?.entity;

    await connectToDatabase();

    // Handle different webhook events
    switch (eventType) {
      case "payment.captured": {
        // Payment was successfully captured
        const orderDoc = await Order.findOne({
          "payment.razorpayOrderId": order?.id,
        });

        if (orderDoc && orderDoc.payment.status !== "completed") {
          orderDoc.payment.status = "captured";
          orderDoc.payment.razorpayPaymentId = payment.id;
          orderDoc.payment.paidAt = new Date(payment.created_at * 1000);
          orderDoc.payment.amountPaid = payment.amount / 100;
          orderDoc.status = "confirmed";
          orderDoc.statusHistory.push({
            status: "confirmed",
            timestamp: new Date(),
            note: "Payment captured via webhook",
          });
          await orderDoc.save();
          console.log(`Order ${orderDoc._id} payment captured via webhook`);
        }
        break;
      }

      case "payment.failed": {
        // Payment failed
        const orderDoc = await Order.findOne({
          "payment.razorpayOrderId": order?.id,
        });

        if (orderDoc) {
          orderDoc.payment.status = "failed";
          orderDoc.payment.failureReason = payment.error_description || "Payment failed";
          orderDoc.status = "cancelled";
          orderDoc.statusHistory.push({
            status: "cancelled",
            timestamp: new Date(),
            note: `Payment failed: ${payment.error_description}`,
          });
          await orderDoc.save();
          console.log(`Order ${orderDoc._id} payment failed via webhook`);
        }
        break;
      }

      case "refund.processed": {
        // Refund was processed
        const refund = event.payload?.refund?.entity;
        const orderDoc = await Order.findOne({
          "payment.razorpayPaymentId": refund?.payment_id,
        });

        if (orderDoc) {
          orderDoc.payment.status = "refunded";
          orderDoc.refundDetails = {
            refundId: refund.id,
            amount: refund.amount / 100,
            reason: refund.notes?.reason || "Customer request",
            status: refund.status,
            processedAt: new Date(refund.created_at * 1000),
          };
          orderDoc.status = "refunded";
          orderDoc.statusHistory.push({
            status: "refunded",
            timestamp: new Date(),
            note: `Refund processed: ${refund.amount / 100}`,
          });
          await orderDoc.save();
          console.log(`Order ${orderDoc._id} refund processed via webhook`);
        }
        break;
      }

      case "order.paid": {
        // Order was paid
        const orderDoc = await Order.findOne({
          "payment.razorpayOrderId": order?.id,
        });

        if (orderDoc && orderDoc.payment.status !== "completed") {
          orderDoc.payment.status = "completed";
          orderDoc.payment.razorpayPaymentId = payment.id;
          orderDoc.payment.paidAt = new Date();
          orderDoc.status = "confirmed";
          orderDoc.statusHistory.push({
            status: "confirmed",
            timestamp: new Date(),
            note: "Order paid via webhook",
          });
          await orderDoc.save();
          console.log(`Order ${orderDoc._id} marked as paid via webhook`);
        }
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Disable body parsing for webhook (we need raw body for signature verification)
export const config = {
  api: {
    bodyParser: false,
  },
};
