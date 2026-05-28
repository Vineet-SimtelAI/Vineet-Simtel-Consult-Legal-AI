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
var LawyersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawyersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
const redis_service_1 = require("../../core/redis/redis.service");
let LawyersService = LawyersService_1 = class LawyersService {
    constructor(prisma, redisService) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.logger = new common_1.Logger(LawyersService_1.name);
    }
    async searchLawyers(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const cacheKey = `lawyer:search:${JSON.stringify(filters)}`;
        const cached = await this.redisService.getJson(cacheKey);
        if (cached)
            return cached;
        const where = {
            verified: true,
            isAvailable: true,
            kycStatus: 'verified',
        };
        if (filters.specialization) {
            where.specializations = { has: filters.specialization };
        }
        if (filters.city) {
            where.city = { contains: filters.city, mode: 'insensitive' };
        }
        if (filters.minRating) {
            where.rating = { gte: filters.minRating };
        }
        if (filters.maxHourlyRate) {
            where.hourlyRate = { lte: filters.maxHourlyRate * 100 };
        }
        if (filters.language) {
            where.languages = { has: filters.language };
        }
        const [lawyers, total] = await Promise.all([
            this.prisma.lawyerProfile.findMany({
                where,
                orderBy: { rating: 'desc' },
                skip,
                take: limit,
                include: {
                    user: {
                        select: { name: true, avatarUrl: true },
                    },
                },
            }),
            this.prisma.lawyerProfile.count({ where }),
        ]);
        const result = {
            lawyers: lawyers.map((l) => ({
                id: l.id,
                userId: l.userId,
                name: l.user.name,
                avatarUrl: l.user.avatarUrl,
                specializations: l.specializations,
                experience: l.experience,
                hourlyRate: l.hourlyRate ? l.hourlyRate / 100 : null,
                rating: l.rating,
                totalReviews: l.totalReviews,
                city: l.city,
                state: l.state,
                languages: l.languages,
                bio: l.bio,
                isAvailable: l.isAvailable,
            })),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
        await this.redisService.setJson(cacheKey, result, 60);
        return result;
    }
    async getLawyerProfile(lawyerId) {
        const lawyer = await this.prisma.lawyerProfile.findUnique({
            where: { id: lawyerId },
            include: {
                user: {
                    select: { name: true, avatarUrl: true, email: true },
                },
            },
        });
        if (!lawyer) {
            throw new common_1.NotFoundException('Lawyer not found');
        }
        return {
            id: lawyer.id,
            userId: lawyer.userId,
            name: lawyer.user.name,
            avatarUrl: lawyer.user.avatarUrl,
            specializations: lawyer.specializations,
            experience: lawyer.experience,
            hourlyRate: lawyer.hourlyRate ? lawyer.hourlyRate / 100 : null,
            rating: lawyer.rating,
            totalReviews: lawyer.totalReviews,
            city: lawyer.city,
            state: lawyer.state,
            languages: lawyer.languages,
            bio: lawyer.bio,
            isAvailable: lawyer.isAvailable,
            availability: lawyer.availability,
            kycStatus: lawyer.kycStatus,
        };
    }
    async applyAsLawyer(userId, dto) {
        const existing = await this.prisma.lawyerProfile.findUnique({
            where: { userId },
        });
        if (existing) {
            return { message: 'You already have a lawyer profile', lawyerId: existing.id };
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { role: 'LAWYER' },
        });
        const profile = await this.prisma.lawyerProfile.create({
            data: {
                userId,
                specializations: dto.specializations,
                experience: dto.experience,
                city: dto.city,
                state: dto.state,
                languages: dto.languages,
                hourlyRate: dto.hourlyRate * 100,
                bio: dto.bio,
                barCouncilNo: dto.barCouncilNo,
                kycStatus: 'pending',
                isAvailable: false,
            },
        });
        this.logger.log(`New lawyer application: ${profile.id} (user: ${userId})`);
        return {
            message: 'Lawyer application submitted. Your profile will be reviewed and verified within 48 hours.',
            lawyerId: profile.id,
        };
    }
    async getAvailableSlots(lawyerId, date) {
        const lawyer = await this.prisma.lawyerProfile.findUnique({
            where: { id: lawyerId },
        });
        if (!lawyer) {
            throw new common_1.NotFoundException('Lawyer not found');
        }
        const targetDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        const bookedConsultations = await this.prisma.consultation.findMany({
            where: {
                lawyerId,
                status: { in: ['CONFIRMED', 'REQUESTED'] },
                scheduledAt: { gte: startOfDay, lte: endOfDay },
            },
            select: { scheduledAt: true, duration: true },
        });
        const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const availability = lawyer.availability || {};
        const daySlots = availability[dayName] || ['09:00-12:00', '14:00-18:00'];
        const bookedTimes = bookedConsultations.map((c) => ({
            start: c.scheduledAt,
            duration: c.duration || 30,
        }));
        const availableSlots = [];
        for (const slotRange of daySlots) {
            const [start, end] = slotRange.split('-');
            const [startH, startM] = start.split(':').map(Number);
            const [endH, endM] = end.split(':').map(Number);
            let currentMinutes = startH * 60 + startM;
            const endMinutes = endH * 60 + endM;
            while (currentMinutes + 30 <= endMinutes) {
                const slotStart = new Date(targetDate);
                slotStart.setHours(Math.floor(currentMinutes / 60), currentMinutes % 60, 0, 0);
                const isBooked = bookedTimes.some((b) => {
                    const diff = Math.abs(slotStart.getTime() - (b.start?.getTime() || 0));
                    return diff < b.duration * 60 * 1000;
                });
                if (!isBooked) {
                    const h = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
                    const m = (currentMinutes % 60).toString().padStart(2, '0');
                    availableSlots.push(`${h}:${m}`);
                }
                currentMinutes += 30;
            }
        }
        return { date: targetDate, slots: availableSlots };
    }
};
exports.LawyersService = LawyersService;
exports.LawyersService = LawyersService = LawyersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], LawyersService);
//# sourceMappingURL=lawyers.service.js.map