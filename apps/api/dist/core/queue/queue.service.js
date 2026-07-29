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
var QueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const prisma_service_1 = require("../database/prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
const redis_service_1 = require("../redis/redis.service");
const all_schemas_1 = require("../database/mongoose/schemas/all-schemas");
const document_processor_1 = require("../../modules/documents/processors/document.processor");
let QueueService = QueueService_1 = class QueueService {
    constructor(configService, analyticsModel, prisma, storageService, redisService) {
        this.configService = configService;
        this.analyticsModel = analyticsModel;
        this.prisma = prisma;
        this.storageService = storageService;
        this.redisService = redisService;
        this.logger = new common_1.Logger(QueueService_1.name);
    }
    async enqueue(queueName, data, options) {
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.logger.log(`Enqueued job [${jobId}] to queue [${queueName}]`);
        if (queueName === 'document:generate') {
            const processor = new document_processor_1.DocumentProcessor(this.prisma, this.storageService, this.configService, this.redisService);
            setTimeout(() => {
                processor.process(data)
                    .then(() => {
                    this.logger.log(`✅ Document job [${jobId}] completed`);
                })
                    .catch((err) => {
                    this.logger.error(`❌ Document job [${jobId}] failed: ${err.message}`);
                });
            }, options?.delay || 500);
        }
        return jobId;
    }
    async trackEvent(event, userId, properties, req) {
        await this.analyticsModel.create({
            userId,
            event,
            properties,
            userAgent: req?.headers?.['user-agent'],
            ip: req?.ip || req?.headers?.['x-forwarded-for'],
        });
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = QueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(all_schemas_1.AnalyticsEvent.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model,
        prisma_service_1.PrismaService,
        storage_service_1.StorageService,
        redis_service_1.RedisService])
], QueueService);
//# sourceMappingURL=queue.service.js.map