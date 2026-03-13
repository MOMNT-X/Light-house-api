import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  bannerUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isOpen?: boolean;

  @IsNumber()
  @IsOptional()
  deliveryFee?: number;

  @IsNumber()
  @IsOptional()
  minOrder?: number;

  @IsNumber()
  @IsOptional()
  deliveryRadius?: number;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}

export class UpdateVendorDto extends PartialType(CreateVendorDto) {}
