"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DocumentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
const redis_service_1 = require("../../core/redis/redis.service");
const storage_service_1 = require("../../core/storage/storage.service");
const queue_service_1 = require("../../core/queue/queue.service");
let DocumentsService = DocumentsService_1 = class DocumentsService {
    constructor(prisma, redisService, storageService, queueService) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.storageService = storageService;
        this.queueService = queueService;
        this.logger = new common_1.Logger(DocumentsService_1.name);
        this.CREDIT_COSTS = {
            basic: 10,
            ai_enhanced: 25,
        };
    }
    async listTemplates() {
        const cacheKey = 'document:templates:all';
        const cached = await this.redisService.getJson(cacheKey);
        if (cached)
            return cached;
        const templates = await this.prisma.documentTemplate.findMany({
            where: { isActive: true },
            orderBy: { category: 'asc' },
        });
        await this.redisService.setJson(cacheKey, templates, 300);
        return templates;
    }
    async getTemplate(type) {
        const template = await this.prisma.documentTemplate.findUnique({
            where: { type, isActive: true },
        });
        if (!template) {
            throw new common_1.NotFoundException(`Template not found: ${type}`);
        }
        return template;
    }
    async listDocuments(userId, filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const where = { userId, deletedAt: null };
        if (filters.status)
            where.status = filters.status;
        if (filters.type)
            where.type = filters.type;
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
    async getDocument(userId, documentId) {
        const document = await this.prisma.document.findFirst({
            where: { id: documentId, userId, deletedAt: null },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        return document;
    }
    async generateDocument(userId, dto) {
        const template = await this.prisma.documentTemplate.findUnique({
            where: { type: dto.type, isActive: true },
        });
        if (!template) {
            throw new common_1.NotFoundException(`Template not found: ${dto.type}`);
        }
        const creditsCost = dto.aiEnhanced ? this.CREDIT_COSTS.ai_enhanced : this.CREDIT_COSTS.basic;
        const balance = await this.checkAndDeductCredits(userId, creditsCost);
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
        const jobId = await this.queueService.enqueue('document:generate', {
            documentId: document.id,
            userId,
            type: dto.type,
            title: dto.title,
            formData: dto.formData,
            clauses: dto.clauses,
            aiEnhanced: dto.aiEnhanced,
        });
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
    async getDownloadUrl(userId, documentId, format = 'pdf') {
        const document = await this.prisma.document.findFirst({
            where: { id: documentId, userId, deletedAt: null },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        if (document.status !== 'COMPLETED') {
            throw new common_1.BadRequestException('Document is not ready for download');
        }
        const objectKey = format === 'pdf' ? document.pdfKey : document.docxKey;
        if (!objectKey) {
            throw new common_1.BadRequestException(`${format.toUpperCase()} format not available`);
        }
        if (objectKey.startsWith('local:')) {
            const baseUrl = process.env.API_URL || 'http://localhost:4000';
            const fileUrl = `${baseUrl}/api/v1/documents/${documentId}/file?format=${format}`;
            return { url: fileUrl, format, expiresAt: new Date(Date.now() + 3600000).toISOString() };
        }
        const presignedUrl = await this.storageService.getPresignedUrl(objectKey, 3600);
        return { url: presignedUrl, format, expiresAt: new Date(Date.now() + 3600000).toISOString() };
    }
    async deleteDocument(userId, documentId) {
        const document = await this.prisma.document.findFirst({
            where: { id: documentId, userId, deletedAt: null },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        await this.prisma.document.update({
            where: { id: documentId },
            data: { deletedAt: new Date() },
        });
        return { message: 'Document deleted successfully' };
    }
    async checkAndDeductCredits(userId, amount) {
        const lockKey = `credits:lock:${userId}`;
        const locked = await this.redisService.acquireLock(lockKey, 10);
        if (!locked) {
            throw new common_1.BadRequestException('Another operation is in progress. Please try again.');
        }
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { creditBalance: true },
            });
            if (!user || user.creditBalance < amount) {
                throw new common_1.BadRequestException(`Insufficient credits. You have ${user?.creditBalance || 0} credits, but need ${amount}.`);
            }
            const newBalance = user.creditBalance - amount;
            await this.prisma.user.update({
                where: { id: userId },
                data: { creditBalance: newBalance },
            });
            await this.redisService.set(`credits:balance:${userId}`, newBalance.toString(), 300);
            return newBalance;
        }
        finally {
            await this.redisService.releaseLock(lockKey);
        }
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = DocumentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        storage_service_1.StorageService,
        queue_service_1.QueueService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map