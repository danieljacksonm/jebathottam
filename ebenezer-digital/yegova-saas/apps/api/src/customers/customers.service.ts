import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  list(shopId: string) {
    return this.prisma.customer.findMany({
      where: { shopId },
      orderBy: { name: 'asc' },
    });
  }

  create(shopId: string, dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        shopId,
        name: dto.name.trim(),
        phone: dto.phone?.trim() || null,
        gstin: dto.gstin?.trim() || null,
        address: dto.address?.trim() || null,
      },
    });
  }

  async update(shopId: string, id: string, dto: UpdateCustomerDto) {
    const row = await this.prisma.customer.findFirst({ where: { id, shopId } });
    if (!row) throw new NotFoundException('Customer not found');
    return this.prisma.customer.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        phone: dto.phone?.trim(),
        gstin: dto.gstin?.trim(),
        address: dto.address?.trim(),
      },
    });
  }

  async remove(shopId: string, id: string) {
    const row = await this.prisma.customer.findFirst({ where: { id, shopId } });
    if (!row) throw new NotFoundException('Customer not found');
    await this.prisma.customer.delete({ where: { id } });
    return { ok: true };
  }
}
