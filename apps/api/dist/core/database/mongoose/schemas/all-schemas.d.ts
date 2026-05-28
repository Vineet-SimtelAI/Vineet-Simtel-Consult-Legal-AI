import { Document, Schema as MongooseSchema } from 'mongoose';
export declare class ChatConversation {
    userId: string;
    title: string;
    status: string;
    creditsUsed: number;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const ChatConversationSchema: MongooseSchema<ChatConversation, import("mongoose").Model<ChatConversation, any, any, any, Document<unknown, any, ChatConversation, any, {}> & ChatConversation & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChatConversation, Document<unknown, {}, import("mongoose").FlatRecord<ChatConversation>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ChatConversation> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare class ChatMessage {
    conversationId: string;
    userId: string;
    role: string;
    content: string;
    metadata: {
        model?: string;
        tokensUsed?: number;
        latencyMs?: number;
        legalReferences?: Array<{
            act: string;
            section: string;
            url?: string;
        }>;
        sources?: string[];
        confidence?: number;
    };
    isStreaming: boolean;
    parentMessageId: string;
    createdAt: Date;
}
export declare const ChatMessageSchema: MongooseSchema<ChatMessage, import("mongoose").Model<ChatMessage, any, any, any, Document<unknown, any, ChatMessage, any, {}> & ChatMessage & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChatMessage, Document<unknown, {}, import("mongoose").FlatRecord<ChatMessage>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ChatMessage> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare class DocumentGenerationLog {
    userId: string;
    documentId: string;
    templateType: string;
    formData: Record<string, any>;
    generationSteps: Array<{
        step: string;
        status: string;
        durationMs?: number;
        error?: string;
    }>;
    aiModel: string;
    tokensUsed: number;
    totalDurationMs: number;
    createdAt: Date;
}
export declare const DocumentGenerationLogSchema: MongooseSchema<DocumentGenerationLog, import("mongoose").Model<DocumentGenerationLog, any, any, any, Document<unknown, any, DocumentGenerationLog, any, {}> & DocumentGenerationLog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DocumentGenerationLog, Document<unknown, {}, import("mongoose").FlatRecord<DocumentGenerationLog>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<DocumentGenerationLog> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare class AnalyticsEvent {
    userId: string;
    event: string;
    properties: Record<string, any>;
    sessionId: string;
    userAgent: string;
    ip: string;
    createdAt: Date;
}
export declare const AnalyticsEventSchema: MongooseSchema<AnalyticsEvent, import("mongoose").Model<AnalyticsEvent, any, any, any, Document<unknown, any, AnalyticsEvent, any, {}> & AnalyticsEvent & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AnalyticsEvent, Document<unknown, {}, import("mongoose").FlatRecord<AnalyticsEvent>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<AnalyticsEvent> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
