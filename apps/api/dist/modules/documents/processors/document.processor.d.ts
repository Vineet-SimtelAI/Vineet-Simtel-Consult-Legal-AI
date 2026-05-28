import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { StorageService } from '../../../core/storage/storage.service';
import { ConfigService } from '@nestjs/config';
interface GenerateJobData {
    documentId: string;
    userId: string;
    type: string;
    title: string;
    formData: Record<string, any>;
    clauses?: any[];
    aiEnhanced?: boolean;
}
export declare class DocumentProcessor {
    private prisma;
    private storageService;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, storageService: StorageService, configService: ConfigService);
    process(jobData: GenerateJobData): Promise<void>;
    private loadTemplate;
    private getDefaultTemplate;
    private wrapHtml;
}
export {};
