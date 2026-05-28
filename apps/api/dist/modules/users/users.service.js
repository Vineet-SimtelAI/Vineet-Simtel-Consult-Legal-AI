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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
const redis_service_1 = require("../../core/redis/redis.service");
const storage_service_1 = require("../../core/storage/storage.service");
let UsersService = UsersService_1 = class UsersService {
    constructor(prisma, redisService, storageService) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.storageService = storageService;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async getProfile(userId) {
        const cacheKey = `user:profile:${userId}`;
        const cached = await this.redisService.getJson(cacheKey);
        if (cached)
            return cached;
        const user = await this.prisma.user.findUnique({
            where: { id: userId, deletedAt: null },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                avatarUrl: true,
                company: true,
                designation: true,
                creditBalance: true,
                emailVerified: true,
                phoneVerified: true,
                createdAt: true,
                lastLoginAt: true,
                lawyerProfile: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.redisService.setJson(cacheKey, user, 300);
        return user;
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                name: dto.name,
                email: dto.email,
                phone: dto.phone,
                company: dto.company,
                designation: dto.designation,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                avatarUrl: true,
                company: true,
                designation: true,
                creditBalance: true,
            },
        });
        await this.redisService.del(`user:profile:${userId}`);
        this.logger.log(`Profile updated for user ${userId}`);
        return user;
    }
    async getDashboardStats(userId) {
        const [documents, consultations, chatSessions, creditBalance] = await Promise.all([
            this.prisma.document.count({ where: { userId, deletedAt: null } }),
            this.prisma.consultation.count({ where: { userId } }),
            this.prisma.chatSession.count({ where: { userId, status: 'active' } }),
            this.prisma.user.findUnique({
                where: { id: userId },
                select: { creditBalance: true },
            }),
        ]);
        const recentDocuments = await this.prisma.document.findMany({
            where: { userId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                title: true,
                type: true,
                status: true,
                createdAt: true,
            },
        });
        const upcomingConsultations = await this.prisma.consultation.findMany({
            where: {
                userId,
                status: { in: ['CONFIRMED', 'REQUESTED'] },
                scheduledAt: { gte: new Date() },
            },
            orderBy: { scheduledAt: 'asc' },
            take: 5,
            include: {
                lawyer: {
                    include: {
                        user: { select: { name: true, avatarUrl: true } },
                    },
                },
            },
        });
        return {
            stats: {
                documents,
                consultations,
                chatSessions,
                creditBalance: creditBalance?.creditBalance || 0,
            },
            recentDocuments,
            upcomingConsultations,
        };
    }
    async deleteAccount(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { deletedAt: new Date() },
        });
        await this.redisService.del(`user:profile:${userId}`);
        await this.redisService.del(`session:${userId}`);
        await this.redisService.del(`credits:balance:${userId}`);
        this.logger.log(`Account soft-deleted: ${userId}`);
        return { message: 'Account deleted successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        storage_service_1.StorageService])
], UsersService);
//# sourceMappingURL=users.service.js.map