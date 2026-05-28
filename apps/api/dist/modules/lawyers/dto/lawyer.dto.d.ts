export declare class SearchLawyersDto {
    specialization?: string;
    city?: string;
    minRating?: number;
    maxHourlyRate?: number;
    language?: string;
    page?: number;
    limit?: number;
}
export declare class ApplyAsLawyerDto {
    specializations: string[];
    experience: number;
    location: string;
    city: string;
    state: string;
    languages: string[];
    hourlyRate: number;
    bio?: string;
    barCouncilNo?: string;
}
