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
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const chat_service_1 = require("./chat.service");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    constructor(chatService, jwtService, configService) {
        this.chatService = chatService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(ChatGateway_1.name);
        this.connectedUsers = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token) {
                this.logger.warn(`Connection rejected: No token provided (socket: ${client.id})`);
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('app.jwtSecret') || 'consultlegal-jwt-secret-2024',
            });
            const userId = payload.sub;
            this.connectedUsers.set(client.id, userId);
            client.join(`user:${userId}`);
            this.logger.log(`User ${userId} connected (socket: ${client.id})`);
        }
        catch (error) {
            this.logger.warn(`Connection rejected: Invalid token (socket: ${client.id})`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const userId = this.connectedUsers.get(client.id);
        if (userId) {
            this.logger.log(`User ${userId} disconnected (socket: ${client.id})`);
            this.connectedUsers.delete(client.id);
        }
    }
    async handleJoinConversation(client, data) {
        client.join(`conversation:${data.conversationId}`);
        this.logger.debug(`Socket ${client.id} joined conversation ${data.conversationId}`);
    }
    async handleLeaveConversation(client, data) {
        client.leave(`conversation:${data.conversationId}`);
    }
    async handleMessage(client, data) {
        const userId = this.connectedUsers.get(client.id);
        if (!userId) {
            client.emit('chat:error', { message: 'Not authenticated' });
            return;
        }
        try {
            client.to(`conversation:${data.conversationId}`).emit('chat:typing', {
                conversationId: data.conversationId,
            });
            const result = await this.chatService.handleMessage(userId, data.conversationId, data.content);
            this.server.to(`conversation:${data.conversationId}`).emit('chat:message', {
                id: result.userMessage._id,
                conversationId: data.conversationId,
                role: 'user',
                content: data.content,
                createdAt: result.userMessage.createdAt,
            });
            this.server.to(`conversation:${data.conversationId}`).emit('chat:stream:start', {
                conversationId: data.conversationId,
                messageId: result.assistantMessage._id,
            });
            const fullContent = result.assistantMessage.content;
            const chunkSize = 20;
            for (let i = 0; i < fullContent.length; i += chunkSize) {
                const chunk = fullContent.slice(i, i + chunkSize);
                this.server.to(`conversation:${data.conversationId}`).emit('chat:stream:chunk', {
                    messageId: result.assistantMessage._id,
                    chunk,
                });
                await new Promise((resolve) => setTimeout(resolve, 30));
            }
            this.server.to(`conversation:${data.conversationId}`).emit('chat:stream:end', {
                messageId: result.assistantMessage._id,
                fullContent,
                metadata: result.assistantMessage.metadata,
                creditBalance: result.creditBalance,
            });
        }
        catch (error) {
            this.logger.error(`Chat message error: ${error.message}`);
            client.emit('chat:error', { message: error.message });
        }
    }
    handleTyping(client, data) {
        const userId = this.connectedUsers.get(client.id);
        client.to(`conversation:${data.conversationId}`).emit('chat:typing', {
            conversationId: data.conversationId,
            userId,
        });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:leave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeaveConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true,
        },
        namespace: '/chat',
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map