import { Injectable, Logger, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { QueueService } from '../../core/queue/queue.service';
import * as bcrypt from 'bcryptjs';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export interface JwtPayload {
  sub: string;  // userId
  email?: string;
  phone?: string;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private sns: AWS.SNS;

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private queueService: QueueService,
  ) {
    // Initialize AWS SNS
    this.sns = new AWS.SNS({
      region: this.configService.get<string>('app.awsRegion'),
      accessKeyId: this.configService.get<string>('app.awsAccessKeyId'),
      secretAccessKey: this.configService.get<string>('app.awsSecretAccessKey'),
    });
  }

  // ─── Send OTP ───
  async sendOtp(phone: string, purpose: string = 'login'): Promise<{ message: string; retryAfter: number }> {
    // Rate limiting: max 3 OTP requests per phone per hour
    const rateKey = `otp:rate:${phone}`;
    const rateCount = await this.redisService.incr(rateKey);
    if (rateCount === 1) {
      await this.redisService.expire(rateKey, 3600); // 1 hour window
    }
    if (rateCount > 3) {
      throw new BadRequestException('Too many OTP requests. Please try again later.');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Store in Redis with 5-minute TTL
    const otpKey = `otp:${phone}`;
    await this.redisService.set(otpKey, hashedOtp, 300); // 5 minutes

    // Reset attempts counter
    const attemptsKey = `otp:attempts:${phone}`;
    await this.redisService.set(attemptsKey, '0', 300);

    // Send OTP via AWS SNS
    try {
      // In production, send real SMS
      if (this.configService.get<string>('app.nodeEnv') === 'production') {
        await this.sns
          .publish({
            Message: `Your ConsultLegal verification code is ${otp}. Valid for 5 minutes. Do not share this code.`,
            PhoneNumber: phone,
          })
          .promise();
        this.logger.log(`OTP sent via SNS to ${phone}`);
      } else {
        // In development, log the OTP
        this.logger.warn(`[DEV] OTP for ${phone}: ${otp}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${phone}: ${error.message}`);
      throw new BadRequestException('Failed to send OTP. Please try again.');
    }

    // Track analytics
    await this.queueService.trackEvent('otp_sent', undefined, { phone, purpose });

    return {
      message: 'OTP sent successfully',
      retryAfter: 60, // seconds
    };
  }

  // ─── Verify OTP ───
  async verifyOtp(phone: string, otp: string, name?: string, email?: string) {
    const otpKey = `otp:${phone}`;
    const attemptsKey = `otp:attempts:${phone}`;

    // Check if OTP exists
    const hashedOtp = await this.redisService.get(otpKey);
    if (!hashedOtp) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    // Check attempts
    const attempts = parseInt(await this.redisService.get(attemptsKey) || '0', 10);
    if (attempts >= 5) {
      await this.redisService.del(otpKey);
      await this.redisService.del(attemptsKey);
      throw new BadRequestException('Too many incorrect attempts. Please request a new OTP.');
    }

    // Verify OTP
    const isValid = await bcrypt.compare(otp, hashedOtp);
    if (!isValid) {
      await this.redisService.incr(attemptsKey);
      throw new UnauthorizedException('Invalid OTP. Please try again.');
    }

    // OTP is valid — clear it
    await this.redisService.del(otpKey);
    await this.redisService.del(attemptsKey);

    // Find or create user
    let user = await this.prisma.user.findFirst({
      where: { phone, deletedAt: null },
    });

    if (!user) {
      // Create new user
      user = await this.prisma.user.create({
        data: {
          phone,
          name: name || `User_${phone.slice(-4)}`,
          email: email || null,
          phoneVerified: true,
          creditBalance: 25, // welcome bonus
        },
      });

      // Create welcome credit transaction
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
    } else {
      // Update phone verification status
      await this.prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true, lastLoginAt: new Date() },
      });
    }

    // Generate JWT
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email || undefined,
      phone: user.phone || undefined,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    // Cache user session in Redis
    await this.redisService.setJson(`session:${user.id}`, payload, 86400); // 24h

    // Track analytics
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

  // ─── Google OAuth - Find or Create User ───
  async handleGoogleUser(googleProfile: {
    googleId: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }) {
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
      // Create new user
      user = await this.prisma.user.create({
        data: {
          googleId: googleProfile.googleId,
          email: googleProfile.email,
          name: googleProfile.name,
          avatarUrl: googleProfile.avatarUrl || null,
          emailVerified: true,
          creditBalance: 25, // welcome bonus
        },
      });

      // Create welcome credit transaction
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
    } else {
      // Update last login and Google ID if not set
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

    // Generate JWT
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email || undefined,
      phone: user.phone || undefined,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    // Cache session
    await this.redisService.setJson(`session:${user.id}`, payload, 86400);

    // Track analytics
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

  // ─── Validate JWT payload (used by JwtStrategy) ───
  async validatePayload(payload: JwtPayload) {
    // Check if session exists in Redis
    const cached = await this.redisService.getJson(`session:${payload.sub}`);
    if (!cached) {
      // Session expired or revoked
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub, deletedAt: null },
      });
      if (!user) return null;

      // Re-cache session
      const newPayload: JwtPayload = {
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

  // ─── Refresh Token ───
  async refreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email || undefined,
      phone: user.phone || undefined,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);
    await this.redisService.setJson(`session:${user.id}`, payload, 86400);

    return { accessToken: token };
  }

  // ─── Logout ───
  async logout(userId: string) {
    await this.redisService.del(`session:${userId}`);
    return { message: 'Logged out successfully' };
  }
}
