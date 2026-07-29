import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/chat.dto';
declare class ChatMessageDto {
    role: string;
    content: string;
}
declare class AskDto {
    messages: ChatMessageDto[];
}
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    listConversations(req: any, page?: number, limit?: number): Promise<{
        conversations: (import("mongoose").Document<unknown, {}, import("../../core/database/mongoose/schemas/all-schemas").ChatConversation, {}, {}> & import("../../core/database/mongoose/schemas/all-schemas").ChatConversation & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createConversation(req: any, dto: CreateConversationDto): Promise<import("mongoose").Document<unknown, {}, import("../../core/database/mongoose/schemas/all-schemas").ChatConversation, {}, {}> & import("../../core/database/mongoose/schemas/all-schemas").ChatConversation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getConversation(req: any, id: string, page?: number, limit?: number): Promise<{
        conversation: import("mongoose").Document<unknown, {}, import("../../core/database/mongoose/schemas/all-schemas").ChatConversation, {}, {}> & import("../../core/database/mongoose/schemas/all-schemas").ChatConversation & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        messages: (import("mongoose").Document<unknown, {}, import("../../core/database/mongoose/schemas/all-schemas").ChatMessage, {}, {}> & import("../../core/database/mongoose/schemas/all-schemas").ChatMessage & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    archiveConversation(req: any, id: string): Promise<{
        message: string;
        conversation: import("mongoose").Document<unknown, {}, import("../../core/database/mongoose/schemas/all-schemas").ChatConversation, {}, {}> & import("../../core/database/mongoose/schemas/all-schemas").ChatConversation & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    ask(dto: AskDto): Promise<{
        content: string;
        model: string;
        tokensUsed: number;
        legalReferences: {
            act: string;
            section: string;
        }[] | undefined;
    }>;
}
export {};
