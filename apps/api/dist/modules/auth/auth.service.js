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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
const redis_service_1 = require("../../core/redis/redis.service");
const queue_service_1 = require("../../core/queue/queue.service");
const bcrypt = require("bcryptjs");
const AWS = require("aws-sdk");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, redisService, jwtService, configService, queueService) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.queueService = queueService;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.sns = new AWS.SNS({
            region: this.configService.get('app.awsRegion'),
            accessKeyId: this.configService.get('app.awsAccessKeyId'),
            secretAccessKey: this.configService.get('app.awsSecretAccessKey'),
        });
    }
    async sendOtp(phone, purpose = 'login') {
        const rateKey = `otp:rate:${phone}`;
        const rateCount = await this.redisService.incr(rateKey);
        if (rateCount === 1) {
            await this.redisService.expire(rateKey, 3600);
        }
        if (rateCount > 3) {
            throw new common_1.BadRequestException('Too many OTP requests. Please try again later.');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpKey = `otp:${phone}`;
        await this.redisService.set(otpKey, hashedOtp, 300);
        const attemptsKey = `otp:attempts:${phone}`;
        await this.redisService.set(attemptsKey, '0', 300);
        try {
            if (this.configService.get('app.nodeEnv') === 'production') {
                await this.sns
                    .publish({
                    Message: `Your ConsultLegal verification code is ${otp}. Valid for 5 minutes. Do not share this code.`,
                    PhoneNumber: phone,
                })
                    .promise();
                this.logger.log(`OTP sent via SNS to ${phone}`);
            }
            else {
                this.logger.warn(`[DEV] OTP for ${phone}: ${otp}`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to send OTP to ${phone}: ${error.message}`);
            throw new common_1.BadRequestException('Failed to send OTP. Please try again.');
        }
        await this.queueService.trackEvent('otp_sent', undefined, { phone, purpose });
        return {
            message: 'OTP sent successfully',
            retryAfter: 60,
        };
    }
    async verifyOtp(phone, otp, name, email) {
        const otpKey = `otp:${phone}`;
        const attemptsKey = `otp:attempts:${phone}`;
        const hashedOtp = await this.redisService.get(otpKey);
        if (!hashedOtp) {
            throw new common_1.BadRequestException('OTP has expired. Please request a new one.');
        }
        const attempts = parseInt(await this.redisService.get(attemptsKey) || '0', 10);
        if (attempts >= 5) {
            await this.redisService.del(otpKey);
            await this.redisService.del(attemptsKey);
            throw new common_1.BadRequestException('Too many incorrect attempts. Please request a new OTP.');
        }
        const isValid = await bcrypt.compare(otp, hashedOtp);
        if (!isValid) {
            await this.redisService.incr(attemptsKey);
            throw new common_1.UnauthorizedException('Invalid OTP. Please try again.');
        }
        await this.redisService.del(otpKey);
        await this.redisService.del(attemptsKey);
        let user = await this.prisma.user.findFirst({
            where: { phone, deletedAt: null },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    phone,
                    name: name || `User_${phone.slice(-4)}`,
                    email: email || null,
                    phoneVerified: true,
                    creditBalance: 25,
                },
            });
            await this.prisma.creditTransaction.create({
                data: {
                    userId: user.id,
                    amount: 25,
                    balance: 25,
                    type: 'BONUS',
                    description: 'Welcome bonus credits',
                },
            });
            this.logger.log(`New user created via OTP: ${user.id}`);
        }
        else {
            await this.prisma.user.update({
                where: { id: user.id },
                data: { phoneVerified: true, lastLoginAt: new Date() },
            });
        }
        const payload = {
            sub: user.id,
            email: user.email || undefined,
            phone: user.phone || undefined,
            role: user.role,
        };
        const token = this.jwtService.sign(payload);
        await this.redisService.setJson(`session:${user.id}`, payload, 86400);
        await this.queueService.trackEvent('login', user.id, { method: 'otp' });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                creditBalance: user.creditBalance,
                avatarUrl: user.avatarUrl,
            },
            accessToken: token,
        };
    }
    async handleGoogleUser(googleProfile) {
        let user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { googleId: googleProfile.googleId },
                    { email: googleProfile.email },
                ],
                deletedAt: null,
            },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    googleId: googleProfile.googleId,
                    email: googleProfile.email,
                    name: googleProfile.name,
                    avatarUrl: googleProfile.avatarUrl || null,
                    emailVerified: true,
                    creditBalance: 25,
                },
            });
            await this.prisma.creditTransaction.create({
                data: {
                    userId: user.id,
                    amount: 25,
                    balance: 25,
                    type: 'BONUS',
                    description: 'Welcome bonus credits',
                },
            });
            this.logger.log(`New user created via Google: ${user.id}`);
        }
        else {
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    lastLoginAt: new Date(),
                    googleId: user.googleId || googleProfile.googleId,
                    avatarUrl: user.avatarUrl || googleProfile.avatarUrl || null,
                    emailVerified: true,
                },
            });
        }
        const payload = {
            sub: user.id,
            email: user.email || undefined,
            phone: user.phone || undefined,
            role: user.role,
        };
        const token = this.jwtService.sign(payload);
        await this.redisService.setJson(`session:${user.id}`, payload, 86400);
        await this.queueService.trackEvent('login', user.id, { method: 'google' });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                creditBalance: user.creditBalance,
                avatarUrl: user.avatarUrl,
            },
            accessToken: token,
        };
    }
    async validatePayload(payload) {
        const cached = await this.redisService.getJson(`session:${payload.sub}`);
        if (!cached) {
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub, deletedAt: null },
            });
            if (!user)
                return null;
            const newPayload = {
                sub: user.id,
                email: user.email || undefined,
                phone: user.phone || undefined,
                role: user.role,
            };
            await this.redisService.setJson(`session:${user.id}`, newPayload, 86400);
            return user;
        }
        return this.prisma.user.findUnique({
            where: { id: payload.sub, deletedAt: null },
        });
    }
    async refreshToken(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, deletedAt: null },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const payload = {
            sub: user.id,
            email: user.email || undefined,
            phone: user.phone || undefined,
            role: user.role,
        };
        const token = this.jwtService.sign(payload);
        await this.redisService.setJson(`session:${user.id}`, payload, 86400);
        return { accessToken: token };
    }
    async logout(userId) {
        await this.redisService.del(`session:${userId}`);
        return { message: 'Logged out successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        jwt_1.JwtService,
        config_1.ConfigService,
        queue_service_1.QueueService])
], AuthService);
//# sourceMappingURL=auth.service.js.map