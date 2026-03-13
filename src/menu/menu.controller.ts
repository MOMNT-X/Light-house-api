import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu.dto';

@Controller('menu')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Public()
  @Get('vendor/:vendorId')
  findAllByVendor(@Param('vendorId') vendorId: string) {
    return this.menuService.findAllByVendor(vendorId);
  }

  @Public()
  @Get('vendor/:vendorId/categories')
  getCategoriesWithItems(@Param('vendorId') vendorId: string) {
    return this.menuService.getCategoriesWithItems(vendorId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'VENDOR')
  create(@Body() createData: CreateMenuItemDto) {
    return this.menuService.create(createData as any);
  }

  @Patch(':id')
  @Roles('ADMIN', 'VENDOR')
  update(@Param('id') id: string, @Body() updateData: UpdateMenuItemDto) {
    return this.menuService.update(id, updateData as any);
  }

  @Delete(':id')
  @Roles('ADMIN', 'VENDOR')
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
