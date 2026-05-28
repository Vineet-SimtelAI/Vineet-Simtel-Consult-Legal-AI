import { PrismaService } from '../../core/database/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { QueueService } from '../../core/queue/queue.service';
import { BookConsultationDto, ReviewConsultationDto } from './dto/consultation.dto';
export declare class ConsultationsService {
    private prisma;
    private redisService;
    private queueService;
    private readonly logger;
    constructor(prisma: PrismaService, redisService: RedisService, queueService: QueueService);
    bookConsultation(userId: string, dto: BookConsultationDto): Promise<{
        consultation: {
            lawyer: {
                user: {
                    name: string;
                    avatarUrl: string | null;
                };
            } & {
                id: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                specializations: string[];
                experience: number;
                barCouncilNo: string | null;
                licenseVerified: boolean;
                bio: string | null;
                hourlyRate: number | null;
                rating: number;
                totalReviews: number;
                isAvailable: boolean;
                city: string | null;
                state: string | null;
                languages: string[];
                kycStatus: string;
                kycDocuments: import("@prisma/client/runtime/library").JsonValue | null;
                availability: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            type: string;
            userId: string;
            status: import(".prisma/client").$Enums.ConsultationStatus;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            lawyerId: string;
            scheduledAt: Date | null;
            duration: number | null;
            meetingLink: string | null;
            topic: string;
            creditsCharged: number | null;
            paymentId: string | null;
            notes: string | null;
            userRating: number | null;
            userReview: string | null;
        };
        creditsCharged: number;
        creditBalance: number;
        message: string;
    }>;
    listConsultations(userId: string, page?: number, limit?: number): Promise<{
        consultations: ({
            lawyer: {
                user: {
                    name: string;
                    avatarUrl: string | null;
                };
            } & {
                id: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                specializations: string[];
                experience: number;
                barCouncilNo: string | null;
                licenseVerified: boolean;
                bio: string | null;
                hourlyRate: number | null;
                rating: number;
                totalReviews: number;
                isAvailable: boolean;
                city: string | null;
                state: string | null;
                languages: string[];
                kycStatus: string;
                kycDocuments: import("@prisma/client/runtime/library").JsonValue | null;
                availability: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            type: string;
            userId: string;
            status: import(".prisma/client").$Enums.ConsultationStatus;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            lawyerId: string;
            scheduledAt: Date | null;
            duration: number | null;
            meetingLink: string | null;
            topic: string;
            creditsCharged: number | null;
            paymentId: string | null;
            notes: string | null;
            userRating: number | null;
            userReview: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getConsultation(userId: string, consultationId: string): Promise<{
        lawyer: {
            user: {
                name: string;
                email: string | null;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            specializations: string[];
            experience: number;
            barCouncilNo: string | null;
            licenseVerified: boolean;
            bio: string | null;
            hourlyRate: number | null;
            rating: number;
            totalReviews: number;
            isAvailable: boolean;
            city: string | null;
            state: string | null;
            languages: string[];
            kycStatus: string;
            kycDocuments: import("@prisma/client/runtime/library").JsonValue | null;
            availability: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        id: string;
        type: string;
        userId: string;
        status: import(".prisma/client").$Enums.ConsultationStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        lawyerId: string;
        scheduledAt: Date | null;
        duration: number | null;
        meetingLink: string | null;
        topic: string;
        creditsCharged: number | null;
        paymentId: string | null;
        notes: string | null;
        userRating: number | null;
        userReview: string | null;
    }>;
    cancelConsultation(userId: string, consultationId: string): Promise<{
        message: string;
    }>;
    submitReview(userId: string, consultationId: string, dto: ReviewConsultationDto): Promise<{
        message: string;
    }>;
}
