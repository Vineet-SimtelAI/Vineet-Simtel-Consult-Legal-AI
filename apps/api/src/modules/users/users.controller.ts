import { Controller, Get, Put, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Get('me/dashboard')
  @ApiOperation({ summary: 'Get dashboard stats' })
  async getDashboard(@Request() req: any) {
    return this.usersService.getDashboardStats(req.user.id);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete user account (soft delete)' })
  async deleteAccount(@Request() req: any) {
    return this.usersService.deleteAccount(req.user.id);
  }
}
