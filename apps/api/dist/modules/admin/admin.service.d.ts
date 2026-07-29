import { PrismaService } from '../../core/database/prisma/prisma.service';
export declare class AdminService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        users: {
            total: number;
        };
        lawyers: {
            total: number;
        };
        documents: {
            total: number;
            byStatus: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.DocumentGroupByOutputType, "status"[]> & {
                _count: {
                    status: number;
                };
            })[];
        };
        consultations: {
            total: number;
        };
        revenue: {
            total: number;
            totalInRupees: string;
        };
        recentUsers: {
            name: string;
            id: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.UserRole;
            email: string | null;
        }[];
    }>;
    listUsers(page?: number, limit?: number, search?: string, role?: string): Promise<{
        users: {
            name: string;
            id: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.UserRole;
            email: string | null;
            phone: string | null;
            creditBalance: number;
            lastLoginAt: Date | null;
            _count: {
                documents: number;
                consultations: number;
                creditTransactions: number;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateUser(userId: string, dto: {
        role?: string;
        banReason?: string;
    }): Promise<{
        name: string;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        email: string | null;
    }>;
    listPendingLawyers(): Promise<({
        user: {
            name: string;
            email: string | null;
            phone: string | null;
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
    })[]>;
    lawyerAction(lawyerId: string, action: 'approve' | 'reject', reason?: string): Promise<{
        message: string;
    }>;
    getRevenueAnalytics(days?: number): Promise<{
        period: string;
        totalRevenue: number;
        totalTransactions: number;
        dailyRevenue: Record<string, {
            amount: number;
            count: number;
        }>;
    }>;
}
