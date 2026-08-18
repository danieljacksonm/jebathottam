import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private prisma: PrismaService) {}

  private range(from?: string, to?: string) {
    const start = from ? new Date(from) : new Date(new Date().setDate(1));
    start.setHours(0, 0, 0, 0);
    const end = to ? new Date(to) : new Date();
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  @Get('sales')
  async sales(
    @Req() req: { user: { shopId: string } },
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const shopId = req.user.shopId;
    const { start, end } = this.range(from, to);

    const bills = await this.prisma.bill.findMany({
      where: {
        shopId,
        docType: 'invoice',
        status: { not: 'void' },
        billDate: { gte: start, lte: end },
      },
      include: { customer: true, items: true },
      orderBy: { billDate: 'desc' },
    });

    const expenses = await this.prisma.expense.findMany({
      where: { shopId, expenseDate: { gte: start, lte: end } },
    });

    const totalSales = bills.reduce((s, b) => s + b.grandTotal, 0);
    const totalTax = bills.reduce((s, b) => s + b.taxTotal, 0);
    const totalPaid = bills.reduce((s, b) => s + b.paidAmount, 0);
    const totalDiscount = bills.reduce((s, b) => s + b.discount, 0);
    const unpaid = bills
      .filter((b) => b.status !== 'paid')
      .reduce((s, b) => s + (b.grandTotal - b.paidAmount), 0);
    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);

    const byDayMap = new Map<string, { date: string; sales: number; bills: number }>();
    for (const b of bills) {
      const key = b.billDate.toISOString().slice(0, 10);
      const row = byDayMap.get(key) || { date: key, sales: 0, bills: 0 };
      row.sales += b.grandTotal;
      row.bills += 1;
      byDayMap.set(key, row);
    }

    const topProducts = new Map<string, { name: string; qty: number; amount: number }>();
    for (const b of bills) {
      for (const item of b.items) {
        const row = topProducts.get(item.name) || {
          name: item.name,
          qty: 0,
          amount: 0,
        };
        row.qty += item.qty;
        row.amount += item.lineTotal;
        topProducts.set(item.name, row);
      }
    }

    const byMode = new Map<string, number>();
    for (const b of bills) {
      byMode.set(b.paymentMode, (byMode.get(b.paymentMode) || 0) + b.paidAmount);
    }

    return {
      from: start.toISOString(),
      to: end.toISOString(),
      summary: {
        invoiceCount: bills.length,
        totalSales: Math.round(totalSales * 100) / 100,
        totalTax: Math.round(totalTax * 100) / 100,
        totalPaid: Math.round(totalPaid * 100) / 100,
        totalDiscount: Math.round(totalDiscount * 100) / 100,
        outstanding: Math.round(unpaid * 100) / 100,
        totalExpense: Math.round(totalExpense * 100) / 100,
        netCash: Math.round((totalPaid - totalExpense) * 100) / 100,
      },
      byPaymentMode: Array.from(byMode.entries()).map(([mode, amount]) => ({
        mode,
        amount: Math.round(amount * 100) / 100,
      })),
      byDay: Array.from(byDayMap.values()).sort((a, b) =>
        a.date < b.date ? 1 : -1,
      ),
      topProducts: Array.from(topProducts.values())
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10),
      recent: bills.slice(0, 25).map((b) => ({
        id: b.id,
        invoiceLabel: b.invoiceLabel,
        billDate: b.billDate,
        customer: b.customer?.name || 'Walk-in',
        grandTotal: b.grandTotal,
        paidAmount: b.paidAmount,
        status: b.status,
      })),
    };
  }

  @Get('gst')
  async gst(
    @Req() req: { user: { shopId: string } },
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const { start, end } = this.range(from, to);
    const bills = await this.prisma.bill.findMany({
      where: {
        shopId: req.user.shopId,
        docType: 'invoice',
        status: { not: 'void' },
        billDate: { gte: start, lte: end },
      },
      include: { items: true, customer: true },
    });

    const byRate = new Map<
      number,
      { gstRate: number; taxable: number; tax: number; invoices: number }
    >();

    for (const b of bills) {
      const ratesInBill = new Set<number>();
      for (const item of b.items) {
        const base = Math.max(0, item.qty * item.price - (item.discount || 0));
        const tax = (base * item.gstRate) / 100;
        const row = byRate.get(item.gstRate) || {
          gstRate: item.gstRate,
          taxable: 0,
          tax: 0,
          invoices: 0,
        };
        row.taxable += base;
        row.tax += tax;
        byRate.set(item.gstRate, row);
        ratesInBill.add(item.gstRate);
      }
      for (const rate of ratesInBill) {
        const row = byRate.get(rate)!;
        row.invoices += 1;
      }
    }

    const rows = Array.from(byRate.values())
      .map((r) => ({
        gstRate: r.gstRate,
        taxable: Math.round(r.taxable * 100) / 100,
        cgst: Math.round((r.tax / 2) * 100) / 100,
        sgst: Math.round((r.tax / 2) * 100) / 100,
        igst: 0,
        tax: Math.round(r.tax * 100) / 100,
        invoices: r.invoices,
      }))
      .sort((a, b) => a.gstRate - b.gstRate);

    return {
      from: start.toISOString(),
      to: end.toISOString(),
      rows,
      totals: {
        taxable: Math.round(rows.reduce((s, r) => s + r.taxable, 0) * 100) / 100,
        cgst: Math.round(rows.reduce((s, r) => s + r.cgst, 0) * 100) / 100,
        sgst: Math.round(rows.reduce((s, r) => s + r.sgst, 0) * 100) / 100,
        tax: Math.round(rows.reduce((s, r) => s + r.tax, 0) * 100) / 100,
      },
    };
  }

  @Get('ledger')
  async ledger(@Req() req: { user: { shopId: string } }) {
    const customers = await this.prisma.customer.findMany({
      where: { shopId: req.user.shopId },
      include: {
        bills: {
          where: { docType: 'invoice', status: { not: 'void' } },
          orderBy: { billDate: 'desc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return customers
      .map((c) => {
        const billed = c.bills.reduce((s, b) => s + b.grandTotal, 0);
        const paid = c.bills.reduce((s, b) => s + b.paidAmount, 0);
        const due = Math.round((billed - paid) * 100) / 100;
        return {
          id: c.id,
          name: c.name,
          phone: c.phone,
          gstin: c.gstin,
          invoiceCount: c.bills.length,
          billed: Math.round(billed * 100) / 100,
          paid: Math.round(paid * 100) / 100,
          due,
          overdueCount: c.bills.filter(
            (b) =>
              b.status !== 'paid' &&
              b.dueDate &&
              b.dueDate < new Date() &&
              b.grandTotal > b.paidAmount,
          ).length,
        };
      })
      .filter((c) => c.invoiceCount > 0)
      .sort((a, b) => b.due - a.due);
  }

  @Get('ledger/:customerId')
  async customerLedger(
    @Req() req: { user: { shopId: string } },
    @Param('customerId') customerId: string,
  ) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, shopId: req.user.shopId },
    });
    if (!customer) return null;

    const bills = await this.prisma.bill.findMany({
      where: {
        shopId: req.user.shopId,
        customerId,
        docType: 'invoice',
        status: { not: 'void' },
      },
      include: { payments: true },
      orderBy: { billDate: 'asc' },
    });

    let running = 0;
    const entries = bills.flatMap((b) => {
      const rows: Array<{
        date: string;
        type: string;
        ref: string;
        debit: number;
        credit: number;
        balance: number;
        billId: string;
      }> = [];

      running += b.grandTotal;
      rows.push({
        date: b.billDate.toISOString(),
        type: 'Invoice',
        ref: b.invoiceLabel,
        debit: b.grandTotal,
        credit: 0,
        balance: Math.round(running * 100) / 100,
        billId: b.id,
      });

      for (const p of b.payments) {
        running -= p.amount;
        rows.push({
          date: p.paidAt.toISOString(),
          type: 'Payment',
          ref: `${b.invoiceLabel} · ${p.mode}`,
          debit: 0,
          credit: p.amount,
          balance: Math.round(running * 100) / 100,
          billId: b.id,
        });
      }
      return rows;
    });

    return {
      customer,
      balance: Math.round(running * 100) / 100,
      entries,
    };
  }

  @Get('gst-invoices')
  async gstInvoices(
    @Req() req: { user: { shopId: string } },
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const { start, end } = this.range(from, to);
    const shop = await this.prisma.shop.findUnique({
      where: { id: req.user.shopId },
    });
    const bills = await this.prisma.bill.findMany({
      where: {
        shopId: req.user.shopId,
        docType: 'invoice',
        status: { not: 'void' },
        billDate: { gte: start, lte: end },
      },
      include: { items: true, customer: true },
      orderBy: { billDate: 'asc' },
    });

    const rows = bills.flatMap((b) =>
      b.items.map((item) => {
        const taxable = Math.max(
          0,
          item.qty * item.price - (item.discount || 0),
        );
        const tax = (taxable * item.gstRate) / 100;
        return {
          invoiceNo: b.invoiceLabel,
          billDate: b.billDate.toISOString().slice(0, 10),
          customerName: b.customer?.name || 'Walk-in',
          customerGstin: b.customer?.gstin || '',
          hsn: '',
          itemName: item.name,
          qty: item.qty,
          rate: item.price,
          taxable: Math.round(taxable * 100) / 100,
          gstRate: item.gstRate,
          cgst: Math.round((tax / 2) * 100) / 100,
          sgst: Math.round((tax / 2) * 100) / 100,
          igst: 0,
          lineTotal: item.lineTotal,
          paymentMode: b.paymentMode,
          status: b.status,
        };
      }),
    );

    return {
      from: start.toISOString().slice(0, 10),
      to: end.toISOString().slice(0, 10),
      shop: {
        name: shop?.name || '',
        gstin: shop?.gstin || '',
      },
      rows,
      count: rows.length,
    };
  }

  @Get('daybook')
  async daybook(
    @Req() req: { user: { shopId: string } },
    @Query('date') date?: string,
  ) {
    const day = date ? new Date(date) : new Date();
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setHours(23, 59, 59, 999);
    const shopId = req.user.shopId;

    const [bills, payments, expenses] = await Promise.all([
      this.prisma.bill.findMany({
        where: {
          shopId,
          docType: 'invoice',
          status: { not: 'void' },
          billDate: { gte: start, lte: end },
        },
        include: { customer: true },
      }),
      this.prisma.payment.findMany({
        where: { shopId, paidAt: { gte: start, lte: end } },
        include: { bill: true },
      }),
      this.prisma.expense.findMany({
        where: { shopId, expenseDate: { gte: start, lte: end } },
      }),
    ]);

    const sales = bills.reduce((s, b) => s + b.grandTotal, 0);
    const collected = payments.reduce((s, p) => s + p.amount, 0);
    const spent = expenses.reduce((s, e) => s + e.amount, 0);

    return {
      date: start.toISOString().slice(0, 10),
      summary: {
        invoices: bills.length,
        sales: Math.round(sales * 100) / 100,
        collected: Math.round(collected * 100) / 100,
        expenses: Math.round(spent * 100) / 100,
        net: Math.round((collected - spent) * 100) / 100,
      },
      bills,
      payments,
      expenses,
    };
  }
}
