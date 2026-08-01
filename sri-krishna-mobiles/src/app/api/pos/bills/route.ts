import { NextRequest, NextResponse } from "next/server";
import { requirePosSession } from "@/lib/pos-auth";
import { createPosBill } from "@/lib/pos-bill";
import { connectDB } from "@/models";
import Bill from "@/models/Bill";

export async function GET(request: NextRequest) {
  const auth = await requirePosSession();
  if (auth.error) return auth.error;

  try {
    const dateParam = request.nextUrl.searchParams.get("date");
    const date = dateParam ? new Date(dateParam) : new Date();
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    await connectDB();
    const bills = await Bill.find({
      createdAt: { $gte: start, $lte: end },
      type: { $in: ["retail", "wholesale"] },
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      bills: bills.map((b) => ({
        id: b.billNumber,
        billNumber: b.billNumber,
        date: b.createdAt,
        customer: b.customer,
        items: b.items,
        subtotal: b.subtotal,
        totalTaxAmount: b.totalTaxAmount,
        total: b.total,
        payments: b.payments,
        type: b.type,
        isCreditSale: b.isCreditSale,
        creditRemainingAmount: b.creditRemainingAmount,
      })),
    });
  } catch (error) {
    console.error("POS bills list error:", error);
    return NextResponse.json({ error: "Failed to load bills" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requirePosSession();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const bill = await createPosBill({
      type: body.type === "wholesale" ? "wholesale" : "retail",
      customer: {
        name: body.customer?.name || "Walk-in Customer",
        phone: body.customer?.phone || "",
        email: body.customer?.email,
      },
      items: (body.items || []).map((item: {
        productId: number | string;
        quantity: number;
        discount?: number;
        unitPrice?: number;
      }) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        discount: Number(item.discount || 0),
        unitPrice: item.unitPrice != null ? Number(item.unitPrice) : undefined,
      })),
      payments: body.payments || [],
      isCreditSale: Boolean(body.isCreditSale),
      creditDueDate: body.creditDueDate,
      notes: body.notes,
      cashierId: auth.userId,
      cashierName: auth.userName,
    });

    return NextResponse.json({
      bill: {
        id: bill.billNumber,
        billNumber: bill.billNumber,
        date: bill.createdAt.toISOString().split("T")[0],
        time: bill.createdAt.toLocaleTimeString(),
        customer: bill.customer,
        items: bill.items.map((item) => ({
          id: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.unitPrice,
          discount: item.discountAmount,
        })),
        subtotal: bill.subtotal,
        gstAmount: bill.totalTaxAmount,
        total: bill.total,
        payments: bill.payments,
        isCreditSale: bill.isCreditSale,
        creditRemainingAmount: bill.creditRemainingAmount,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save bill";
    console.error("POS bill save error:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
