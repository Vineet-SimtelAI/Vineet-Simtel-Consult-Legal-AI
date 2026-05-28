import { IsString, IsOptional, IsNumber, IsDateString, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookConsultationDto {
  @ApiProperty()
  @IsString()
  lawyerId: string;

  @ApiProperty({ example: '2024-04-15T10:00:00Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ default: 'video' })
  @IsOptional()
  @IsString()
  type?: string; // video, audio, chat

  @ApiProperty()
  @IsString()
  @MaxLength(500)
  topic: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ required: false, default: 30 })
  @IsOptional()
  @IsNumber()
  duration?: number; // minutes
}

export class ReviewConsultationDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  review?: string;
}
