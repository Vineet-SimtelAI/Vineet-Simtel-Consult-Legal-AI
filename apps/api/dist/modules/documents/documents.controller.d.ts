import { DocumentsService } from './documents.service';
import { GenerateDocumentDto, ListDocumentsDto } from './dto/document.dto';
export declare class DocumentsController {
    private documentsService;
    constructor(documentsService: DocumentsService);
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
    listDocuments(req: any, filters: ListDocumentsDto): Promise<{
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
    getDocument(req: any, id: string): Promise<{
        id: string;
        type: string;
        userId: string;
        title: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        creditsUsed: number;
        createdAt: Date;
        updatedAt: Date;
        formData: import("@prisma/client/runtime/library").JsonValue;
        deletedAt: Date | null;
        clauses: import("@prisma/client/runtime/library").JsonValue | null;
        pdfUrl: string | null;
        docxUrl: string | null;
        pdfKey: string | null;
        docxKey: string | null;
        fileSize: number | null;
    }>;
    generateDocument(req: any, dto: GenerateDocumentDto): Promise<{
        documentId: string;
        status: string;
        creditsUsed: number;
        creditBalance: number;
        message: string;
    }>;
    downloadDocument(req: any, id: string, format?: 'pdf' | 'docx'): Promise<{
        url: string;
        format: "pdf" | "docx";
        expiresAt: string;
    }>;
    deleteDocument(req: any, id: string): Promise<{
        message: string;
    }>;
}
