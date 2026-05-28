import { PrismaService } from '../../core/database/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { SearchLawyersDto, ApplyAsLawyerDto } from './dto/lawyer.dto';
export declare class LawyersService {
    private prisma;
    private redisService;
    private readonly logger;
    constructor(prisma: PrismaService, redisService: RedisService);
    searchLawyers(filters: SearchLawyersDto): Promise<{}>;
    getLawyerProfile(lawyerId: string): Promise<{
        id: string;
        userId: string;
        name: string;
        avatarUrl: string | null;
        specializations: string[];
        experience: number;
        hourlyRate: number | null;
        rating: number;
        totalReviews: number;
        city: string | null;
        state: string | null;
        languages: string[];
        bio: string | null;
        isAvailable: boolean;
        availability: import("@prisma/client/runtime/library").JsonValue;
        kycStatus: string;
    }>;
    applyAsLawyer(userId: string, dto: ApplyAsLawyerDto): Promise<{
        message: string;
        lawyerId: string;
    }>;
    getAvailableSlots(lawyerId: string, date?: string): Promise<{
        date: Date;
        slots: string[];
    }>;
}
