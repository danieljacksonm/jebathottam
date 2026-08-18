import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private customers: CustomersService) {}

  @Get()
  list(@Req() req: { user: { shopId: string } }) {
    return this.customers.list(req.user.shopId);
  }

  @Post()
  create(
    @Req() req: { user: { shopId: string } },
    @Body() dto: CreateCustomerDto,
  ) {
    return this.customers.create(req.user.shopId, dto);
  }

  @Patch(':id')
  update(
    @Req() req: { user: { shopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customers.update(req.user.shopId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: { user: { shopId: string } }, @Param('id') id: string) {
    return this.customers.remove(req.user.shopId, id);
  }
}
