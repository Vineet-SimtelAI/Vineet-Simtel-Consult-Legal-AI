import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { GenerateDocumentDto, ListDocumentsDto } from './dto/document.dto';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get('templates')
  @ApiOperation({ summary: 'List available document templates' })
  async listTemplates() {
    return this.documentsService.listTemplates();
  }

  @Get('templates/:type')
  @ApiOperation({ summary: 'Get template details and form schema' })
  async getTemplate(@Param('type') type: string) {
    return this.documentsService.getTemplate(type);
  }

  @Get()
  @ApiOperation({ summary: 'List user documents' })
  async listDocuments(@Request() req: any, @Query() filters: ListDocumentsDto) {
    return this.documentsService.listDocuments(req.user.id, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document details' })
  async getDocument(@Request() req: any, @Param('id') id: string) {
    return this.documentsService.getDocument(req.user.id, id);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate a new legal document' })
  async generateDocument(@Request() req: any, @Body() dto: GenerateDocumentDto) {
    return this.documentsService.generateDocument(req.user.id, dto);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get presigned download URL' })
  async downloadDocument(
    @Request() req: any,
    @Param('id') id: string,
    @Query('format') format: 'pdf' | 'docx' = 'pdf',
  ) {
    return this.documentsService.getDownloadUrl(req.user.id, id, format);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  async deleteDocument(@Request() req: any, @Param('id') id: string) {
    return this.documentsService.deleteDocument(req.user.id, id);
  }
}
