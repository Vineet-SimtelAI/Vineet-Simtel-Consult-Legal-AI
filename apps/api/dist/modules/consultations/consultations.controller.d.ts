import { ConsultationsService } from './consultations.service';
import { BookConsultationDto, ReviewConsultationDto } from './dto/consultation.dto';
export declare class ConsultationsController {
    private consultationsService;
    constructor(consultationsService: ConsultationsService);
    bookConsultation(req: any, dto: BookConsultationDto): Promise<{
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
    listConsultations(req: any, page?: number, limit?: number): Promise<{
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
    getConsultation(req: any, id: string): Promise<{
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
    cancelConsultation(req: any, id: string): Promise<{
        message: string;
    }>;
    submitReview(req: any, id: string, dto: ReviewConsultationDto): Promise<{
        message: string;
    }>;
}
