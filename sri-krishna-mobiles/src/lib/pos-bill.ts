import mongoose from "mongoose";
import { prisma } from "@/lib/db";
import { connectDB } from "@/models";
import Bill from "@/models/Bill";

const GST_RATE = 0.18;
const SHOP_GSTIN = process.env.SHOP_GSTIN || "29XXXXXXXXXX1ZX";

export type PosBillItemInput = {
  productId: number;
  quantity: number;
  discount?: number;
  unitPrice?: number;
};

export type PosPaymentInput = {
  method: "cash" | "card" | "upi" | "wallet" | "credit";
  amount: number;
  transactionId?: string;
  notes?: string;
};

export type CreatePosBillInput = {
  type: "retail" | "wholesale";
  customer: { name: string; phone: string; email?: string };
  items: PosBillItemInput[];
  payments: PosPaymentInput[];
  isCreditSale?: boolean;
  creditDueDate?: string;
  notes?: string;
  cashierId: string;
  cashierName: string;
};

export async function generateBillNumber() {
  await connectDB();
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const count = await Bill.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });
  return `BILL${year}${month}${day}${(count + 1).toString().padStart(4, "0")}`;
}

export async function createPosBill(input: CreatePosBillInput) {
  if (!input.items.length) {
    throw new Error("Cart is empty");
  }
  if (!input.customer.phone?.trim()) {
    throw new Error("Customer phone is required for shop billing");
  }

  const productIds = input.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { category: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of input.items) {
    const product = productMap.get(item.productId);
    if (!product) throw new Error(`Product #${item.productId} not found`);
    if (product.stockQty < item.quantity) {
      throw new Error(`Not enough stock for ${product.name}. Available: ${product.stockQty}`);
    }
  }

  let subtotal = 0;
  let totalDiscount = 0;
  const billItems = input.items.map((item) => {
    const product = productMap.get(item.productId)!;
    const unitPrice =
      item.unitPrice ??
      (input.type === "wholesale" && product.wholesalePrice != null
        ? product.wholesalePrice
        : product.price);
    const discountAmount = item.discount || 0;
    const lineSubtotal = unitPrice * item.quantity - discountAmount;
    const taxAmount = Math.round(lineSubtotal * GST_RATE * 100) / 100;
    const total = Math.round((lineSubtotal + taxAmount) * 100) / 100;
    subtotal += lineSubtotal;
    totalDiscount += discountAmount;
    return {
      productId: String(product.id),
      name: product.name,
      sku: product.sku || `SKU-${product.id}`,
      barcode: product.barcode || undefined,
      quantity: item.quantity,
      unitPrice,
      discountAmount,
      discountPercent: 0,
      taxRate: 18,
      taxAmount,
      total,
    };
  });

  subtotal = Math.round(subtotal * 100) / 100;
  const totalTaxAmount = Math.round(subtotal * GST_RATE * 100) / 100;
  const cgstTotal = Math.round((totalTaxAmount / 2) * 100) / 100;
  const sgstTotal = Math.round((totalTaxAmount / 2) * 100) / 100;
  const total = Math.round((subtotal + totalTaxAmount) * 100) / 100;
  const paidAmount = input.payments.reduce((sum, p) => sum + p.amount, 0);
  const isCreditSale =
    input.isCreditSale || input.payments.some((p) => p.method === "credit") || paidAmount < total;

  if (!isCreditSale && paidAmount + 0.01 < total) {
    throw new Error(`Payment incomplete. Due: ₹${(total - paidAmount).toFixed(2)}`);
  }

  const creditPaidAmount = input.payments
    .filter((p) => p.method !== "credit")
    .reduce((sum, p) => sum + p.amount, 0);
  const creditRemainingAmount = isCreditSale ? Math.max(0, total - creditPaidAmount) : 0;

  await connectDB();
  const billNumber = await generateBillNumber();

  let cashierObjectId: mongoose.Types.ObjectId;
  try {
    cashierObjectId = new mongoose.Types.ObjectId(input.cashierId);
  } catch {
    cashierObjectId = new mongoose.Types.ObjectId();
  }

  const bill = await Bill.create({
    billNumber,
    type: input.type,
    customer: {
      name: input.customer.name.trim() || "Walk-in Customer",
      phone: input.customer.phone.trim(),
      email: input.customer.email,
      isCreditCustomer: isCreditSale,
    },
    items: billItems,
    subtotal,
    totalDiscount,
    totalTaxAmount,
    cgstTotal,
    sgstTotal,
    roundOff: 0,
    total,
    payments: input.payments,
    isCreditSale,
    creditDueDate: input.creditDueDate ? new Date(input.creditDueDate) : undefined,
    creditPaidAmount,
    creditRemainingAmount,
    shopGstin: SHOP_GSTIN,
    notes: input.notes,
    cashierId: cashierObjectId,
    cashierName: input.cashierName,
  });

  for (const item of input.items) {
    const updated = await prisma.product.update({
      where: { id: item.productId },
      data: {
        stockQty: { decrement: item.quantity },
      },
    });
    if (updated.stockQty <= 0) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { inStock: false, stockQty: 0 },
      });
    }
  }

  return bill;
}
