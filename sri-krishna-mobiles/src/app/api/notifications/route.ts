import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const apiKey = req.headers.get("x-api-key");
    const internalKey = process.env.INTERNAL_API_KEY;

    if (!session?.user && (!internalKey || apiKey !== internalKey)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { email, phone, template, data } = body;

    if ((!email && !phone) || !template) {
      return NextResponse.json(
        { error: "Email or phone, and template are required" },
        { status: 400 }
      );
    }

    const result = await sendNotification({ email, phone, template, data });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
