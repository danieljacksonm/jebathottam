import { createPaymentIntent } from "@/lib/payments";
import { getServerProductPrice } from "@/lib/products";
import { checkoutSchema, cartItemSchema } from "@/lib/validation";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING } from "@/lib/constants";
import { z } from "zod";

const CUSTOM_PRICES: Record<string, number> = {
  small: 299,
  medium: 499,
  large: 799,
};

function estimateShipping(subtotal: number) {
  if (subtotal <= 0) return 0;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return STANDARD_SHIPPING;
}

function priceCustomItem(sizeId: string, quantity: number) {
  const sizeKey = sizeId.split("-")[0];
  const unit = CUSTOM_PRICES[sizeKey];
  if (!unit || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
    return null;
  }
  return { unitPrice: unit, lineTotal: unit * quantity };
}

const bodySchema = z.object({
  customer: checkoutSchema,
  items: z.array(cartItemSchema).min(1),
  shippingMethod: z.enum(["standard", "express"]).default("standard"),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "form";
        fieldErrors[key.replace(/^customer\./, "")] = issue.message;
      }
      return Response.json(
        { error: "Please check your details", fieldErrors },
        { status: 400 },
      );
    }

    const { customer, items } = parsed.data;
    const priced = [];

    for (const item of items) {
      if (item.productId === "custom-sticker") {
        const custom = priceCustomItem(item.sizeId, item.quantity);
        if (!custom) {
          return Response.json(
            { error: "Invalid custom sticker size or quantity" },
            { status: 400 },
          );
        }
        priced.push({
          productId: item.productId,
          name: "Custom Sticker",
          sizeId: item.sizeId,
          quantity: item.quantity,
          unitPrice: custom.unitPrice,
          lineTotal: custom.lineTotal,
        });
        continue;
      }

      const result = await getServerProductPrice(item.productId, item.sizeId, item.quantity);
      if (!result) {
        return Response.json(
          { error: "Invalid product, size, or quantity in cart" },
          { status: 400 },
        );
      }
      priced.push({
        productId: item.productId,
        name: result.product.name,
        sizeId: item.sizeId,
        quantity: item.quantity,
        unitPrice: result.unitPrice,
        lineTotal: result.lineTotal,
      });
    }

    const subtotal = priced.reduce((sum, i) => sum + i.lineTotal, 0);
    const shipping = estimateShipping(subtotal);
    const total = subtotal + shipping;
    const orderId = `RS-${Date.now().toString(36).toUpperCase()}`;

    const payment = await createPaymentIntent({
      orderId,
      amount: total,
      currency: "INR",
      customer,
      items: priced,
    });

    return Response.json({
      orderId,
      subtotal,
      shipping,
      total,
      payment,
      message: payment.configured
        ? "Order created. Continue with payment."
        : "Order reserved. Connect Razorpay or Stripe credentials to enable payment capture.",
    });
  } catch {
    return Response.json({ error: "Unable to process checkout" }, { status: 500 });
  }
}
