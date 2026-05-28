import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DocumentProcessor } from './processors/document.processor';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentProcessor],
  exports: [DocumentsService, DocumentProcessor],
})
export class DocumentsModule {}
