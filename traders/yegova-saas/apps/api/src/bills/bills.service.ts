import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateBillDto, UpdatePaymentDto } from './dto';

type Actor = { userId?: string; userName?: string };

@Injectable()
export class BillsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  list(
    shopId: string,
    q?: string,
    status?: string,
    docType = 'invoice',
  ) {
    return this.prisma.bill.findMany({
      where: {
        shopId,
        docType,
        ...(status ? { status } : {}),
        ...(q
          ? {
              OR: [
                { invoiceLabel: { contains: q } },
                { customer: { name: { contains: q } } },
                { notes: { contains: q } },
              ],
            }
          : {}),
      },
      include: { customer: true, items: true, payments: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async get(shopId: string, id: string) {
    const bill = await this.prisma.bill.findFirst({
      where: { id, shopId },
      include: {
        customer: true,
        items: true,
        shop: true,
        payments: { orderBy: { paidAt: 'desc' } },
      },
    });
    if (!bill) throw new NotFoundException('Bill not found');
    return bill;
  }

  private paymentStatus(paidAmount: number, grandTotal: number, docType: string) {
    if (docType === 'quote') return 'draft';
    if (paidAmount <= 0) return 'unpaid';
    if (paidAmount + 0.001 >= grandTotal) return 'paid';
    return 'partial';
  }

  private calcLines(items: CreateBillDto['items']) {
    return items.map((item) => {
      const gstRate = item.gstRate ?? 0;
      const lineDiscount = item.discount ?? 0;
      const base = Math.max(0, item.qty * item.price - lineDiscount);
      const tax = (base * gstRate) / 100;
      return {
        productId: item.productId || null,
        name: item.name.trim(),
        qty: item.qty,
        price: item.price,
        discount: lineDiscount,
        gstRate,
        lineTotal: Math.round((base + tax) * 100) / 100,
        base,
        tax,
      };
    });
  }

  async create(shopId: string, dto: CreateBillDto, actor: Actor = {}) {
    if (!dto.items?.length) {
      throw new BadRequestException('Add at least one item');
    }

    const docType = dto.docType || 'invoice';
    const lines = this.calcLines(dto.items);
    const subtotal = Math.round(lines.reduce((s, l) => s + l.base, 0) * 100) / 100;
    const taxTotal = Math.round(lines.reduce((s, l) => s + l.tax, 0) * 100) / 100;
    const discount = Math.min(dto.discount ?? 0, subtotal + taxTotal);
    const beforeRound = Math.max(0, subtotal + taxTotal - discount);
    const roundOff = Math.round(beforeRound) - beforeRound;
    const grandTotal = Math.round((beforeRound + roundOff) * 100) / 100;

    let paidAmount = 0;
    let paymentMode = dto.paymentMode || 'cash';
    if (docType === 'quote') {
      paidAmount = 0;
      paymentMode = 'credit';
    } else if (docType === 'credit_note') {
      paidAmount = 0;
      paymentMode = 'credit';
    } else if (dto.paidAmount === undefined) {
      paidAmount = paymentMode === 'credit' ? 0 : grandTotal;
    } else {
      paidAmount = Math.min(dto.paidAmount, grandTotal);
    }

    const status = this.paymentStatus(paidAmount, grandTotal, docType);
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    const last = await this.prisma.bill.findFirst({
      where: { shopId, docType },
      orderBy: { invoiceNo: 'desc' },
    });
    const invoiceNo = (last?.invoiceNo || 100) + 1;
    const prefix =
      docType === 'quote'
        ? (shop?.quotePrefix || 'QT').trim() || 'QT'
        : docType === 'credit_note'
          ? 'CN'
          : (shop?.invoicePrefix || 'INV').trim() || 'INV';
    const invoiceLabel = `${prefix}-${invoiceNo}`;
    const dueDate = dto.dueDate ? new Date(dto.dueDate) : null;

    return this.prisma.$transaction(async (tx) => {
      const created = await tx.bill.create({
        data: {
          shopId,
          customerId: dto.customerId || null,
          invoiceNo,
          invoiceLabel,
          docType,
          subtotal,
          discount,
          taxTotal,
          roundOff: Math.round(roundOff * 100) / 100,
          grandTotal,
          paidAmount,
          paymentMode,
          status,
          notes: dto.notes?.trim() || null,
          dueDate,
          items: {
            create: lines.map((l) => ({
              productId: l.productId,
              name: l.name,
              qty: l.qty,
              price: l.price,
              discount: l.discount,
              gstRate: l.gstRate,
              lineTotal: l.lineTotal,
            })),
          },
        },
        include: { customer: true, items: true, payments: true },
      });

      if (docType === 'invoice') {
        for (const line of lines) {
          if (!line.productId) continue;
          await tx.product.updateMany({
            where: { id: line.productId, shopId },
            data: { stock: { decrement: line.qty } },
          });
          await tx.stockMovement.create({
            data: {
              shopId,
              productId: line.productId,
              qty: -line.qty,
              type: 'out',
              note: `Sale ${invoiceLabel}`,
            },
          });
        }

        if (paidAmount > 0) {
          await tx.payment.create({
            data: {
              shopId,
              billId: created.id,
              amount: paidAmount,
              mode: paymentMode,
              note: 'Initial payment',
            },
          });
        }
      }

      if (docType === 'credit_note') {
        for (const line of lines) {
          if (!line.productId) continue;
          await tx.product.updateMany({
            where: { id: line.productId, shopId },
            data: { stock: { increment: line.qty } },
          });
          await tx.stockMovement.create({
            data: {
              shopId,
              productId: line.productId,
              qty: line.qty,
              type: 'in',
              note: `Credit note ${invoiceLabel}`,
            },
          });
        }
      }

      return created;
    }).then(async (created) => {
      await this.audit.log({
        shopId,
        userId: actor.userId,
        userName: actor.userName,
        action:
          docType === 'quote'
            ? 'quote.create'
            : docType === 'credit_note'
              ? 'credit.create'
              : 'bill.create',
        entity: 'bill',
        entityId: created.id,
        detail: `${created.invoiceLabel} · Rs ${created.grandTotal}`,
      });
      return created;
    });
  }

  async updatePayment(
    shopId: string,
    id: string,
    dto: UpdatePaymentDto,
    actor: Actor = {},
  ) {
    const bill = await this.get(shopId, id);
    if (bill.status === 'void') {
      throw new BadRequestException('Cannot take payment on a void invoice');
    }
    if (bill.docType !== 'invoice') {
      throw new BadRequestException('Payments only for invoices');
    }

    const previous = bill.paidAmount;
    const paidAmount = Math.min(dto.paidAmount, bill.grandTotal);
    const delta = Math.round((paidAmount - previous) * 100) / 100;
    const mode = dto.paymentMode || bill.paymentMode || 'cash';

    return this.prisma.$transaction(async (tx) => {
      if (delta > 0) {
        await tx.payment.create({
          data: {
            shopId,
            billId: id,
            amount: delta,
            mode,
            note: dto.note || 'Payment received',
          },
        });
      }

      return tx.bill.update({
        where: { id },
        data: {
          paidAmount,
          paymentMode: mode,
          status: this.paymentStatus(paidAmount, bill.grandTotal, 'invoice'),
        },
        include: { customer: true, items: true, payments: true },
      });
    }).then(async (updated) => {
      await this.audit.log({
        shopId,
        userId: actor.userId,
        userName: actor.userName,
        action: 'bill.payment',
        entity: 'bill',
        entityId: id,
        detail: `${updated.invoiceLabel} · paid Rs ${updated.paidAmount}`,
      });
      return updated;
    });
  }

  async voidBill(shopId: string, id: string, actor: Actor = {}) {
    const bill = await this.get(shopId, id);
    if (bill.status === 'void') {
      throw new BadRequestException('Invoice already void');
    }
    if (bill.docType === 'quote' && bill.status === 'converted') {
      throw new BadRequestException('Converted quote cannot be voided');
    }

    return this.prisma.$transaction(async (tx) => {
      if (bill.docType === 'invoice') {
        for (const item of bill.items) {
          if (!item.productId) continue;
          await tx.product.updateMany({
            where: { id: item.productId, shopId },
            data: { stock: { increment: item.qty } },
          });
          await tx.stockMovement.create({
            data: {
              shopId,
              productId: item.productId,
              qty: item.qty,
              type: 'in',
              note: `Void ${bill.invoiceLabel}`,
            },
          });
        }
      }

      return tx.bill.update({
        where: { id },
        data: { status: 'void', paidAmount: 0 },
        include: { customer: true, items: true, payments: true },
      });
    }).then(async (updated) => {
      await this.audit.log({
        shopId,
        userId: actor.userId,
        userName: actor.userName,
        action: 'bill.void',
        entity: 'bill',
        entityId: id,
        detail: updated.invoiceLabel,
      });
      return updated;
    });
  }

  async convertQuote(shopId: string, id: string) {
    const quote = await this.get(shopId, id);
    if (quote.docType !== 'quote') {
      throw new BadRequestException('Not a quote');
    }
    if (quote.status === 'converted') {
      throw new BadRequestException('Quote already converted');
    }
    if (quote.status === 'void') {
      throw new BadRequestException('Quote is void');
    }

    const invoice = await this.create(shopId, {
      customerId: quote.customerId || undefined,
      notes: quote.notes || undefined,
      discount: quote.discount,
      paymentMode: 'credit',
      paidAmount: 0,
      docType: 'invoice',
      items: quote.items.map((i) => ({
        productId: i.productId || undefined,
        name: i.name,
        qty: i.qty,
        price: i.price,
        discount: i.discount,
        gstRate: i.gstRate,
      })),
    });

    await this.prisma.bill.update({
      where: { id: quote.id },
      data: { status: 'converted', convertedFromId: invoice.id },
    });

    await this.prisma.bill.update({
      where: { id: invoice.id },
      data: { convertedFromId: quote.id },
    });

    return invoice;
  }

  async duplicate(shopId: string, id: string) {
    const bill = await this.get(shopId, id);
    return this.create(shopId, {
      customerId: bill.customerId || undefined,
      notes: bill.notes || undefined,
      discount: bill.discount,
      paymentMode: bill.paymentMode as CreateBillDto['paymentMode'],
      paidAmount: 0,
      docType: bill.docType === 'quote' ? 'quote' : 'invoice',
      items: bill.items.map((i) => ({
        productId: i.productId || undefined,
        name: i.name,
        qty: i.qty,
        price: i.price,
        discount: i.discount,
        gstRate: i.gstRate,
      })),
    });
  }
}
