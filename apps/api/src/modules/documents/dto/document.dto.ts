import { IsString, IsOptional, IsObject, IsArray, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateDocumentDto {
  @ApiProperty({ example: 'nda', description: 'Document template type' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'Non-Disclosure Agreement - Acme Corp' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Form data for the template' })
  @IsObject()
  formData: Record<string, any>;

  @ApiProperty({ required: false, description: 'Selected clauses' })
  @IsOptional()
  @IsArray()
  clauses?: Array<{ name: string; text: string; selected: boolean }>;

  @ApiProperty({ required: false, description: 'Whether to use AI enhancement' })
  @IsOptional()
  aiEnhanced?: boolean;
}

export class ListDocumentsDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
