import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppConfigModule } from './core/config/config.module';
import { PrismaModule } from './core/database/prisma/prisma.module';
import { MongooseModule } from './core/database/mongoose/mongoose.module';
import { RedisModule } from './core/redis/redis.module';
import { StorageModule } from './core/storage/storage.module';
import { QueueModule } from './core/queue/queue.module';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './core/filters/http-exception.filter';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { ChatModule } from './modules/chat/chat.module';
import { LawyersModule } from './modules/lawyers/lawyers.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    // Core
    AppConfigModule,
    PrismaModule,
    MongooseModule,
    RedisModule,
    StorageModule,
    QueueModule,

    // Features
    AuthModule,
    UsersModule,
    DocumentsModule,
    ChatModule,
    LawyersModule,
    ConsultationsModule,
    PaymentsModule,
    AdminModule,
  ],
  providers: [
    // Global validation pipe
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    },
    // Global interceptors (order matters — last registered runs first)
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
