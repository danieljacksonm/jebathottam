import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import { planPublic } from '../billing/plan';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (exists) throw new BadRequestException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.toLowerCase(),
        passwordHash,
        shops: {
          create: {
            role: 'owner',
            shop: {
              create: {
                name: dto.shopName.trim(),
                plan: 'free',
              },
            },
          },
        },
      },
      include: {
        shops: { include: { shop: true } },
      },
    });

    const membership = user.shops[0];
    const shop = membership.shop;
    return this.tokenResponse(user, shop, membership.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { shops: { include: { shop: true } } },
    });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid email or password');

    const membership = user.shops[0];
    const shop = membership?.shop;
    if (!shop) throw new BadRequestException('No shop found for this user');

    return this.tokenResponse(user, shop, membership.role);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { shops: { include: { shop: true } } },
    });
    if (!user) throw new UnauthorizedException();
    const membership = user.shops[0];
    const shop = membership?.shop;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: membership?.role || 'owner',
      shop: shop ? planPublic(shop) : null,
    };
  }

  private tokenResponse(
    user: { id: string; email: string; name: string },
    shop: {
      id: string;
      name: string;
      plan: string;
      trialEndsAt?: Date | null;
      planExpiresAt?: Date | null;
    },
    role: string,
  ) {
    const accessToken = this.jwt.sign({
      sub: user.id,
      email: user.email,
      name: user.name,
      shopId: shop.id,
      role,
    });
    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, role },
      shop: planPublic(shop),
    };
  }
}
