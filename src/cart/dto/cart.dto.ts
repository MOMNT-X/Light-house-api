import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  vendorId!: string;

  @IsString()
  @IsNotEmpty()
  menuItemId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}
