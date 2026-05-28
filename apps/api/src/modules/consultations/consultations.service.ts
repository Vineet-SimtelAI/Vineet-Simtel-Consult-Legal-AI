import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { QueueService } from '../../core/queue/queue.service';
import { BookConsultationDto, ReviewConsultationDto } from './dto/consultation.dto';

@Injectable()
export class ConsultationsService {
  private readonly logger = new Logger(ConsultationsService.name);

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private queueService: QueueService,
  ) {}

  // ─── Book Consultation ───
  async bookConsultation(userId: string, dto: BookConsultationDto) {
    // 1. Verify lawyer exists and is available
    const lawyer = await this.prisma.lawyerProfile.findUnique({
      where: { id: dto.lawyerId },
      include: { user: { select: { name: true } } },
    });

    if (!lawyer || !lawyer.isAvailable || lawyer.kycStatus !== 'verified') {
      throw new BadRequestException('Lawyer is not available for consultations');
    }

    // 2. Calculate credits cost
    const duration = dto.duration || 30; // default 30 minutes
    const creditsCost = Math.ceil((lawyer.hourlyRate || 5000) / 100 * (duration / 60)); // Simplified: hourly rate in credits

    // 3. Check and deduct credits
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { creditBalance: true },
    });

    if (!user || user.creditBalance < creditsCost) {
      throw new BadRequestException(
        `Insufficient credits. You have ${user?.creditBalance || 0}, but need ${creditsCost}.`,
      );
    }

    // 4. Check for scheduling conflicts
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
      throw new BadRequestException('This time slot is already booked. Please choose another time.');
    }

    // 5. Deduct credits (using lock)
    const lockKey = `credits:lock:${userId}`;
    const locked = await this.redisService.acquireLock(lockKey, 10);
    if (!locked) {
      throw new BadRequestException('Another operation is in progress. Please try again.');
    }

    try {
      const newBalance = user.creditBalance - creditsCost;
      await this.prisma.user.update({
        where: { id: userId },
        data: { creditBalance: newBalance },
      });

      // Create credit transaction
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

      // Update cache
      await this.redisService.set(`credits:balance:${userId}`, newBalance.toString(), 300);
    } finally {
      await this.redisService.releaseLock(lockKey);
    }

    // 6. Create consultation
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
        meetingLink: `https://meet.google.com/new`, // Placeholder — integrate Google Meet API
      },
      include: {
        lawyer: {
          include: { user: { select: { name: true, avatarUrl: true } } },
        },
      },
    });

    // 7. Track analytics
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

  // ─── List User Consultations ───
  async listConsultations(userId: string, page: number = 1, limit: number = 20) {
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

  // ─── Get Consultation Details ───
  async getConsultation(userId: string, consultationId: string) {
    const consultation = await this.prisma.consultation.findFirst({
      where: { id: consultationId, userId },
      include: {
        lawyer: {
          include: { user: { select: { name: true, avatarUrl: true, email: true } } },
        },
      },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    return consultation;
  }

  // ─── Cancel Consultation ───
  async cancelConsultation(userId: string, consultationId: string) {
    const consultation = await this.prisma.consultation.findFirst({
      where: { id: consultationId, userId, status: { in: ['REQUESTED', 'CONFIRMED'] } },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found or cannot be cancelled');
    }

    // Cancel consultation
    await this.prisma.consultation.update({
      where: { id: consultationId },
      data: { status: 'CANCELLED' },
    });

    // Refund credits
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

  // ─── Submit Review ───
  async submitReview(userId: string, consultationId: string, dto: ReviewConsultationDto) {
    const consultation = await this.prisma.consultation.findFirst({
      where: { id: consultationId, userId, status: 'COMPLETED' },
    });

    if (!consultation) {
      throw new NotFoundException('Completed consultation not found');
    }

    if (consultation.userRating) {
      throw new BadRequestException('You have already reviewed this consultation');
    }

    // Update consultation with review
    await this.prisma.consultation.update({
      where: { id: consultationId },
      data: { userRating: dto.rating, userReview: dto.review },
    });

    // Update lawyer's average rating
    const lawyerConsultations = await this.prisma.consultation.findMany({
      where: { lawyerId: consultation.lawyerId, userRating: { not: null } },
      select: { userRating: true },
    });

    const avgRating =
      lawyerConsultations.reduce((sum, c) => sum + (c.userRating || 0), 0) / lawyerConsultations.length;

    await this.prisma.lawyerProfile.update({
      where: { id: consultation.lawyerId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        totalReviews: lawyerConsultations.length,
      },
    });

    return { message: 'Review submitted successfully' };
  }
}
