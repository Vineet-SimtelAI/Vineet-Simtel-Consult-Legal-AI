import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/chat.dto';
import { IsArray, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class ChatMessageDto {
  @IsString()
  role: string;

  @IsString()
  content: string;
}

class AskDto {
  @IsArray()
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];
}

@ApiTags('AI Chat')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'List chat conversations' })
  async listConversations(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.listConversations(req.user.id, page, limit);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Create a new conversation' })
  async createConversation(@Request() req: any, @Body() dto: CreateConversationDto) {
    return this.chatService.createConversation(req.user.id, dto.title, dto.tags);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation with messages' })
  async getConversation(
    @Request() req: any,
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getConversation(req.user.id, id, page, limit);
  }

  @Delete('conversations/:id')
  @ApiOperation({ summary: 'Archive a conversation' })
  async archiveConversation(@Request() req: any, @Param('id') id: string) {
    return this.chatService.archiveConversation(req.user.id, id);
  }

  @Post('ask')
  @ApiOperation({ summary: 'Ask Gemini AI directly (no conversation stored)' })
  async ask(@Body() dto: AskDto) {
    return this.chatService.directAsk(dto.messages);
  }
}
