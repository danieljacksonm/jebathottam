import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{8,15}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email"),
  address: z.string().trim().min(8, "Address is required").max(200),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postalCode: z
    .string()
    .trim()
    .regex(/^[0-9A-Za-z\-\s]{4,12}$/, "Enter a valid postal code"),
  country: z.string().trim().min(2).max(80).default("India"),
  notes: z.string().trim().max(500).optional(),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  sizeId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const customStickerSchema = z.object({
  text: z.string().trim().min(1, "Enter sticker text").max(48),
  color: z.string().min(1),
  size: z.enum(["small", "medium", "large"]),
  quantity: z.number().int().min(1).max(50),
  notes: z.string().trim().max(300).optional().default(""),
});

export const recommendSchema = z.object({
  intent: z.enum([
    "racing",
    "jdm",
    "funny",
    "minimal",
    "motivational",
    "car-brand",
    "motorsport",
    "custom",
    "chrome",
    "matte",
    "carbon",
    "other",
  ]),
  query: z.string().trim().max(120).optional(),
});
