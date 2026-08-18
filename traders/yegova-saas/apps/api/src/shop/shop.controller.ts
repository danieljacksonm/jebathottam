import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateShopDto } from './dto';
import { ShopService } from './shop.service';

type AuthUser = {
  shopId: string;
  userId: string;
  email: string;
  name?: string;
  role?: string;
};

@Controller('shop')
@UseGuards(JwtAuthGuard)
export class ShopController {
  constructor(private shop: ShopService) {}

  @Get()
  get(@Req() req: { user: AuthUser }) {
    return this.shop.get(req.user.shopId);
  }

  @Patch()
  update(@Req() req: { user: AuthUser }, @Body() dto: UpdateShopDto) {
    return this.shop.update(req.user.shopId, dto, {
      userId: req.user.userId,
      userName: req.user.name || req.user.email,
    });
  }

  @Get('backup')
  backup(@Req() req: { user: AuthUser }) {
    return this.shop.backup(req.user.shopId, req.user.role);
  }
}
