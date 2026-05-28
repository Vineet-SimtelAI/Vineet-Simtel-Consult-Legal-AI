import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { QueueService } from '../../core/queue/queue.service';
import { CreatePaymentOrderDto } from './dto/payment.dto';
import * as crypto from 'crypto';

// Credit packages configuration
const CREDIT_PACKAGES = {
  starter: { credits: 100, amount: 19900, label: 'Starter' },        // ₹199
  standard: { credits: 500, amount: 79900, label: 'Standard' },       // ₹799
  professional: { credits: 1500, amount: 199900, label: 'Professional' }, // ₹1,999
  enterprise: { credits: 5000, amount: 599900, label: 'Enterprise' },  // ₹5,999
};

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpay: any;

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private configService: ConfigService,
    private queueService: QueueService,
  ) {
    // Initialize Razorpay
    const keyId = this.configService.get<string>('app.razorpayKeyId');
    const keySecret = this.configService.get<string>('app.razorpayKeySecret');

    if (keyId && keySecret) {
      const Razorpay = require('razorpay');
      this.razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
      this.logger.log('✅ Razorpay initialized');
    } else {
      this.logger.warn('⚠️ Razorpay not configured — payments will be simulated');
    }
  }

  // ─── Get Available Credit Packages ───
  getCreditPackages() {
    return Object.entries(CREDIT_PACKAGES).map(([key, pkg]) => ({
      id: key,
      ...pkg,
      perCreditPrice: (pkg.amount / 100 / pkg.credits).toFixed(2),
    }));
  }

  // ─── Create Payment Order ───
  async createOrder(userId: string, dto: CreatePaymentOrderDto) {
    const receipt = `cl_${Date.now()}_${userId.slice(-8)}`;

    if (this.razorpay) {
      // Real Razorpay order
      try {
        const order = await this.razorpay.orders.create({
          amount: dto.amount,
          currency: 'INR',
          receipt,
          notes: {
            userId,
            purpose: dto.purpose,
            creditsToAdd: dto.creditsToAdd?.toString() || '',
            packageName: dto.packageName || '',
          },
        });

        // Save payment record
        await this.prisma.payment.create({
          data: {
            userId,
            razorpayOrderId: order.id,
            amount: dto.amount,
            currency: 'INR',
            status: 'PENDING',
            purpose: dto.purpose,
            purposeId: dto.purposeId,
            creditsAdded: dto.creditsToAdd,
            receipt,
          },
        });

        return {
          orderId: order.id,
          amount: dto.amount,
          currency: 'INR',
          key: this.configService.get<string>('app.razorpayKeyId'),
          receipt,
        };
      } catch (error) {
        this.logger.error(`Razorpay order creation failed: ${error.message}`);
        throw new BadRequestException('Failed to create payment order');
      }
    } else {
      // Simulated payment (development mode)
      const simulatedOrderId = `order_sim_${Date.now()}`;
      await this.prisma.payment.create({
        data: {
          userId,
          razorpayOrderId: simulatedOrderId,
          amount: dto.amount,
          currency: 'INR',
          status: 'PENDING',
          purpose: dto.purpose,
          purposeId: dto.purposeId,
          creditsAdded: dto.creditsToAdd,
          receipt,
        },
      });

      return {
        orderId: simulatedOrderId,
        amount: dto.amount,
        currency: 'INR',
        key: 'simulated_key',
        receipt,
        simulated: true,
      };
    }
  }

  // ─── Verify Payment ───
  async verifyPayment(
    userId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ) {
    // Find the payment record
    const payment = await this.prisma.payment.findUnique({
      where: { razorpayOrderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === 'COMPLETED') {
      // Already processed (idempotent)
      return {
        message: 'Payment already processed',
        creditsAdded: payment.creditsAdded,
        paymentId: payment.id,
      };
    }

    // Verify signature (for real Razorpay)
    if (this.razorpay) {
      const expectedSignature = crypto
        .createHmac('sha256', this.configService.get<string>('app.razorpayKeySecret') || '')
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        await this.prisma.payment.update({
          where: { razorpayOrderId },
          data: { status: 'FAILED' },
        });
        throw new BadRequestException('Invalid payment signature');
      }
    }

    // Payment verified — add credits
    const creditsToAdd = payment.creditsAdded || 0;
    const newBalance = await this.addCredits(userId, creditsToAdd, {
      type: 'PURCHASE',
      referenceId: payment.id,
      package: payment.purpose,
      description: `Purchased ${creditsToAdd} credits (${payment.purpose})`,
    });

    // Update payment status
    await this.prisma.payment.update({
      where: { razorpayOrderId },
      data: {
        razorpayPaymentId,
        razorpaySignature,
        status: 'COMPLETED',
      },
    });

    // Track analytics
    await this.queueService.trackEvent('payment_completed', userId, {
      amount: payment.amount,
      creditsToAdd,
    });

    this.logger.log(`Payment completed: ${razorpayOrderId} — ${creditsToAdd} credits added to user ${userId}`);

    return {
      message: 'Payment verified and credits added',
      creditsToAdd,
      paymentId: payment.id,
    };
  }

  // ─── Handle Razorpay Webhook ───
  async handleWebhook(body: any, signature: string) {
    // Verify webhook signature
    if (this.razorpay) {
      const webhookSecret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET') || '';
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(body))
        .digest('hex');

      if (expectedSignature !== signature) {
        this.logger.warn('Invalid webhook signature');
        return { status: 'ignored' };
      }
    }

    const event = body.event;
    const paymentEntity = body.payload?.payment?.entity;

    if (event === 'payment.captured') {
      const orderId = paymentEntity?.order_id;
      if (orderId) {
        // Process the payment (idempotent)
        const payment = await this.prisma.payment.findUnique({
          where: { razorpayOrderId: orderId },
        });

        if (payment && payment.status !== 'COMPLETED') {
          const creditsToAdd = payment.creditsAdded || 0;
          await this.addCredits(payment.userId, creditsToAdd, {
            type: 'PURCHASE',
            referenceId: payment.id,
            package: payment.purpose,
            description: `Purchased ${creditsToAdd} credits (webhook)`,
          });

          await this.prisma.payment.update({
            where: { razorpayOrderId: orderId },
            data: {
              razorpayPaymentId: paymentEntity.id,
              status: 'COMPLETED',
            },
          });
        }
      }
    }

    return { status: 'processed' };
  }

  // ─── Purchase Credits by Package ───
  async purchaseCredits(userId: string, packageName: string) {
    const pkg = CREDIT_PACKAGES[packageName as keyof typeof CREDIT_PACKAGES];
    if (!pkg) {
      throw new BadRequestException(`Invalid package: ${packageName}. Available: ${Object.keys(CREDIT_PACKAGES).join(', ')}`);
    }

    return this.createOrder(userId, {
      amount: pkg.amount,
      purpose: 'credits',
      creditsToAdd: pkg.credits,
      packageName,
    });
  }

  // ─── Get Credit Balance ───
  async getCreditBalance(userId: string) {
    // Check cache first
    const cached = await this.redisService.get(`credits:balance:${userId}`);
    if (cached) {
      return { balance: parseInt(cached, 10) };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { creditBalance: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.redisService.set(`credits:balance:${userId}`, user.creditBalance.toString(), 300);
    return { balance: user.creditBalance };
  }

  // ─── Get Transaction History ───
  async getTransactionHistory(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.creditTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.creditTransaction.count({ where: { userId } }),
    ]);

    return {
      transactions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Helper: Add Credits to User ───
  private async addCredits(
    userId: string,
    amount: number,
    details: { type: string; referenceId?: string; package?: string; description: string },
  ): Promise<number> {
    const lockKey = `credits:lock:${userId}`;
    const locked = await this.redisService.acquireLock(lockKey, 10);
    if (!locked) {
      throw new BadRequestException('Another credit operation is in progress. Please try again.');
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { creditBalance: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const newBalance = user.creditBalance + amount;
      await this.prisma.user.update({
        where: { id: userId },
        data: { creditBalance: newBalance },
      });

      await this.prisma.creditTransaction.create({
        data: {
          userId,
          amount,
          balance: newBalance,
          type: details.type as any,
          referenceId: details.referenceId,
          package: details.package,
          description: details.description,
        },
      });

      await this.redisService.set(`credits:balance:${userId}`, newBalance.toString(), 300);

      return newBalance;
    } finally {
      await this.redisService.releaseLock(lockKey);
    }
  }
}
