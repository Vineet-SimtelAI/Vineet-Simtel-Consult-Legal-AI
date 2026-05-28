import { IsString, IsOptional, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminUpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  banReason?: string;
}

export class AdminLawyerActionDto {
  @ApiProperty()
  @IsString()
  action: 'approve' | 'reject';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
