import { IsString, IsOptional, IsNumber, IsArray, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchLawyersDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minRating?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxHourlyRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  limit?: number;
}

export class ApplyAsLawyerDto {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  specializations: string[];

  @ApiProperty()
  @IsNumber()
  @Min(0)
  experience: number;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @ApiProperty()
  @IsNumber()
  @Min(0)
  hourlyRate: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  barCouncilNo?: string;
}
