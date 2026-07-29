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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const fs = require("fs");
const documents_service_1 = require("./documents.service");
const redis_service_1 = require("../../core/redis/redis.service");
const document_dto_1 = require("./dto/document.dto");
let DocumentsController = class DocumentsController {
    constructor(documentsService, redisService) {
        this.documentsService = documentsService;
        this.redisService = redisService;
    }
    async listTemplates() {
        return this.documentsService.listTemplates();
    }
    async getTemplate(type) {
        return this.documentsService.getTemplate(type);
    }
    async listDocuments(req, filters) {
        return this.documentsService.listDocuments(req.user.id, filters);
    }
    async getDocument(req, id) {
        return this.documentsService.getDocument(req.user.id, id);
    }
    async generateDocument(req, dto) {
        return this.documentsService.generateDocument(req.user.id, dto);
    }
    async getDocumentProgress(req, id) {
        const progress = await this.redisService.getJson(`doc:progress:${id}`);
        if (!progress) {
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
    async downloadDocument(req, id, format = 'pdf') {
        const token = req.headers.authorization?.split(' ')[1];
        const downloadInfo = await this.documentsService.getDownloadUrl(req.user.id, id, format);
        if (downloadInfo.url.includes('/api/v1/documents/') && token) {
            downloadInfo.url = `${downloadInfo.url}&token=${token}`;
        }
        return downloadInfo;
    }
    async getLocalFile(req, id, format = 'pdf', res) {
        const doc = await this.documentsService.getDocument(req.user.id, id);
        const objectKey = format === 'pdf' ? doc.pdfKey : doc.docxKey;
        if (!objectKey || !objectKey.startsWith('local:')) {
            throw new common_1.BadRequestException('This document is not stored locally');
        }
        const filePath = objectKey.replace(/^local:/, '');
        if (!fs.existsSync(filePath)) {
            throw new common_1.NotFoundException('Local document file not found');
        }
        const contentType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        res.set({
            'Content-Type': contentType,
            'Content-Disposition': `inline; filename="${encodeURIComponent(doc.title)}.${format}"`,
        });
        return new common_1.StreamableFile(fs.createReadStream(filePath));
    }
    async deleteDocument(req, id) {
        return this.documentsService.deleteDocument(req.user.id, id);
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, common_1.Get)('templates'),
    (0, swagger_1.ApiOperation)({ summary: 'List available document templates' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "listTemplates", null);
__decorate([
    (0, common_1.Get)('templates/:type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get template details and form schema' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List user documents' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, document_dto_1.ListDocumentsDto]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "listDocuments", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get document details' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "getDocument", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a new legal document' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, document_dto_1.GenerateDocumentDto]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "generateDocument", null);
__decorate([
    (0, common_1.Get)(':id/progress'),
    (0, swagger_1.ApiOperation)({ summary: 'Get real-time generation progress for a document' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "getDocumentProgress", null);
__decorate([
    openapi.ApiQuery({ name: "format", required: false }),
    (0, common_1.Get)(':id/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Get presigned download URL' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('format')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "downloadDocument", null);
__decorate([
    openapi.ApiQuery({ name: "format", required: false }),
    (0, common_1.Get)(':id/file'),
    (0, swagger_1.ApiOperation)({ summary: 'Serve the local document file directly' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('format')),
    __param(3, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "getLocalFile", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a document' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "deleteDocument", null);
exports.DocumentsController = DocumentsController = __decorate([
    (0, swagger_1.ApiTags)('Documents'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('documents'),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService,
        redis_service_1.RedisService])
], DocumentsController);
//# sourceMappingURL=documents.controller.js.map