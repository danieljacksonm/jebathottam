import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Billing checkout endpoint — placeholder until Razorpay/Stripe is connected.
 * Checkout UI already calls this route.
 */
export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email : "";
  } catch {
    // ignore
  }

  return NextResponse.json(
    {
      error: "Billing not connected yet",
      status: "pending_provider",
      message:
        "Payment gateway is not wired yet. Ask Ebenezer Billing AI on this page for help, or contact support.",
      email: email || null,
      nextSteps: [
        "Connect Razorpay or Stripe keys",
        "Create payment session in this route",
        "Return checkoutUrl to redirect the buyer",
      ],
      help: "/ai?mode=billing",
    },
    { status: 503 }
  );
}
