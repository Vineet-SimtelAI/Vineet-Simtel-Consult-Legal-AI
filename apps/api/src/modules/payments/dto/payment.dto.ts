import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PurchaseCreditsDto {
  @ApiProperty({ example: 'standard' })
  @IsString()
  package: string; // starter, standard, professional, enterprise
}

export class CreatePaymentOrderDto {
  @ApiProperty({ example: 79900, description: 'Amount in paisa' })
  @IsNumber()
  @Min(100)
  amount: number;

  @ApiProperty({ example: 'credits' })
  @IsString()
  purpose: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  purposeId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  creditsToAdd?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  packageName?: string;
}
