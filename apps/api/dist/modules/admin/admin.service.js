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
var AdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
let AdminService = AdminService_1 = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AdminService_1.name);
    }
    async getStats() {
        const [totalUsers, totalLawyers, totalDocuments, totalConsultations, totalRevenue, recentUsers, documentsByStatus,] = await Promise.all([
            this.prisma.user.count({ where: { deletedAt: null } }),
            this.prisma.lawyerProfile.count(),
            this.prisma.document.count({ where: { deletedAt: null } }),
            this.prisma.consultation.count(),
            this.prisma.payment.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { amount: true },
            }),
            this.prisma.user.findMany({
                where: { deletedAt: null },
                orderBy: { createdAt: 'desc' },
                take: 10,
                select: { id: true, name: true, email: true, role: true, createdAt: true },
            }),
            this.prisma.document.groupBy({
                by: ['status'],
                where: { deletedAt: null },
                _count: { status: true },
            }),
        ]);
        return {
            users: { total: totalUsers },
            lawyers: { total: totalLawyers },
            documents: { total: totalDocuments, byStatus: documentsByStatus },
            consultations: { total: totalConsultations },
            revenue: {
                total: totalRevenue._sum.amount || 0,
                totalInRupees: ((totalRevenue._sum.amount || 0) / 100).toFixed(2),
            },
            recentUsers,
        };
    }
    async listUsers(page = 1, limit = 20, search, role) {
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (role)
            where.role = role;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } },
            ];
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    creditBalance: true,
                    createdAt: true,
                    lastLoginAt: true,
                    _count: {
                        select: { documents: true, consultations: true, creditTransactions: true },
                    },
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async updateUser(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const updateData = {};
        if (dto.role)
            updateData.role = dto.role;
        if (dto.banReason) {
            updateData.deletedAt = new Date();
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, name: true, email: true, role: true },
        });
    }
    async listPendingLawyers() {
        return this.prisma.lawyerProfile.findMany({
            where: { kycStatus: 'pending' },
            orderBy: { createdAt: 'asc' },
            include: {
                user: {
                    select: { name: true, email: true, phone: true, avatarUrl: true },
                },
            },
        });
    }
    async lawyerAction(lawyerId, action, reason) {
        const lawyer = await this.prisma.lawyerProfile.findUnique({ where: { id: lawyerId } });
        if (!lawyer)
            throw new common_1.NotFoundException('Lawyer profile not found');
        if (action === 'approve') {
            await this.prisma.lawyerProfile.update({
                where: { id: lawyerId },
                data: { kycStatus: 'verified', licenseVerified: true, isAvailable: true },
            });
            return { message: 'Lawyer approved successfully' };
        }
        else {
            await this.prisma.lawyerProfile.update({
                where: { id: lawyerId },
                data: { kycStatus: 'rejected', isAvailable: false },
            });
            return { message: 'Lawyer application rejected' };
        }
    }
    async getRevenueAnalytics(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const payments = await this.prisma.payment.findMany({
            where: {
                status: 'COMPLETED',
                createdAt: { gte: startDate },
            },
            orderBy: { createdAt: 'asc' },
            select: {
                amount: true,
                purpose: true,
                creditsAdded: true,
                createdAt: true,
            },
        });
        const dailyRevenue = {};
        for (const payment of payments) {
            const dateKey = payment.createdAt.toISOString().split('T')[0];
            if (!dailyRevenue[dateKey]) {
                dailyRevenue[dateKey] = { amount: 0, count: 0 };
            }
            dailyRevenue[dateKey].amount += payment.amount;
            dailyRevenue[dateKey].count += 1;
        }
        return {
            period: `${days} days`,
            totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
            totalTransactions: payments.length,
            dailyRevenue,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = AdminService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map