/**
 * User Registration API
 * POST /api/auth/register
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/models";
import { User } from "@/models/User";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v === "" || v.length === 10, "Phone must be 10 digits")
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const body = {
      name: String(raw.name ?? "").trim(),
      email: String(raw.email ?? "").trim().toLowerCase(),
      password: String(raw.password ?? ""),
      phone: raw.phone ? String(raw.phone).trim() : undefined,
    };
    if (!body.phone) delete (body as { phone?: string }).phone;

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const messages = Object.entries(fieldErrors)
        .map(([field, errs]) => `${field}: ${(errs || []).join(", ")}`)
        .join(" | ");
      return NextResponse.json(
        {
          error: messages || "Validation failed",
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = validation.data;
    const phoneValue = phone && phone.length === 10 ? phone : undefined;

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    if (phoneValue) {
      const existingPhone = await User.findOne({ phone: phoneValue });
      if (existingPhone) {
        return NextResponse.json(
          { error: "An account with this phone number already exists" },
          { status: 409 }
        );
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phoneValue,
      role: "customer",
      isActive: true,
      isBlocked: false,
      addresses: [],
      wishlist: [],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
