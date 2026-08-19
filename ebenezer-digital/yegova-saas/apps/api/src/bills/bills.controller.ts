import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BillsService } from './bills.service';
import { CreateBillDto, UpdatePaymentDto } from './dto';

type AuthUser = {
  shopId: string;
  userId: string;
  email: string;
  name?: string;
};

@Controller('bills')
@UseGuards(JwtAuthGuard)
export class BillsController {
  constructor(private bills: BillsService) {}

  private actor(user: AuthUser) {
    return { userId: user.userId, userName: user.name || user.email };
  }

  @Get()
  list(
    @Req() req: { user: AuthUser },
    @Query('q') q?: string,
    @Query('status') status?: string,
    @Query('docType') docType?: string,
  ) {
    return this.bills.list(req.user.shopId, q, status, docType || 'invoice');
  }

  @Get(':id')
  get(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.bills.get(req.user.shopId, id);
  }

  @Post()
  create(@Req() req: { user: AuthUser }, @Body() dto: CreateBillDto) {
    return this.bills.create(req.user.shopId, dto, this.actor(req.user));
  }

  @Patch(':id/payment')
  payment(
    @Req() req: { user: AuthUser },
    @Param('id') id: string,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.bills.updatePayment(
      req.user.shopId,
      id,
      dto,
      this.actor(req.user),
    );
  }

  @Post(':id/void')
  voidBill(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.bills.voidBill(req.user.shopId, id, this.actor(req.user));
  }

  @Post(':id/convert')
  convert(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.bills.convertQuote(req.user.shopId, id);
  }

  @Post(':id/duplicate')
  duplicate(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.bills.duplicate(req.user.shopId, id);
  }
}
