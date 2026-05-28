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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
const redis_service_1 = require("../../core/redis/redis.service");
const queue_service_1 = require("../../core/queue/queue.service");
const crypto = require("crypto");
const CREDIT_PACKAGES = {
    starter: { credits: 100, amount: 19900, label: 'Starter' },
    standard: { credits: 500, amount: 79900, label: 'Standard' },
    professional: { credits: 1500, amount: 199900, label: 'Professional' },
    enterprise: { credits: 5000, amount: 599900, label: 'Enterprise' },
};
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(prisma, redisService, configService, queueService) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.configService = configService;
        this.queueService = queueService;
        this.logger = new common_1.Logger(PaymentsService_1.name);
        const keyId = this.configService.get('app.razorpayKeyId');
        const keySecret = this.configService.get('app.razorpayKeySecret');
        if (keyId && keySecret) {
            const Razorpay = require('razorpay');
            this.razorpay = new Razorpay({
                key_id: keyId,
                key_secret: keySecret,
            });
            this.logger.log('✅ Razorpay initialized');
        }
        else {
            this.logger.warn('⚠️ Razorpay not configured — payments will be simulated');
        }
    }
    getCreditPackages() {
        return Object.entries(CREDIT_PACKAGES).map(([key, pkg]) => ({
            id: key,
            ...pkg,
            perCreditPrice: (pkg.amount / 100 / pkg.credits).toFixed(2),
        }));
    }
    async createOrder(userId, dto) {
        const receipt = `cl_${Date.now()}_${userId.slice(-8)}`;
        if (this.razorpay) {
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
                    key: this.configService.get('app.razorpayKeyId'),
                    receipt,
                };
            }
            catch (error) {
                this.logger.error(`Razorpay order creation failed: ${error.message}`);
                throw new common_1.BadRequestException('Failed to create payment order');
            }
        }
        else {
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
    async verifyPayment(userId, razorpayOrderId, razorpayPaymentId, razorpaySignature) {
        const payment = await this.prisma.payment.findUnique({
            where: { razorpayOrderId },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.status === 'COMPLETED') {
            return {
                message: 'Payment already processed',
                creditsAdded: payment.creditsAdded,
                paymentId: payment.id,
            };
        }
        if (this.razorpay) {
            const expectedSignature = crypto
                .createHmac('sha256', this.configService.get('app.razorpayKeySecret') || '')
                .update(`${razorpayOrderId}|${razorpayPaymentId}`)
                .digest('hex');
            if (expectedSignature !== razorpaySignature) {
                await this.prisma.payment.update({
                    where: { razorpayOrderId },
                    data: { status: 'FAILED' },
                });
                throw new common_1.BadRequestException('Invalid payment signature');
            }
        }
        const creditsToAdd = payment.creditsAdded || 0;
        const newBalance = await this.addCredits(userId, creditsToAdd, {
            type: 'PURCHASE',
            referenceId: payment.id,
            package: payment.purpose,
            description: `Purchased ${creditsToAdd} credits (${payment.purpose})`,
        });
        await this.prisma.payment.update({
            where: { razorpayOrderId },
            data: {
                razorpayPaymentId,
                razorpaySignature,
                status: 'COMPLETED',
            },
        });
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
    async handleWebhook(body, signature) {
        if (this.razorpay) {
            const webhookSecret = this.configService.get('RAZORPAY_WEBHOOK_SECRET') || '';
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
    async purchaseCredits(userId, packageName) {
        const pkg = CREDIT_PACKAGES[packageName];
        if (!pkg) {
            throw new common_1.BadRequestException(`Invalid package: ${packageName}. Available: ${Object.keys(CREDIT_PACKAGES).join(', ')}`);
        }
        return this.createOrder(userId, {
            amount: pkg.amount,
            purpose: 'credits',
            creditsToAdd: pkg.credits,
            packageName,
        });
    }
    async getCreditBalance(userId) {
        const cached = await this.redisService.get(`credits:balance:${userId}`);
        if (cached) {
            return { balance: parseInt(cached, 10) };
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { creditBalance: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.redisService.set(`credits:balance:${userId}`, user.creditBalance.toString(), 300);
        return { balance: user.creditBalance };
    }
    async getTransactionHistory(userId, page = 1, limit = 20) {
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
    async addCredits(userId, amount, details) {
        const lockKey = `credits:lock:${userId}`;
        const locked = await this.redisService.acquireLock(lockKey, 10);
        if (!locked) {
            throw new common_1.BadRequestException('Another credit operation is in progress. Please try again.');
        }
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { creditBalance: true },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
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
                    type: details.type,
                    referenceId: details.referenceId,
                    package: details.package,
                    description: details.description,
                },
            });
            await this.redisService.set(`credits:balance:${userId}`, newBalance.toString(), 300);
            return newBalance;
        }
        finally {
            await this.redisService.releaseLock(lockKey);
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        config_1.ConfigService,
        queue_service_1.QueueService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map