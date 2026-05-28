export declare class GenerateDocumentDto {
    type: string;
    title: string;
    formData: Record<string, any>;
    clauses?: Array<{
        name: string;
        text: string;
        selected: boolean;
    }>;
    aiEnhanced?: boolean;
}
export declare class ListDocumentsDto {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
}
