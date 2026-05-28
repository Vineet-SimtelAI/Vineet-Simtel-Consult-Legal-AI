import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { SearchLawyersDto, ApplyAsLawyerDto } from './dto/lawyer.dto';

@Injectable()
export class LawyersService {
  private readonly logger = new Logger(LawyersService.name);

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  // ─── Search/Filter Lawyers ───
  async searchLawyers(filters: SearchLawyersDto) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    // Build cache key
    const cacheKey = `lawyer:search:${JSON.stringify(filters)}`;
    const cached = await this.redisService.getJson(cacheKey);
    if (cached) return cached;

    const where: any = {
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
      where.hourlyRate = { lte: filters.maxHourlyRate * 100 }; // convert to paisa
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
        hourlyRate: l.hourlyRate ? l.hourlyRate / 100 : null, // convert from paisa to INR
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

    // Cache for 1 minute
    await this.redisService.setJson(cacheKey, result, 60);
    return result;
  }

  // ─── Get Lawyer Profile ───
  async getLawyerProfile(lawyerId: string) {
    const lawyer = await this.prisma.lawyerProfile.findUnique({
      where: { id: lawyerId },
      include: {
        user: {
          select: { name: true, avatarUrl: true, email: true },
        },
      },
    });

    if (!lawyer) {
      throw new NotFoundException('Lawyer not found');
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

  // ─── Apply as Lawyer ───
  async applyAsLawyer(userId: string, dto: ApplyAsLawyerDto) {
    // Check if already a lawyer
    const existing = await this.prisma.lawyerProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      return { message: 'You already have a lawyer profile', lawyerId: existing.id };
    }

    // Update user role
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'LAWYER' },
    });

    // Create lawyer profile
    const profile = await this.prisma.lawyerProfile.create({
      data: {
        userId,
        specializations: dto.specializations,
        experience: dto.experience,
        city: dto.city,
        state: dto.state,
        languages: dto.languages,
        hourlyRate: dto.hourlyRate * 100, // convert to paisa
        bio: dto.bio,
        barCouncilNo: dto.barCouncilNo,
        kycStatus: 'pending',
        isAvailable: false, // not available until verified
      },
    });

    this.logger.log(`New lawyer application: ${profile.id} (user: ${userId})`);

    return {
      message: 'Lawyer application submitted. Your profile will be reviewed and verified within 48 hours.',
      lawyerId: profile.id,
    };
  }

  // ─── Get Available Time Slots ───
  async getAvailableSlots(lawyerId: string, date?: string) {
    const lawyer = await this.prisma.lawyerProfile.findUnique({
      where: { id: lawyerId },
    });

    if (!lawyer) {
      throw new NotFoundException('Lawyer not found');
    }

    // Get booked consultations for the date
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

    // Generate available slots based on lawyer's availability
    const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const availability = (lawyer.availability as any) || {};
    const daySlots = availability[dayName] || ['09:00-12:00', '14:00-18:00'];

    // Parse slots and filter out booked times
    const bookedTimes = bookedConsultations.map((c) => ({
      start: c.scheduledAt,
      duration: c.duration || 30,
    }));

    const availableSlots: string[] = [];
    for (const slotRange of daySlots) {
      const [start, end] = slotRange.split('-');
      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);

      let currentMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      while (currentMinutes + 30 <= endMinutes) {
        const slotStart = new Date(targetDate);
        slotStart.setHours(Math.floor(currentMinutes / 60), currentMinutes % 60, 0, 0);

        // Check if slot is booked
        const isBooked = bookedTimes.some((b) => {
          const diff = Math.abs(slotStart.getTime() - (b.start?.getTime() || 0));
          return diff < b.duration * 60 * 1000;
        });

        if (!isBooked) {
          const h = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
          const m = (currentMinutes % 60).toString().padStart(2, '0');
          availableSlots.push(`${h}:${m}`);
        }

        currentMinutes += 30; // 30-minute slots
      }
    }

    return { date: targetDate, slots: availableSlots };
  }
}
