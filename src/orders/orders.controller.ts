import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { OrdersService, CreateOrderDto } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(user.userId, createOrderDto);
  }

  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const skip = (Number(page) - 1) * Number(limit);
    return this.ordersService.findAllByUser(user.userId, skip, Number(limit));
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.ordersService.findOne(user.userId, id);
  }

  @Patch(':id/cancel')
  cancel(@CurrentUser() user: any, @Param('id') id: string) {
    return this.ordersService.cancel(user.userId, id);
  }
}
