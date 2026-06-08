import { NextRequest, NextResponse } from "next/server";
import { sendOTP, verifyOTP } from "@/lib/notifications/sms";

// Send OTP
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const result = await sendOTP(phone);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "OTP sent successfully",
        otp: result.otp, // Only returned in development mode
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send OTP", details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Verify OTP
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    const isValid = verifyOTP(phone, otp);

    return NextResponse.json({
      success: isValid,
      message: isValid ? "OTP verified successfully" : "Invalid or expired OTP",
    });
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
