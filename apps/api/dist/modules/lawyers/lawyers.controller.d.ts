import { LawyersService } from './lawyers.service';
import { SearchLawyersDto, ApplyAsLawyerDto } from './dto/lawyer.dto';
export declare class LawyersController {
    private lawyersService;
    constructor(lawyersService: LawyersService);
    searchLawyers(filters: SearchLawyersDto): Promise<{}>;
    getLawyerProfile(id: string): Promise<{
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
    getAvailableSlots(id: string, date?: string): Promise<{
        date: Date;
        slots: string[];
    }>;
    applyAsLawyer(req: any, dto: ApplyAsLawyerDto): Promise<{
        message: string;
        lawyerId: string;
    }>;
}
