import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private prisma: PrismaService) {}

  @Get('stats')
  async stats(@Req() req: { user: { shopId: string } }) {
    const shopId = req.user.shopId;
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    const lowAt = shop?.lowStockAt ?? 10;

    const [
      todayAgg,
      billCount,
      productCount,
      customerCount,
      recent,
      lowStock,
      teamCount,
      hasGstin,
    ] = await Promise.all([
      this.prisma.bill.aggregate({
        where: {
          shopId,
          docType: 'invoice',
          status: { not: 'void' },
          billDate: { gte: start },
        },
        _sum: { grandTotal: true },
        _count: true,
      }),
      this.prisma.bill.count({
        where: { shopId, docType: 'invoice', status: { not: 'void' } },
      }),
      this.prisma.product.count({ where: { shopId, active: true } }),
      this.prisma.customer.count({ where: { shopId } }),
      this.prisma.bill.findMany({
        where: { shopId },
        include: { customer: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      this.prisma.product.findMany({
        where: { shopId, active: true, stock: { lte: lowAt } },
        orderBy: { stock: 'asc' },
        take: 8,
        select: { id: true, name: true, stock: true, unit: true },
      }),
      this.prisma.shopMember.count({ where: { shopId } }),
      Promise.resolve(Boolean(shop?.gstin)),
    ]);

    const onboarding = [
      {
        id: 'products',
        done: productCount > 0,
        href: '/app/products',
      },
      {
        id: 'customers',
        done: customerCount > 0,
        href: '/app/customers',
      },
      {
        id: 'bill',
        done: billCount > 0,
        href: '/app/bills/new',
      },
      {
        id: 'gstin',
        done: hasGstin,
        href: '/app/settings',
      },
      {
        id: 'team',
        done: teamCount > 1,
        href: '/app/team',
      },
    ];

    return {
      todaySales: todayAgg._sum.grandTotal || 0,
      todayBills: todayAgg._count || 0,
      totalBills: billCount,
      products: productCount,
      customers: customerCount,
      lowStockCount: lowStock.length,
      lowStock,
      plan: shop?.plan || 'free',
      shopName: shop?.name || 'Shop',
      teamCount,
      onboarding,
      onboardingDone: onboarding.filter((s) => s.done).length,
      onboardingTotal: onboarding.length,
      recent,
    };
  }
}
