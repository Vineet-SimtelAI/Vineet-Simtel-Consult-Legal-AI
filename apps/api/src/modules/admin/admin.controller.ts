import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminUpdateUserDto, AdminLawyerActionDto } from './dto/admin.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  async listUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.listUsers(page, limit, search, role);
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Update user (ban, role change)' })
  async updateUser(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.adminService.updateUser(id, dto);
  }

  @Get('lawyers/pending')
  @ApiOperation({ summary: 'List pending lawyer applications' })
  async listPendingLawyers() {
    return this.adminService.listPendingLawyers();
  }

  @Put('lawyers/:id/action')
  @ApiOperation({ summary: 'Approve or reject a lawyer' })
  async lawyerAction(@Param('id') id: string, @Body() dto: AdminLawyerActionDto) {
    return this.adminService.lawyerAction(id, dto.action, dto.reason);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  async getRevenue(@Query('days') days?: number) {
    return this.adminService.getRevenueAnalytics(days);
  }
}
