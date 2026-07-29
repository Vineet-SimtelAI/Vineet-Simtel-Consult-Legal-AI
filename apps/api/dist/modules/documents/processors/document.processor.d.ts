import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { StorageService } from '../../../core/storage/storage.service';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../../core/redis/redis.service';
export interface GenerateJobData {
    documentId: string;
    userId: string;
    type: string;
    title: string;
    formData: Record<string, any>;
    clauses?: any[];
    aiEnhanced?: boolean;
}
export interface DocumentProgress {
    documentId: string;
    status: 'GENERATING' | 'COMPLETED' | 'FAILED';
    percentage: number;
    currentStep: string;
    currentStepIndex: number;
    totalSteps: number;
    message: string;
    steps: Array<{
        name: string;
        label: string;
        status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
        durationMs?: number;
        error?: string;
    }>;
    startedAt: string;
    estimatedTotalMs: number;
    elapsedMs: number;
}
export declare class DocumentProcessor {
    private prisma;
    private storageService;
    private configService;
    private redisService;
    private readonly logger;
    constructor(prisma: PrismaService, storageService: StorageService, configService: ConfigService, redisService: RedisService);
    private saveProgress;
    private buildInitialProgress;
    private getPercentageAtStep;
    private getPercentageAfterStep;
    process(jobData: GenerateJobData): Promise<void>;
    private loadTemplate;
    private getDefaultTemplate;
    private wrapHtml;
}
