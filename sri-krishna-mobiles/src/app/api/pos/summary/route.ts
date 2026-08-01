import { NextRequest, NextResponse } from "next/server";
import { requirePosSession } from "@/lib/pos-auth";
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
    }).lean();

    let cash = 0;
    let upi = 0;
    let card = 0;
    let credit = 0;
    let totalItems = 0;

    for (const bill of bills) {
      totalItems += bill.items.reduce((sum, item) => sum + item.quantity, 0);
      for (const payment of bill.payments) {
        if (payment.method === "cash") cash += payment.amount;
        if (payment.method === "upi") upi += payment.amount;
        if (payment.method === "card") card += payment.amount;
        if (payment.method === "credit") credit += payment.amount;
      }
      if (bill.isCreditSale) {
        credit += bill.creditRemainingAmount || 0;
      }
    }

    const totalSales = bills.reduce((sum, b) => sum + b.total, 0);
    const totalTransactions = bills.length;
    const averageOrderValue =
      totalTransactions > 0 ? Math.round(totalSales / totalTransactions) : 0;

    return NextResponse.json({
      summary: {
        date: start.toISOString().split("T")[0],
        totalSales,
        totalTransactions,
        totalItems,
        averageOrderValue,
        payments: { cash, upi, card, credit },
        refunds: 0,
        expenses: 0,
        netCash: cash,
      },
      bills: bills.map((b) => ({
        id: b.billNumber,
        date: b.createdAt,
        total: b.total,
        paymentMethod: b.payments[0]?.method || (b.isCreditSale ? "credit" : "cash"),
        items: b.items.length,
        customer: b.customer?.name,
        isCreditSale: b.isCreditSale,
      })),
    });
  } catch (error) {
    console.error("POS summary error:", error);
    return NextResponse.json({ error: "Failed to load summary" }, { status: 500 });
  }
}
