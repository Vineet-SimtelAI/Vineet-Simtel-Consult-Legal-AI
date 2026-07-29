import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { QueueService } from '../../core/queue/queue.service';
import { Model } from 'mongoose';
import { ChatConversation, ChatMessage } from '../../core/database/mongoose/schemas/all-schemas';
export declare class ChatService {
    private prisma;
    private redisService;
    private configService;
    private queueService;
    private conversationModel;
    private messageModel;
    private readonly logger;
    constructor(prisma: PrismaService, redisService: RedisService, configService: ConfigService, queueService: QueueService, conversationModel: Model<ChatConversation>, messageModel: Model<ChatMessage>);
    createConversation(userId: string, title?: string, tags?: string[]): Promise<import("mongoose").Document<unknown, {}, ChatConversation, {}, {}> & ChatConversation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    listConversations(userId: string, page?: number, limit?: number): Promise<{
        conversations: (import("mongoose").Document<unknown, {}, ChatConversation, {}, {}> & ChatConversation & {
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
    getConversation(userId: string, conversationId: string, page?: number, limit?: number): Promise<{
        conversation: import("mongoose").Document<unknown, {}, ChatConversation, {}, {}> & ChatConversation & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        messages: (import("mongoose").Document<unknown, {}, ChatMessage, {}, {}> & ChatMessage & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    handleMessage(userId: string, conversationId: string, content: string): Promise<{
        userMessage: import("mongoose").Document<unknown, {}, ChatMessage, {}, {}> & ChatMessage & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        assistantMessage: import("mongoose").Document<unknown, {}, ChatMessage, {}, {}> & ChatMessage & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        creditBalance: number;
    }>;
    private generateAIResponse;
    private extractLegalReferences;
    archiveConversation(userId: string, conversationId: string): Promise<{
        message: string;
        conversation: import("mongoose").Document<unknown, {}, ChatConversation, {}, {}> & ChatConversation & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    directAsk(messages: Array<{
        role: string;
        content: string;
    }>): Promise<{
        content: string;
        model: string;
        tokensUsed: number;
        legalReferences: {
            act: string;
            section: string;
        }[] | undefined;
    }>;
}
