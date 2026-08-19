import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class AddStaffDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(3)
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  @IsIn(['cashier', 'manager'])
  role?: string;
}

export class UpdateStaffRoleDto {
  @IsString()
  @IsIn(['cashier', 'manager'])
  role: string;
}
