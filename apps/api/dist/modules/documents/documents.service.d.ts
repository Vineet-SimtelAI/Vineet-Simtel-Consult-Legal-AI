import { PrismaService } from '../../core/database/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { StorageService } from '../../core/storage/storage.service';
import { QueueService } from '../../core/queue/queue.service';
import { GenerateDocumentDto } from './dto/document.dto';
export declare class DocumentsService {
    private prisma;
    private redisService;
    private storageService;
    private queueService;
    private readonly logger;
    private readonly CREDIT_COSTS;
    constructor(prisma: PrismaService, redisService: RedisService, storageService: StorageService, queueService: QueueService);
    listTemplates(): Promise<{}>;
    getTemplate(type: string): Promise<{
        name: string;
        id: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        clauses: import("@prisma/client/runtime/library").JsonValue;
        category: string;
        formSchema: import("@prisma/client/runtime/library").JsonValue;
        price: number;
        creditsCost: number;
        isActive: boolean;
    }>;
    listDocuments(userId: string, filters: {
        status?: string;
        type?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        documents: {
            id: string;
            type: string;
            title: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            creditsUsed: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getDocument(userId: string, documentId: string): Promise<{
        id: string;
        type: string;
        userId: string;
        title: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        creditsUsed: number;
        createdAt: Date;
        updatedAt: Date;
        formData: import("@prisma/client/runtime/library").JsonValue;
        clauses: import("@prisma/client/runtime/library").JsonValue | null;
        pdfUrl: string | null;
        docxUrl: string | null;
        pdfKey: string | null;
        docxKey: string | null;
        fileSize: number | null;
        deletedAt: Date | null;
    }>;
    generateDocument(userId: string, dto: GenerateDocumentDto): Promise<{
        documentId: string;
        status: string;
        creditsUsed: number;
        creditBalance: number;
        message: string;
    }>;
    getDownloadUrl(userId: string, documentId: string, format?: 'pdf' | 'docx'): Promise<{
        url: string;
        format: "pdf" | "docx";
        expiresAt: string;
    }>;
    deleteDocument(userId: string, documentId: string): Promise<{
        message: string;
    }>;
    private checkAndDeductCredits;
}
