import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateExpenseDto } from './dto';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private expenses: ExpensesService) {}

  @Get()
  list(
    @Req() req: { user: { shopId: string } },
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.expenses.list(req.user.shopId, from, to);
  }

  @Post()
  create(
    @Req() req: { user: { shopId: string } },
    @Body() dto: CreateExpenseDto,
  ) {
    return this.expenses.create(req.user.shopId, dto);
  }

  @Delete(':id')
  remove(@Req() req: { user: { shopId: string } }, @Param('id') id: string) {
    return this.expenses.remove(req.user.shopId, id);
  }
}
