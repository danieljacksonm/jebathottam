const RAZORPAY_BASE = "https://api.razorpay.com/v1";

function getAuth(): string {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Missing Razorpay credentials");
  return Buffer.from(`${keyId}:${keySecret}`).toString("base64");
}

export async function createRazorpayOrder(amountPaise: number, receipt: string) {
  const res = await fetch(`${RAZORPAY_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${getAuth()}`,
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt: receipt.slice(0, 40),
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Razorpay create order failed: ${err}`);
  }
  const data = (await res.json()) as { id: string };
  return data.id;
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require("node:crypto") as typeof import("node:crypto");
  const payload = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return expected === signature;
}
