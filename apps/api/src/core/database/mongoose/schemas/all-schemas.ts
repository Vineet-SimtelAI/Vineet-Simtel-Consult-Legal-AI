import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// ─── Chat Conversation Schema ───
@Schema({ timestamps: true, collection: 'chat_conversations' })
export class ChatConversation {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ default: 'New Conversation' })
  title: string;

  @Prop({ default: 'active', enum: ['active', 'archived'] })
  status: string;

  @Prop({ default: 0 })
  creditsUsed: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ChatConversationSchema = SchemaFactory.createForClass(ChatConversation);

// ─── Chat Message Schema ───
@Schema({ timestamps: true, collection: 'chat_messages' })
export class ChatMessage {
  @Prop({ required: true, index: true, type: MongooseSchema.Types.ObjectId, ref: 'ChatConversation' })
  conversationId: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, enum: ['user', 'assistant', 'system'] })
  role: string;

  @Prop({ required: true })
  content: string;

  // AI-specific metadata
  @Prop({ type: Object })
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

  @Prop({ default: false })
  isStreaming: boolean;

  @Prop()
  parentMessageId: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
ChatMessageSchema.index({ conversationId: 1, createdAt: 1 });

// ─── Document Generation Log Schema ───
@Schema({ timestamps: true, collection: 'document_generation_logs' })
export class DocumentGenerationLog {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  documentId: string;

  @Prop({ required: true })
  templateType: string;

  @Prop({ type: Object })
  formData: Record<string, any>;

  @Prop({
    type: [
      {
        step: String,
        status: String,
        durationMs: Number,
        error: String,
      },
    ],
    default: [],
  })
  generationSteps: Array<{
    step: string;
    status: string;
    durationMs?: number;
    error?: string;
  }>;

  @Prop()
  aiModel: string;

  @Prop()
  tokensUsed: number;

  @Prop()
  totalDurationMs: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const DocumentGenerationLogSchema = SchemaFactory.createForClass(DocumentGenerationLog);

// ─── Analytics Event Schema ───
@Schema({ timestamps: true, collection: 'analytics_events' })
export class AnalyticsEvent {
  @Prop({ index: true })
  userId: string;

  @Prop({ required: true, index: true })
  event: string;

  @Prop({ type: Object })
  properties: Record<string, any>;

  @Prop()
  sessionId: string;

  @Prop()
  userAgent: string;

  @Prop()
  ip: string;

  @Prop({ default: Date.now, expires: 2592000 }) // TTL: 30 days
  createdAt: Date;
}

export const AnalyticsEventSchema = SchemaFactory.createForClass(AnalyticsEvent);
