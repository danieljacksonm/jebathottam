import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { UpdateShopDto } from './dto';

@Injectable()
export class ShopService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async get(shopId: string) {
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Shop not found');
    return shop;
  }

  async update(
    shopId: string,
    dto: UpdateShopDto,
    actor?: { userId?: string; userName?: string },
  ) {
    await this.get(shopId);
    const shop = await this.prisma.shop.update({
      where: { id: shopId },
      data: {
        name: dto.name?.trim(),
        gstin: dto.gstin?.trim() || null,
        phone: dto.phone?.trim() || null,
        address: dto.address?.trim() || null,
        bankAccount: dto.bankAccount?.trim() || null,
        bankIfsc: dto.bankIfsc?.trim() || null,
        gpayPhone: dto.gpayPhone?.trim() || null,
        invoicePrefix: dto.invoicePrefix?.trim() || undefined,
        quotePrefix: dto.quotePrefix?.trim() || undefined,
        lowStockAt: dto.lowStockAt,
      },
    });
    await this.audit.log({
      shopId,
      userId: actor?.userId,
      userName: actor?.userName,
      action: 'shop.update',
      entity: 'shop',
      entityId: shopId,
      detail: shop.name,
    });
    return shop;
  }

  async backup(shopId: string, role?: string) {
    if (role === 'cashier') {
      throw new ForbiddenException('Only owner or manager can download backup');
    }
    const shop = await this.get(shopId);
    const [products, customers, bills, expenses, stockMoves, members] =
      await Promise.all([
        this.prisma.product.findMany({ where: { shopId } }),
        this.prisma.customer.findMany({ where: { shopId } }),
        this.prisma.bill.findMany({
          where: { shopId },
          include: { items: true, payments: true, customer: true },
        }),
        this.prisma.expense.findMany({ where: { shopId } }),
        this.prisma.stockMovement.findMany({
          where: { shopId },
          include: { product: { select: { name: true, sku: true } } },
        }),
        this.prisma.shopMember.findMany({
          where: { shopId },
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        }),
      ]);

    return {
      exportedAt: new Date().toISOString(),
      version: 1,
      shop: {
        id: shop.id,
        name: shop.name,
        gstin: shop.gstin,
        phone: shop.phone,
        address: shop.address,
        plan: shop.plan,
      },
      counts: {
        products: products.length,
        customers: customers.length,
        bills: bills.length,
        expenses: expenses.length,
        stockMoves: stockMoves.length,
        team: members.length,
      },
      products,
      customers,
      bills,
      expenses,
      stockMoves,
      team: members.map((m) => ({
        role: m.role,
        user: m.user,
      })),
    };
  }
}
