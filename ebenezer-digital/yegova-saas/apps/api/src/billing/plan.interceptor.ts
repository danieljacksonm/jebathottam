import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { isPlanActive } from './plan';

@Injectable()
export class PlanInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const req = context.switchToHttp().getRequest<{
      method: string;
      originalUrl?: string;
      url: string;
      user?: { shopId?: string };
    }>();
    const method = (req.method || 'GET').toUpperCase();
    if (method === 'GET' || method === 'OPTIONS' || method === 'HEAD') {
      return next.handle();
    }
    const shopId = req.user?.shopId;
    if (!shopId) return next.handle();

    const path = req.originalUrl || req.url || '';
    if (path.includes('/billing') || path.includes('/auth/')) {
      return next.handle();
    }

    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (isPlanActive(shop)) return next.handle();

    throw new HttpException(
      {
        message:
          'Trial ended. Pay $1 per month for website + online app, or buy the $5 offline app on Android / iOS.',
        code: 'PLAN_EXPIRED',
      },
      HttpStatus.PAYMENT_REQUIRED,
    );
  }
}
