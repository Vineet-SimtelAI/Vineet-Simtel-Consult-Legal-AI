import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { QueueService } from '../../core/queue/queue.service';
export interface JwtPayload {
    sub: string;
    email?: string;
    phone?: string;
    role: string;
}
export declare class AuthService {
    private prisma;
    private redisService;
    private jwtService;
    private configService;
    private queueService;
    private readonly logger;
    private sns;
    constructor(prisma: PrismaService, redisService: RedisService, jwtService: JwtService, configService: ConfigService, queueService: QueueService);
    sendOtp(phone: string, purpose?: string): Promise<{
        message: string;
        retryAfter: number;
    }>;
    verifyOtp(phone: string, otp: string, name?: string, email?: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            creditBalance: number;
            avatarUrl: string | null;
        };
        accessToken: string;
    }>;
    handleGoogleUser(googleProfile: {
        googleId: string;
        email: string;
        name: string;
        avatarUrl?: string;
    }): Promise<{
        user: {
            id: string;
            name: string;
            email: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            creditBalance: number;
            avatarUrl: string | null;
        };
        accessToken: string;
    }>;
    validatePayload(payload: JwtPayload): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.UserRole;
        deletedAt: Date | null;
        email: string | null;
        phone: string | null;
        googleId: string | null;
        avatarUrl: string | null;
        emailVerified: boolean;
        phoneVerified: boolean;
        creditBalance: number;
        company: string | null;
        designation: string | null;
        lastLoginAt: Date | null;
    } | null>;
    refreshToken(userId: string): Promise<{
        accessToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
}
