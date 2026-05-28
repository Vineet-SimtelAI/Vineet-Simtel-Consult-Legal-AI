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
var ConsultationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
const redis_service_1 = require("../../core/redis/redis.service");
const queue_service_1 = require("../../core/queue/queue.service");
let ConsultationsService = ConsultationsService_1 = class ConsultationsService {
    constructor(prisma, redisService, queueService) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.queueService = queueService;
        this.logger = new common_1.Logger(ConsultationsService_1.name);
    }
    async bookConsultation(userId, dto) {
        const lawyer = await this.prisma.lawyerProfile.findUnique({
            where: { id: dto.lawyerId },
            include: { user: { select: { name: true } } },
        });
        if (!lawyer || !lawyer.isAvailable || lawyer.kycStatus !== 'verified') {
            throw new common_1.BadRequestException('Lawyer is not available for consultations');
        }
        const duration = dto.duration || 30;
        const creditsCost = Math.ceil((lawyer.hourlyRate || 5000) / 100 * (duration / 60));
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { creditBalance: true },
        });
        if (!user || user.creditBalance < creditsCost) {
            throw new common_1.BadRequestException(`Insufficient credits. You have ${user?.creditBalance || 0}, but need ${creditsCost}.`);
        }
        const scheduledTime = new Date(dto.scheduledAt);
        const existingConsultation = await this.prisma.consultation.findFirst({
            where: {
                lawyerId: dto.lawyerId,
                status: { in: ['CONFIRMED', 'REQUESTED'] },
                scheduledAt: {
                    gte: new Date(scheduledTime.getTime() - duration * 60 * 1000),
                    lte: new Date(scheduledTime.getTime() + duration * 60 * 1000),
                },
            },
        });
        if (existingConsultation) {
            throw new common_1.BadRequestException('This time slot is already booked. Please choose another time.');
        }
        const lockKey = `credits:lock:${userId}`;
        const locked = await this.redisService.acquireLock(lockKey, 10);
        if (!locked) {
            throw new common_1.BadRequestException('Another operation is in progress. Please try again.');
        }
        try {
            const newBalance = user.creditBalance - creditsCost;
            await this.prisma.user.update({
                where: { id: userId },
                data: { creditBalance: newBalance },
            });
            await this.prisma.creditTransaction.create({
                data: {
                    userId,
                    amount: -creditsCost,
                    balance: newBalance,
                    type: 'CONSULTATION',
                    referenceId: dto.lawyerId,
                    description: `Consultation with ${lawyer.user.name}`,
                },
            });
            await this.redisService.set(`credits:balance:${userId}`, newBalance.toString(), 300);
        }
        finally {
            await this.redisService.releaseLock(lockKey);
        }
        const consultation = await this.prisma.consultation.create({
            data: {
                userId,
                lawyerId: dto.lawyerId,
                type: dto.type || 'video',
                status: 'REQUESTED',
                scheduledAt: scheduledTime,
                duration,
                topic: dto.topic,
                description: dto.description,
                creditsCharged: creditsCost,
                meetingLink: `https://meet.google.com/new`,
            },
            include: {
                lawyer: {
                    include: { user: { select: { name: true, avatarUrl: true } } },
                },
            },
        });
        await this.queueService.trackEvent('consultation_booked', userId, {
            lawyerId: dto.lawyerId,
            creditsCost,
            duration,
        });
        this.logger.log(`Consultation booked: ${consultation.id} (user: ${userId}, lawyer: ${dto.lawyerId})`);
        return {
            consultation,
            creditsCharged: creditsCost,
            creditBalance: user.creditBalance - creditsCost,
            message: 'Consultation booked successfully. The lawyer will confirm shortly.',
        };
    }
    async listConsultations(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [consultations, total] = await Promise.all([
            this.prisma.consultation.findMany({
                where: { userId },
                orderBy: { scheduledAt: 'desc' },
                skip,
                take: limit,
                include: {
                    lawyer: {
                        include: { user: { select: { name: true, avatarUrl: true } } },
                    },
                },
            }),
            this.prisma.consultation.count({ where: { userId } }),
        ]);
        return {
            consultations,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getConsultation(userId, consultationId) {
        const consultation = await this.prisma.consultation.findFirst({
            where: { id: consultationId, userId },
            include: {
                lawyer: {
                    include: { user: { select: { name: true, avatarUrl: true, email: true } } },
                },
            },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        return consultation;
    }
    async cancelConsultation(userId, consultationId) {
        const consultation = await this.prisma.consultation.findFirst({
            where: { id: consultationId, userId, status: { in: ['REQUESTED', 'CONFIRMED'] } },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found or cannot be cancelled');
        }
        await this.prisma.consultation.update({
            where: { id: consultationId },
            data: { status: 'CANCELLED' },
        });
        if (consultation.creditsCharged) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (user) {
                const newBalance = user.creditBalance + consultation.creditsCharged;
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { creditBalance: newBalance },
                });
                await this.prisma.creditTransaction.create({
                    data: {
                        userId,
                        amount: consultation.creditsCharged,
                        balance: newBalance,
                        type: 'REFUND',
                        referenceId: consultationId,
                        description: 'Refund for cancelled consultation',
                    },
                });
                await this.redisService.set(`credits:balance:${userId}`, newBalance.toString(), 300);
            }
        }
        return { message: 'Consultation cancelled. Credits have been refunded.' };
    }
    async submitReview(userId, consultationId, dto) {
        const consultation = await this.prisma.consultation.findFirst({
            where: { id: consultationId, userId, status: 'COMPLETED' },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Completed consultation not found');
        }
        if (consultation.userRating) {
            throw new common_1.BadRequestException('You have already reviewed this consultation');
        }
        await this.prisma.consultation.update({
            where: { id: consultationId },
            data: { userRating: dto.rating, userReview: dto.review },
        });
        const lawyerConsultations = await this.prisma.consultation.findMany({
            where: { lawyerId: consultation.lawyerId, userRating: { not: null } },
            select: { userRating: true },
        });
        const avgRating = lawyerConsultations.reduce((sum, c) => sum + (c.userRating || 0), 0) / lawyerConsultations.length;
        await this.prisma.lawyerProfile.update({
            where: { id: consultation.lawyerId },
            data: {
                rating: Math.round(avgRating * 10) / 10,
                totalReviews: lawyerConsultations.length,
            },
        });
        return { message: 'Review submitted successfully' };
    }
};
exports.ConsultationsService = ConsultationsService;
exports.ConsultationsService = ConsultationsService = ConsultationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        queue_service_1.QueueService])
], ConsultationsService);
//# sourceMappingURL=consultations.service.js.map