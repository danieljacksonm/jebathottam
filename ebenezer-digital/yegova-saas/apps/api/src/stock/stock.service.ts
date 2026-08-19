import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockAdjustDto, StockInDto } from './dto';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  history(shopId: string) {
    return this.prisma.stockMovement.findMany({
      where: { shopId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async stockIn(shopId: string, dto: StockInDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, shopId, active: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id: product.id },
        data: {
          stock: { increment: dto.qty },
          ...(dto.purchasePrice !== undefined
            ? { purchasePrice: dto.purchasePrice }
            : {}),
        },
      });
      await tx.stockMovement.create({
        data: {
          shopId,
          productId: product.id,
          qty: dto.qty,
          type: 'in',
          note: dto.note?.trim() || 'Stock purchase / inward',
        },
      });
      return updated;
    });
  }

  async adjust(shopId: string, dto: StockAdjustDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, shopId, active: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    const delta = dto.stock - product.stock;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id: product.id },
        data: { stock: dto.stock },
      });
      await tx.stockMovement.create({
        data: {
          shopId,
          productId: product.id,
          qty: delta,
          type: 'adjust',
          note: dto.note?.trim() || 'Stock adjustment',
        },
      });
      return updated;
    });
  }
}
