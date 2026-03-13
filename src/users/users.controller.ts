import { Controller, Get, Patch, Body, UseGuards, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/users.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    const fullUser = await this.usersService.findById(user.userId);
    const { passwordHash, ...result } = fullUser;
    return result;
  }

  @Patch('me')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateData: UpdateUserDto,
  ) {
    // Prevent sensitive field updates directly
    // since we only accept fields defined in UpdateUserDto which doesn't have password/role, it's safe now.

    const updatedUser = await this.usersService.update(user.userId, updateData);
    const { passwordHash, ...result } = updatedUser;
    return result;
  }

  @Delete('me')
  async deleteAccount(@CurrentUser() user: any) {
    await this.usersService.delete(user.userId);
    return { message: 'Account deleted successfully' };
  }
}
