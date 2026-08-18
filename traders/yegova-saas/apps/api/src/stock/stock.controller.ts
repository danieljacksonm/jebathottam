import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StockAdjustDto, StockInDto } from './dto';
import { StockService } from './stock.service';

@Controller('stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private stock: StockService) {}

  @Get('history')
  history(@Req() req: { user: { shopId: string } }) {
    return this.stock.history(req.user.shopId);
  }

  @Post('in')
  stockIn(@Req() req: { user: { shopId: string } }, @Body() dto: StockInDto) {
    return this.stock.stockIn(req.user.shopId, dto);
  }

  @Post('adjust')
  adjust(
    @Req() req: { user: { shopId: string } },
    @Body() dto: StockAdjustDto,
  ) {
    return this.stock.adjust(req.user.shopId, dto);
  }
}
