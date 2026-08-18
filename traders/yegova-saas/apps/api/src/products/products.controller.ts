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
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Get()
  list(@Req() req: { user: { shopId: string } }) {
    return this.products.list(req.user.shopId);
  }

  @Post()
  create(
    @Req() req: { user: { shopId: string } },
    @Body() dto: CreateProductDto,
  ) {
    return this.products.create(req.user.shopId, dto);
  }

  @Patch(':id')
  update(
    @Req() req: { user: { shopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.products.update(req.user.shopId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: { user: { shopId: string } }, @Param('id') id: string) {
    return this.products.remove(req.user.shopId, id);
  }
}
