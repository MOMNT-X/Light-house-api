import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { Prisma } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateVendorDto, UpdateVendorDto } from './dto/vendors.dto';

@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Public()
  @Get()
  findAll(@Query('search') search?: string, @Query('category') category?: string) {
    const where: Prisma.VendorWhereInput = { isActive: true };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.category = category;
    }

    return this.vendorsService.findAll({ where });
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() createData: CreateVendorDto) {
    return this.vendorsService.create(createData as any);
  }

  @Patch(':id')
  @Roles('ADMIN', 'VENDOR')
  update(@Param('id') id: string, @Body() updateData: UpdateVendorDto) {
    return this.vendorsService.update(id, updateData as any);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(id);
  }
}
