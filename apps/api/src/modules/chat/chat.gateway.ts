import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ─── Handle Connection ───
  async handleConnection(client: Socket) {
    try {
      // Verify JWT from handshake auth
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn(`Connection rejected: No token provided (socket: ${client.id})`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('app.jwtSecret') || 'consultlegal-jwt-secret-2024',
      });

      const userId = payload.sub;
      this.connectedUsers.set(client.id, userId);

      // Join user's personal room for notifications
      client.join(`user:${userId}`);

      this.logger.log(`User ${userId} connected (socket: ${client.id})`);
    } catch (error) {
      this.logger.warn(`Connection rejected: Invalid token (socket: ${client.id})`);
      client.disconnect();
    }
  }

  // ─── Handle Disconnection ───
  handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.logger.log(`User ${userId} disconnected (socket: ${client.id})`);
      this.connectedUsers.delete(client.id);
    }
  }

  // ─── Join Conversation Room ───
  @SubscribeMessage('chat:join')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(`conversation:${data.conversationId}`);
    this.logger.debug(`Socket ${client.id} joined conversation ${data.conversationId}`);
  }

  // ─── Leave Conversation Room ───
  @SubscribeMessage('chat:leave')
  async handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(`conversation:${data.conversationId}`);
  }

  // ─── Handle Chat Message ───
  @SubscribeMessage('chat:message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) {
      client.emit('chat:error', { message: 'Not authenticated' });
      return;
    }

    try {
      // Emit typing indicator
      client.to(`conversation:${data.conversationId}`).emit('chat:typing', {
        conversationId: data.conversationId,
      });

      // Process message and get AI response
      const result = await this.chatService.handleMessage(
        userId,
        data.conversationId,
        data.content,
      );

      // Emit user message to conversation room
      this.server.to(`conversation:${data.conversationId}`).emit('chat:message', {
        id: result.userMessage._id,
        conversationId: data.conversationId,
        role: 'user',
        content: data.content,
        createdAt: result.userMessage.createdAt,
      });

      // Emit streaming start
      this.server.to(`conversation:${data.conversationId}`).emit('chat:stream:start', {
        conversationId: data.conversationId,
        messageId: result.assistantMessage._id,
      });

      // Simulate streaming by sending chunks
      const fullContent = result.assistantMessage.content;
      const chunkSize = 20; // characters per chunk
      for (let i = 0; i < fullContent.length; i += chunkSize) {
        const chunk = fullContent.slice(i, i + chunkSize);
        this.server.to(`conversation:${data.conversationId}`).emit('chat:stream:chunk', {
          messageId: result.assistantMessage._id,
          chunk,
        });
        // Small delay for streaming effect
        await new Promise((resolve) => setTimeout(resolve, 30));
      }

      // Emit stream complete
      this.server.to(`conversation:${data.conversationId}`).emit('chat:stream:end', {
        messageId: result.assistantMessage._id,
        fullContent,
        metadata: result.assistantMessage.metadata,
        creditBalance: result.creditBalance,
      });
    } catch (error) {
      this.logger.error(`Chat message error: ${error.message}`);
      client.emit('chat:error', { message: error.message });
    }
  }

  // ─── Typing Indicator ───
  @SubscribeMessage('chat:typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = this.connectedUsers.get(client.id);
    client.to(`conversation:${data.conversationId}`).emit('chat:typing', {
      conversationId: data.conversationId,
      userId,
    });
  }
}
