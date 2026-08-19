import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class StockInDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(0.001)
  qty: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  purchasePrice?: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class StockAdjustDto {
  @IsString()
  productId: string;

  @IsNumber()
  stock: number;

  @IsOptional()
  @IsString()
  note?: string;
}
