import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { StorageService } from '../../core/storage/storage.service';
import { UpdateProfileDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private storageService: StorageService,
  ) {}

  // ─── Get User Profile ───
  async getProfile(userId: string) {
    // Check Redis cache first
    const cacheKey = `user:profile:${userId}`;
    const cached = await this.redisService.getJson(cacheKey);
    if (cached) return cached;

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
      throw new NotFoundException('User not found');
    }

    // Cache for 5 minutes
    await this.redisService.setJson(cacheKey, user, 300);
    return user;
  }

  // ─── Update Profile ───
  async updateProfile(userId: string, dto: UpdateProfileDto) {
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

    // Invalidate cache
    await this.redisService.del(`user:profile:${userId}`);

    this.logger.log(`Profile updated for user ${userId}`);
    return user;
  }

  // ─── Get Dashboard Stats ───
  async getDashboardStats(userId: string) {
    const [documents, consultations, chatSessions, creditBalance] = await Promise.all([
      this.prisma.document.count({ where: { userId, deletedAt: null } }),
      this.prisma.consultation.count({ where: { userId } }),
      this.prisma.chatSession.count({ where: { userId, status: 'active' } }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { creditBalance: true },
      }),
    ]);

    // Recent documents
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

    // Upcoming consultations
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

  // ─── Delete Account (Soft Delete) ───
  async deleteAccount(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });

    // Clear caches
    await this.redisService.del(`user:profile:${userId}`);
    await this.redisService.del(`session:${userId}`);
    await this.redisService.del(`credits:balance:${userId}`);

    this.logger.log(`Account soft-deleted: ${userId}`);
    return { message: 'Account deleted successfully' };
  }
}
