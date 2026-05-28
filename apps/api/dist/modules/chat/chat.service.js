"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
const redis_service_1 = require("../../core/redis/redis.service");
const queue_service_1 = require("../../core/queue/queue.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const all_schemas_1 = require("../../core/database/mongoose/schemas/all-schemas");
let ChatService = ChatService_1 = class ChatService {
    constructor(prisma, redisService, configService, queueService, conversationModel, messageModel) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.configService = configService;
        this.queueService = queueService;
        this.conversationModel = conversationModel;
        this.messageModel = messageModel;
        this.logger = new common_1.Logger(ChatService_1.name);
    }
    async createConversation(userId, title, tags) {
        const conversation = await this.conversationModel.create({
            userId,
            title: title || 'New Conversation',
            tags: tags || [],
        });
        return conversation;
    }
    async listConversations(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [conversations, total] = await Promise.all([
            this.conversationModel
                .find({ userId, status: 'active' })
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('title tags creditsUsed createdAt updatedAt'),
            this.conversationModel.countDocuments({ userId, status: 'active' }),
        ]);
        return {
            conversations,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getConversation(userId, conversationId, page = 1, limit = 50) {
        const conversation = await this.conversationModel.findOne({
            _id: conversationId,
            userId,
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const skip = (page - 1) * limit;
        const messages = await this.messageModel
            .find({ conversationId })
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit);
        return { conversation, messages };
    }
    async handleMessage(userId, conversationId, content) {
        const conversation = await this.conversationModel.findOne({
            _id: conversationId,
            userId,
            status: 'active',
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { creditBalance: true },
        });
        if (!user || user.creditBalance < 1) {
            throw new common_1.BadRequestException('Insufficient credits for AI chat');
        }
        const newBalance = user.creditBalance - 1;
        await this.prisma.user.update({
            where: { id: userId },
            data: { creditBalance: newBalance },
        });
        await this.prisma.creditTransaction.create({
            data: {
                userId,
                amount: -1,
                balance: newBalance,
                type: 'AI_CHAT',
                referenceId: conversationId,
                description: 'AI Chat message',
            },
        });
        await this.redisService.set(`credits:balance:${userId}`, newBalance.toString(), 300);
        const userMessage = await this.messageModel.create({
            conversationId,
            userId,
            role: 'user',
            content,
        });
        await this.conversationModel.updateOne({ _id: conversationId }, { $inc: { creditsUsed: 1 }, $set: { updatedAt: new Date() } });
        const history = await this.messageModel
            .find({ conversationId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('role content');
        const contextMessages = history.reverse().map((msg) => ({
            role: msg.role,
            content: msg.content,
        }));
        const startTime = Date.now();
        const aiResponse = await this.generateAIResponse(contextMessages);
        const latencyMs = Date.now() - startTime;
        const assistantMessage = await this.messageModel.create({
            conversationId,
            userId,
            role: 'assistant',
            content: aiResponse.content,
            metadata: {
                model: aiResponse.model,
                tokensUsed: aiResponse.tokensUsed,
                latencyMs,
                legalReferences: aiResponse.legalReferences,
                confidence: aiResponse.confidence,
            },
        });
        if (conversation.title === 'New Conversation') {
            const autoTitle = content.slice(0, 50) + (content.length > 50 ? '...' : '');
            await this.conversationModel.updateOne({ _id: conversationId }, { $set: { title: autoTitle } });
        }
        await this.queueService.trackEvent('chat_message', userId, {
            conversationId,
            latencyMs,
            tokensUsed: aiResponse.tokensUsed,
        });
        return {
            userMessage,
            assistantMessage,
            creditBalance: newBalance,
        };
    }
    async generateAIResponse(messages) {
        const model = this.configService.get('app.aiModel') || 'gpt-4';
        const apiKey = this.configService.get('app.aiApiKey');
        const baseUrl = this.configService.get('app.aiBaseUrl') || 'https://api.openai.com/v1';
        const systemPrompt = {
            role: 'system',
            content: `You are ConsultLegal AI, an expert legal assistant specializing in Indian law. You provide accurate, helpful legal information based on Indian legal frameworks including:

- Indian Contract Act, 1872
- Companies Act, 2013
- Indian Penal Code
- Code of Civil Procedure
- Code of Criminal Procedure
- Constitution of India
- Consumer Protection Act, 2019
- Intellectual Property laws (Patents, Trademarks, Copyright)
- Labour laws and employment regulations
- Real Estate (Regulation and Development) Act, 2016
- Information Technology Act, 2000
- Goods and Services Tax (GST) laws

Important guidelines:
1. Always cite relevant acts and sections when applicable
2. Clarify that you provide legal information, not legal advice
3. Recommend consulting a qualified lawyer for specific situations
4. Be precise about jurisdiction (primarily Indian law)
5. If unsure, say so rather than providing incorrect information
6. Use clear, accessible language while maintaining legal accuracy`,
        };
        try {
            const response = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    messages: [systemPrompt, ...messages],
                    temperature: 0.7,
                    max_tokens: 2000,
                }),
            });
            if (!response.ok) {
                throw new Error(`AI API error: ${response.status}`);
            }
            const data = await response.json();
            const content = data.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';
            const legalReferences = this.extractLegalReferences(content);
            return {
                content,
                model,
                tokensUsed: data.usage?.total_tokens || 0,
                legalReferences: legalReferences.length > 0 ? legalReferences : undefined,
                confidence: 0.85,
            };
        }
        catch (error) {
            this.logger.error(`AI generation failed: ${error.message}`);
            return {
                content: 'I apologize, but I am currently unable to process your request. This may be due to a temporary service issue. Please try again in a few moments. If the problem persists, please contact our support team.',
                model: 'fallback',
                tokensUsed: 0,
                confidence: 0,
            };
        }
    }
    extractLegalReferences(text) {
        const references = [];
        const sectionPattern = /Section\s+(\d+[A-Z]?)\s+(?:of\s+)?(?:the\s+)?([A-Za-z\s]+Act(?:,\s*\d{4})?)/gi;
        let match;
        while ((match = sectionPattern.exec(text)) !== null) {
            references.push({
                section: `Section ${match[1]}`,
                act: match[2].trim(),
            });
        }
        return references;
    }
    async archiveConversation(userId, conversationId) {
        const conversation = await this.conversationModel.findOneAndUpdate({ _id: conversationId, userId }, { status: 'archived' }, { new: true });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        return { message: 'Conversation archived', conversation };
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, mongoose_1.InjectModel)(all_schemas_1.ChatConversation.name)),
    __param(5, (0, mongoose_1.InjectModel)(all_schemas_1.ChatMessage.name)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        config_1.ConfigService,
        queue_service_1.QueueService,
        mongoose_2.Model,
        mongoose_2.Model])
], ChatService);
//# sourceMappingURL=chat.service.js.map