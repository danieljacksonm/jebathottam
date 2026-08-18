import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  list(shopId: string, from?: string, to?: string) {
    const start = from ? new Date(from) : undefined;
    const end = to ? new Date(to) : undefined;
    if (end) end.setHours(23, 59, 59, 999);

    return this.prisma.expense.findMany({
      where: {
        shopId,
        ...(start || end
          ? {
              expenseDate: {
                ...(start ? { gte: start } : {}),
                ...(end ? { lte: end } : {}),
              },
            }
          : {}),
      },
      orderBy: { expenseDate: 'desc' },
      take: 300,
    });
  }

  create(shopId: string, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        shopId,
        title: dto.title.trim(),
        category: dto.category?.trim() || 'General',
        amount: dto.amount,
        paymentMode: dto.paymentMode || 'cash',
        expenseDate: dto.expenseDate ? new Date(dto.expenseDate) : new Date(),
        notes: dto.notes?.trim() || null,
      },
    });
  }

  async remove(shopId: string, id: string) {
    const row = await this.prisma.expense.findFirst({ where: { id, shopId } });
    if (!row) throw new NotFoundException('Expense not found');
    return this.prisma.expense.delete({ where: { id } });
  }
}
