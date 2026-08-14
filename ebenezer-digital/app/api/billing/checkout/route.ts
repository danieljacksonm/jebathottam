import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Item = {
  name?: string;
  price?: number;
  qty?: number;
};

/**
 * PayPal Checkout (worldwide cards + PayPal balance).
 * Set PAYPAL_BUSINESS_EMAIL to your PayPal login / business email.
 */
export async function POST(request: Request) {
  let email = "";
  let items: Item[] = [];
  let successUrl = "";
  let cancelUrl = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email : "";
    items = Array.isArray(body?.items) ? body.items : [];
    successUrl = typeof body?.successUrl === "string" ? body.successUrl : "";
    cancelUrl = typeof body?.cancelUrl === "string" ? body.cancelUrl : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const total = items.reduce((n, it) => n + Number(it.price || 0) * Number(it.qty || 1), 0);
  const firstSlug = typeof items[0]?.name === "string" ? items[0].name : "Ebenezer order";

  if (total <= 0) {
    return NextResponse.json({
      orderId: `free-${Date.now()}`,
      email: email || null,
    });
  }

  const paypalEmail = process.env.PAYPAL_BUSINESS_EMAIL || "";
  if (!paypalEmail) {
    return NextResponse.json(
      {
        error: "PayPal not connected yet",
        status: "pending_provider",
        message:
          "Add PAYPAL_BUSINESS_EMAIL on the server (your PayPal business email), then restart. Kits are free for now — paid custom work can still use PayPal after that.",
        email: email || null,
        help: "/contact",
      },
      { status: 503 }
    );
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://ebenezerdigital.com";
  const ret = successUrl || `${origin}/products/success`;
  const cancel = cancelUrl || `${origin}/products/checkout`;

  const params = new URLSearchParams({
    cmd: "_xclick",
    business: paypalEmail,
    item_name: firstSlug.slice(0, 120),
    amount: total.toFixed(2),
    currency_code: "USD",
    no_shipping: "1",
    no_note: "1",
    return: ret,
    cancel_return: cancel,
    custom: email,
  });

  return NextResponse.json({
    checkoutUrl: `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`,
    provider: "paypal",
    email: email || null,
  });
}
