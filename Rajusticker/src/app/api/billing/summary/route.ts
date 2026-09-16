import { staffFromRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  if (!staffFromRequest(request)) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const bills = await prisma.bill.findMany({
    where: { createdAt: { gte: start } },
    include: { payments: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  const totals = { cash: 0, upi: 0, card: 0, bills: bills.length, revenue: 0 };
  for (const bill of bills) {
    totals.revenue += bill.total;
    for (const payment of bill.payments) {
      if (payment.method === "cash" || payment.method === "upi" || payment.method === "card") {
        totals[payment.method] += payment.amount;
      }
    }
  }

  return Response.json({ totals, bills });
}
