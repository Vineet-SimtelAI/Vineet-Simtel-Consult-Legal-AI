import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{}>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
        name: string;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        phone: string | null;
        email: string | null;
        avatarUrl: string | null;
        creditBalance: number;
        company: string | null;
        designation: string | null;
    }>;
    getDashboard(req: any): Promise<{
        stats: {
            documents: number;
            consultations: number;
            chatSessions: number;
            creditBalance: number;
        };
        recentDocuments: {
            id: string;
            type: string;
            title: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            createdAt: Date;
        }[];
        upcomingConsultations: ({
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
    }>;
    deleteAccount(req: any): Promise<{
        message: string;
    }>;
}
