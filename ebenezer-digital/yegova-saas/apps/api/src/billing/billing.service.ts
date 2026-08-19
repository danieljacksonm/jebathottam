import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { planPublic } from './plan';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async status(shopId: string) {
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Shop not found');
    if (shop.plan !== 'free') {
      const updated = await this.prisma.shop.update({
        where: { id: shopId },
        data: { plan: 'free', trialEndsAt: null, planExpiresAt: null },
      });
      return planPublic(updated);
    }
    return planPublic(shop);
  }
}
