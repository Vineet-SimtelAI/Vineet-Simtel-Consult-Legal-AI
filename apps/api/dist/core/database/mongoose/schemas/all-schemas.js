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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsEventSchema = exports.AnalyticsEvent = exports.DocumentGenerationLogSchema = exports.DocumentGenerationLog = exports.ChatMessageSchema = exports.ChatMessage = exports.ChatConversationSchema = exports.ChatConversation = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ChatConversation = class ChatConversation {
};
exports.ChatConversation = ChatConversation;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], ChatConversation.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'New Conversation' }),
    __metadata("design:type", String)
], ChatConversation.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'active', enum: ['active', 'archived'] }),
    __metadata("design:type", String)
], ChatConversation.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ChatConversation.prototype, "creditsUsed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ChatConversation.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], ChatConversation.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], ChatConversation.prototype, "updatedAt", void 0);
exports.ChatConversation = ChatConversation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'chat_conversations' })
], ChatConversation);
exports.ChatConversationSchema = mongoose_1.SchemaFactory.createForClass(ChatConversation);
let ChatMessage = class ChatMessage {
};
exports.ChatMessage = ChatMessage;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true, type: mongoose_2.Schema.Types.ObjectId, ref: 'ChatConversation' }),
    __metadata("design:type", String)
], ChatMessage.prototype, "conversationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], ChatMessage.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['user', 'assistant', 'system'] }),
    __metadata("design:type", String)
], ChatMessage.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ChatMessage.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], ChatMessage.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ChatMessage.prototype, "isStreaming", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ChatMessage.prototype, "parentMessageId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], ChatMessage.prototype, "createdAt", void 0);
exports.ChatMessage = ChatMessage = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'chat_messages' })
], ChatMessage);
exports.ChatMessageSchema = mongoose_1.SchemaFactory.createForClass(ChatMessage);
exports.ChatMessageSchema.index({ conversationId: 1, createdAt: 1 });
let DocumentGenerationLog = class DocumentGenerationLog {
};
exports.DocumentGenerationLog = DocumentGenerationLog;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], DocumentGenerationLog.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentGenerationLog.prototype, "documentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentGenerationLog.prototype, "templateType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], DocumentGenerationLog.prototype, "formData", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                step: String,
                status: String,
                durationMs: Number,
                error: String,
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], DocumentGenerationLog.prototype, "generationSteps", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DocumentGenerationLog.prototype, "aiModel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DocumentGenerationLog.prototype, "tokensUsed", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DocumentGenerationLog.prototype, "totalDurationMs", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], DocumentGenerationLog.prototype, "createdAt", void 0);
exports.DocumentGenerationLog = DocumentGenerationLog = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'document_generation_logs' })
], DocumentGenerationLog);
exports.DocumentGenerationLogSchema = mongoose_1.SchemaFactory.createForClass(DocumentGenerationLog);
let AnalyticsEvent = class AnalyticsEvent {
};
exports.AnalyticsEvent = AnalyticsEvent;
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], AnalyticsEvent.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], AnalyticsEvent.prototype, "event", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], AnalyticsEvent.prototype, "properties", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AnalyticsEvent.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AnalyticsEvent.prototype, "userAgent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AnalyticsEvent.prototype, "ip", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now, expires: 2592000 }),
    __metadata("design:type", Date)
], AnalyticsEvent.prototype, "createdAt", void 0);
exports.AnalyticsEvent = AnalyticsEvent = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'analytics_events' })
], AnalyticsEvent);
exports.AnalyticsEventSchema = mongoose_1.SchemaFactory.createForClass(AnalyticsEvent);
//# sourceMappingURL=all-schemas.js.map