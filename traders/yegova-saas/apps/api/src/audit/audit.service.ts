import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(input: {
    shopId: string;
    userId?: string;
    userName?: string;
    action: string;
    entity?: string;
    entityId?: string;
    detail?: string;
  }) {
    try {
      await this.prisma.auditLog.create({
        data: {
          shopId: input.shopId,
          userId: input.userId || null,
          userName: input.userName || null,
          action: input.action,
          entity: input.entity || null,
          entityId: input.entityId || null,
          detail: input.detail || null,
        },
      });
    } catch {
      // never block business flow for audit failures
    }
  }

  list(shopId: string, take = 80) {
    return this.prisma.auditLog.findMany({
      where: { shopId },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }
}
