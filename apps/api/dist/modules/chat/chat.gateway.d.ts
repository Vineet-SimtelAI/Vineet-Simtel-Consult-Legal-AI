import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private chatService;
    private jwtService;
    private configService;
    server: Server;
    private readonly logger;
    private readonly connectedUsers;
    constructor(chatService: ChatService, jwtService: JwtService, configService: ConfigService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinConversation(client: Socket, data: {
        conversationId: string;
    }): Promise<void>;
    handleLeaveConversation(client: Socket, data: {
        conversationId: string;
    }): Promise<void>;
    handleMessage(client: Socket, data: {
        conversationId: string;
        content: string;
    }): Promise<void>;
    handleTyping(client: Socket, data: {
        conversationId: string;
    }): void;
}
