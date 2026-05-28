import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private prisma: PrismaService) {}

  // ─── Dashboard Stats ───
  async getStats() {
    const [
      totalUsers,
      totalLawyers,
      totalDocuments,
      totalConsultations,
      totalRevenue,
      recentUsers,
      documentsByStatus,
    ] = await Promise.all([
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

  // ─── List All Users ───
  async listUsers(page: number = 1, limit: number = 20, search?: string, role?: string) {
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (role) where.role = role;
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

  // ─── Update User (Admin Action) ───
  async updateUser(userId: string, dto: { role?: string; banReason?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updateData: any = {};
    if (dto.role) updateData.role = dto.role;

    if (dto.banReason) {
      updateData.deletedAt = new Date(); // soft delete = ban
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, email: true, role: true },
    });
  }

  // ─── List Pending Lawyer Applications ───
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

  // ─── Approve/Reject Lawyer ───
  async lawyerAction(lawyerId: string, action: 'approve' | 'reject', reason?: string) {
    const lawyer = await this.prisma.lawyerProfile.findUnique({ where: { id: lawyerId } });
    if (!lawyer) throw new NotFoundException('Lawyer profile not found');

    if (action === 'approve') {
      await this.prisma.lawyerProfile.update({
        where: { id: lawyerId },
        data: { kycStatus: 'verified', licenseVerified: true, isAvailable: true },
      });
      return { message: 'Lawyer approved successfully' };
    } else {
      await this.prisma.lawyerProfile.update({
        where: { id: lawyerId },
        data: { kycStatus: 'rejected', isAvailable: false },
      });
      return { message: 'Lawyer application rejected' };
    }
  }

  // ─── Revenue Analytics ───
  async getRevenueAnalytics(days: number = 30) {
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

    // Group by date
    const dailyRevenue: Record<string, { amount: number; count: number }> = {};
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
}
