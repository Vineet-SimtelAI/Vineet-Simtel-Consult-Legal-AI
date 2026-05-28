import { Module } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ChatConversation,
  ChatConversationSchema,
  ChatMessage,
  ChatMessageSchema,
  DocumentGenerationLog,
  DocumentGenerationLogSchema,
  AnalyticsEvent,
  AnalyticsEventSchema,
} from './schemas/all-schemas';

@Module({
  imports: [
    NestMongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('app.mongodbUri'),
        connectionFactory: (connection: any) => {
          connection.on('connected', () => console.log('✅ MongoDB connected'));
          connection.on('error', (error: any) => console.error('❌ MongoDB connection error:', error));
          return connection;
        },
      }),
    }),
    NestMongooseModule.forFeature([
      { name: ChatConversation.name, schema: ChatConversationSchema },
      { name: ChatMessage.name, schema: ChatMessageSchema },
      { name: DocumentGenerationLog.name, schema: DocumentGenerationLogSchema },
      { name: AnalyticsEvent.name, schema: AnalyticsEventSchema },
    ]),
  ],
  exports: [NestMongooseModule],
})
export class MongooseModule {}
