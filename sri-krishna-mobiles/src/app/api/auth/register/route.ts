/**
 * User Registration API
 * POST /api/auth/register
 * Creates a new customer account with validation
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/models";
import { User } from "@/models/User";

// Registration validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character (!@#$% etc)"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .optional()
    .or(z.literal("")),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    // Empty phone should be treated as missing
    if (body.phone === "" || body.phone === null) {
      delete body.phone;
    }
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const firstError =
        Object.values(fieldErrors).flat()[0] || "Validation failed";
      return NextResponse.json(
        {
          error: firstError,
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = validation.data;
    const phoneValue = phone && phone.length === 10 ? phone : undefined;

    // Connect to database
    await connectDB();

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Check if phone already exists (if provided)
    if (phoneValue) {
      const existingPhone = await User.findOne({ phone: phoneValue });
      if (existingPhone) {
        return NextResponse.json(
          { error: "An account with this phone number already exists" },
          { status: 409 }
        );
      }
    }

    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phoneValue,
      role: "customer",
      isActive: true,
      isBlocked: false,
      addresses: [],
      wishlist: [],
    });

    // Return success response (without password)
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
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
