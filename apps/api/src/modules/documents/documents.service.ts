import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { StorageService } from '../../core/storage/storage.service';
import { QueueService } from '../../core/queue/queue.service';
import { GenerateDocumentDto } from './dto/document.dto';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  // Credit costs for document types
  private readonly CREDIT_COSTS: Record<string, number> = {
    basic: 10,
    ai_enhanced: 25,
  };

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private storageService: StorageService,
    private queueService: QueueService,
  ) {}

  // ─── List Document Templates ───
  async listTemplates() {
    const cacheKey = 'document:templates:all';
    const cached = await this.redisService.getJson(cacheKey);
    if (cached) return cached;

    const templates = await this.prisma.documentTemplate.findMany({
      where: { isActive: true },
      orderBy: { category: 'asc' },
    });

    await this.redisService.setJson(cacheKey, templates, 300); // 5 min cache
    return templates;
  }

  // ─── Get Single Template ───
  async getTemplate(type: string) {
    const template = await this.prisma.documentTemplate.findUnique({
      where: { type, isActive: true },
    });

    if (!template) {
      throw new NotFoundException(`Template not found: ${type}`);
    }

    return template;
  }

  // ─── List User Documents ───
  async listDocuments(userId: string, filters: { status?: string; type?: string; page?: number; limit?: number }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { userId, deletedAt: null };
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;

    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          type: true,
          title: true,
          status: true,
          creditsUsed: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.document.count({ where }),
    ]);

    return {
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ─── Get Document By ID ───
  async getDocument(userId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId, deletedAt: null },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  // ─── Generate Document (Main Pipeline) ───
  async generateDocument(userId: string, dto: GenerateDocumentDto) {
    // 1. Check if template exists
    const template = await this.prisma.documentTemplate.findUnique({
      where: { type: dto.type, isActive: true },
    });

    if (!template) {
      throw new NotFoundException(`Template not found: ${dto.type}`);
    }

    // 2. Determine credit cost
    const creditsCost = dto.aiEnhanced ? this.CREDIT_COSTS.ai_enhanced : this.CREDIT_COSTS.basic;

    // 3. Check and deduct credits atomically
    const balance = await this.checkAndDeductCredits(userId, creditsCost);

    // 4. Create document record
    const document = await this.prisma.document.create({
      data: {
        userId,
        type: dto.type,
        title: dto.title,
        formData: dto.formData,
        clauses: dto.clauses || undefined,
        status: 'GENERATING',
        creditsUsed: creditsCost,
      },
    });

    // 5. Create credit transaction
    await this.prisma.creditTransaction.create({
      data: {
        userId,
        amount: -creditsCost,
        balance,
        type: 'DOCUMENT_GENERATION',
        referenceId: document.id,
        description: `Generated ${dto.title}`,
      },
    });

    // 6. Enqueue background job
    const jobId = await this.queueService.enqueue('document:generate', {
      documentId: document.id,
      userId,
      type: dto.type,
      title: dto.title,
      formData: dto.formData,
      clauses: dto.clauses,
      aiEnhanced: dto.aiEnhanced,
    });

    // 7. Track analytics
    await this.queueService.trackEvent('document_generation_started', userId, {
      type: dto.type,
      creditsCost,
      aiEnhanced: dto.aiEnhanced,
    });

    this.logger.log(`Document generation started: ${document.id} (job: ${jobId})`);

    return {
      documentId: document.id,
      status: 'GENERATING',
      creditsUsed: creditsCost,
      creditBalance: balance,
      message: 'Document generation started. You will be notified when it is ready.',
    };
  }

  // ─── Get Download URL ───
  async getDownloadUrl(userId: string, documentId: string, format: 'pdf' | 'docx' = 'pdf') {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId, deletedAt: null },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.status !== 'COMPLETED') {
      throw new BadRequestException('Document is not ready for download');
    }

    const objectKey = format === 'pdf' ? document.pdfKey : document.docxKey;
    if (!objectKey) {
      throw new BadRequestException(`${format.toUpperCase()} format not available`);
    }

    const presignedUrl = await this.storageService.getPresignedUrl(objectKey, 3600); // 1 hour

    return { url: presignedUrl, format, expiresAt: new Date(Date.now() + 3600000).toISOString() };
  }

  // ─── Delete Document (Soft Delete) ───
  async deleteDocument(userId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId, deletedAt: null },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    await this.prisma.document.update({
      where: { id: documentId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Document deleted successfully' };
  }

  // ─── Helper: Check and Deduct Credits ───
  private async checkAndDeductCredits(userId: string, amount: number): Promise<number> {
    // Acquire distributed lock
    const lockKey = `credits:lock:${userId}`;
    const locked = await this.redisService.acquireLock(lockKey, 10);
    if (!locked) {
      throw new BadRequestException('Another operation is in progress. Please try again.');
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { creditBalance: true },
      });

      if (!user || user.creditBalance < amount) {
        throw new BadRequestException(`Insufficient credits. You have ${user?.creditBalance || 0} credits, but need ${amount}.`);
      }

      const newBalance = user.creditBalance - amount;
      await this.prisma.user.update({
        where: { id: userId },
        data: { creditBalance: newBalance },
      });

      // Update cache
      await this.redisService.set(`credits:balance:${userId}`, newBalance.toString(), 300);

      return newBalance;
    } finally {
      await this.redisService.releaseLock(lockKey);
    }
  }
}
