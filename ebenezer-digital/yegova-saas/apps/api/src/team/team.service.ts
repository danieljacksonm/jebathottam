import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AddStaffDto, UpdateStaffRoleDto } from './dto';

const MANAGE_ROLES = new Set(['owner', 'manager']);

@Injectable()
export class TeamService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async requireManager(shopId: string, userId: string) {
    const member = await this.prisma.shopMember.findUnique({
      where: { userId_shopId: { userId, shopId } },
    });
    if (!member || !MANAGE_ROLES.has(member.role)) {
      throw new ForbiddenException('Only owner or manager can manage team');
    }
    return member;
  }

  async list(shopId: string) {
    const members = await this.prisma.shopMember.findMany({
      where: { shopId },
      include: {
        user: { select: { id: true, name: true, email: true, createdAt: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return members.map((m) => ({
      id: m.id,
      role: m.role,
      createdAt: m.createdAt,
      user: m.user,
    }));
  }

  async add(
    shopId: string,
    actorUserId: string,
    actorName: string,
    dto: AddStaffDto,
  ) {
    await this.requireManager(shopId, actorUserId);
    const role = (dto.role || 'cashier').toLowerCase();
    if (!['cashier', 'manager'].includes(role)) {
      throw new BadRequestException('Role must be cashier or manager');
    }

    const email = dto.email.toLowerCase().trim();
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      const already = await this.prisma.shopMember.findUnique({
        where: { userId_shopId: { userId: user.id, shopId } },
      });
      if (already) throw new BadRequestException('This person is already in the shop');
    } else {
      if (!dto.password || dto.password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters');
      }
      user = await this.prisma.user.create({
        data: {
          name: dto.name.trim(),
          email,
          passwordHash: await bcrypt.hash(dto.password, 10),
        },
      });
    }

    const member = await this.prisma.shopMember.create({
      data: {
        shopId,
        userId: user.id,
        role,
      },
      include: {
        user: { select: { id: true, name: true, email: true, createdAt: true } },
      },
    });

    await this.audit.log({
      shopId,
      userId: actorUserId,
      userName: actorName,
      action: 'staff.add',
      entity: 'user',
      entityId: user.id,
      detail: `${user.name} · ${role}`,
    });

    return {
      id: member.id,
      role: member.role,
      createdAt: member.createdAt,
      user: member.user,
    };
  }

  async updateRole(
    shopId: string,
    actorUserId: string,
    actorName: string,
    memberId: string,
    dto: UpdateStaffRoleDto,
  ) {
    const actor = await this.requireManager(shopId, actorUserId);
    const member = await this.prisma.shopMember.findFirst({
      where: { id: memberId, shopId },
      include: { user: true },
    });
    if (!member) throw new NotFoundException('Staff not found');
    if (member.role === 'owner') {
      throw new BadRequestException('Cannot change owner role');
    }
    if (actor.role !== 'owner' && dto.role === 'manager') {
      throw new ForbiddenException('Only owner can make managers');
    }
    if (!['cashier', 'manager'].includes(dto.role)) {
      throw new BadRequestException('Role must be cashier or manager');
    }

    const updated = await this.prisma.shopMember.update({
      where: { id: member.id },
      data: { role: dto.role },
      include: {
        user: { select: { id: true, name: true, email: true, createdAt: true } },
      },
    });

    await this.audit.log({
      shopId,
      userId: actorUserId,
      userName: actorName,
      action: 'staff.role',
      entity: 'user',
      entityId: member.userId,
      detail: `${updated.user.name} → ${dto.role}`,
    });

    return {
      id: updated.id,
      role: updated.role,
      createdAt: updated.createdAt,
      user: updated.user,
    };
  }

  async remove(
    shopId: string,
    actorUserId: string,
    actorName: string,
    memberId: string,
  ) {
    await this.requireManager(shopId, actorUserId);
    const member = await this.prisma.shopMember.findFirst({
      where: { id: memberId, shopId },
      include: { user: true },
    });
    if (!member) throw new NotFoundException('Staff not found');
    if (member.role === 'owner') {
      throw new BadRequestException('Cannot remove shop owner');
    }
    if (member.userId === actorUserId) {
      throw new BadRequestException('Cannot remove yourself');
    }

    await this.prisma.shopMember.delete({ where: { id: member.id } });
    await this.audit.log({
      shopId,
      userId: actorUserId,
      userName: actorName,
      action: 'staff.remove',
      entity: 'user',
      entityId: member.userId,
      detail: member.user.name,
    });
    return { ok: true };
  }
}
