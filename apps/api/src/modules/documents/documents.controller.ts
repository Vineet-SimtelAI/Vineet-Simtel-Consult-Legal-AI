import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request, Res, StreamableFile, NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import { DocumentsService } from './documents.service';
import { RedisService } from '../../core/redis/redis.service';
import { GenerateDocumentDto, ListDocumentsDto } from './dto/document.dto';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('documents')
export class DocumentsController {
  constructor(
    private documentsService: DocumentsService,
    private redisService: RedisService,
  ) {}

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

  @Get(':id/progress')
  @ApiOperation({ summary: 'Get real-time generation progress for a document' })
  async getDocumentProgress(@Request() req: any, @Param('id') id: string) {
    const progress = await this.redisService.getJson(`doc:progress:${id}`);
    if (!progress) {
      // Fallback: return basic status from DB
      const doc = await this.documentsService.getDocument(req.user.id, id);
      return {
        documentId: id,
        status: doc.status,
        percentage: doc.status === 'COMPLETED' ? 100 : doc.status === 'FAILED' ? 0 : 50,
        message: doc.status === 'COMPLETED' ? 'Document ready.' : doc.status === 'FAILED' ? 'Generation failed.' : 'Processing...',
        steps: [],
      };
    }
    return progress;
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get presigned download URL' })
  async downloadDocument(
    @Request() req: any,
    @Param('id') id: string,
    @Query('format') format: 'pdf' | 'docx' = 'pdf',
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    const downloadInfo = await this.documentsService.getDownloadUrl(req.user.id, id, format);
    if (downloadInfo.url.includes('/api/v1/documents/') && token) {
      downloadInfo.url = `${downloadInfo.url}&token=${token}`;
    }
    return downloadInfo;
  }

  @Get(':id/file')
  @ApiOperation({ summary: 'Serve the local document file directly' })
  async getLocalFile(
    @Request() req: any,
    @Param('id') id: string,
    @Query('format') format: 'pdf' | 'docx' = 'pdf',
    @Res({ passthrough: true }) res: Response,
  ) {
    const doc = await this.documentsService.getDocument(req.user.id, id);
    const objectKey = format === 'pdf' ? doc.pdfKey : doc.docxKey;

    if (!objectKey || !objectKey.startsWith('local:')) {
      throw new BadRequestException('This document is not stored locally');
    }

    const filePath = objectKey.replace(/^local:/, '');
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Local document file not found');
    }

    const contentType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${encodeURIComponent(doc.title)}.${format}"`,
    });

    return new StreamableFile(fs.createReadStream(filePath));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  async deleteDocument(@Request() req: any, @Param('id') id: string) {
    return this.documentsService.deleteDocument(req.user.id, id);
  }
}
