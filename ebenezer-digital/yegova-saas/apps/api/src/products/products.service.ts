import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  list(shopId: string) {
    return this.prisma.product.findMany({
      where: { shopId, active: true },
      orderBy: { name: 'asc' },
    });
  }

  create(shopId: string, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        shopId,
        name: dto.name.trim(),
        sku: dto.sku?.trim() || null,
        barcode: dto.barcode?.trim() || null,
        hsn: dto.hsn?.trim() || null,
        category: dto.category?.trim() || null,
        unit: dto.unit?.trim() || 'NOS',
        price: dto.price,
        mrp: dto.mrp ?? dto.price,
        purchasePrice: dto.purchasePrice,
        stock: dto.stock ?? 0,
        gstRate: dto.gstRate ?? 0,
      },
    });
  }

  async update(shopId: string, id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findFirst({ where: { id, shopId } });
    if (!product) throw new NotFoundException('Product not found');
    return this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        name: dto.name?.trim(),
        sku: dto.sku?.trim(),
        barcode: dto.barcode?.trim(),
        hsn: dto.hsn?.trim(),
        category: dto.category?.trim(),
        unit: dto.unit?.trim(),
      },
    });
  }

  async remove(shopId: string, id: string) {
    const product = await this.prisma.product.findFirst({ where: { id, shopId } });
    if (!product) throw new NotFoundException('Product not found');
    return this.prisma.product.update({
      where: { id },
      data: { active: false },
    });
  }
}
