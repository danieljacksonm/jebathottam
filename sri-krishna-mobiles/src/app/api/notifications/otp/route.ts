import { NextRequest, NextResponse } from "next/server";
import { sendOTP, verifyOTP } from "@/lib/notifications/sms";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) return false;
  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (!checkRateLimit(`otp:${ip}`)) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }

    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const result = await sendOTP(phone);

    if (result.success) {
      const response: { success: boolean; message: string; otp?: string } = {
        success: true,
        message: "OTP sent successfully",
      };
      if (process.env.NODE_ENV === "development") {
        response.otp = result.otp;
      }
      return NextResponse.json(response);
    }

    return NextResponse.json({ error: "Failed to send OTP", details: result.error }, { status: 500 });
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
    }

    const isValid = verifyOTP(phone, otp);

    return NextResponse.json({
      success: isValid,
      message: isValid ? "OTP verified successfully" : "Invalid or expired OTP",
    });
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
