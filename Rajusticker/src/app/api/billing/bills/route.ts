import { staffFromRequest } from "@/lib/admin-auth";
import { getTradeUnitPrice, getUnitPrice } from "@/lib/catalog";
import { prisma } from "@/lib/db";
import { mapProduct } from "@/lib/products";
import { z } from "zod";

const bodySchema = z.object({
  customerName: z.string().max(80).optional(),
  customerPhone: z.string().max(20).optional(),
  saleType: z.enum(["retail", "trade"]).default("retail"),
  gstEnabled: z.boolean().default(true),
  items: z
    .array(
      z.object({
        productId: z.string(),
        sizeId: z.string(),
        quantity: z.number().int().min(1).max(99),
        discount: z.number().int().min(0).default(0),
      }),
    )
    .min(1),
  payments: z
    .array(
      z.object({
        method: z.enum(["cash", "upi", "card"]),
        amount: z.number().int().positive(),
      }),
    )
    .min(1),
});

function localStamp(date = new Date()) {
  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

async function nextBillId(tx: { bill: { count: (args: { where: { id: { startsWith: string } } }) => Promise<number> } }) {
  const prefix = `RS-${localStamp()}-`;
  const count = await tx.bill.count({ where: { id: { startsWith: prefix } } });
  return `${prefix}${String(count + 1).padStart(3, "0")}`;
}

export async function POST(request: Request) {
  if (!staffFromRequest(request)) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Check the bill lines" }, { status: 400 });
  }

  const { items, payments, saleType, gstEnabled, customerName, customerPhone } = parsed.data;

  try {
    const bill = await prisma.$transaction(async (tx) => {
      const needed = new Map<string, number>();
      for (const item of items) {
        needed.set(item.productId, (needed.get(item.productId) || 0) + item.quantity);
      }

      const lines = [];
      for (const item of items) {
        const row = await tx.product.findUnique({
          where: { id: item.productId },
          include: { sizes: true },
        });
        if (!row || !row.published) {
          throw new Error("A product is no longer available");
        }
        const demand = needed.get(row.id) || item.quantity;
        if (row.stock < demand) {
          throw new Error(`${row.name} only has ${row.stock} in stock`);
        }
        const product = mapProduct(row);
        const unit =
          saleType === "trade" ? getTradeUnitPrice(product, item.sizeId) : getUnitPrice(product, item.sizeId);
        const size = product.sizes.find((entry) => entry.id === item.sizeId) || product.sizes[0];
        const gross = unit * item.quantity;
        const discount = Math.min(item.discount, gross);
        lines.push({
          productId: row.id,
          name: row.name,
          sizeKey: size?.id || item.sizeId,
          sizeLabel: size?.label || item.sizeId,
          unitPrice: unit,
          quantity: item.quantity,
          discount,
          lineTotal: gross - discount,
        });
      }

      for (const [productId, quantity] of needed) {
        await tx.product.update({
          where: { id: productId },
          data: { stock: { decrement: quantity } },
        });
      }

      const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
      const discountTotal = lines.reduce((sum, line) => sum + line.discount, 0);
      const taxable = subtotal - discountTotal;
      const gstAmount = gstEnabled ? Math.round(taxable * 0.18) : 0;
      const total = taxable + gstAmount;
      const paid = payments.reduce((sum, payment) => sum + payment.amount, 0);
      if (paid !== total) {
        throw new Error("Payments must match the bill total");
      }

      const id = await nextBillId(tx);
      return tx.bill.create({
        data: {
          id,
          customerName: customerName?.trim() || null,
          customerPhone: customerPhone?.trim() || null,
          saleType,
          gstEnabled,
          subtotal,
          discountTotal,
          gstAmount,
          total,
          items: { create: lines },
          payments: { create: payments },
        },
        include: { items: true, payments: true },
      });
    });

    return Response.json({ bill });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save bill";
    return Response.json({ error: message }, { status: 400 });
  }
}
