import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Prisma } from '@prisma/client';
import { CreateAddressDto, UpdateAddressDto } from './dto/addresses.dto';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.addressesService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.addressesService.findOne(user.userId, id);
  }

  @Post()
  create(@CurrentUser() user: any, @Body() createData: CreateAddressDto) {
    return this.addressesService.create(user.userId, createData as any);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateData: UpdateAddressDto,
  ) {
    return this.addressesService.update(user.userId, id, updateData as any);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.addressesService.remove(user.userId, id);
  }
}
