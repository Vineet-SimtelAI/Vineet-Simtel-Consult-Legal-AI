import { Controller, Get, Post, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LawyersService } from './lawyers.service';
import { SearchLawyersDto, ApplyAsLawyerDto } from './dto/lawyer.dto';

@ApiTags('Lawyers')
@Controller('lawyers')
export class LawyersController {
  constructor(private lawyersService: LawyersService) {}

  @Get()
  @ApiOperation({ summary: 'Search and filter lawyers' })
  async searchLawyers(@Query() filters: SearchLawyersDto) {
    return this.lawyersService.searchLawyers(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lawyer profile details' })
  async getLawyerProfile(@Param('id') id: string) {
    return this.lawyersService.getLawyerProfile(id);
  }

  @Get(':id/slots')
  @ApiOperation({ summary: 'Get available time slots for a lawyer' })
  async getAvailableSlots(
    @Param('id') id: string,
    @Query('date') date?: string,
  ) {
    return this.lawyersService.getAvailableSlots(id, date);
  }

  @Post('apply')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply to become a lawyer' })
  async applyAsLawyer(@Request() req: any, @Body() dto: ApplyAsLawyerDto) {
    return this.lawyersService.applyAsLawyer(req.user.id, dto);
  }
}
