import { Controller, Get, Post, Put, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';
import { BookConsultationDto, ReviewConsultationDto } from './dto/consultation.dto';

@ApiTags('Consultations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('consultations')
export class ConsultationsController {
  constructor(private consultationsService: ConsultationsService) {}

  @Post()
  @ApiOperation({ summary: 'Book a consultation with a lawyer' })
  async bookConsultation(@Request() req: any, @Body() dto: BookConsultationDto) {
    return this.consultationsService.bookConsultation(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List user consultations' })
  async listConsultations(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.consultationsService.listConsultations(req.user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get consultation details' })
  async getConsultation(@Request() req: any, @Param('id') id: string) {
    return this.consultationsService.getConsultation(req.user.id, id);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel a consultation' })
  async cancelConsultation(@Request() req: any, @Param('id') id: string) {
    return this.consultationsService.cancelConsultation(req.user.id, id);
  }

  @Put(':id/review')
  @ApiOperation({ summary: 'Submit a review after consultation' })
  async submitReview(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: ReviewConsultationDto,
  ) {
    return this.consultationsService.submitReview(req.user.id, id, dto);
  }
}
