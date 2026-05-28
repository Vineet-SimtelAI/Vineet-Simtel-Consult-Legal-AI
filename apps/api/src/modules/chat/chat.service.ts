import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { QueueService } from '../../core/queue/queue.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatConversation, ChatMessage } from '../../core/database/mongoose/schemas/all-schemas';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private configService: ConfigService,
    private queueService: QueueService,
    @InjectModel(ChatConversation.name) private conversationModel: Model<ChatConversation>,
    @InjectModel(ChatMessage.name) private messageModel: Model<ChatMessage>,
  ) {}

  // ─── Create Conversation ───
  async createConversation(userId: string, title?: string, tags?: string[]) {
    const conversation = await this.conversationModel.create({
      userId,
      title: title || 'New Conversation',
      tags: tags || [],
    });

    return conversation;
  }

  // ─── List Conversations ───
  async listConversations(userId: string, page: number = 1, limit: number = 20) {
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

  // ─── Get Conversation with Messages ───
  async getConversation(userId: string, conversationId: string, page: number = 1, limit: number = 50) {
    const conversation = await this.conversationModel.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const skip = (page - 1) * limit;
    const messages = await this.messageModel
      .find({ conversationId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    return { conversation, messages };
  }

  // ─── Handle Incoming Message (from Socket.io) ───
  async handleMessage(userId: string, conversationId: string, content: string) {
    // 1. Verify conversation exists and belongs to user
    const conversation = await this.conversationModel.findOne({
      _id: conversationId,
      userId,
      status: 'active',
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // 2. Check and deduct credits (1 credit per message)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { creditBalance: true },
    });

    if (!user || user.creditBalance < 1) {
      throw new BadRequestException('Insufficient credits for AI chat');
    }

    // Deduct credit
    const newBalance = user.creditBalance - 1;
    await this.prisma.user.update({
      where: { id: userId },
      data: { creditBalance: newBalance },
    });

    // Create credit transaction
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

    // Update Redis cache
    await this.redisService.set(`credits:balance:${userId}`, newBalance.toString(), 300);

    // 3. Save user message to MongoDB
    const userMessage = await this.messageModel.create({
      conversationId,
      userId,
      role: 'user',
      content,
    });

    // 4. Update conversation
    await this.conversationModel.updateOne(
      { _id: conversationId },
      { $inc: { creditsUsed: 1 }, $set: { updatedAt: new Date() } },
    );

    // 5. Load conversation history for AI context (last 10 messages)
    const history = await this.messageModel
      .find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('role content');

    const contextMessages = history.reverse().map((msg) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }));

    // 6. Generate AI response
    const startTime = Date.now();
    const aiResponse = await this.generateAIResponse(contextMessages);
    const latencyMs = Date.now() - startTime;

    // 7. Save assistant message to MongoDB
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

    // 8. Auto-generate title if first message
    if (conversation.title === 'New Conversation') {
      const autoTitle = content.slice(0, 50) + (content.length > 50 ? '...' : '');
      await this.conversationModel.updateOne(
        { _id: conversationId },
        { $set: { title: autoTitle } },
      );
    }

    // 9. Track analytics
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

  // ─── Generate AI Response ───
  private async generateAIResponse(messages: Array<{ role: string; content: string }>): Promise<{
    content: string;
    model: string;
    tokensUsed: number;
    legalReferences?: Array<{ act: string; section: string }>;
    confidence?: number;
  }> {
    const model = this.configService.get<string>('app.aiModel') || 'gpt-4';
    const apiKey = this.configService.get<string>('app.aiApiKey');
    const baseUrl = this.configService.get<string>('app.aiBaseUrl') || 'https://api.openai.com/v1';

    // System prompt for Indian legal context
    const systemPrompt = {
      role: 'system' as const,
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

      // Extract legal references from the response
      const legalReferences = this.extractLegalReferences(content);

      return {
        content,
        model,
        tokensUsed: data.usage?.total_tokens || 0,
        legalReferences: legalReferences.length > 0 ? legalReferences : undefined,
        confidence: 0.85,
      };
    } catch (error) {
      this.logger.error(`AI generation failed: ${error.message}`);

      // Fallback response
      return {
        content: 'I apologize, but I am currently unable to process your request. This may be due to a temporary service issue. Please try again in a few moments. If the problem persists, please contact our support team.',
        model: 'fallback',
        tokensUsed: 0,
        confidence: 0,
      };
    }
  }

  // ─── Extract Legal References from AI response text ───
  private extractLegalReferences(text: string): Array<{ act: string; section: string }> {
    const references: Array<{ act: string; section: string }> = [];
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

  // ─── Archive Conversation ───
  async archiveConversation(userId: string, conversationId: string) {
    const conversation = await this.conversationModel.findOneAndUpdate(
      { _id: conversationId, userId },
      { status: 'archived' },
      { new: true },
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return { message: 'Conversation archived', conversation };
  }
}
