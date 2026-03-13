import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AddToCartDto } from './dto/cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() user: any) {
    return this.cartService.getCart(user.userId);
  }

  @Post()
  addToCart(
    @CurrentUser() user: any,
    @Body() body: AddToCartDto,
  ) {
    return this.cartService.addToCart(user.userId, body.vendorId, body.menuItemId, body.quantity || 1);
  }

  @Patch(':menuItemId')
  updateQuantity(
    @CurrentUser() user: any,
    @Param('menuItemId') menuItemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateQuantity(user.userId, menuItemId, quantity);
  }

  @Delete(':menuItemId')
  removeFromCart(@CurrentUser() user: any, @Param('menuItemId') menuItemId: string) {
    return this.cartService.removeFromCart(user.userId, menuItemId);
  }

  @Delete()
  clearCart(@CurrentUser() user: any) {
    return this.cartService.clearCart(user.userId);
  }
}
